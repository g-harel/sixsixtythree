const dialog = (app) => {
    let hidden = true;
    let hint = '';
    let action = null;
    let value = '';

    let hideDialog = () => {
        hidden = true;
        hint = '';
        action = null;
        value = '';
        app.update();
    };

    let showDialog = (_hint, defaultValue, submit) => {
        let _submit = (...args) => {
            submit(...args);
            hideDialog();
        };
        hidden = false;
        hint = _hint;
        action = _submit;
        value = defaultValue;
        app.update();
    };

    let builder = () => {
        if (hidden) {
            return null;
        }
        setTimeout(() => document.querySelector('.field').focus(), 0);
        return [() => (
            ['div.dialog-wrapper', {}, [
                ['div.dialog', {}, [
                    ['form', {onsubmit: action}, [
                        ['label', {}, [
                            hint || '',
                            ['br'],
                            ['input.field', {type: 'text', value: value}],
                        ]],
                    ]],
                ]],
                ['div.dialog-overlay', {onclick: hideDialog}],
            ]]
        )];
    };

    return {builder, showDialog};
};

module.exports = dialog;
