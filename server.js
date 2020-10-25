require('dotenv').config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');

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

require('./models/User.js');
require('./models/Conversation');
require('./models/Message');


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`)
})

