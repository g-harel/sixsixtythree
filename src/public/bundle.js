/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var utils = function utils() {
    // type checks
    var isDefined = function isDefined(value) {
        return value !== undefined;
    };
    var isNull = function isNull(value) {
        return value === null;
    };
    var isArray = function isArray(value) {
        return Array.isArray(value);
    };
    var isFunction = function isFunction(value) {
        return typeof value === 'function';
    };
    var isString = function isString(value) {
        return typeof value === 'string';
    };
    var isObject = function isObject(value) {
        return !!value && value.constructor === Object;
    };
    var isNode = function isNode(value) {
        return !!(value && value.tagName && value.nodeName && value.ownerDocument && value.removeAttribute);
    };

    // creates a deep copy of an object (can only copy basic objects/arrays/primitives)
    var deepCopy = function deepCopy(obj) {
        if (isArray(obj)) {
            return obj.map(function (element) {
                return deepCopy(element);
            });
        }
        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj) {
            var keys = Object.keys(obj);
            var temp = {};
            keys.forEach(function (key) {
                temp[key] = deepCopy(obj[key]);
            });
            return temp;
        }
        return obj;
    };

    // displays error message
    var err = function err(message) {
        throw new Error('gooErr:: ' + message);
    };

    // throw errors when assertion fails
    var assert = function assert(result, message, culprit) {
        var print = function print(obj) {
            return JSON.stringify(obj, function (key, value) {
                return typeof value === 'function' ? value.toString() : value;
            }, 4);
        };
        if (!result) {
            err(message + (culprit ? '\n>>>' + print(culprit) : '') || 'assertion has failed');
        }
    };

    // wait queue (ex. async middlware during blob changes)
    var makeQueue = function makeQueue() {
        var queue = [];
        var run = function run() {
            var func = queue[0];
            if (isDefined(func)) {
                func();
            }
        };
        var add = function add(func) {
            assert(isFunction(func));
            queue.push(func);
            if (queue.length === 1) {
                run();
            }
        };
        var done = function done() {
            queue.shift();
            run();
        };
        return { add: add, done: done };
    };

    // handle common blob logic
    var blobNames = {};
    var blobHandler = function blobHandler(blobs) {
        var blob = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var queue = arguments[2];

        assert(isObject(blob), 'blob is not an object', blob);
        if (isDefined(blob.name)) {
            assert(isString(blob.name), 'a blob name must be a string', blob);
            if (blobNames[blob.name] === true) {
                return null;
            } else {
                blobNames[blob.name] = true;
            }
        }
        return Object.keys(blob).map(function (key) {
            var blobObject = blob[key];
            if (!isArray(blobObject)) {
                blobObject = [blobObject];
            }
            if (!isDefined(blobs[key])) {
                return blobObject.map(function () {
                    return null;
                });
            }
            return blobObject.map(function (drop) {
                if (isDefined(queue)) {
                    queue.add(function () {
                        blobs[key](drop);
                        queue.done();
                    });
                    return null;
                } else {
                    return blobs[key](drop);
                }
            });
        });
    };

    // public interface
    return { deepCopy: deepCopy, err: err, assert: assert, isDefined: isDefined, isNull: isNull, isArray: isArray, isFunction: isFunction, isString: isString, isObject: isObject, isNode: isNode, makeQueue: makeQueue, blobHandler: blobHandler };
};

module.exports = utils;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dialog = function dialog(app) {
    var hidden = true;
    var hint = '';
    var action = null;
    var value = '';

    var hideDialog = function hideDialog() {
        hidden = true;
        hint = '';
        action = null;
        value = '';
        app.update();
    };

    var showDialog = function showDialog(_hint, defaultValue, submit) {
        var _submit = function _submit() {
            submit.apply(undefined, arguments);
            hideDialog();
        };
        hidden = false;
        hint = _hint;
        action = _submit;
        value = defaultValue;
        app.update();
    };

    var builder = function builder() {
        if (hidden) {
            return null;
        }
        setTimeout(function () {
            return document.querySelector('.field').focus();
        }, 0);
        return [function () {
            return ['div.dialog-wrapper', {}, [['div.dialog', {}, [['form', { onsubmit: action }, [['label', {}, [hint || '', ['br'], ['input.field', { type: 'text', value: value }]]]]]]], ['div.dialog-overlay', { onclick: hideDialog }]]];
        }];
    };

    return { builder: builder, showDialog: showDialog };
};

module.exports = dialog;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var socket = window.io.connect(window.location.origin, { reconnectionDelayMax: 500, reconnectionAttempts: 25 });

