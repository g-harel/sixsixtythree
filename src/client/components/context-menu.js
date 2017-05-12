const colors = [
    {name: 'NONE', color: 'transparent'},
    {name: 'RED', color: '#ffcdbf'},
    {name: 'YELLOW', color: '#fffac1'},
    {name: 'GREEN', color: '#c7ffbf'},
    {name: 'BLUE', color: '#bfffeb'},
    {name: 'PURPLE', color: '#e9bfff'},
];

const contextMenu = (isCompleted, toggleMenu, toggleComplete, addChild, changeColor, edit, remove) => (
    ['div.context-menu', {onclick: toggleMenu}, [
        ['div.item', {onclick: toggleComplete}, [
            isCompleted?'NOT DONE':'DONE',
        ]],
        ['div.item', {onclick: addChild}, [
            'ADD',
        ]],
        ['div.item', {}, [
            'COLOR',
            ['div.submenu', {},
                colors.map((color) => (
                    ['div.item', {onclick: () => changeColor(color.color)}, [
                        [`span | background-color:${color.color};`, {}, [
                            color.name,
                        ]],
                    ]]
                )),
            ],
        ]],
        ['div.item', {onclick: edit}, [
            'EDIT',
        ]],
        ['div.item', {onclick: remove}, [
            'REMOVE',
        ]],
    ]]
);

module.exports = contextMenu;
