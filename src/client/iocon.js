const localKeyPrefix = '663';

const iocon = ({onJoin, onChange, onReconnect}) => {
    const socket = window.io.connect(window.location.origin);

    // if client was offline, fetch new data and call onReconnect
    let currentRoomId = null;
    let wasOffline = false;
    socket.on('connect', () => {
        if (wasOffline) {
            socket.emit('pull', currentRoomId);
        };
    });
    socket.on('push', (roomId, state) => {
        wasOffline = false;
        onReconnect(roomId, state, localStorage.getItem(localKeyPrefix + roomId));
    });

    // joined a room
    socket.on('join', (roomId, state) => {
        currentRoomId = roomId;
        onJoin(roomId, state);
    });

    // when server has new changes
    socket.on('update', (state) => onChange(state));

    // record that the client has gone offline
    socket.on('disconnect', () => wasOffline = true);

    socket.on('error', (err) => console.log(err));

    // emit a join event
    const join = (roomId) => roomId && socket.emit('join', roomId);

    // update the server with the most recent changes or fallback to localStorage
    const emitChange = (state) => {
        if (socket.connected) {
            socket.emit('update', state);
        } else {
            localStorage.setItem(localKeyPrefix + roomId, JSON.stringify(state));
        }
    };

    return {join, emitChange};
};

window.join = iocon({onJoin: () => {}, onChange: () => {}}).join;

module.exports = iocon;