var iocon = function iocon(_ref) {
    var onJoin = _ref.onJoin,
        onChange = _ref.onChange;

    socket.on('reload', function () {
        return location.reload();
    });

    socket.on('join', function (roomId, state) {
        return onJoin(roomId, state);
    });

    socket.on('update', function (state) {
        return onChange(state);
    });

    socket.on('error', function (err) {
        return console.log(err);
    });

    var join = function join(roomId) {
        return roomId && socket.emit('join', roomId);
    };

    var emitChange = function emitChange(state) {
        return socket.emit('update', state);
    };

    return { join: join, emitChange: emitChange };
};

module.exports = iocon;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var homePage = function homePage(_ref) {
    var app = _ref.app,
        dialog = _ref.dialog;

    var generateName = function generateName() {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var name = [];
        for (var i = 0; i < 16; ++i) {
            name.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        return name.join('');
    };

    var joinRoom = function joinRoom(name) {
        return function () {
            if (name.match(/^[\w-]+$/) === null) {
                pickName({ value: name + ' - ERR invalid character(s)' });
                return;
            }
            app.redirect('/!/' + name + '/');
        };
    };

    var pickName = function pickName(_ref2) {
        var _ref2$value = _ref2.value,
            value = _ref2$value === undefined ? '' : _ref2$value;

        dialog.showDialog('ROOM NAME', value, function (e) {
            e.preventDefault();
            joinRoom(e.target[0].value)();
        });
    };

    return function () {
        return function () {
            return ['div', {}, [[dialog.builder], ['div.home', {}, [['div.button', { onclick: joinRoom(generateName()) }, ['GENERATE RANDOM ROOM']], ['br'], 'OR', ['br'], ['div.button', { onclick: pickName }, ['PICK ROOM']]]]]];
        };
    };
};

module.exports = homePage;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LoadingPage = __webpack_require__(10);

var Menu = __webpack_require__(8);
var Task = __webpack_require__(9);
var createContextMenu = __webpack_require__(7);

var mainPage = function mainPage(_ref) {
    var app = _ref.app,
        join = _ref.join,
        emitChange = _ref.emitChange,
        joinedRoom = _ref.joinedRoom,
        dialog = _ref.dialog;

    app.use({ action: {
            type: 'TOGGLE_SHOW_COMPLETED',
            target: ['showCompleted'],
            handler: function handler(value) {
                return !value;
            }
        } });

    var navigate = function navigate(object, address, callback) {
        var _navigate = function _navigate(_object, _address, _callback) {
            if (_address.length === 0 || _object === undefined) {
                return _callback(_object);
            } else {
                var nextKey = _address.shift();
                if (nextKey !== 'children' && _address.length > 0) {
                    _address.unshift('children');
                }
                return navigate(_object[nextKey], _address, _callback);
            }
        };
        return _navigate(object, address.slice(), callback);
    };

    var createTask = function createTask(description, address) {
        return {
            completed: false,
            collapsed: false,
            color: 'transparent',
            description: description,
            address: address,
            children: []
        };
    };

    app.use({ action: {
            type: 'ADD',
            target: ['tasks'],
            handler: function handler(tasks, _ref2) {
                var address = _ref2.address,
                    description = _ref2.description;

                var addr = address.slice();
                navigate(tasks, address, function (task) {
                    if (!Array.isArray(task)) {
                        task = task.children;
                    }
                    addr.push(task.length);
                    task.push(createTask(description, addr));
                });
                return tasks;
            }
        } });

    app.use({ action: {
            type: 'EDIT',
            target: ['tasks'],
            handler: function handler(tasks, _ref3) {
                var address = _ref3.address,
                    key = _ref3.key,
                    value = _ref3.value;

                navigate(tasks, address, function (task) {
                    task[key] = value;
                });
                return tasks;
            }
        } });

    app.use({ action: {
            type: 'REMOVE',
            target: ['tasks'],
            handler: function handler(tasks, _ref4) {
                var address = _ref4.address;

                var index = addr.pop();
                navigate(tasks, address, function (task) {
                    if (!Array.isArray(task)) {
                        task = task.children;
                    }
                    task.splice(index, 1);
                });
                return tasks;
            }
        } });

    var undo = function undo() {
        ContextMenu.setContextMenuAddress(null);
        app.undo();
    };

    var redo = function redo() {
        ContextMenu.setContextMenuAddress(null);
        app.redo();
    };

    var showDialog = function showDialog(hint) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var action = arguments[2];

        ContextMenu.setContextMenuAddress(null);
        dialog.showDialog(hint, value, function (e) {
            e.preventDefault();
            action(e.target[0].value);
        });
    };

    var addTask = function addTask(address) {
        showDialog('Add a task', '', function (description) {
            app.act('ADD', { description: description, address: address });
        });
    };

    var toggleShowCompleted = function toggleShowCompleted() {
        app.act('TOGGLE_SHOW_COMPLETED');
    };

    var isCompleted = function isCompleted(address) {
        return navigate(app.getState().tasks, address, function (task) {
            return task.completed;
        });
    };

    var toggleCollapsed = function toggleCollapsed(address) {
        return function () {
            navigate(app.getState().tasks, address, function (task) {
                app.act('EDIT', {
                    address: address,
                    key: 'collapsed',
                    value: !task.collapsed
                });
            });
        };
    };

    var toggleComplete = function toggleComplete(address) {
        return function () {
            navigate(app.getState().tasks, address, function (task) {
                app.act('EDIT', {
                    address: address,
                    key: 'completed',
                    value: !task.completed
                });
            });
        };
    };

    var addChild = function addChild(address) {
        return function () {
            showDialog('Add a child task', '', function (description) {
                app.act('ADD', { description: description, address: address });
            });
        };
    };

    var changeColor = function changeColor(address, color) {
        return function () {
            app.act('EDIT', {
                address: address,
                key: 'color',
                value: color
            });
        };
    };

    var editTask = function editTask(address) {
        return function () {
            navigate(app.getState().tasks, address, function (task) {
                showDialog('Edit task', task.description, function (description) {
                    app.act('EDIT', {
                        address: address,
                        key: 'description',
                        value: description
                    });
                });
            });
        };
    };

    var remove = function remove(address) {
        return function () {
            app.act('REMOVE', { address: address });
        };
    };

    var ContextMenu = createContextMenu({ app: app, isCompleted: isCompleted, toggleComplete: toggleComplete, addChild: addChild, changeColor: changeColor, editTask: editTask, remove: remove });

    app.use({ watcher: function watcher(state) {
            return emitChange(state);
        } });

    return function (_ref5) {
        var roomId = _ref5.roomId;

        join(roomId);
        return function (state) {
            if (!joinedRoom()) {
                return [LoadingPage];
            }
            return ['div', {}, [[dialog.builder], [Menu, state.showCompleted, function () {
                return addTask([]);
            }, toggleShowCompleted, app.redirect, undo, redo], ['div.tree-container', {}, [['ul', {}, state.tasks.map(function (parentTask) {
                return [Task, parentTask, state.showCompleted, toggleCollapsed, ContextMenu];
            })]]]]];
        };
    };
};

