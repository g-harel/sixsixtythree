const LoadingPage = require('./loading');

const Menu = require('./../components/menu');
const Task = require('./../components/task');
const createContextMenu = require('./../components/context-menu');

const mainPage = ({app, join, emitChange, joinedRoom, dialog}) => {
    app.use({action: {
        type: 'TOGGLE_SHOW_COMPLETED',
        target: ['showCompleted'],
        handler: (value) => !value,
    }});

    const navigate = (object, address, callback) => {
        const _navigate = (_object, _address, _callback) => {
            if (_address.length === 0 || _object === undefined) {
                return _callback(_object);
            } else {
                let nextKey = _address.shift();
                if (nextKey !== 'children' && _address.length > 0) {
                    _address.unshift('children');
                }
                return navigate(_object[nextKey], _address, _callback);
            }
        };
        return _navigate(object, address.slice(), callback);
    };

    const createTask = (description, address) => ({
        completed: false,
        collapsed: false,
        color: 'transparent',
        description: description,
        address: address,
        children: [],
    });

    app.use({action: {
        type: 'ADD',
        target: ['tasks'],
        handler: (tasks, {address, description}) => {
            let addr = address.slice();
            navigate(tasks, address, (task) => {
                if (!Array.isArray(task)) {
                    task = task.children;
                }
                addr.push(task.length);
                task.push(createTask(description, addr));
            });
            return tasks;
        },
    }});

    app.use({action: {
        type: 'EDIT',
        target: ['tasks'],
        handler: (tasks, {address, key, value}) => {
            navigate(tasks, address, (task) => {
                task[key] = value;
            });
            return tasks;
        },
    }});

    app.use({action: {
        type: 'REMOVE',
        target: ['tasks'],
        handler: (tasks, {address}) => {
            let index = addr.pop();
            navigate(tasks, address, (task) => {
                if (!Array.isArray(task)) {
                    task = task.children;
                }
                task.splice(index, 1);
            });
            return tasks;
        },
    }});

    const undo = () => {
        ContextMenu.setContextMenuAddress(null);
        app.undo();
    };

    const redo = () => {
        ContextMenu.setContextMenuAddress(null);
        app.redo();
    };

    const showDialog = (hint, value = '', action) => {
        ContextMenu.setContextMenuAddress(null);
        dialog.showDialog(hint, value, (e) => {
            e.preventDefault();
            action(e.target[0].value);
        });
    };

    const addTask = (address) => {
        showDialog('Add a task', '', (description) => {
            app.act('ADD', {description, address});
        });
    };

    const toggleShowCompleted = () => {
        app.act('TOGGLE_SHOW_COMPLETED');
    };

    const isCompleted = (address) => {
        return navigate(app.getState().tasks, address, (task) => {
            return task.completed;
        });
    };

    const toggleCollapsed = (address) => () => {
        navigate(app.getState().tasks, address, (task) => {
            app.act('EDIT', {
                address: address,
                key: 'collapsed',
                value: !task.collapsed,
            });
        });
    };

    const toggleComplete = (address) => () => {
        navigate(app.getState().tasks, address, (task) => {
            app.act('EDIT', {
                address: address,
                key: 'completed',
                value: !task.completed,
            });
        });
    };

    const addChild = (address) => () => {
        showDialog('Add a child task', '', (description) => {
            app.act('ADD', {description, address});
        });
    };

    const changeColor = (address, color) => () => {
        app.act('EDIT', {
            address: address,
            key: 'color',
            value: color,
        });
    };

    const editTask = (address) => () => {
        navigate(app.getState().tasks, address, (task) => {
            showDialog('Edit task', task.description, (description) => {
                app.act('EDIT', {
                    address: address,
                    key: 'description',
                    value: description,
                });
            });
        });
    };

    const remove = (address) => () => {
        app.act('REMOVE', {address});
    };

    const ContextMenu = createContextMenu({app, isCompleted, toggleComplete, addChild, changeColor, editTask, remove});

    app.use({watcher: (state) => emitChange(state)});

    return ({roomId}) => {
        join(roomId);
        return (state) => {
            if (!joinedRoom()) {
                return [LoadingPage];
            }
            return (
                ['div', {}, [
                    [dialog.builder],
                    [Menu, state.showCompleted, () => addTask([]), toggleShowCompleted, app.redirect, undo, redo],
                    ['div.tree-container', {}, [
                        ['ul', {},
                            state.tasks.map((parentTask) => (
                                [Task, parentTask, state.showCompleted, toggleCollapsed, ContextMenu]
                            )),
                        ],
                    ]],
                ]]
            );
        };
    };
};

module.exports = mainPage;
