import {sync} from "./utils";

export const syncGroupMembersToUsers = sync({
    sourceDocument: "groups",
    sourceField: ["members"],
    targetDocument: "users",
});

export const syncProjectEditorsToGroups = sync({
    sourceDocument: "projects",
    sourceField: ["editors", "groups"],
    targetDocument: "groups",
});

export const syncProjectReadersToGroups = sync({
    sourceDocument: "projects",
    sourceField: ["readers", "groups"],
    targetDocument: "groups",
});

export const syncProjectEditorsToUsers = sync({
    sourceDocument: "projects",
    sourceField: ["editors", "users"],
    targetDocument: "users",
});

export const syncProjectReadersToUsers = sync({
    sourceDocument: "projects",
    sourceField: ["readers", "users"],
    targetDocument: "users",
});
