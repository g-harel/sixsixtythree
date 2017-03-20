module.exports = (item, colors) => [
    'div#contextmenu',,, [
        ['div.item', {onclick: `(TOGGLE_COMPLETED,${item.address})`},, [
            item.completed?'NOT DONE':'DONE',
        ]],
        ['div.item', {onclick: `(ADD_CHILD,${item.address})`},, [
            'ADD',
        ]],
        ['div.item',,, [
            'COLOR',
            ['div.submenu',,,
                colors.map((color) => {
                    return [
                        'div.item', {onclick: `(CHANGE_COLOR,${color.color}!${item.address})`},, [
                            ['span',, {backgroundColor: color.color}],
                            color.name,
                        ],
                    ];
                }),
            ],
        ]],
        ['div.item', {onclick: `(EDIT_DESCRIPTION,${item.address})`},, [
            'EDIT',
        ]],
        ['div.item', {onclick: `(REMOVE,${item.address})`},, [
            'REMOVE',
        ]],
    ],
];
