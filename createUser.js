const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./src/model/User')
const saltRounds = 10;

mongoose.Promise = global.Promise;
mongoURL = "mongodb+srv://hiddenntu:hiddenntu@cluster0-wjufh.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(mongoURL, {useNewUrlParser: true});

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

function loop(){
    rl.question('Enter name: ', (name) => {
        rl.question('Enter account: ', (account) => {
            rl.question('Enter password: ', (password) => {
                const hash = bcrypt.hashSync(password, saltRounds);
                const newUser = new User({
                    name: name,
                    account: account,
                    pwdHash: hash,
                    progress: 0 
                })
                newUser.save().then((user)=>{
                    console.log('New user created!');
                    console.log(user);
                    loop();
                })
            })
        });
    });
}

loop();