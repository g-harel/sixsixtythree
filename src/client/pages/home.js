const Dialog = require('./../components/dialog');

const homePage = ({app}) => {
    let dialog = {
        hidden: true,
        hint: '',
        action: null,
        value: '',
    };

    const generateName = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const name = [];
        for (let i = 0; i < 16; ++i) {
            name.push(chars[Math.floor(Math.random()*chars.length)]);
        }
        return name.join('');
    };

    const joinRoom = (name) => () => {
        hideDialog();
        if (name.match(/^[\w-]+$/) === null) {
            pickName({value: name + ' - ERR invalid character(s)'});
            return;
        }
        app.redirect(`/!/${name}/`);
    };

    const hideDialog = () => {
        dialog = {
            hidden: true,
            hint: '',
            action: null,
            value: '',
        };
        app.update();
    };

    const pickName = ({value = ''}) => {
        dialog = {
            hidden: false,
            hint: 'ROOM NAME',
            action: (e) => {
                e.preventDefault();
                joinRoom(e.target[0].value)();
            },
            value: value,
        };
        app.update();
    };

    return () => () => (
        ['div', {}, [
            (dialog.hidden
                ? null
                : [Dialog, dialog.hint, dialog.value, dialog.action, hideDialog]),
            ['div.home', {}, [
                ['div.button', {onclick: joinRoom(generateName())}, [
                    'GENERATE RANDOM ROOM',
                ]],
                ['br'],
                'OR',
                ['br'],
                ['div.button', {onclick: pickName}, [
                    'PICK ROOM',
                ]],
            ]],
        ]]
    );
};

module.exports = homePage;
