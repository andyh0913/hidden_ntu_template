const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    },
    pwdHash: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        default: 0,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;