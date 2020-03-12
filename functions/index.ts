import firebase from "firebase";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

const db = admin.firestore();
const users = db.collection("users");

// Returns an array of items that are in B, but not A.
const findNew = (a: string[], b: string[]) => {
    const seen: Record<string, boolean> = {};
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
const createIfNotExists = async (
    collection: firebase.firestore.CollectionReference,
    documentPath: string,
    data: firebase.firestore.DocumentData,
) => {
    const ref = collection.doc(documentPath);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
        await ref.set(data);
    }
};

// Helper to maintain a one-way many-to-many relationship between source and
// target. Updates the target(s) when source's targetIds is changed.
const syncSourceToTarget = async (p: {
    sourceId: string;
    sourceBeforeTargetIds: string[];
    sourceAfterTargetIds: string[];
    targetCollection: any;
    targetDefaultData: firebase.firestore.DocumentData;
    targetField: string;
}) => {
    const added = findNew(p.sourceBeforeTargetIds, p.sourceAfterTargetIds);
    for (const targetId of added) {
        await createIfNotExists(
            p.targetCollection,
            targetId,
            p.targetDefaultData,
        );
        await p.targetCollection.doc(targetId).update({
            [p.targetField]: admin.firestore.FieldValue.arrayUnion(p.sourceId),
        });
    }

    const removed = findNew(p.sourceAfterTargetIds, p.sourceBeforeTargetIds);
    for (const targetId of removed) {
        await createIfNotExists(
            p.targetCollection,
            targetId,
            p.targetDefaultData,
        );
        await p.targetCollection.doc(targetId).update({
            [p.targetField]: admin.firestore.FieldValue.arrayRemove(p.sourceId),
        });
    }
};

// Add or remove groups from users when group members are changed.
export const syncUserGroups_onGroupWrite = functions.firestore
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
