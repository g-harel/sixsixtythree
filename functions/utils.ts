import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import {findNew} from "../shared/utils";
import {syncField} from "../shared/schema";

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
    await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(ref);
        if (!snapshot.exists) {
            await transaction.set(ref, data);
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
const updateSetMap = (type: "arrayUnion" | "arrayRemove") => async (options: {
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

    await ref.update(updates);
};

const removeEmptyListsFromMap = async (options: {
    collection: string;
    id: string;
    field: string;
}) =>
    await db.runTransaction(async (transaction) => {
        const ref = db.collection(options.collection).doc(options.id);
        const snapshot = await transaction.get(ref);
        const data = snapshot.get(options.field);

        const deletes: Record<string, FirebaseFirestore.FieldValue> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (!Array.isArray(value)) return;
            if (value.length > 0) return;
            const field = `${options.field}.${key}`;
            deletes[field] = admin.firestore.FieldValue.delete();
        });
        if (Object.keys(deletes).length === 0) {
            return;
        }

        await transaction.update(ref, deletes);
    });

// TODO make updates in parallel.
const handleChange = async (options: {
    field: string;
    change: functions.Change<functions.firestore.DocumentSnapshot>;
    addedHandler: (value: string) => Promise<any>;
    removedHandler: (value: string) => Promise<any>;
}) => {
    const beforeValues: string[] =
        options.change.before.get(options.field) || [];
    const afterValues: string[] = options.change.after.get(options.field) || [];

    const addedValues = findNew(beforeValues, afterValues);
    for (const value of addedValues) {
        await options.addedHandler(value);
    }

    const removedValues = findNew(afterValues, beforeValues);
    for (const value of removedValues) {
        await options.removedHandler(value);
    }
};

// Helper to maintain a one-way many-to-many relationship between source and
// target. Updates the target(s) when source field is changed. The synced data
// is written to a nested map using the source document and field accessible
// using `resource.sync.{sourceDocument}.{sourceField}`.
export const sync = (options: {
    source: string;
    sourceFkey: string;
    target: string;
    targetFkey: string;
}) =>
    functions.firestore
        .document(`${options.source}/{sourceId}`)
        .onWrite(async (change, context) => {
            const sourceId = context.params["sourceId"];
            const field = `${syncField}.${options.targetFkey}`;

            // Add or remove sourceId from targets.
            await handleChange({
                field: options.sourceFkey,
                change,
                addedHandler: async (targetId) => {
                    await updateSet("arrayUnion")({
                        collection: options.target,
                        id: targetId,
                        field,
                        items: [sourceId],
                    });
                },
                removedHandler: async (targetId) => {
                    await updateSet("arrayRemove")({
                        collection: options.target,
                        id: targetId,
                        field,
                        items: [sourceId],
                    });
                },
            });
        });

export const copy = (options: {
    source: string;
    sourceFkey: string;
    sourceCopiedItems: string;
    target: string;
    targetField: string;
}) =>
    functions.firestore
        .document(`${options.source}/{sourceId}`)
        .onWrite(async (change, context) => {
            const sourceId = context.params["sourceId"];
            const targetField = `${syncField}.${options.targetField}`;

            const genUpdate = (items: string[]) => {
                const update: Record<string, string[]> = {};
                for (const item of items) {
                    update[item] = [sourceId];
                }
                return update;
            };

            const afterItemsUpdate = genUpdate(
                change.after.get(options.sourceCopiedItems),
            );
            const allItemsUpdate = genUpdate(
                change.after
                    .get(options.sourceCopiedItems)
                    .concat(...change.after.get(options.sourceCopiedItems)),
            );

            // Add or remove copied items when fkey added/removed.
            await handleChange({
                field: options.sourceFkey,
                change,
                addedHandler: async (targetId) => {
                    await updateSetMap("arrayUnion")({
                        collection: options.target,
                        id: targetId,
                        field: targetField,
                        items: afterItemsUpdate,
                    });
                },
                removedHandler: async (targetId) => {
                    await updateSetMap("arrayRemove")({
                        collection: options.target,
                        id: targetId,
                        field: targetField,
                        items: allItemsUpdate,
                    });
                    await removeEmptyListsFromMap({
                        collection: options.target,
                        id: targetId,
                        field: targetField,
                    });
                },
            });

            // Add new copied items to all fkeys.
            const newItems = findNew(
                change.before.get(options.sourceCopiedItems),
                change.after.get(options.sourceCopiedItems),
            );
            if (newItems.length > 0) {
                const newItemsUpdate = genUpdate(newItems);
                for (const targetId of change.after.get(options.sourceFkey)) {
                    await updateSetMap("arrayUnion")({
                        collection: options.target,
                        id: targetId,
                        field: targetField,
                        items: newItemsUpdate,
                    });
                }
            }

            // Remove old copied items from all fkeys.
            const oldItems = findNew(
                change.after.get(options.sourceCopiedItems),
                change.before.get(options.sourceCopiedItems),
            );
            if (oldItems.length > 0) {
                const oldItemsUpdate = genUpdate(oldItems);
                for (const targetId of change.after.get(options.sourceFkey)) {
                    await updateSetMap("arrayRemove")({
                        collection: options.target,
                        id: targetId,
                        field: targetField,
                        items: oldItemsUpdate,
                    });
                    await removeEmptyListsFromMap({
                        collection: options.target,
                        id: targetId,
                        field: targetField,
                    });
                }
            }
        });
