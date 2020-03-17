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

const edit = (
    arr: string[],
    type: "add" | "remove",
    items: string[],
): string[] => {
    const itemCounts: Record<string, number> = {};
    for (const beforeItem of arr) {
        if (itemCounts[beforeItem] === undefined) itemCounts[beforeItem] = 0;
        itemCounts[beforeItem] += 1;
    }
    for (const item of items) {
        if (itemCounts[item] === undefined) itemCounts[item] = 0;
        if (type === "add") {
            itemCounts[item] += 1;
        }
        if (type === "remove") {
            itemCounts[item] -= 1;
        }
    }
    const afterList: string[] = [];
    for (const item of Object.keys(itemCounts)) {
        for (let i = 0; i < itemCounts[item]; i++) {
            afterList.push(item);
        }
    }
    return afterList;
};

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
const updateAsSet = (type: "add" | "remove") => async (opt: {
    collection: string;
    id: string;
    field: string;
    items: string[];
}) => {
    const collection = db.collection(opt.collection);
    await createIfNotExists(collection, opt.id, {});
    const fieldValueType = type === "add" ? "arrayUnion" : "arrayRemove";
    await collection.doc(opt.id).update({
        [opt.field]: admin.firestore.FieldValue[fieldValueType](...opt.items),
    });
};

// Updates a list field in the target document.
// TODO make able to be called more than once (make map [targetID -> sourceID]).
const updateAsList = (type: "add" | "remove") => async (opt: {
    collection: string;
    id: string;
    field: string;
    items: string[];
}) => {
    const collection = db.collection(opt.collection);
    await createIfNotExists(collection, opt.id, {});
    const ref = collection.doc(opt.id);
    db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(ref);
        await collection.doc(opt.id).update({
            [opt.field]: edit(await snapshot.get(opt.field), type, opt.items),
        });
    });
};

// Helper to maintain a one-way many-to-many relationship between source and
// target. Updates the target(s) when source field is changed. The synced data
// is written to a nested map using the source document and field accessible
// using `resource.sync.{sourceDocument}.{sourceField}`.
export const sync = (opt: {
    sourceCollection: string;
    sourceField: string;
    targetCollection: string;
}) =>
    functions.firestore
        .document(`${opt.sourceCollection}/{sourceId}`)
        .onWrite(async (change, context) => {
            const sourceId = context.params["sourceId"];

            const beforeTargetIds = change.before.get(opt.sourceField);
            const afterTargetIds = change.after.get(opt.sourceField);

            const addedTargetIds = findNew(beforeTargetIds, afterTargetIds);
            for (const targetId of addedTargetIds) {
                await updateAsSet("add")({
                    collection: opt.targetCollection,
                    id: targetId,
                    field: `sync.${opt.sourceCollection}.${opt.sourceField}`,
                    items: [sourceId],
                });
            }

            const removedTargetIds = findNew(afterTargetIds, beforeTargetIds);
            for (const targetId of removedTargetIds) {
                await updateAsSet("remove")({
                    collection: opt.targetCollection,
                    id: targetId,
                    field: `sync.${opt.sourceCollection}.${opt.sourceField}`,
                    items: [sourceId],
                });
            }
        });

export const syncCopy = (opt: {
    sourceCollection: string;
    sourceField: string;
    sourceTargetIdsField: string;
    targetCollection: string;
}) => {
    // TODO copy source field to targetIds.
};
