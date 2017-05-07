/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

module.exports = function (app) {
    app.use({ action: [{
            type: '*SHOW_DIALOG',
            target: ['dialog'],
            handler: function handler(dialog, _ref) {
                var _ref2 = _slicedToArray(_ref, 3),
                    description = _ref2[0],
                    value = _ref2[1],
                    action = _ref2[2];

                dialog.hidden = false;
                dialog.action = function (value) {
                    return action;
                };
                dialog.description = description;
                dialog.value = value;
                setTimeout(function () {
                    document.querySelector('.field').focus();
                }, 0);
                return dialog;
            }
        }, {
            type: '*HIDE_DIALOG',
            target: ['dialog'],
            handler: function handler(dialog) {
                return {
                    hidden: true,
                    action: null,
                    description: '',
                    value: ''
                };
            }
        }] });

    return function (app, state) {
        return state.dialog.hidden ? null : ['div.dialog-wrapper', {}, [['div.dialog', {}, [['form', {
            onsubmit: function onsubmit(e) {
                e.preventDefault();
                state.dialog.action()(e.srcElement[0].value);
                e.srcElement[0].value = '';
                app.a('*HIDE_DIALOG');
            }
        }, [['label', {}, [state.dialog.description || '-', ['br'], ['input.field', { type: 'text', value: state.dialog.value }]]]]]]], ['div.dialog-overlay', { onclick: function onclick() {
                return app.a('*HIDE_DIALOG');
            } }]]];
    };
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (app) {
    app.use({ action: [{
            type: 'TOGGLE_SHOW_COMPLETED',
            target: ['showCompleted'],
            handler: function handler(status) {
                return !status;
            }
        }, {
            type: 'NEW_PARENT',
            target: ['nodes'],
            handler: function handler(nodes, description) {
                nodes.push(app._.createNode(description, nodes.length));
                return nodes;
            }
        }] });

    return function (app, state) {
        return ['div.buttons', {}, [
        // new parent
        ['div.button', { onclick: function onclick() {
                app.a('*SHOW_DIALOG', ['Add a parent task', '', function (value) {
                    app.a('NEW_PARENT', value);
                }]);
            } }, ['NEW PARENT']],
        // toggle completed
        ['div.button', { onclick: function onclick() {
                return app.a('TOGGLE_SHOW_COMPLETED');
            } }, [state.showCompleted ? 'HIDE COMPLETED' : 'SHOW COMPLETED']],
        // undo
        ['div.button', { onclick: function onclick() {
                return app.undo();
            } }, ['UNDO']],
        // redo
        ['div.button', { onclick: function onclick() {
                return app.redo();
            } }, ['REDO']]]];
    };
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var contextmenu = __webpack_require__(3);

module.exports = function (app) {
    var contextmenuBuilder = contextmenu(app);

    app.use({ action: [{
            type: 'TOGGLE_COLLAPSED',
            target: ['nodes'],
            handler: function handler(state, address) {
                app._.navigate(state, address.split('#'), function (node) {
                    node.collapsed = !node.collapsed;
                });
                return state;
            }
        }, {
            type: 'TOGGLE_COMPLETED',
            target: ['nodes'],
            handler: function handler(state, address) {
                app._.navigate(state, address.split('#'), function (node) {
                    node.completed = !node.completed;
                });
                return state;
            }
        }, {
            type: 'ADD_CHILD',
            target: ['nodes'],
            handler: function handler(state, _ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    value = _ref2[0],
                    address = _ref2[1];

                app._.navigate(state, address.split('#'), function (node) {
                    node.children.push(app._.createNode(value, address + '#' + node.children.length));
                });
                return state;
            }
        }, {
            type: 'CHANGE_COLOR',
            target: ['nodes'],
            handler: function handler(state, _ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                    color = _ref4[0],
                    address = _ref4[1];

                app._.navigate(state, address.split('#'), function (node) {
                    node.color = color;
                });
                return state;
            }
        }, {
            type: 'EDIT_DESCRIPTION',
            target: ['nodes'],
            handler: function handler(state, _ref5) {
                var _ref6 = _slicedToArray(_ref5, 2),
                    value = _ref6[0],
                    address = _ref6[1];

                app._.navigate(state, address.split('#'), function (node) {
                    node.info = value;
                });
                return state;
            }
        }, {
            type: 'REMOVE',
            target: ['nodes'],
            handler: function handler(state, address) {
                address = address.split('#');
                var childIndex = address.pop();
                app._.navigate(state, address, function (node) {
                    if (!Array.isArray(node)) {
                        node = node.children;
                    }
                    node.splice(childIndex, 1);
                });
                return state;
            }
        }] });

    var buildNode = function buildNode(app, state, node) {
        return ['li', {
            style: '\n                display: ' + (node.completed && !state.showCompleted ? 'none' : 'block') + ';\n                color: ' + (node.completed ? 'rgba(0,0,0,0.2)' : 'inherit') + ';\n            '
        }, [['span', {}, [
        // symbol
        ['span.symbol', {
            onclick: function onclick() {
                return app.a('TOGGLE_COLLAPSED', node.address);
            },
            style: '\n                        pointer-events: ' + (node.children.length ? 'all' : 'none') + ';\n                        color: ' + (node.children.length ? 'inherit' : 'rgba(0,0,0,0.2)') + ';\n                    '
        }, [node.children.length ? node.collapsed ? '+ ' : '- ' : '~ ']],
        // title
        ['span.title', {
            onclick: function onclick() {
                return app.a('*TOGGLE_CONTEXTMENU', node.address);
            },
            style: 'background-color: ' + node.color
        }, [node.info]],
        // contextmenu
        state.contextMenuAddress === node.address ? contextmenuBuilder(app, state, node) : null,
        // children
        ['span.children', {
            style: 'display: ' + (node.collapsed ? 'none' : 'block')
        }, [['ul', {}, node.children.map(function (node) {
            return buildNode(app, state, node);
        })]]]]]]];
    };
    return buildNode;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (app) {
    app.use({ action: [{
            type: '*TOGGLE_CONTEXTMENU',
            target: ['contextMenuAddress'],
            handler: function handler(address, params) {
                if (address === params) {
                    return null;
                } else {
                    return params || null;
                }
            }
        }] });

    return function (app, state, item) {
        return ['div.contextmenu', {
            onclick: function onclick() {
                return app.a('*TOGGLE_CONTEXTMENU');
            },
            onmouseleave: function onmouseleave() {
                return app.a('*TOGGLE_CONTEXTMENU');
            }
        }, [['div.item', { onclick: function onclick() {
                return app.a('TOGGLE_COMPLETED', item.address);
            } }, [item.completed ? 'NOT DONE' : 'DONE']], ['div.item', { onclick: function onclick() {
                app.a('*SHOW_DIALOG', ['Add a child task', '', function (value) {
                    app.a('ADD_CHILD', [value, item.address]);
                }]);
            } }, ['ADD']], ['div.item', {}, ['COLOR', ['div.submenu', {}, state.colors.map(function (color) {
            return ['div.item', { onclick: function onclick() {
                    return app.a('CHANGE_COLOR', [color.color, item.address]);
                } }, [['span', { style: 'background-color: ' + color.color }, [color.name]]]];
        })]]], ['div.item', { onclick: function onclick() {
                app.a('*SHOW_DIALOG', ['Edit', item.info, function (value) {
                    app.a('EDIT_DESCRIPTION', [value, item.address]);
                }]);
            } }, ['EDIT']], ['div.item', { onclick: function onclick() {
                return app.a('REMOVE', item.address);
            } }, ['REMOVE']]]];
    };
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dialog = __webpack_require__(0);
var menu = __webpack_require__(1);
var node = __webpack_require__(2);

var app = window.goo(document.body);

var dialogBuilder = dialog(app);
var menuBuilder = menu(app);
var nodeBuilder = node(app);

var localStorageKey = 'data-663';

// first time user's state
var defaultState = {
    showCompleted: true,
    contextMenuAddress: null,
    dialog: {
        hidden: true,
        description: '',
        action: null,
        value: ''
    },
    colors: [{ name: 'NONE', color: 'transparent' }, { name: 'RED', color: '#ffcdbf' }, { name: 'YELLOW', color: '#fffac1' }, { name: 'GREEN', color: '#c7ffbf' }, { name: 'BLUE', color: '#bfffeb' }, { name: 'PURPLE', color: '#e9bfff' }],
    nodes: []
};

// fetching state
app.setState(JSON.parse(localStorage.getItem(localStorageKey)) || defaultState);

// making some "globally" available functions
app._.createNode = function (description, address) {
    return {
        completed: false,
        collapsed: false,
        color: 'transparent',
        info: description,
        address: String(address),
        children: []
    };
};
app._.navigate = function (object, address, callback) {
    if (address.length === 0 || object === undefined) {
        callback(object);
    } else {
        var nextKey = address.shift();
        if (nextKey !== 'children' && address.length > 0) {
            address.unshift('children');
        }
        app._.navigate(object[nextKey], address, callback);
    }
};

// defining layout
app(function (state) {
    return ['div', {}, [dialogBuilder(app, state), menuBuilder(app, state), ['div#tree_container', {}, [['ul', {}, state.nodes.map(function (parentNode) {
        return nodeBuilder(app, state, parentNode);
    })]]]]];
});

// make sure the menus are hidden when undo/redo actions happen
app.use({ action: [{
        type: 'UNDO',
        target: [],
        handler: function handler(state) {
            state.contextMenuAddress = null;
            state.dialog = {
                hidden: true,
                description: '',
                action: null,
                value: ''
            };
            return state;
        }
    }, {
        type: 'REDO',
        target: [],
        handler: function handler(state) {
            state.contextMenuAddress = null;
            state.dialog = {
                hidden: true,
                description: '',
                action: null,
                value: ''
            };
            return state;
        }
    }] });

// save state after each change
app.use({ watcher: function watcher(state, type) {
        localStorage.setItem(localStorageKey, JSON.stringify(state));
    } });

/***/ })
/******/ ]);