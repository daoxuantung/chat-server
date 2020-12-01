const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    avatarUrl: {
        type: String,
        default: 'https://res.cloudinary.com/lepis/image/upload/v1604833803/avatar.svg'
    },
    aboutMe: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    webUrl: {
        type: String,
        default: ''
    },
    sentRequest: [{
        username: {
            type: String,
            default: ''
        }
    }],
    request: [{
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
            default: ''
        }
    }],
    friendsList: [{
        friendId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        friendName: {
            type: String,
            default: ''
        }
    }],
    totalRequest: {
        type: Number,
        default: 0
    }
});

mongoose.set('useFindAndModify', false);

module.exports = mongoose.model('User', userSchema);