module.exports = mainPage;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dom = __webpack_require__(11);
var state = __webpack_require__(16);
var router = __webpack_require__(13);
var history = __webpack_require__(12)();

var _require = __webpack_require__(0)(),
    isFunction = _require.isFunction,
    assert = _require.assert,
    deepCopy = _require.deepCopy;

var goo = function goo(rootElement) {
    var _window = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

    var domHandler = dom(_window, rootElement);
    var stateHandler = state();
    var routeHandler = router(_window);

    var _state = { __unset__: true };

    // forwarding use calls
    var use = function use(blob) {
        return [domHandler, stateHandler, routeHandler].map(function (g) {
            return g.use(blob);
        });
    };

    // adding blobs
    [history].forEach(function (b) {
        return use(b);
    });

    // add watcher to keep track of current state
    use({ watcher: function watcher(newState) {
            return _state = newState;
        }
    });

    // add watcher to update dom
    use({ watcher: function watcher(newState) {
            return use({ state: newState });
        }
    });

    // add action to override state
    use({ action: {
            type: '__OVERRIDE__',
            target: [],
            handler: function handler(target, params) {
                return params;
            }
        } });

    var update = function update() {
        use({ state: _state });
    };

    // adding currentState and forwarding act calls
    var act = function act(type, params) {
        assert(!(_state && _state.__unset__) || type === '__OVERRIDE__', 'cannot act on state before it has been set');
        if (isFunction(type)) {
            type();
            update();
            return;
        }
        stateHandler.act(_state, type, params);
    };

    // override state
    var setState = function setState(replacement) {
        act('__OVERRIDE__', isFunction(replacement) ? replacement(deepCopy(_state)) : replacement);
    };

    // register a route/controller combo
    var register = function register(path, builder) {
        if (isFunction(path)) {
            builder = path();
            use({ builder: builder });
            return;
        }
        use({ route: {
                path: path,
                callback: function callback(params) {
                    use({ builder: builder(params) });
                }
            } });
    };

    // making it easier to use undo/redo
    var undo = function undo() {
        act('UNDO', {});
    };
    var redo = function redo() {
        act('REDO', {});
    };

    var getState = function getState() {
        assert(!(_state && _state.__unset__), 'cannot get state before it has been set');
        return deepCopy(_state);
    };

    return Object.assign(register, {
        setState: setState,
        s: setState,
        getState: getState,
        g: getState,
        redirect: routeHandler.redirect,
        r: routeHandler.redirect,
        act: act,
        a: act,
        use: use,
        update: update,
        u: update,
        undo: undo,
        redo: redo
    });
};

