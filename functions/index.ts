import {copy, sync} from "./utils";
import {syncField} from "../shared/schema";

// TODO more error handling, these preserve data integrity.
// This could be done by having a kube-like approach with a desired state
// instead of brittle listeners. State could be spot checked for specific
// collections/ids when those get updated, or in the background. Would also be
// nice to have less (~1) functions ran when a document gets updated.

export const syncGroupMembersToUsers = sync({
    sourceCollection: "groups",
    sourceField: "members",
    targetCollection: "users",
});

export const syncProjectEditorsToGroups = sync({
    sourceCollection: "projects",
    sourceField: "editors.groups",
    targetCollection: "groups",
});

export const syncProjectReadersToGroups = sync({
    sourceCollection: "projects",
    sourceField: "readers.groups",
    targetCollection: "groups",
});

export const syncProjectEditorsToUsers = sync({
    sourceCollection: "projects",
    sourceField: "editors.users",
    targetCollection: "users",
});

export const syncProjectReadersToUsers = sync({
    sourceCollection: "projects",
    sourceField: "readers.users",
    targetCollection: "users",
});

export const copyProjectEditorsFromGroupsToUsers = copy({
    sourceCollection: "groups",
    sourceField: syncField + ".projects.editors.groups",
    sourceCopyField: "members",
    targetCollection: "users",
});

export const copyProjectReadersFromGroupsToUsers = copy({
    sourceCollection: "groups",
    sourceField: syncField + ".projects.readers.groups",
    sourceCopyField: "members",
    targetCollection: "users",
});

export const syncTest = sync({
    sourceCollection: "test_source",
    sourceField: "sync_to",
    targetCollection: "test_target",
});

export const copyTest = copy({
    sourceCollection: "test_source",
    sourceField: "copy_to",
    sourceCopyField: "copy_ids",
    targetCollection: "test_target",
});
