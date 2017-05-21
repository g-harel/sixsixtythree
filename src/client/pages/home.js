const homePage = ({app, dialog}) => {
    const generateName = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const name = [];
        for (let i = 0; i < 16; ++i) {
            name.push(chars[Math.floor(Math.random()*chars.length)]);
        }
        return name.join('');
    };

    const joinRoom = (name) => () => {
        if (name.match(/^[\w-]+$/) === null) {
            pickName({value: name + ' - ERR invalid character(s)'});
            return;
        }
        app.redirect(`/!/${name}/`);
    };

    const pickName = ({value = ''}) => {
        dialog.showDialog('ROOM NAME', value, (e) => {
            e.preventDefault();
            joinRoom(e.target[0].value)();
        });
    };

    return () => () => (
        ['div', {}, [
            [dialog.builder],
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
