const path = require('path');
const fs = require('fs');

fscon = (app) => {
    app.get('*', (req, res) => {
        const filename = req.originalUrl
            .replace(/\?[^]*$/, '')
            .replace(/^([^]*\/)*/, '') || 'index.html';
        const pathName = path.resolve(__dirname, '../../public/' + filename);
        if (fs.existsSync(pathName)) {
            res.sendFile(pathName);
        } else {
            console.log(pathName);
            res.status(404).send('Not found');
        }
    });
};

module.exports = fscon;
