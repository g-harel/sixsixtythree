module.exports = (app, state) => (
    ['div.buttons',,, [
        // new parent
        ['div.button', {
            onclick: '(ADD_PARENT, [])',
        },, [
            'NEW PARENT',
        ]],
        // toggle completed
        ['div.button', {onclick: '(TOGGLE_DISPLAY_COMPLETED, 0)'},, [
            state.showCompleted?'HIDE COMPLETED':'SHOW COMPLETED',
        ]],
        // undo
        ['div.button', {onclick: '(UNDO, 0)'},, [
            'UNDO',
        ]],
        // redo
        ['div.button', {onclick: '(REDO, 0)'},, [
            'REDO',
        ]],
    ]]
);
