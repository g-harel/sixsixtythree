import {copy, sync} from "./utils";
import {syncField} from "../shared/schema";

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
