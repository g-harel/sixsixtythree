import {sync} from "./utils";

export const syncGroupMembersToUsers = sync({
    sourceCollection: "groups",
    sourceField: ["members"],
    targetCollection: "users",
});

export const syncProjectEditorsToGroups = sync({
    sourceCollection: "projects",
    sourceField: ["editors", "groups"],
    targetCollection: "groups",
});

export const syncProjectReadersToGroups = sync({
    sourceCollection: "projects",
    sourceField: ["readers", "groups"],
    targetCollection: "groups",
});

export const syncProjectEditorsToUsers = sync({
    sourceCollection: "projects",
    sourceField: ["editors", "users"],
    targetCollection: "users",
});

export const syncProjectReadersToUsers = sync({
    sourceCollection: "projects",
    sourceField: ["readers", "users"],
    targetCollection: "users",
});
