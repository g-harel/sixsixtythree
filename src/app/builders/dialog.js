module.exports = (app, state) => (
    state.dialog.hidden?null:['div.dialog-wrapper', {}, [
        ['div.dialog', {}, [
            ['form', {
                onsubmit: (e) => {
                    e.preventDefault();
                    state.dialog.action(e.srcElement[0].value);
                    e.srcElement[0].value = '';
                    app.a('HIDE_DIALOG');
                },
            }, [
                ['label', {}, [
                    (state.dialog.description || '-'),
                    ['br'],
                    ['input.field', {type: 'text'}],
                ]],
            ]],
        ]],
        ['div.dialog-overlay', {onclick: () => app.a('HIDE_DIALOG')}],
    ]]
);