// making goo function available as an import or in the global window object
if (typeof module !== 'undefined' && module.exports) {
    module.exports = goo;
}
if (!!window) {
    window.goo = goo;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var goo = __webpack_require__(5);

var iocon = __webpack_require__(2);

var mainPage = __webpack_require__(4);
var homePage = __webpack_require__(3);
var dialogComponent = __webpack_require__(1);

var app = goo(document.body);

app.setState({});

var hasJoinedRoom = false;

var joinedRoom = function joinedRoom() {
    return hasJoinedRoom;
};

var _iocon = iocon({
    onJoin: function onJoin(roomId, state) {
        hasJoinedRoom = true;
        app.setState(state);
        app.act('__RESET__');
    },
    onChange: function onChange(state) {
        app.setState(state);
    }
}),
    join = _iocon.join,
    emitChange = _iocon.emitChange;

var dialog = dialogComponent(app);

app('/!/:roomId/', mainPage({ app: app, join: join, emitChange: emitChange, joinedRoom: joinedRoom, dialog: dialog }));

app('*', homePage({ app: app, dialog: dialog }));

app.use({ watcher: function watcher(state, type) {
        return console.log(state, type, new Error().stack);
    } });

window.app = app;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var colors = [{ name: 'NONE', color: 'transparent' }, { name: 'RED', color: '#ffcdbf' }, { name: 'YELLOW', color: '#fffac1' }, { name: 'GREEN', color: '#c7ffbf' }, { name: 'BLUE', color: '#bfffeb' }, { name: 'PURPLE', color: '#e9bfff' }];

var contextMenu = function contextMenu(_ref) {
    var app = _ref.app,
        isCompleted = _ref.isCompleted,
        toggleComplete = _ref.toggleComplete,
        addChild = _ref.addChild,
        changeColor = _ref.changeColor,
        edit = _ref.edit,
        remove = _ref.remove;

    var contextMenuAddress = null;

    var setContextMenuAddress = function setContextMenuAddress() {
        var address = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        contextMenuAddress = Array.isArray(address) ? address.slice() : null;
        app.update();
    };

    var contextMenuIsActive = function contextMenuIsActive(address) {
        return contextMenuAddress && contextMenuAddress.toString() === address.toString();
    };

    var toggleContextMenu = function toggleContextMenu(address) {
        console.log('>>', contextMenuIsActive(address) ? null : address);
        contextMenuIsActive(address) ? setContextMenuAddress(null) : setContextMenuAddress(address);
    };

    var builder = function builder(address) {
        if (!contextMenuIsActive(address)) {
            return null;
        }
        address = address.slice();
        return ['div.context-menu', { onclick: toggleContextMenu.bind(null, address) }, [['div.item', { onclick: toggleComplete(address) }, [isCompleted(address) ? 'NOT DONE' : 'DONE']], ['div.item', { onclick: addChild(address) }, ['ADD']], ['div.item', {}, ['COLOR', ['div.submenu', {}, colors.map(function (color) {
            return ['div.item', { onclick: changeColor(address, color.color) }, [['span | background-color:' + color.color + ';', {}, [color.name]]]];
        })]]], ['div.item', { onclick: function onclick() {
                return edit(address);
            } }, ['EDIT']], ['div.item', { onclick: function onclick() {
                return remove(address);
            } }, ['REMOVE']]]];
    };

    return { builder: builder, setContextMenuAddress: setContextMenuAddress, contextMenuIsActive: contextMenuIsActive, toggleContextMenu: toggleContextMenu };
};

module.exports = contextMenu;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var menu = function menu(showCompleted, addParent, toggleShowCompleted, redirect, undo, redo) {
    return ['div.buttons', {}, [['div.button', { onclick: function onclick() {
            return redirect('/');
        } }, ['HOME']], ['div.button', { onclick: addParent }, ['ADD PARENT']], ['div.button', { onclick: toggleShowCompleted }, [(showCompleted ? 'HIDE' : 'SHOW') + ' COMPLETED']], ['div.button', { onclick: undo }, ['UNDO']], ['div.button', { onclick: redo }, ['REDO']]]];
};

module.exports = menu;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Task = function Task(_ref, showCompleted, toggleCollapsed, ContextMenu) {
    var completed = _ref.completed,
        collapsed = _ref.collapsed,
        color = _ref.color,
        description = _ref.description,
        address = _ref.address,
        children = _ref.children;

    var isDisplayed = completed && !showCompleted;
    var textColor = completed ? 'rgba(0,0,0,0.2)' : 'inherit';
    var hasChildren = !!children.length;
    var symbol = hasChildren ? collapsed ? '+ ' : '- ' : '~ ';
    address = address.slice();
    return ['li | display:' + (isDisplayed ? 'none' : 'block') + '; color:' + textColor + ';', {}, [['span', {}, [['span.symbol', {
        style: 'pointer-events:' + (hasChildren ? 'all' : 'none') + ';\n                            color:' + (hasChildren ? 'inherit' : 'rgba(0,0,0,0.2)') + ';',
        onclick: toggleCollapsed(address)
    }, [symbol]], ['span.title | background-color:' + color + ';', {
        onclick: function onclick() {
            return ContextMenu.toggleContextMenu(address);
        },
        onmouseleave: ContextMenu.contextMenuIsActive(address) ? function () {
            return ContextMenu.toggleContextMenu(address);
        } : null
    }, [description, [ContextMenu.builder, address]]], ['span.children', {}, [['ul | display:' + (collapsed ? 'none' : 'block') + ';', {}, children.map(function (t) {
        return [Task, t, showCompleted, toggleCollapsed, ContextMenu];
    })]]]]]]];
};

module.exports = Task;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var loadingPage = function loadingPage() {
    return ['div | height: 100vh; width: 100vw; position: relative;', {}, [['div | width: 100%; text-align: center; position:absolute; top:30%;', {}, ['LOADING ...']]]];
};

module.exports = loadingPage;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _require = __webpack_require__(0)(),
    assert = _require.assert,
    isDefined = _require.isDefined,
    isNull = _require.isNull,
    isArray = _require.isArray,
    isString = _require.isString,
    isNode = _require.isNode,
    isObject = _require.isObject,
    isFunction = _require.isFunction,
    makeQueue = _require.makeQueue,
    blobHandler = _require.blobHandler;

var dom = function dom() {
    var _window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

    var _target = arguments[1];
    var _builder = arguments[2];
    var _state = arguments[3];

    // build vdom from state
    var build = function build(state) {
        var parse = function parse(element) {
            if (isNull(element)) {
                return { text: '' };
            }
            if (isString(element)) {
                return { text: element };
            }
            assert(isArray(element), 'vdom object is not an array or string', element);
            if (isFunction(element[0])) {
                var _element = _toArray(element),
                    args = _element.slice(1);

                return parse(element[0].apply(element, _toConsumableArray(args)));
            }

            var _element2 = _slicedToArray(element, 3),
                tagType = _element2[0],
                attributes = _element2[1],
                children = _element2[2];

            assert(isString(tagType), 'tag property is not a string', tagType);
            // capture groups: tagName, id, className, style
            var match = /^ *(\w+) *(?:#([-\w\d]+))? *((?:\.[-\w\d]+)*)? *(?:\|\s*([^\s]{1}[^]*?))? *$/.exec(tagType);
            assert(isArray(match), 'tag property cannot be parsed', tagType);

            var _match = _slicedToArray(match, 5),
                tagName = _match[1],
                id = _match[2],
                className = _match[3],
                style = _match[4];

            if (!isObject(attributes)) {
                attributes = {};
            }
            if (isDefined(id) && !isDefined(attributes.id)) {
                attributes.id = id.trim();
            }
            if (isDefined(className)) {
                if (!isDefined(attributes.className)) {
                    attributes.className = '';
                }
                attributes.className += className.replace(/\./g, ' ');
                attributes.className = attributes.className.trim();
            }
            if (isDefined(style)) {
                if (!isDefined(attributes.style)) {
                    attributes.style = style;
                } else {
                    attributes.style += ';' + style;
                }
            }
            if (isDefined(children)) {
                assert(isArray(children), 'children of vdom object is not an array', children);
            } else {
                children = [];
            }
            return {
                tagName: tagName,
                attributes: attributes,
                children: children.map(function (c) {
                    return parse(c);
                })
            };
        };
        return parse(builder(state));
    };

    // recursively creates DOM elements from vdom object
    var render = function render(velem) {
        if (isDefined(velem.text)) {
            velem.DOM = _window.document.createTextNode(velem.text);
            return velem;
        }
        var element = _window.document.createElement(velem.tagName);
        Object.keys(velem.attributes).forEach(function (attribute) {
            element[attribute] = velem.attributes[attribute];
        });
        Object.keys(velem.children).forEach(function (key) {
            velem.children[key] = render(velem.children[key]);
            element.appendChild(velem.children[key].DOM);
        });
        velem.DOM = element;
        return velem;
    };

    /* shallow diff of two objects which returns an array of the
        modified keys (functions always considered different)*/
    var diff = function diff(original, successor) {
        return Object.keys(Object.assign({}, original, successor)).filter(function (key) {
            var valueOriginal = original[key];
            var valueSuccessor = successor[key];
            return !(valueOriginal !== Object(valueOriginal) && valueSuccessor !== Object(valueSuccessor) && valueOriginal === valueSuccessor);
        });
    };

    // update vdom and real DOM to new state
    var update = function update(newState) {
        // using a queue to clean up deleted nodes after diffing finishes
        var queue = makeQueue();
        queue.add(function () {
            _window.requestAnimationFrame(function () {
                return _update(vdom, build(newState), { DOM: target, children: [vdom] }, 0);
            });
            queue.done();
        });
        // recursive function to update an element according to new state
        var _update = function _update(original, successor, originalParent, parentIndex) {
            if (!isDefined(original) && !isDefined(successor)) {
                return;
            }
            // add
            if (!isDefined(original)) {
                originalParent.children[parentIndex] = render(successor);
                originalParent.DOM.appendChild(originalParent.children[parentIndex].DOM);
                return;
            }
            // remove
            if (!isDefined(successor)) {
                originalParent.DOM.removeChild(original.DOM);
                queue.add(function () {
                    delete originalParent.children[parentIndex];
                    queue.done();
                });
                return;
            }
            // replace
            if (original.tagName !== successor.tagName) {
                var oldDOM = original.DOM;
                var newVDOM = render(successor);
                originalParent.DOM.replaceChild(newVDOM.DOM, oldDOM);
                /* need to manually delete to preserve reference to past object */
                if (isDefined(newVDOM.text)) {
                    originalParent.children[parentIndex].DOM = newVDOM.DOM;
                    originalParent.children[parentIndex].text = newVDOM.text;
                    delete originalParent.children[parentIndex].tagName;
                    delete originalParent.children[parentIndex].attributes;
                    delete originalParent.children[parentIndex].children;
                } else {
                    originalParent.children[parentIndex].DOM = newVDOM.DOM;
                    delete originalParent.children[parentIndex].text;
                    originalParent.children[parentIndex].tagName = newVDOM.tagName;
                    originalParent.children[parentIndex].attributes = newVDOM.attributes;
                    originalParent.children[parentIndex].children = newVDOM.children;
                }
                return;
            }
            // edit
            if (original.DOM.nodeType === 3) {
                if (original.text !== successor.text) {
                    original.DOM.nodeValue = successor.text;
                    original.text = successor.text;
                }
            } else {
                var attributesDiff = diff(original.attributes, successor.attributes);
                if (attributesDiff.length !== 0) {
                    attributesDiff.forEach(function (key) {
                        original.attributes[key] = successor.attributes[key];
                        original.DOM[key] = successor.attributes[key];
                    });
                }
            }
            var keys = Object.keys(original.children || {}).concat(Object.keys(successor.children || {}));
            var visited = {};
            keys.forEach(function (key) {
                if (visited[key] === undefined) {
                    visited[key] = true;
                    _update(original.children[key], successor.children[key], original, key);
                }
            });
        };
    };

    var vdom = render({ text: '' });
    var target = undefined;
    var builder = undefined;
    var state = undefined;

    var hasDrawn = false;
    var drawToTarget = function drawToTarget() {
        hasDrawn = true;
        _window.requestAnimationFrame(function () {
            target.innerHTML = '';
            target.appendChild(vdom.DOM);
        });
    };

    var requiredVariablesAreDefined = function requiredVariablesAreDefined() {
        return isDefined(target) && isDefined(builder) && isDefined(state);
    };

    var replaceTarget = function replaceTarget(newTarget) {
        assert(isNode(newTarget), 'target is not a DOM node', newTarget);
        target = newTarget;
        if (requiredVariablesAreDefined()) {
            drawToTarget();
        }
    };

    var replaceBuilder = function replaceBuilder(newBuilder) {
        assert(isFunction(newBuilder), 'builder is not a function', newBuilder);
        builder = newBuilder;
        if (requiredVariablesAreDefined()) {
            if (!hasDrawn) {
                drawToTarget();
            }
            update(state);
        }
    };

    var updateState = function updateState(newState) {
        assert(isDefined(newState), 'new state is not defined', newState);
        state = newState;
        if (requiredVariablesAreDefined()) {
            if (!hasDrawn) {
                drawToTarget();
            }
            update(state);
        }
    };

    if (isDefined(_target)) {
        replaceTarget(_target);
    }
    if (isDefined(_builder)) {
        replaceBuilder(_builder);
    }
    if (isDefined(_state)) {
        updateState(_state);
    }

    var use = function use(blob) {
        // making sure only one value is given to each handler
        var newBlob = {};
        Object.keys(blob).map(function (b) {
            return newBlob[b] = [blob[b]];
        });
        if (isDefined(blob.name)) {
            newBlob.name = blob.name;
        }
        return blobHandler({
            target: replaceTarget,
            builder: replaceBuilder,
            state: updateState
        }, newBlob);
    };

    return { use: use };
};

module.exports = dom;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0)(),
    deepCopy = _require.deepCopy;

var history = function history() {
    var past = [];
    var current = { __unset__: true };
    var future = [];

    var historyLength = 20;
    var ignorePrefix = '*';

    var undoAction = {
        type: 'UNDO',
        target: [],
        handler: function handler() {
            if (past.length > 0 && (!past[past.length - 1] || past[past.length - 1].__unset__ !== true)) {
                future.push(current);
                return past.pop();
            } else {
                return current;
            }
        }
    };

    var redoAction = {
        type: 'REDO',
        target: [],
        handler: function handler() {
            if (future.length > 0) {
                past.push(current);
                return future.pop();
            } else {
                return current;
            }
        }
    };

    var resetAction = {
        type: '__RESET__',
        target: [],
        handler: function handler() {
            past = [];
            future = [];
            return current;
        }
    };

    var updateState = function updateState(state, type) {
        if (type === '__RESET__' || type[0] === ignorePrefix) {
            return;
        }
        if (type !== 'UNDO' && type !== 'REDO') {
            future = [];
            past.push(current);
            if (past.length > historyLength + 1) {
                past.shift();
            }
        }
        current = deepCopy(state);
    };

    return {
        action: [undoAction, redoAction, resetAction],
        watcher: updateState
    };
};

module.exports = history;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pathToRegexp = __webpack_require__(15);

var _require = __webpack_require__(0)(),
    assert = _require.assert,
    isString = _require.isString,
    isObject = _require.isObject,
    isFunction = _require.isFunction,
    blobHandler = _require.blobHandler;

var router = function router() {
    var _window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

    // store all the registered routes
    var pathStore = [];

    // store base url to prepend to all addresses
    var baseUrl = '';

    // track if a path has matched on page load
    var hasMatched = false;

    var isHosted = _window.document.origin !== null && _window.document.origin !== 'null';

    // removes base url from a path
    var removeBaseUrl = function removeBaseUrl(path) {
        return path.replace(new RegExp('\^' + baseUrl), '') || '';
    };

    // store initial pathName
    var currentPath = _window.location.pathname;
    if (!isHosted) {
        currentPath = '';
    }

    // add a route/callback combo to the store given as argument
    var register = function register(store) {
        return function (path, callback) {
            store.push({
                pattern: pathToRegexp(path, [], { strict: true }),
                callback: callback
            });
        };
    };

    /* call all the callbacks from the store given as argument
        who's route matches path argument*/
    var fetch = function fetch(store) {
        return function (path, params) {
            var found = false;
            store.forEach(function (registeredPath) {
                if (found) {
                    return;
                }
                var test = registeredPath.pattern.exec(path);
                if (test === null) {
                    return;
                }
                found = true;
                test.shift();
                registeredPath.pattern.keys.forEach(function (key, i) {
                    params[key.name] = test[i];
                });
                registeredPath.callback(params);
            });
            return found;
        };
    };

    // handle back/forward events
    _window.onpopstate = function () {
        currentPath = removeBaseUrl(_window.location.pathname);
        fetch(pathStore)(currentPath, _window.history.state || {});
    };

    // register wrapper that runs the current page's url against new routes
    var addRoute = function addRoute(_ref) {
        var path = _ref.path,
            callback = _ref.callback;

        assert(isString(path), 'register path is not a string', path);
        assert(isFunction(callback), 'callback for path is not a function\n>>>' + path, callback);
        register(pathStore)(path, callback);
        // checking new path against current pathname
        if (!hasMatched) {
            var temp = [];
            register(temp)(path, callback);
            var found = fetch(temp)(currentPath, _window.history.state || {});
            if (found) {
                hasMatched = true;
            }
        }
    };

    // fetch wrapper that makes the browser aware of the url change
    var redirect = function redirect(path) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        assert(isString(path), 'redirect path is not a string', path);
        assert(isObject(params), 'redirect params is not an object', params);
        currentPath = path;
        if (isHosted) {
            /* edge doesn't care that the file is local and will allow pushState.
                it also includes "/C:" in the location.pathname, but adds it to
                the path given to pushState. which means it needs to be removed here */
            _window.history.pushState({}, '', (baseUrl + currentPath).replace(/^\/C\:/, ''));
        } else {
            console.log('goo-router:: path changed to\n>>>' + currentPath);
        }
        return fetch(pathStore)(currentPath, params);
    };

    // replace the base url, adjust the current and try to fetch with the new url
    var replaceBaseUrl = function replaceBaseUrl(base) {
        assert(isString(base), 'base url is not a string', base);
        baseUrl = base;
        currentPath = removeBaseUrl(currentPath);
        fetch(pathStore)(currentPath, _window.history.state || {});
    };

    var use = function use(blob) {
        return blobHandler({
            route: addRoute,
            base: replaceBaseUrl
        }, blob);
    };

    return { redirect: redirect, use: use };
};

