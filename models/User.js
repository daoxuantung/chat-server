const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    avatarUrl: String,
    aboutMe: String,
    phoneNumber: String,
    webUrl: String
});

module.exports = mongoose.model('User', userSchema);