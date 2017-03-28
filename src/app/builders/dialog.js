module.exports = (app, state) => (
    ['div',, {display: state.dialog.hidden?'none':'block'}, [
        ['form', {
            // transfer event to action
            onsubmit: (e) => {
                e.preventDefault();
                app.act('ADD', {
                    description: e.srcElement[0].value,
                    address: [],
                });
                e.srcElement[0].value = '';
            },
        },, [
            ['label',,, [
                (state.dialog.description || '-'),
                ['br'],
                ['input.field', {type: 'text'}],
            ]],
        ]],
    ]]
);
