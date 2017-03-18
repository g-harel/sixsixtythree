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
        color: 'rgb(255,205,191)',
    }, {
        name: 'YELLOW',
        color: 'rgb(255,250,193)',
    }, {
        name: 'GREEN',
        color: 'rgb(199,255,191)',
    }, {
        name: 'BLUE',
        color: 'rgb(191,255,235)',
    }, {
        name: 'PURPLE',
        color: 'rgb(233,191,255)',
    },
];

let state = {
    showCompleted: true,
    contextMenuAddress: undefined,
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
            info: 'test',
            children: [],
        },
    ],
};

let actions = {
    PROMPT: (state, params) => {
        state.dialog.hidden = false;
        state.dialog.description = params.description;
        state.dialog.action = params.action;
        return state;
    },
    ADD: (state, params) => {
        state.nodes.push(params.description);
        state.dialog.hidden = true;
        return state;
    },
};

let builder = (state) => [
    'div',,, [
        dialogBuilder(app, state),
        menuBuilder(app, state),
        ['div#tree_container',,, [
            ['ul',,,
                state.nodes.map((parentNode) => {
                    return nodeBuilder(state, parentNode, colors);
                }),
            ],
        ]],
    ],
];

let watcher = (state) => {
    console.log(JSON.stringify(state));
    localStorage.setItem(localStorageKey, JSON.stringify(state));
};

let app = goo({
    target: document.body,
    builder: builder,
}, {
    state: state,
    actions: actions,
    watchers: watcher,
});
