const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const mongodb = require('mongodb');

const port = 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const MongoClient = mongodb.MongoClient;
const collectionName = 'rooms';
const mongoUrl = 'mongodb://localhost:27017/663';

const defaultState = {showCompleted: true, tasks: []};

const readRoom = (roomId, handleErr, callback) => {
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) {
            handleErr(err);
        }
        db.collection(collectionName).findAndModify(
            {roomId},
            [],
            {$setOnInsert: Object.assign({}, defaultState, {roomId})},
            {new: true, upsert: true},
            (err, doc) => {
                if (err) {
                    handleErr(err);
                }
                callback(doc.value);
            }
        );
        db.close();
    });
};

const writeRoom = (roomId, newState, handleErr, callback) => {
    delete newState._id;
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) {
            callback(null);
        }
        db.collection(collectionName).updateOne({roomId}, newState, {upsert: true}, (err, res) => {
            if (err) {
                handleErr(err);
            }
            callback(res);
        });
        db.close();
    });
};

io.on('connection', (socket) => {
    socket.on('join', (roomId) => {
        socket.join(roomId);
        socket.roomId = roomId;
        readRoom(roomId,
            (err) => {
                socket.emit('error', err);
            },
            (state) => {
                socket.emit('update', state);
            }
        );
    });

    socket.on('update', (newState) => {
        writeRoom(socket.roomId, newState,
            (err) => {
                socket.emit('error', err);
            },
            () => {
                socket.broadcast.to(socket.roomId).emit('update', newState);
            }
        );
    });
});

app.get('*', (req, res) => {
    const filename = req.originalUrl
        .replace(/\?[^]*$/, '')
        .replace(/^([^]*\/)*/, '') || 'index.html';
    res.sendFile(path.resolve(__dirname, '../public/' + filename));
});

server.listen(port, () => console.log('server running at ' + port));
