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


var dom = __webpack_require__(2);
var state = __webpack_require__(5);
var router = __webpack_require__(4);
var history = __webpack_require__(3)();

var _require = __webpack_require__(0)(),
    isFunction = _require.isFunction,
    assert = _require.assert,
    deepCopy = _require.deepCopy;

var goo = function goo(rootElement) {
    var _state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { __unset__: true };

    var _window = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;

    var domHandler = dom(_window, rootElement);
    var stateHandler = state();
    var routeHandler = router(_window);

    _state = deepCopy(_state);

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

    // adding currentState and forwarding act calls
    var act = function act(type, params) {
        assert(!(_state && _state.__unset__) || type === '__OVERRIDE__', 'cannot act on state before it has been set');
        stateHandler.act(_state, type, params);
    };

    // override state
    var setState = function setState(replacement) {
        act('__OVERRIDE__', isFunction(replacement) ? replacement(deepCopy(_state)) : replacement);
    };

    // register a route/controller combo
    var register = function register(path, builder) {
        if (isFunction(path)) {
            builder = path;
            path = '';
        }
        use({ route: {
                path: path,
                callback: function callback(params) {
                    var _builder = function _builder(newState) {
                        return builder(newState, params);
                    };
                    use({ builder: _builder });
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

    var update = function update() {
        use({ state: _state });
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
        redo: redo,
        _: {}
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
/* 2 */
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

            assert(isString(tagType), 'tag property is not a string', element);
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
/* 3 */
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

    var updateState = function updateState(state, type) {
        if (type[0] === ignorePrefix) {
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
        action: [undoAction, redoAction],
        watcher: updateState
    };
};

module.exports = history;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0)(),
    deepCopy = _require.deepCopy,
    assert = _require.assert,
    isDefined = _require.isDefined,
    isString = _require.isString,
    isObject = _require.isObject,
    isFunction = _require.isFunction,
    blobHandler = _require.blobHandler;

var paramKey = ':params';
var callbackKey = ':callback';

// creates blank single-level route object
var mkdir = function mkdir() {
    var temp = {};
    temp[paramKey] = {};
    return temp;
};

// splits url path into array
var explodePath = function explodePath(path) {
    return path.replace(/\?[^]*$/g, '').split('/').map(function (p) {
        return p.trim();
    });
};

var router = function router() {
    var _window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

    // store all the registered routes in an encoded format
    var pathStore = mkdir();

    // store base url to prepend to all addresses
    var baseUrl = '';

    var isHosted = _window.document.origin !== null && _window.document.origin !== 'null';

    // removes base url from a path
    var removeBaseUrl = function removeBaseUrl(path) {
        return path.replace(new RegExp('\^' + baseUrl), '') || '';
    };

    // fallback function
    var fallback = function fallback(path) {
        console.log('no route was found for\n>>>' + path);
    };

    // store initial pathName
    var currentPath = _window.location.pathname;
    if (!isHosted) {
        currentPath = '';
    }

    // add a route/callback combo to the store given as argument
    var register = function register(store) {
        return function (path, callback) {
            var explodedPath = explodePath(path);
            var currentLevel = store;
            explodedPath.forEach(function (token, i) {
                if (token[0] === ':') {
                    currentLevel[paramKey][token.substring(1)] = currentLevel[paramKey][token.substring(1)] || [];
                    var defaultObj = mkdir();
                    currentLevel[paramKey][token.substring(1)].push(defaultObj);
                    currentLevel = defaultObj;
                } else {
                    currentLevel[token] = currentLevel[token] || mkdir();
                    currentLevel = currentLevel[token];
                }
                if (i === explodedPath.length - 1) {
                    currentLevel[callbackKey] = callback;
                }
            });
        };
    };

    /* call all the callbacks from the store given as argument
        who's route matches path argument*/
    var fetch = function fetch(store) {
        return function (path, params) {
            var explodedPath = explodePath(path);
            var explore = function explore(fragment, path, params) {
                path = path.slice();
                params = deepCopy(params);
                if (path.length === 0) {
                    if (fragment[callbackKey]) {
                        fragment[callbackKey](params);
                        found = true;
                    }
                } else {
                    var next = path.shift();
                    if (isDefined(fragment[next])) {
                        explore(fragment[next], path, params);
                    }
                    Object.keys(fragment[paramKey]).forEach(function (param) {
                        fragment[paramKey][param].forEach(function (p) {
                            var temp = {};
                            temp[param] = next;
                            explore(p, path, Object.assign(params, temp));
                        });
                    });
                }
            };
            var found = false;
            explore(store, explodedPath, params);
            return found;
        };
    };

    // handle back/forward events
    _window.onpopstate = function () {
        currentPath = removeBaseUrl(_window.location.pathname);
        var found = fetch(pathStore)(currentPath, _window.history.state || {});
        if (!found) {
            fallback(currentPath);
        }
    };

    // register wrapper that runs the current page's url against new routes
    var addRoute = function addRoute(_ref) {
        var path = _ref.path,
            callback = _ref.callback;

        assert(isString(path), 'register path is not a string', path);
        assert(isFunction(callback), 'callback for path is not a function\n>>>' + path, callback);
        register(pathStore)(path, callback);
        // chacking new path against current pathname
        var temp = mkdir();
        register(temp)(path, callback);
        fetch(temp)(currentPath, _window.history.state || {});
    };

    // replace the current fallback function
    var replaceFallback = function replaceFallback(callback) {
        assert(isFunction(callback), 'callback for fallback is not a function', callback);
        fallback = callback;
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
        var found = fetch(pathStore)(currentPath, params);
        if (!found) {
            fallback(path);
        }
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
            base: replaceBaseUrl,
            fallback: replaceFallback
        }, blob);
    };

    return { redirect: redirect, use: use };
};

module.exports = router;

/***/ }),
/* 5 */
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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var goo = __webpack_require__(1);

var Dialog = __webpack_require__(7);
var Menu = __webpack_require__(8);
var Task = __webpack_require__(11);
var ContextMenu = __webpack_require__(12);

var localStorageKey = 'data-663';

var app = goo(document.body);

app.use({ base: '/C:/Users/Gabriel/Documents/dev/663/src/public/index.html' });

var contextMenuAddress = [];
var dialog = {
    hidden: true,
    hint: '',
    action: null,
    value: ''
};

var defaultState = {
    showCompleted: true,
    tasks: []
};

app.setState(JSON.parse(localStorage.getItem(localStorageKey)) || defaultState);

app.use({ watcher: function watcher(state, type) {
        localStorage.setItem(localStorageKey, JSON.stringify(state));
    } });

app.use({ action: {
        type: 'TOGGLE_SHOW_COMPLETED',
        target: ['showCompleted'],
        handler: function handler(value) {
            return !value;
        }
    } });

var navigate = function navigate(object, address, callback) {
    if (address.length === 0 || object === undefined) {
        callback(object);
    } else {
        var nextKey = address.shift();
        if (nextKey !== 'children' && address.length > 0) {
            address.unshift('children');
        }
        navigate(object[nextKey], address, callback);
    }
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
        handler: function handler(tasks, _ref) {
            var address = _ref.address,
                description = _ref.description;

            var addr = address.slice();
            navigate(tasks, address.slice(), function (task) {
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
        handler: function handler(tasks, _ref2) {
            var address = _ref2.address,
                key = _ref2.key,
                value = _ref2.value;

            navigate(tasks, address, function (task) {
                task[key] = value;
            });
            return tasks;
        }
    } });

app.use({ action: {
        type: 'REMOVE',
        target: ['tasks'],
        handler: function handler(tasks, _ref3) {
            var address = _ref3.address;

            var addr = address.slice();
            var index = addr.pop();
            navigate(tasks, addr, function (task) {
                if (!Array.isArray(task)) {
                    task = task.children;
                }
                delete task[index];
            });
            return tasks;
        }
    } });

var undo = function undo() {
    contextMenuAddress = [];
    app.undo();
};

var redo = function redo() {
    contextMenuAddress = [];
    app.redo();
};

var hideDialog = function hideDialog() {
    dialog = {
        hidden: true,
        hint: '',
        action: null,
        value: ''
    };
    app.update();
};

var showDialog = function showDialog(hint) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var _action = arguments[2];

    dialog = {
        hidden: false,
        hint: hint,
        value: value,
        action: function action(e) {
            e.preventDefault();
            _action(e.target[0].value);
            hideDialog();
        }
    };
    contextMenuAddress = [];
    app.update();
};

var addTask = function addTask(address) {
    showDialog('Add a task', '', function (description) {
        app.act('ADD', { description: description, address: address });
    });
};

var toggleShowCompleted = function toggleShowCompleted() {
    app.act('TOGGLE_SHOW_COMPLETED');
};

var toggleCollapsed = function toggleCollapsed(address) {
    return function () {
        navigate(app.getState().tasks, address.slice(), function (task) {
            app.act('EDIT', {
                address: address,
                key: 'collapsed',
                value: !task.collapsed
            });
        });
    };
};

var toggleContextMenu = function toggleContextMenu(address) {
    return function () {
        if (contextMenuAddress.toString() === address.toString()) {
            contextMenuAddress = [];
        } else {
            contextMenuAddress = address.slice();
        }
        app.update();
    };
};

var toggleComplete = function toggleComplete(address) {
    return function () {
        navigate(app.getState().tasks, address.slice(), function (task) {
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

var changeColor = function changeColor(address) {
    return function (color) {
        app.act('EDIT', {
            address: address,
            key: 'color',
            value: color
        });
    };
};

var editTask = function editTask(address) {
    return function () {
        navigate(app.getState().tasks, address.slice(), function (task) {
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

var createContextMenu = function createContextMenu(address, isCompleted) {
    return [ContextMenu, isCompleted, toggleContextMenu(address), toggleComplete(address), addChild(address), changeColor(address), editTask(address), remove(address)];
};

app(function (state) {
    return ['div', {}, [dialog.hidden ? null : [Dialog, dialog.hint, dialog.value, dialog.action, hideDialog], [Menu, state.showCompleted, function () {
        return addTask([]);
    }, toggleShowCompleted, undo, redo], ['div.tree-container', {}, [['ul', {}, state.tasks.map(function (parentTask) {
        return [Task, parentTask, state.showCompleted, toggleCollapsed, toggleContextMenu, contextMenuAddress, createContextMenu];
    })]]]]];
});

window.app = app;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dialog = function dialog(hint, defaultValue, submit, hideDialog) {
    setTimeout(function () {
        return document.querySelector('.field').focus();
    }, 0);
    return [function () {
        return ['div.dialog-wrapper', {}, [['div.dialog', {}, [['form', { onsubmit: submit }, [['label', {}, [hint || '', ['br'], ['input.field', { type: 'text', value: defaultValue }]]]]]]], ['div.dialog-overlay', { onclick: hideDialog }]]];
    }];
};

module.exports = dialog;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var menu = function menu(showCompleted, addParent, toggleShowCompleted, undo, redo) {
    return ['div.buttons', {}, [['div.button', { onclick: addParent }, ['ADD PARENT']], ['div.button', { onclick: toggleShowCompleted }, [(showCompleted ? 'HIDE' : 'SHOW') + ' COMPLETED']], ['div.button', { onclick: undo }, ['UNDO']], ['div.button', { onclick: redo }, ['REDO']]]];
};

module.exports = menu;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Task = function Task(_ref, showCompleted, toggleCollapsed, toggleContextMenu, contextMenuAddress, ContextMenu) {
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
    var contextMenuIsActive = contextMenuAddress && contextMenuAddress.toString() === address.toString();
    return [function () {
        return ['li | display:' + (isDisplayed ? 'none' : 'block') + '; color:' + textColor + ';', {}, [['span', {}, [['span.symbol', {
            style: 'pointer-events:' + (hasChildren ? 'all' : 'none') + ';\n                            color:' + (hasChildren ? 'inherit' : 'rgba(0,0,0,0.2)') + ';',
            onclick: toggleCollapsed(address)
        }, [symbol]], ['span.title | background-color:' + color + ';', {
            onclick: toggleContextMenu(address),
            onmouseleave: contextMenuIsActive ? toggleContextMenu(address) : null
        }, [description, contextMenuIsActive ? [ContextMenu, address, completed] : null]], ['span.children', {}, [['ul | display:' + (collapsed ? 'none' : 'block') + ';', {}, children.map(function (t) {
            return [Task, t, showCompleted, toggleCollapsed, toggleContextMenu, contextMenuAddress, ContextMenu];
        })]]]]]]];
    }];
};

module.exports = Task;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var colors = [{ name: 'NONE', color: 'transparent' }, { name: 'RED', color: '#ffcdbf' }, { name: 'YELLOW', color: '#fffac1' }, { name: 'GREEN', color: '#c7ffbf' }, { name: 'BLUE', color: '#bfffeb' }, { name: 'PURPLE', color: '#e9bfff' }];

var contextMenu = function contextMenu(isCompleted, toggleMenu, toggleComplete, addChild, changeColor, edit, remove) {
    return ['div.context-menu', { onclick: toggleMenu }, [['div.item', { onclick: toggleComplete }, [isCompleted ? 'NOT DONE' : 'DONE']], ['div.item', { onclick: addChild }, ['ADD']], ['div.item', {}, ['COLOR', ['div.submenu', {}, colors.map(function (color) {
        return ['div.item', { onclick: function onclick() {
                return changeColor(color.color);
            } }, [['span | background-color:' + color.color + ';', {}, [color.name]]]];
    })]]], ['div.item', { onclick: edit }, ['EDIT']], ['div.item', { onclick: remove }, ['REMOVE']]]];
};

module.exports = contextMenu;

/***/ })
/******/ ]);