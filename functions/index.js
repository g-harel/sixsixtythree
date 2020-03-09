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

// Update the users' groups when they are added or removed from a group.
exports.syncUserGroups = functions.firestore
    .document("groups/{groupId}")
    .onUpdate(async (change, context) => {
        const groupId = context.params["groupId"];

        const beforeMembers = change.before.data().members;
        const afterMembers = change.after.data().members;

        const addedMembers = findNew(beforeMembers, afterMembers);
        for (const email of addedMembers) {
            await createIfNotExists(users, email, {});
            await users.doc(email).update({
                groups: admin.firestore.FieldValue.arrayUnion(groupId),
            });
        }

        const removedMembers = findNew(afterMembers, beforeMembers);
        for (const email of removedMembers) {
            await createIfNotExists(users, email, {});
            await users.doc(email).update({
                groups: admin.firestore.FieldValue.arrayRemove(groupId),
            });
        }
    });
