module.exports = (app, state) => [
    'div.buttons',,, [
        // new parent
        ['div.button', {
            onclick: '(ADD_PARENT, 0)',
        },, [
            'NEW PARENT',
        ]],
        // toggle completed
        ['div.button', {
            onclick: '(TOGGLE_COMPLETED, 0)',
        },, [
            'TOGGLE COMPLETED',
        ]],
        // undo
        ['div.button', {
            onclick: '(UNDO, 0)',
        },, [
            'UNDO',
        ]],
    ],
];
