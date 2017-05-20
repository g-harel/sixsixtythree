const goo = require('goo-js');

const iocon = require('./iocon');

const mainPage = require('./pages/main');
const homePage = require('./pages/home');

const app = goo(document.body);

app.setState({});

let hasJoinedRoom = false;

let joinedRoom = () => hasJoinedRoom;

let {join, emitChange} = iocon({
    onJoin: (roomId, state) => {
        hasJoinedRoom = true;
        app.setState(state);
        app.act('__RESET__');
    },
    onChange: (state) => {
        app.setState(state);
    },
});

app('/!/:roomId/', mainPage({app, join, emitChange, joinedRoom}));

app('*', homePage({app}));

window.app = app;
