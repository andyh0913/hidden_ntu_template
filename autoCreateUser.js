const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./src/model/User')
const saltRounds = 10;

mongoose.Promise = global.Promise;
mongoURL = "mongodb+srv://hiddenntu:hiddenntu@cluster0-wjufh.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(mongoURL, {useNewUrlParser: true});

const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const csvfile = 'account.csv';
fs.createReadStream(csvfile)
.pipe(csv())
.on('data', (data) => {
        results.push(data)
        const password = data['密碼']
        const hash = bcrypt.hashSync(password, saltRounds);
        const newUser = new User({
            name: data['姓名'],
            account: data['帳號'],
            pwdHash: hash,
            progress: 0,
            rfid: 'unset'
        })
        newUser.save().then((user)=>{
            console.log('New user created!');
            console.log(user);
        })
    })
.on('end', () => {
    console.log(results);
})



// function loop(){
//     rl.question('Enter name: ', (name) => {
//         rl.question('Enter account: ', (account) => {
//             rl.question('Enter password: ', (password) => {
//                 const hash = bcrypt.hashSync(password, saltRounds);
//                 const newUser = new User({
//                     name: name,
//                     account: account,
//                     pwdHash: hash,
//                     progress: 0 
//                 })
//                 newUser.save().then((user)=>{
//                     console.log('New user created!');
//                     console.log(user);
//                     loop();
//                 })
//             })
//         });
//     });
// }