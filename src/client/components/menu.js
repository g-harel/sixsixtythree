const menu = (showCompleted, addParent, toggleShowCompleted, undo, redo) => (
    ['div.buttons', {}, [
        ['div.button', {onclick: addParent}, [
            'ADD PARENT',
        ]],
        ['div.button', {onclick: toggleShowCompleted}, [
            (showCompleted?'HIDE':'SHOW') + ' COMPLETED',
        ]],
        ['div.button', {onclick: undo}, [
            'UNDO',
        ]],
        ['div.button', {onclick: redo}, [
            'REDO',
        ]],
    ]]
);

module.exports = menu;
