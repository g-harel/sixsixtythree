import firebase from "firebase";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();
const db = admin.firestore();

type Field = string[];

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

// Reads nested fields from the document data.
const fieldData = (field: Field, doc?: firebase.firestore.DocumentData) => {
    let result: any = doc || {};
    for (const sourceFieldPart of field) {
        if (!result) break;
        result = result[sourceFieldPart];
    }
    if (!Array.isArray(result)) {
        result = [];
    }
    return result;
};

// Updates a list field in the target document
const update = (type: "arrayUnion" | "arrayRemove") => async (opt: {
    collection: string;
    id: string;
    field: Field;
    items: any[];
}) => {
    const collection = db.collection(opt.collection);
    const syncPath = `sync.${opt.field.join(".")}`;
    await createIfNotExists(collection as any, opt.id, {});
    await collection.doc(opt.id).update({
        [syncPath]: admin.firestore.FieldValue[type](...opt.items),
    });
};

// Helper to maintain a one-way many-to-many relationship between source and
// target. Updates the target(s) when source field is changed. The synced data
// is written to a nested map using the source document and field accessible
// using `resource.sync.{sourceDocument}.{sourceField}`.
export const sync = (opt: {
    sourceCollection: string;
    sourceField: Field;
    targetCollection: string;
}) =>
    functions.firestore
        .document(`${opt.sourceCollection}/{sourceId}`)
        .onWrite(async (change, context) => {
            const sourceId = context.params["sourceId"];

            const beforeTargetIds = fieldData(
                opt.sourceField,
                change.before.data(),
            );
            const afterTargetIds = fieldData(
                opt.sourceField,
                change.after.data(),
            );

            const addedTargetIds = findNew(beforeTargetIds, afterTargetIds);
            for (const targetId of addedTargetIds) {
                await update("arrayUnion")({
                    collection: opt.targetCollection,
                    id: targetId,
                    field: [opt.sourceCollection, ...opt.sourceField],
                    items: [sourceId],
                });
            }

            const removedTargetIds = findNew(afterTargetIds, beforeTargetIds);
            for (const targetId of removedTargetIds) {
                await update("arrayRemove")({
                    collection: opt.targetCollection,
                    id: targetId,
                    field: [opt.sourceCollection, ...opt.sourceField],
                    items: [sourceId],
                });
            }
        });

export const syncCopy = (opt: {
    sourceCollection: string;
    sourceField: Field;
    sourceTargetIdsField: Field;
    targetCollection: string;
}) => {
    // TODO copy source field to targetIds.
};
