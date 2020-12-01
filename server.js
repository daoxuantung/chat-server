require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const userRouter = require('./routes/user.route');

const app = express();
const server = require('http').createServer(app);

mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection errror: ', err);
})

mongoose.connection.once('open', () => {
    console.log('Mongoose connected!');
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'))

app.use('/user', userRouter);

server.listen(process.env.PORT || 8000, () => {
    console.log('Server listening on', process.env.PORT || 8000);
});

const io = require("socket.io")(server, {
    cors: {
        origin: server,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.use((socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        socket.userId = payload.id;
        next();
    } catch (err) { console.log(err) }
});


io.on("connection", (socket) => {
    console.log("Connected: " + socket.userId);

    socket.on("disconnect", () => {
        console.log("Disconnected: " + socket.userId);
    });

    socket.on("send", (data) => {
        socket.emit('message', data);
    });
});