module.exports = router;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isarray = __webpack_require__(14);

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp;
module.exports.parse = parse;
module.exports.compile = compile;
module.exports.tokensToFunction = tokensToFunction;
module.exports.tokensToRegExp = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
// Match escaped characters that would otherwise appear in future matches.
// This allows the user to escape special characters that won't transform.
'(\\\\.)',
// Match Express-style parameters and un-named parameters with a prefix
// and optional suffixes. Matches appear as:
//
// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse(str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue;
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?'
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile(str, options) {
  return tokensToFunction(parse(str, options));
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty(str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk(str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (_typeof(tokens[i]) === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue;
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue;
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined');
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`');
        }

        if (value.length === 0) {
          if (token.optional) {
            continue;
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty');
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`');
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue;
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
      }

      path += token.prefix + segment;
    }

    return path;
  };
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup(group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys(re, keys) {
  re.keys = keys;
  return re;
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags(options) {
  return options.sensitive ? '' : 'i';
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp(path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys);
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp(path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys);
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp(path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options);
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp(tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys);
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp(path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */keys);
  }

  if (isarray(path)) {
    return arrayToRegexp( /** @type {!Array} */path, /** @type {!Array} */keys, options);
  }

  return stringToRegexp( /** @type {string} */path, /** @type {!Array} */keys, options);
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0)(),
    assert = _require.assert,
    deepCopy = _require.deepCopy,
    makeQueue = _require.makeQueue,
    blobHandler = _require.blobHandler,
    isDefined = _require.isDefined,
    isArray = _require.isArray,
    isFunction = _require.isFunction,
    isString = _require.isString;

// creates an object that acts on a state


var state = function state() {
    var actions = {};
    var middleware = [];
    var watchers = [];

    var queue = makeQueue();

    var addAction = function addAction(action) {
        var type = action.type,
            handler = action.handler,
            target = action.target;

        assert(isString(type), '@use>action: action type "' + type + '" is not a string', action);
        assert(isFunction(handler), '@use>action: handler for action ' + type + ' is not a function', handler);
        assert(isArray(target), '@use>action: target of action ' + type + ' is not an array', target);
        target.forEach(function (address) {
            assert(isString(address), '@use>action: target of action type ' + type + ' is not an array of strings ' + target);
        });
        if (actions[type] === undefined) {
            actions[type] = [action];
        } else {
            actions[type].push(action);
        }
    };

    var addMiddleware = function addMiddleware(handler) {
        assert(isFunction(handler), '@use>middleware: middleware is not a function', handler);
        middleware.push(handler);
    };

    var addWatcher = function addWatcher(handler) {
        assert(isFunction(handler), '@use>watcher: watcher is not a function', handler);
        watchers.push(handler);
    };

    // supported blobs and their execution
    var use = function use(blob) {
        return blobHandler({
            action: addAction,
            middleware: addMiddleware,
            watcher: addWatcher
        }, blob, queue);
    };

    // exectute an action on the state
    var execute = function execute(state, type, params) {
        var newState = deepCopy(state);
        assert(isDefined(actions[type]), 'action type \'' + type + '\' was not found');
        actions[type].forEach(function (currentAction) {
            var target = deepCopy(newState);
            if (currentAction.target.length > 0) {
                var reference = newState;
                currentAction.target.forEach(function (key, i, a) {
                    assert(isDefined(target[key]), 'target of action ' + type + ' does not exist: @state.' + currentAction.target.slice(0, i + 1).join('.'));
                    if (i === a.length - 1) {
                        var newValue = currentAction.handler(target[key], params);
                        assert(isDefined(newValue), 'result of action ' + type + ' on target @state' + (currentAction.target[0] ? '.' : '') + currentAction.target.join('.') + ' is undefined');
                        reference[key] = newValue;
                    } else {
                        target = target[key];
                        reference = reference[key];
                    }
                });
            } else {
                newState = currentAction.handler(target, params);
                assert(isDefined(newState), 'result of action ' + type + ' on target @state' + (currentAction.target[0] ? '.' : '') + currentAction.target.join('.') + ' is undefined');
            }
        });

        watchers.forEach(function (watcher) {
            watcher(deepCopy(newState), type, params);
        });

        queue.done();
    };

    // execute wrapper that applies middleware
    var apply = function apply(state, type, params) {
        var funcs = [function () {
            var _state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state;

            var _type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : type;

            var _params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : params;

            execute(_state, _type, _params);
        }];
        middleware.reverse().forEach(function (currentMiddleware, index) {
            funcs[index + 1] = function () {
                var _state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state;

                var _type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : type;

                var _params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : params;

                state = _state;
                type = _type;
                params = _params;
                currentMiddleware(funcs[index], deepCopy(_state), _type, _params);
            };
        });
        funcs[middleware.length](deepCopy(state), type, params);
    };

    // apply wrapper that uses the wait queue
    var act = function act(state, type) {
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        assert(isDefined(state), 'cannot call act with undefined state');
        assert(isDefined(type), 'cannot call act with undefined type');
        queue.add(function () {
            apply(state, type, params);
        });
    };

    return { act: act, use: use };
};

module.exports = state;

/***/ })
/******/ ]);