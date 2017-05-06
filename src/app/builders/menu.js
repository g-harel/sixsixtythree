module.exports = (app, state) => (
    ['div.buttons', {}, [
        // new parent
        ['div.button', {onclick: () => app.a('SHOW_DIALOG', ['NEW_PARENT', 'Add a parent task'])}, [
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
