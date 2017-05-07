module.exports = (app) => {
    app.use({action: [
        {
            type: 'TOGGLE_SHOW_COMPLETED',
            target: ['showCompleted'],
            handler: (status) => !status,
        },
        {
            type: 'NEW_PARENT',
            target: ['nodes'],
            handler: (nodes, description) => {
                nodes.push(app._.createNode(description, nodes.length));
                return nodes;
            },
        },
    ]});

    return (app, state) => (
        ['div.buttons', {}, [
            // new parent
            ['div.button', {onclick: () => {
                app.a('*SHOW_DIALOG', [
                    'Add a parent task',
                    '',
                    (value) => {
                        app.a('NEW_PARENT', value);
                    },
                ]);
            }}, [
                'NEW PARENT',
            ]],
            // toggle completed
            ['div.button', {onclick: () => app.a('TOGGLE_SHOW_COMPLETED')}, [
                state.showCompleted?'HIDE COMPLETED':'SHOW COMPLETED',
            ]],
            // undo
            ['div.button', {onclick: () => app.undo()}, [
                'UNDO',
            ]],
            // redo
            ['div.button', {onclick: () => app.redo()}, [
                'REDO',
            ]],
        ]]
    );
};
