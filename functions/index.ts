import firebase from "firebase";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

const db = admin.firestore();

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
// target. Updates the target(s) when source field is changed. The synced data
// is written to a nested map using the source document and field accessible
// using `resource.sync.{sourceDocument}.{sourceField}`.
const sync = (opt: {
    sourceDocument: string;
    sourceField: string[];
    targetDocument: string;
}) =>
    functions.firestore
        .document(`${opt.sourceDocument}/{sourceId}`)
        .onWrite(async (change, context) => {
            const sourceId = context.params["sourceId"];
            const targetCollection = db.collection(opt.targetDocument);

            let before: any = change.before.data() || {};
            for (const sourceFieldPart of opt.sourceField) {
                if (!before) break;
                before = before[sourceFieldPart];
            }
            if (!Array.isArray(before)) {
                before = [];
            }

            let after: any = change.after.data() || {};
            for (const sourceFieldPart of opt.sourceField) {
                if (!after) break;
                after = after[sourceFieldPart];
            }
            if (!Array.isArray(after)) {
                after = [];
            }

            let syncPath = `sync.${opt.sourceDocument}`;
            for (const sourceFieldPart of opt.sourceField) {
                syncPath += `.${sourceFieldPart}`;
            }

            console.log(before, after, syncPath);

            const added = findNew(before, after);
            for (const targetId of added) {
                await createIfNotExists(targetCollection as any, targetId, {});
                await targetCollection.doc(targetId).update({
                    [syncPath]: admin.firestore.FieldValue.arrayUnion(sourceId),
                });
            }

            const removed = findNew(after, before);
            for (const targetId of removed) {
                await createIfNotExists(targetCollection as any, targetId, {});
                await targetCollection.doc(targetId).update({
                    [syncPath]: admin.firestore.FieldValue.arrayRemove(
                        sourceId,
                    ),
                });
            }
        });

// Add or remove groups from users when group members are changed.
export const syncGroupMembersToUsers = sync({
    sourceDocument: "groups",
    sourceField: ["members"],
    targetDocument: "users",
});
