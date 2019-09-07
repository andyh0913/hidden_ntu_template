const mongoose = require('mongoose')
const Schema = mongoose.Schema

// TODO 
// save progress

const MessageSchema = new Schema({
    progress: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    speaker: { // 0 for user, 1 for Dennis, 2 for system message, 3 for Joey
        type: Number,
        required: true
    },
    isImage: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;