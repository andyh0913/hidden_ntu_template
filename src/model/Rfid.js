const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RfidSchema = new Schema({
    id: {
        type: String,
        required: true
    }
});

const Rfid = mongoose.model('Rfid', RfidSchema);

module.exports = Rfid;