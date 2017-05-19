const socket = window.io.connect(window.location.origin, {reconnectionDelayMax: 500, reconnectionAttempts: 25});

const iocon = ({onJoin, onChange}) => {
    socket.on('reload', () => location.reload());

    socket.on('join', (roomId, state) => onJoin(roomId, state));

    socket.on('update', (state) => onChange(state));

    socket.on('error', (err) => console.log(err));

    const join = (roomId) => roomId && socket.emit('join', roomId);

    const emitChange = (state) => socket.emit('update', state);

    return {join, emitChange};
};

module.exports = iocon;
