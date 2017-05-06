const dialogBuilder = require('./builders/dialog.js');
const menuBuilder = require('./builders/menu.js');
const nodeBuilder = require('./builders/node.js');

let app = window.goo(document.body);

const localStorageKey = 'data-663';

app.setState({
    showCompleted: true,
    contextMenuAddress: null,
    dialog: {
        hidden: true,
        description: '',
        action: null,
    },
    colors: [
        {name: 'NONE', color: 'transparent'},
        {name: 'RED', color: '#ffcdbf'},
        {name: 'YELLOW', color: '#fffac1'},
        {name: 'GREEN', color: '#c7ffbf'},
        {name: 'BLUE', color: '#bfffeb'},
        {name: 'PURPLE', color: '#e9bfff'},
    ],
    nodes: [
        {
            completed: false,
            collapsed: false,
            color: 'transparent',
            info: 'test0',
            address: '0',
            children: [{
                completed: false,
                collapsed: false,
                color: 'transparent',
                info: 'test00',
                address: '0#0',
                children: [],
            }, {
                completed: false,
                collapsed: false,
                color: 'transparent',
                info: 'test01',
                address: '0#1',
                children: [],
            }],
        },
    ],
});

const createNode = (description, address) => ({
    completed: false,
    collapsed: false,
    color: 'transparent',
    info: description,
    address: String(address),
    children: [],
});

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

app.use({action: [
    {
        type: 'TOGGLE_SHOW_COMPLETED',
        target: ['showCompleted'],
        handler: (status) => !status,
    },
    {
        type: 'SHOW_DIALOG',
        target: ['dialog'],
        handler: (dialog, [action, description]) => {
            dialog.hidden = false;
            dialog.action = (value) => app.a(action, value);
            dialog.description = description;
            return dialog;
        },
    },
    {
        type: 'HIDE_DIALOG',
        target: ['dialog'],
        handler: (dialog) => ({
            hidden: true,
            action: null,
            description: '',
        }),
    },
    {
        type: 'NEW_PARENT',
        target: ['nodes'],
        handler: (nodes, description) => {
            nodes.push(createNode(description, nodes.length));
            return nodes;
        },
    },
]});

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

app.use({watcher: (state) => {
    console.log(JSON.parse(JSON.stringify(state)));
    localStorage.setItem(localStorageKey, JSON.stringify(state));
}});
