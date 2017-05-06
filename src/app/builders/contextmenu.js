module.exports = (app, state, show, item) => (
    ['div.contextmenu', {
        style: `display: ${show?'block':'none'}`,
    }, [
        ['div.item', {onclick: () => app.a('TOGGLE_COMPLETED', item.address)}, [
            item.completed?'NOT DONE':'DONE',
        ]],
        ['div.item', {onclick: () => app.a('ADD_CHILD', item.address)}, [
            'ADD',
        ]],
        ['div.item', {}, [
            'COLOR',
            ['div.submenu', {},
                state.colors.map((color) => (
                    ['div.item', {onclick: () => app.a('CHANGE_COLOR', [item.address, color.color])}, [
                        ['span', {style: `background-color: ${color.color}`}, [
                            color.name,
                        ]],
                    ]]
                )),
            ],
        ]],
        ['div.item', {onclick: () => app.a('EDIT_DESCRIPTION', item.address)}, [
            'EDIT',
        ]],
        ['div.item', {onclick: () => app.a('EDIT_DESCRIPTION', item.address)}, [
            'REMOVE',
        ]],
    ]]
);
