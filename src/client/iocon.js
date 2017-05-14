const socket = window.io.connect(window.location.origin, {reconnectionDelayMax: 500, reconnectionAttempts: 25});

const getRoomId = () => {
    return window.location.pathname
        .replace(/^\/!\//, '')
        .replace(/\/$/, '');
};

const iocon = (app) => {
    socket.on('connect', () => socket.emit('join', getRoomId()));

    socket.on('reload', () => location.reload());

    socket.on('update', (state) => app.setState(state));

    socket.on('error', (err) => console.log(err));

    app.use({watcher:
        (state, type) => {
            if (type !== '__OVERRIDE__') {
                socket.emit('update', state);
            }
        },
    });
};

module.exports = iocon;
