const goo = require('goo-js');

const iocon = require('./iocon');
const reloadcon = require('./reloadcon');

const mainPage = require('./pages/main');
const homePage = require('./pages/home');
const dialogComponent = require('./components/dialog');

reloadcon();

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

const dialog = dialogComponent(app);

app('/!/:roomId/', mainPage({app, join, emitChange, joinedRoom, dialog}));

app('*', homePage({app, dialog}));

app.use({watcher: (state, type) => console.log(state, type, new Error().stack)});

window.app = app;
