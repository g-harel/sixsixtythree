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

# TODO history/audit logs
type Schema {
    groups Map<GroupId, {
        name String?
        # Sync with .users.groups to avoid scanning.
        members List<Email>
        # TODO allow name to be public without exposing user list.
    }>
    users Map<Email, {
        # Sync with .groups.members to avoid scanning.
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

// Global read conditions.
function read(conditions) {
    return conditions;
}

// Global write conditions.
function write(conditions) {
    return conditions && isNotWriting("sync");
}

function readEmail() {
    return request.auth.token.email;
}

function isOnlyWriting(field) {
    return request.resource.data.keys() == [field];
}

function isNotWriting(field) {
    return !(field in request.resource.data);
}

function isRemovingItem(item, field) {
    let before = resource.data[field];
    let after = request.resource.data[field];
    return (
        // Nothing has been added.
        after.hasOnly(before) &&
        // Only item has been removed.
        before.toSet().difference(after.toSet()) == [item].toSet()
    );
}

service cloud.firestore {
    match /databases/{database}/documents {
        match /groups/{group} {
            allow read: if read(readEmail() in resource.data.members);
            allow write: if write(isOnlyWriting("users") && isRemovingItem(readEmail(), "users"));
        }

        match /users/{email} {
            allow read: if read(readEmail() == email);
            allow write: if write(readEmail() == email);
        }

        match /projects/{project} {
            allow read: if read(
                readEmail() in resource.data.readers.users ||
                readEmail() in resource.data.sync.reader_users_from_groups);
            allow write: if write(
                readEmail() in resource.data.editors.users ||
                readEmail() in resource.data.sync.editor_users_from_groups);
        }

        match /tasks/{task} {
            // TODO don't read parent project every time.
            allow read: if read(hasPermission(getProject(resource.data.rootProject).data.readers));
            allow write: if write(hasPermission(getProject(resource.data.rootProject).data.editors));
        }

    }
}
```

# Documentation

- https://firebase.google.com/docs/reference/rules/rules.List
- https://firebase.google.com/docs/functions/firestore-events
