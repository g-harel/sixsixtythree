const dialog = require('./builders/dialog.js');
const menu = require('./builders/menu.js');
const node = require('./builders/node.js');

let app = window.goo(document.body);

const dialogBuilder = dialog(app);
const menuBuilder = menu(app);
const nodeBuilder = node(app);

const localStorageKey = 'data-663';

// first time user's state
const defaultState = {
    showCompleted: true,
    contextMenuAddress: null,
    dialog: {
        hidden: true,
        description: '',
        action: null,
        value: '',
    },
    colors: [
        {name: 'NONE', color: 'transparent'},
        {name: 'RED', color: '#ffcdbf'},
        {name: 'YELLOW', color: '#fffac1'},
        {name: 'GREEN', color: '#c7ffbf'},
        {name: 'BLUE', color: '#bfffeb'},
        {name: 'PURPLE', color: '#e9bfff'},
    ],
    nodes: [],
};

// fetching state
app.setState(JSON.parse(localStorage.getItem(localStorageKey)) || defaultState);

// making some "globally" available functions
app._.createNode = (description, address) => ({
    completed: false,
    collapsed: false,
    color: 'transparent',
    info: description,
    address: String(address),
    children: [],
});
app._.navigate = (object, address, callback) => {
    if (address.length === 0 || object === undefined) {
        callback(object);
    } else {
        let nextKey = address.shift();
        if (nextKey !== 'children' && address.length > 0) {
            address.unshift('children');
        }
        app._.navigate(object[nextKey], address, callback);
    }
};

// defining layout
app((state) => (
    ['div', {}, [
        dialogBuilder(app, state),
        menuBuilder(app, state),
        ['div#tree_container', {}, [
            ['ul', {},
                state.nodes.map((parentNode) => nodeBuilder(app, state, parentNode)),
            ],
        ]],
    ]]
));

// make sure the menus are hidden when undo/redo actions happen
app.use({action: [
    {
        type: 'UNDO',
        target: [],
        handler: (state) => {
            state.contextMenuAddress = null;
            state.dialog = {
                hidden: true,
                description: '',
                action: null,
                value: '',
            };
            return state;
        },
    },
    {
        type: 'REDO',
        target: [],
        handler: (state) => {
            state.contextMenuAddress = null;
            state.dialog = {
                hidden: true,
                description: '',
                action: null,
                value: '',
            };
            return state;
        },
    },
]});

// save state after each change
app.use({watcher: (state, type) => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
}});
