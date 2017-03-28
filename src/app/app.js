const goo = require('goo-js');

const dialogBuilder = require('./builders/dialog.js');
const menuBuilder = require('./builders/menu.js');
const nodeBuilder = require('./builders/node.js');

const localStorageKey = 'data-663';

const colors = [
    {
        name: 'NONE',
        color: 'transparent',
    }, {
        name: 'RED',
        color: '#ffcdbf',
    }, {
        name: 'YELLOW',
        color: '#fffac1',
    }, {
        name: 'GREEN',
        color: '#c7ffbf',
    }, {
        name: 'BLUE',
        color: '#bfffeb',
    }, {
        name: 'PURPLE',
        color: '#e9bfff',
    },
];

const state = {
    showCompleted: true,
    contextMenuAddress: null,
    dialog: {
        hidden: true,
        description: 'test',
        action: null,
    },
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
};

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

const actions = {
    TOGGLE_DISPLAY_COMPLETED: (state) => {
        state.showCompleted = !state.showCompleted;
        return state;
    },
    TOGGLE_COMPLETED: (state, address) => {
        navigate(state.nodes, address.split('#'), (node) => {
            node.completed = !node.completed;
        });
        return state;
    },
    TOGGLE_COLLAPSED: (state, address) => {
        navigate(state.nodes, address.split('#'), (node) => {
            node.collapsed = !node.collapsed;
        });
        return state;
    },
    TOGGLE_CONTEXTMENU: (state, address) => {
        if (state.contextMenuAddress === address) {
            state.contextMenuAddress = null;
        } else {
            state.contextMenuAddress = address;
        }
        return state;
    },
    ADD_CHILD: (state, address) => {
        navigate(state.nodes, address.split('#'), (node) => {
            node.children.push({
                completed: false,
                collapsed: false,
                color: 'transparent',
                info: 'test0',
                address: address + '#' + node.children.length,
                children: [],
            });
        });
        return state;
    },
    CHANGE_COLOR: (state, colorAndAdress) => {
        colorAndAdress = colorAndAdress.split('!');
        let color = colorAndAdress[0];
        let address = colorAndAdress[1];
        navigate(state.nodes, address.split('#'), (node) => {
            node.color = color;
        });
        return state;
    },
    EDIT_DESCRIPTION: (state, address) => {

    },
    REMOVE: (state, address) => {
        address = address.split('#');
        let lastIndex = address.pop();
        navigate(state.nodes, address, (node) => {
            delete node[lastIndex];
        });
        return state;
    },
};

const builder = (state) => (
    ['div',,, [
        dialogBuilder(app, state),
        menuBuilder(app, state),
        ['div#tree_container',,, [
            ['ul',,,
                state.nodes.map((parentNode) => {
                    return nodeBuilder(state, parentNode, colors);
                }),
            ],
        ]],
    ]]
);

const watcher = (state) => {
    console.log(JSON.parse(JSON.stringify(state)));
    localStorage.setItem(localStorageKey, JSON.stringify(state));
};

const app = goo({
    target: document.body,
    builder: builder,
}, {
    state: state,
    actions: actions,
    watchers: watcher,
});