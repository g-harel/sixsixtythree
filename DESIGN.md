# Wishlist

### Data Model

- user groups for permissions/ownership
- projects can be attached to others as tasks
- project templates as mechanism to copy/reuse task trees
- tasks contain due date, duration, assignees, urgency, importance

### User Experience

- filtered/specialized views for assigned tasks and finished tasks
- tasks moved around with click and drag
- notifications for task assigning
- batched email notifications?
- attach files to tasks/projects

# Database

### Schema

```python
type GeneratedId String
type GroupId GeneratedId
type TaskId GeneratedId
type ProjectId GeneratedId
type Email String

type Permissions {
    users List<Email>
    groups List<GroupId>
}

type Schema {
    groups Map<GroupId, {
        name String?
        # Sync with .users.groups to avoid scanning.
        members List<Email>
        # TODO allow name to be public without exposing user list.
    }>
    users Map<Email, {
        # Sync with .groups.members to avoid scanning.
        # TODO disallow all non-admin writes to synced field.
        groups List<GroupId>
    }>
    projects Map<ProjectId, {
        # Use root task for name, description, etc.
        rootTask TaskId
        # Projects can have multiple parents.
        parents List<TaskId>
        editors Permissions
        readers Permissions
    }>
    tasks Map<TaskId, {
        name String?
        description String?
        # For permissions.
        rootProject ProjectId
        # Tasks can only be attached to one parent.
        # Project root tasks have no parent.
        parent TaskId?
        # Sync with .tasks.parent and .projects.parents.
        # Should not be relied on to build tree, only for order.
        childOrder List<{
            # Specify only one.
            task TaskId
            project ProjectId
        }>
    }>
}
```

### Rules

```js
// firestore.rules

rules_version = '2';

function readEmail() {
    return request.auth.token.email;
}

service cloud.firestore {
    match /databases/{database}/documents {

        function getProject(projectId) {
            return get(/databases/$(database)/documents/projects/$(projectId))
        }

        function getUser(email) {
            return get(/databases/$(database)/documents/users/$(email))
        }

        function hasPermission(permissions) {
            return readEmail() in permissions.users ||
                   permissions.groups.hasAny(getUser(readEmail()).data.groups)
        }

        match /groups/{group} {
            allow read, write: if readEmail() in resource.data.members;
        }

        match /users/{email} {
            allow read, write: if readEmail() == email;
        }

        match /projects/{project} {
            allow read: if hasPermission(resource.data.readers);
            allow write: if hasPermission(resource.data.editors);
        }

        match /tasks/{task} {
            allow read: if hasPermission(getProject(resource.data.rootProject).data.readers);
            allow write: if hasPermission(getProject(resource.data.rootProject).data.editors);
        }

    }
}
```

# Documentation

- https://firebase.google.com/docs/reference/rules/rules.List
- https://firebase.google.com/docs/functions/firestore-events
