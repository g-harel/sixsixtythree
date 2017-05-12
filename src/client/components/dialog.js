const dialog = (hint, defaultValue, submit, hideDialog) => {
    setTimeout(() => document.querySelector('.field').focus(), 0);
    return [() => (
        ['div.dialog-wrapper', {}, [
            ['div.dialog', {}, [
                ['form', {onsubmit: submit}, [
                    ['label', {}, [
                        hint || '',
                        ['br'],
                        ['input.field', {type: 'text', value: defaultValue}],
                    ]],
                ]],
            ]],
            ['div.dialog-overlay', {onclick: hideDialog}],
        ]]
    )];
};

module.exports = dialog;
