module.exports = (app) => {
    app.use({action: [
        {
            type: '*TOGGLE_CONTEXTMENU',
            target: ['contextMenuAddress'],
            handler: (address, params) => {
                if (address === params) {
                    return null;
                } else {
                    return params || null;
                }
            },
        },
    ]});

    return (app, state, item) => (
        ['div.contextmenu', {
            onclick: () => app.a('*TOGGLE_CONTEXTMENU'),
            onmouseleave: () => app.a('*TOGGLE_CONTEXTMENU'),
        }, [
            ['div.item', {onclick: () => app.a('TOGGLE_COMPLETED', item.address)}, [
                item.completed?'NOT DONE':'DONE',
            ]],
            ['div.item', {onclick: () => {
                app.a('*SHOW_DIALOG', [
                    'Add a child task',
                    '',
                    (value) => {
                        app.a('ADD_CHILD', [value, item.address]);
                    },
                ]);
            }}, [
                'ADD',
            ]],
            ['div.item', {}, [
                'COLOR',
                ['div.submenu', {},
                    state.colors.map((color) => (
                        ['div.item', {onclick: () => app.a('CHANGE_COLOR', [ color.color, item.address])}, [
                            ['span', {style: `background-color: ${color.color}`}, [
                                color.name,
                            ]],
                        ]]
                    )),
                ],
            ]],
            ['div.item', {onclick: () => {
                app.a('*SHOW_DIALOG', [
                    'Edit',
                    item.info,
                    (value) => {
                        app.a('EDIT_DESCRIPTION', [value, item.address]);
                    },
                ]);
            }}, [
                'EDIT',
            ]],
            ['div.item', {onclick: () => app.a('REMOVE', item.address)}, [
                'REMOVE',
            ]],
        ]]
    );
};
