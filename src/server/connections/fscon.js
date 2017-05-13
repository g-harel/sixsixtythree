const path = require('path');

fscon = (app) => {
    app.get('*', (req, res) => {
        const filename = req.originalUrl
            .replace(/\?[^]*$/, '')
            .replace(/^([^]*\/)*/, '') || 'index.html';
        res.sendFile(path.resolve(__dirname, '../../public/' + filename));
    });
};

module.exports = fscon;
