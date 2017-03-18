const contextmenuBuilder = require('./contextmenu.js');

let buildNode = (state, node, colors) => [
    'li',, {
        display: (node.completed && !state.showCompleted)?'none':'inline',
        color: node.completed?'rgba(0,0,0,0.2)':'#000',
    }, [
        ['span',,, [
            // symbol
            ['span.symbol', {
                onclick: `(TOGGLE_COLLAPSED,${node.address})`,
            }, {
                pointerEvents: node.children.length?'all':'none',
                color: node.children.length?'#000':'rgba(0,0,0,0.2)',
            }, [
                node.collapsed?'+':'-',
            ]],
            // title
            ['span.title', {
                onclick: `(TOGGLE_CONTEXTMENU,${node.address})`,
            }, {
                backgroundColor: node.color,
            }, [
                node.info,
                (state.contextMenuAddress === node.address)?
                    contextmenuBuilder(node, colors):
                    undefined,
            ]],
            // children
            ['span.children',, {
                display: node.collapsed?'none':'inline',
            }, [
                ['ul',,,
                    node.children.map((node) => buildNode(state, node)),
                ],
            ]],
        ]],
    ],
];

module.exports = buildNode;
