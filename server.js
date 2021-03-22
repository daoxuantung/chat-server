require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const userRouter = require('./routes/user.route');
const searchRouter = require('./routes/search.route');

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
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'))

app.use('/user', userRouter);
app.use('/search', searchRouter);

server.listen(process.env.PORT || 8000, () => {
    console.log('Server listening on', process.env.PORT || 8000);
});

require('./socket/socket')(server);
