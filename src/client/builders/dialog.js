module.exports = (app) => {
    app.use({action: [
        {
            type: '*SHOW_DIALOG',
            target: ['dialog'],
            handler: (dialog, [description, value, action]) => {
                dialog.hidden = false;
                dialog.action = (value) => action;
                dialog.description = description;
                dialog.value = value;
                setTimeout(() => {
                    document.querySelector('.field').focus();
                }, 0);
                return dialog;
            },
        },
        {
            type: '*HIDE_DIALOG',
            target: ['dialog'],
            handler: (dialog) => ({
                hidden: true,
                action: null,
                description: '',
                value: '',
            }),
        },
    ]});

    return (app, state) => (
        state.dialog.hidden
            ? null
            : ['div.dialog-wrapper', {}, [
                ['div.dialog', {}, [
                    ['form', {
                        onsubmit: (e) => {
                            e.preventDefault();
                            state.dialog.action()(e.srcElement[0].value);
                            e.srcElement[0].value = '';
                            app.a('*HIDE_DIALOG');
                        },
                    }, [
                        ['label', {}, [
                            (state.dialog.description || '-'),
                            ['br'],
                            ['input.field', {type: 'text', value: state.dialog.value}],
                        ]],
                    ]],
                ]],
                ['div.dialog-overlay', {onclick: () => app.a('*HIDE_DIALOG')}],
            ]]
    );
};
