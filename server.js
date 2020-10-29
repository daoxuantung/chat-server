require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/user.route');

const app = express();

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

app.use('/user', userRouter);

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`)
})

