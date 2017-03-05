const goo = require('goo-js');

const localStorageKey = 'data-663';

const colors = [['NONE', 'RED', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE'], 'transparent', 'rgb(255,205,191)', 'rgb(255,250,193)', 'rgb(199,255,191)', 'rgb(191,255,235)', 'rgb(233,191,255)'];

let state = {
    showCompleted: true,
    dialog: {
        hidden: true,
        description: 'test',
        action: null,
    },
    nodes: [],
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

let builder = (state) => {
    return {
        tagName: 'div',
        children: [
            dialogBuilder(state),
            buttonsBuilder(state),
            treeBuilder(state),
        ],
    };
};

let dialogBuilder = (state) => {
    return [
        'div',, {display: state.dialog.hidden?'none':'block'}, [[
            'form', {
                onsubmit: (e) => {
                    e.preventDefault();
                    app.act('ADD', {
                        description: e.srcElement[0].value,
                        address: [],
                    });
                    e.srcElement[0].value = '';
                },
            },, [[
                'label',,, [
                    (state.dialog.description || '-'),
                    ['br'],
                    ['input.field', {type: 'text'}],
                ],
            ]],
        ]],
    ];
};

let buttonsBuilder = (state) => {
    return [
        'div.buttons',,, [
            ['div.button', {
                onclick: () => {
                    app.act('PROMPT', {});
                    setTimeout(() => {
                        document.querySelector('.field').focus();
                    }, 0);
                },
            },, ['NEW PARENT']],
            ['div.button', {},, ['TOGGLE COMPLETED']],
            ['div.button', {},, ['UNDO']],
        ],
    ];
};

let treeBuilder = (state) => {
    return [
        'div',,,
        state.nodes.map((n) => {
            return n + '--';
        }),
    ];
};

let contextmenuBuilder = (state) => {
    return {
        tagName: 'div',
        children: [{
            tagName: 'div',
        }],
    };
};

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
