const socket = window.io.connect(window.location.origin, {reconnectionDelayMax: 500});

module.exports = (app) => {
    socket.on('reload', () => location.reload());

    socket.on('connect', () => {
        socket.emit('join', (window.location.pathname + 'acdefghijklmnopq').substr(3, 16));
    });

    socket.on('update', (state) => {
        app.setState(state);
    });

    socket.on('error', (err) => {
        console.log(err);
    });

    app.use({
        name: 'socket connection',
        watcher: (state, type) => {
            if (type !== '__OVERRIDE__') {
                socket.emit('update', state);
            }
        },
    });
};
