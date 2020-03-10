const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const users = db.collection("users");

// Returns an array of items that are in B, but not A.
const findNew = (a, b) => {
    const seen = {};
    for (const item of b) {
        seen[item] = true;
    }
    for (const item of a) {
        delete seen[item];
    }
    return Object.keys(seen);
};

// Creates a new document at the document path in the given collection if it
// doesn't already exist.
const createIfNotExists = async (collection, documentPath, data) => {
    const ref = collection.doc(documentPath);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
        await ref.set(data);
    }
};

// Helper to maintain a one-way many-to-many relationship between source and
// target. Updates the target(s) when source's targetIds is changed.
const syncSourceToTarget = async ({
    sourceId,
    sourceBeforeTargetIds,
    sourceAfterTargetIds,
    targetCollection,
    targetDefaultData,
    targetField,
}) => {
    const added = findNew(sourceBeforeTargetIds, sourceAfterTargetIds);
    for (const targetId of added) {
        await createIfNotExists(targetCollection, targetId, targetDefaultData);
        await targetCollection.doc(targetId).update({
            [targetField]: admin.firestore.FieldValue.arrayUnion(sourceId),
        });
    }

    const removed = findNew(sourceAfterTargetIds, sourceBeforeTargetIds);
    for (const targetId of removed) {
        await createIfNotExists(targetCollection, targetId, targetDefaultData);
        await targetCollection.doc(targetId).update({
            [targetField]: admin.firestore.FieldValue.arrayRemove(sourceId),
        });
    }
};

// Add or remove groups from users when group members are changed.
exports.syncUserGroups_onGroupWrite = functions.firestore
    .document("groups/{groupId}")
    .onWrite(async (change, context) =>
        syncSourceToTarget({
            sourceId: context.params["groupId"],
            sourceBeforeTargetIds: (change.before.data() || {}).members || [],
            sourceAfterTargetIds: (change.after.data() || {}).members || [],
            targetCollection: users,
            targetDefaultData: {},
            targetField: "groups",
        }),
    );
