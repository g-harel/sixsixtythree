const LoadingPage = require('./loading');

const Dialog = require('./../components/dialog');
const Menu = require('./../components/menu');
const Task = require('./../components/task');
const ContextMenu = require('./../components/context-menu');

const mainPage = ({app, join, emitChange, joinedRoom, dialog}) => {
    let contextMenuAddress = [];

    app.use({action: {
        type: 'TOGGLE_SHOW_COMPLETED',
        target: ['showCompleted'],
        handler: (value) => !value,
    }});

    const navigate = (object, address, callback) => {
        if (address.length === 0 || object === undefined) {
            callback(object);
        } else {
            let nextKey = address.shift();
            if (nextKey !== 'children' && address.length > 0) {
                address.unshift('children');
            }
            navigate(object[nextKey], address, callback);
        }
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
            navigate(tasks, address.slice(), (task) => {
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
            let addr = address.slice();
            let index = addr.pop();
            navigate(tasks, addr, (task) => {
                if (!Array.isArray(task)) {
                    task = task.children;
                }
                task.splice(index, 1);
            });
            return tasks;
        },
    }});

    const undo = () => {
        contextMenuAddress = [];
        app.undo();
    };

    const redo = () => {
        contextMenuAddress = [];
        app.redo();
    };

    const showDialog = (hint, value = '', action) => {
        contextMenuAddress = [];
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

    const toggleCollapsed = (address) => () => {
        navigate(app.getState().tasks, address.slice(), (task) => {
            app.act('EDIT', {
                address: address,
                key: 'collapsed',
                value: !task.collapsed,
            });
        });
    };

    const toggleContextMenu = (address) => () => {
        if (contextMenuAddress.toString() === address.toString()) {
            contextMenuAddress = [];
        } else {
            contextMenuAddress = address.slice();
        }
        app.update();
    };

    const toggleComplete = (address) => () => {
        navigate(app.getState().tasks, address.slice(), (task) => {
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

    const changeColor = (address) => (color) => {
        app.act('EDIT', {
            address: address,
            key: 'color',
            value: color,
        });
    };

    const editTask = (address) => () => {
        navigate(app.getState().tasks, address.slice(), (task) => {
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

    const createContextMenu = (address, isCompleted) => (
        [ContextMenu,
            isCompleted,
            toggleContextMenu(address),
            toggleComplete(address),
            addChild(address),
            changeColor(address),
            editTask(address),
            remove(address),
        ]
    );

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
                                [Task, parentTask, state.showCompleted, toggleCollapsed, toggleContextMenu, contextMenuAddress, createContextMenu]
                            )),
                        ],
                    ]],
                ]]
            );
        };
    };
};

module.exports = mainPage;
