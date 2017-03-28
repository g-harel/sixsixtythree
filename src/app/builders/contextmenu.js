module.exports = (item, colors, show) => (
    ['div.contextmenu', {onmouseout2: '(TOGGLE_CONTEXTMENU,null)'}, {
        display: show?'block':'none',
    }, [
        ['div.item', {onclick: `(TOGGLE_COMPLETED,${item.address})`},, [
            item.completed?'NOT DONE':'DONE',
        ]],
        ['div.item', {onclick: `(ADD_CHILD,${item.address})`},, [
            'ADD',
        ]],
        ['div.item',,, [
            'COLOR',
            ['div.submenu',,,
                colors.map((color) => (
                    ['div.item', {onclick: `(CHANGE_COLOR,${color.color}!${item.address})`},, [
                        ['span',, {backgroundColor: color.color}, [
                            color.name,
                        ]],
                    ]]
                )),
            ],
        ]],
        ['div.item', {onclick: `(EDIT_DESCRIPTION,${item.address})`},, [
            'EDIT',
        ]],
        ['div.item', {onclick: `(REMOVE,${item.address})`},, [
            'REMOVE',
        ]],
    ]]
);
