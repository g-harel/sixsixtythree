const contextmenuBuilder = require('./contextmenu.js');

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
                onclick: () => app.a('TOGGLE_CONTEXTMENU'),
                style: `background-color: ${node.color}`,
            }, [
                node.info,
                contextmenuBuilder(app, state, (state.contextMenuAddress === node.address), node),
            ]],
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

module.exports = buildNode;
