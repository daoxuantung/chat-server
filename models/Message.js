const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Conversation is required',
        ref: 'Conversation'
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'User is required',
        ref: 'User'
    },

    message: {
        type: String,
        required: 'Message is required'
    }
});

module.exports = mongoose.model('Message', messageSchema);