const goo = require('goo-js');

const mainPage = require('./pages/main');
const homePage = require('./pages/home');

const app = goo(document.body);

app.setState({});

app('/!/:roomId/', mainPage(app));

app('*', homePage(app));

window.app = app;
