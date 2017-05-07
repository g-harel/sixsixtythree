const contextmenu = require('./contextmenu.js');

module.exports = (app) => {
    const contextmenuBuilder = contextmenu(app);

    app.use({action: [
        {
            type: 'TOGGLE_COLLAPSED',
            target: ['nodes'],
            handler: (state, address) => {
                app._.navigate(state, address.split('#'), (node) => {
                    node.collapsed = !node.collapsed;
                });
                return state;
            },
        },
        {
            type: 'TOGGLE_COMPLETED',
            target: ['nodes'],
            handler: (state, address) => {
                app._.navigate(state, address.split('#'), (node) => {
                    node.completed = !node.completed;
                });
                return state;
            },
        },
        {
            type: 'ADD_CHILD',
            target: ['nodes'],
            handler: (state, [value, address]) => {
                app._.navigate(state, address.split('#'), (node) => {
                    node.children.push(app._.createNode(value, address + '#' + node.children.length));
                });
                return state;
            },
        },
        {
            type: 'CHANGE_COLOR',
            target: ['nodes'],
            handler: (state, [color, address]) => {
                app._.navigate(state, address.split('#'), (node) => {
                    node.color = color;
                });
                return state;
            },
        },
        {
            type: 'EDIT_DESCRIPTION',
            target: ['nodes'],
            handler: (state, [value, address]) => {
                app._.navigate(state, address.split('#'), (node) => {
                    node.info = value;
                });
                return state;
            },
        },
        {
            type: 'REMOVE',
            target: ['nodes'],
            handler: (state, address) => {
                address = address.split('#');
                let childIndex = address.pop();
                app._.navigate(state, address, (node) => {
                    if (!Array.isArray(node)) {
                        node = node.children;
                    }
                    node.splice(childIndex, 1);
                });
                return state;
            },
        },
    ]});

    let buildNode = (app, state, node) => (
        ['li', {
            style: `
                display: ${(node.completed && !state.showCompleted)?'none':'block'};
                color: ${node.completed?'rgba(0,0,0,0.2)':'inherit'};
            `,
        }, [
            ['span', {}, [
                // symbol
                ['span.symbol', {
                    onclick: () => app.a('TOGGLE_COLLAPSED', node.address),
                    style: `
                        pointer-events: ${node.children.length?'all':'none'};
                        color: ${node.children.length?'inherit':'rgba(0,0,0,0.2)'};
                    `,
                }, [
                    node.children.length
                        ? node.collapsed
                            ? '+ '
                            : '- '
                        : '~ ',
                ]],
                // title
                ['span.title', {
                    onclick: () => app.a('*TOGGLE_CONTEXTMENU', node.address),
                    style: `background-color: ${node.color}`,
                }, [
                    node.info,
                ]],
                // contextmenu
                (state.contextMenuAddress === node.address)
                    ? contextmenuBuilder(app, state, node)
                    : null,
                // children
                ['span.children', {
                    style: `display: ${node.collapsed?'none':'block'}`,
                }, [
                    ['ul', {},
                        node.children.map((node) => buildNode(app, state, node)),
                    ],
                ]],
            ]],
        ]]
    );
    return buildNode;
};
