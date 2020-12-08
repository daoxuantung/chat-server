const jwt = require('jsonwebtoken');

module.exports = (server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: server,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.query.token;
            if (socket.handshake.query && token) {
                const payload = await jwt.verify(token, process.env.SECRET_KEY);
                socket.userId = payload.id;
                next();
            }
        } catch (err) { console.log(err) }
    });


    io.on("connection", (socket) => {
        console.log('Connected');
        socket.join(socket.userId);

        socket.on('disconnect', () => socket.leave(socket.userId))

        socket.on("private message", ({ userId, message }) => {
            io.to(userId).emit("message", socket.userId);
        });
    });
}