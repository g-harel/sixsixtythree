const socketio = require('socket.io');

const iocon = (server, readRoom, writeRoom) => {
    const io = socketio(server);

    // reload all connections when server restarts (for development)
    setTimeout(() => {
        io.sockets.emit('reload');
    }, 500);

    io.on('connection', (socket) => {
        socket.on('join', (roomId) => {
            if (socket.roomId) {
                socket.leave(roomId);
            }
            socket.join(roomId);
            socket.roomId = roomId;
            readRoom(roomId,
                (err) => {
                    socket.emit('error', err);
                },
                (state) => {
                    socket.emit('join', roomId, state);
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
};

module.exports = iocon;
