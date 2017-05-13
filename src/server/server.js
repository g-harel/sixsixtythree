const http = require('http');
const express = require('express');

const fscon = require('./connections/fscon');
const dbcon = require('./connections/dbcon');
const iocon = require('./connections/iocon');

const port = 3000;

const app = express();
const server = http.createServer(app);

dbcon((db, readRoom, writeRoom) => {
    iocon(server, readRoom, writeRoom);
});

fscon(app);

server.listen(port, () => console.log('server running at ' + port));
