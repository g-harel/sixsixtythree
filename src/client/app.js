const goo = require('goo-js');

const iocon = require('./iocon');

const mainPage = require('./pages/main');
const homePage = require('./pages/home');

const app = goo(document.body);

iocon(app);

app(homePage(app));

app('/!/:roomId/', mainPage(app));

window.app = app;
