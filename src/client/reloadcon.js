module.exports = () => {
    const socket = window.io.connect(window.location.origin, {reconnectionDelayMax: 500, reconnectionAttempts: 25});
    socket.on('reload', () => location.reload());
};
