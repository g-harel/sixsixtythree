const contextmenuBuilder = require('./contextmenu.js');

let buildNode = (state, node, colors) => (
    ['li',, {
        display: (node.completed && !state.showCompleted)?'none':'block',
        color: node.completed?'rgba(0,0,0,0.2)':'inherit',
    }, [
        ['span',,, [
            // symbol
            ['span.symbol', {onclick: `(TOGGLE_COLLAPSED,${node.address})`}, {
                pointerEvents: node.children.length?'all':'none',
                color: node.children.length?'inherit':'rgba(0,0,0,0.2)',
            }, [
                node.children.length?node.collapsed?'+ ':'- ':'~ ',
            ]],
            // title
            ['span.title', {onclick: `(TOGGLE_CONTEXTMENU,${node.address})`}, {
                backgroundColor: node.color,
            }, [
                node.info,
                contextmenuBuilder(node, colors,
                    (state.contextMenuAddress === node.address)),
            ]],
            // children
            ['span.children',, {
                display: node.collapsed?'none':'block',
            }, [
                ['ul',,,
                    node.children.map((node) => buildNode(state, node, colors)),
                ],
            ]],
        ]],
    ]]
);

module.exports = buildNode;
