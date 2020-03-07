# Links

- https://firebase.google.com/docs/reference/rules/rules.List

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

# Database

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
        # Keep in sync with Schema.users.groups to avoid scanning.
        members List<Email>
    }>
    users Map<Email, {
        # Keep in sync with Schema.groups.members to avoid scanning.
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
        # TODO task ordering.
        parent TaskId?
    }>
}
```
