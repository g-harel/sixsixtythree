import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import {findNew} from "../shared/utils";
import {copyField, syncField} from "../shared/schema";

admin.initializeApp();
const db = admin.firestore();

// Creates a new document at the document path in the given collection if it
// doesn't already exist.
const createIfNotExists = async (
    collection: FirebaseFirestore.CollectionReference,
    documentPath: string,
    data: FirebaseFirestore.DocumentData,
) => {
    const ref = collection.doc(documentPath);
    db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(ref);
        if (!snapshot.exists) {
            await ref.set(data);
        }
    });
};

// Updates a list field in the target document.
const updateSet = (type: "arrayUnion" | "arrayRemove") => async (options: {
    collection: string;
    id: string;
    field: string;
    items: string[];
}) => {
    const collection = db.collection(options.collection);
    await createIfNotExists(collection, options.id, {});
    await collection.doc(options.id).update({
        [options.field]: admin.firestore.FieldValue[type](...options.items),
    });
};

// Updates a map of lists field in the target document.
// If one of the lists is empty after the update, it is deleted.
const updateMap = (type: "arrayUnion" | "arrayRemove") => async (options: {
    collection: string;
    id: string;
    field: string;
    // Map values will be added/removed from the list at the associated key.
    items: Record<string, string[]>;
}) => {
    const collection = db.collection(options.collection);
    await createIfNotExists(collection, options.id, {});
    const ref = collection.doc(options.id);

    const updates: Record<string, FirebaseFirestore.FieldValue> = {};
    Object.entries(options.items).forEach(([key, value]) => {
        const field = `${options.field}.${key}`;
        updates[field] = admin.firestore.FieldValue[type](...value);
    });

    db.runTransaction(async (transaction) => {
        await transaction.update(ref, updates);
        const snapshot = await transaction.get(ref);
        const data = snapshot.get(options.field);

        const deletes: Record<string, FirebaseFirestore.FieldValue> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (!Array.isArray(value)) return;
            if (value.length > 0) return;
            const field = `${options.field}.${key}`;
            updates[field] = admin.firestore.FieldValue.delete();
        });

        if (Object.keys(deletes).length > 0) {
            await transaction.update(ref, deletes);
        }
    });
};

// Helper to maintain a one-way many-to-many relationship between source and
// target. Updates the target(s) when source field is changed. The synced data
// is written to a nested map using the source document and field accessible
// using `resource.sync.{sourceDocument}.{sourceField}`.
// TODO make updates in parallel.
export const sync = (options: {
    sourceCollection: string;
    sourceField: string;
    targetCollection: string;
}) =>
    functions.firestore
        .document(`${options.sourceCollection}/{sourceId}`)
        .onWrite(async (change, context) => {
            const sourceId = context.params["sourceId"];

            const beforeTargetIds = change.before.get(options.sourceField);
            const afterTargetIds = change.after.get(options.sourceField);

            const field = `${syncField}.${options.sourceCollection}.${options.sourceField}`;

            const addedTargetIds = findNew(beforeTargetIds, afterTargetIds);
            for (const targetId of addedTargetIds) {
                await updateSet("arrayUnion")({
                    collection: options.targetCollection,
                    id: targetId,
                    field,
                    items: [sourceId],
                });
            }

            const removedTargetIds = findNew(afterTargetIds, beforeTargetIds);
            for (const targetId of removedTargetIds) {
                await updateSet("arrayRemove")({
                    collection: options.targetCollection,
                    id: targetId,
                    field,
                    items: [sourceId],
                });
            }
        });

export const copy = (options: {
    sourceCollection: string;
    sourceField: string;
    sourceTargetIdsField: string;
    targetCollection: string;
}) => {
    // TODO copy source field to targetIds.
};
