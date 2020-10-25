const mongoose = require('mongoose');

const conversctionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required'
    }
});

module.exports = mongoose.model('Conversation', conversctionSchema);