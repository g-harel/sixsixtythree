const socket = window.io.connect(window.location.origin);

module.exports = (app) => {
    socket.on('connect', () => {
        socket.emit('join', (window.location.pathname + 'acdefghijklmnopq').substr(3, 16));
    });

    socket.on('update', (state) => {
        app.setState(state);
    });

    socket.on('error', (err) => {
        console.err(err);
    });

    return {
        name: 'socket connection',
        watcher: (state, type) => {
            if (type !== '__OVERRIDE__') {
                socket.emit('update', state);
            }
        },
    };
};
