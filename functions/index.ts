import {copy, sync} from "./utils";
import {syncField} from "../shared/schema";

// TODO more error handling, these preserve data integrity.
// This could be done by having a kube-like approach with a desired state
// instead of brittle listeners. State could be spot checked for specific
// collections/ids when those get updated, or in the background. Would also be
// nice to have less (~1) functions ran when a document gets updated.

export const syncGroupMembersToUsers = sync({
    source: "groups",
    sourceFkey: "members",
    target: "users",
    targetFkey: "groups",
});

export const syncProjectEditorsToGroups = sync({
    source: "projects",
    sourceFkey: "editors.groups",
    target: "groups",
    targetFkey: "editor_projects",
});

export const syncProjectReadersToGroups = sync({
    source: "projects",
    sourceFkey: "readers.groups",
    target: "groups",
    targetFkey: "reader_projects",
});

export const syncProjectEditorsToUsers = sync({
    source: "projects",
    sourceFkey: "editors.users",
    target: "users",
    targetFkey: "editor_projects",
});

export const syncProjectReadersToUsers = sync({
    source: "projects",
    sourceFkey: "readers.users",
    target: "users",
    targetFkey: "reader_projects",
});

export const copyProjectEditorsFromGroupsToUsers = copy({
    source: "groups",
    sourceFkey: "members",
    sourceCopiedData: syncField + ".editor_projects",
    target: "users",
    targetField: "editor_projects_from_groups",
});

export const copyProjectReadersFromGroupsToUsers = copy({
    source: "groups",
    sourceFkey: "members",
    sourceCopiedData: syncField + ".reader_projects",
    target: "users",
    targetField: "reader_projects_from_groups",
});
