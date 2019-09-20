const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Rfid = require('./src/model/Rfid')
const saltRounds = 10;

mongoose.Promise = global.Promise;
mongoURL = "mongodb+srv://hiddenntu:hiddenntu@cluster0-wjufh.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(mongoURL, {useNewUrlParser: true});

const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const csvfile = 'rfid.csv';
fs.createReadStream(csvfile)
.pipe(csv())
.on('data', (data) => {
        results.push(data)
        const newRfid = new Rfid({
            id: data['id']
        })
        newRfid.save().then((rfid)=>{
            console.log('New rfid created!');
            console.log(rfid);
        })
    })
.on('end', () => {
    console.log(results);
})