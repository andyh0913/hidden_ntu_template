const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./src/model/User')
const Message = require('./src/model/Message')

mongoose.Promise = global.Promise;
mongoURL = "mongodb+srv://hiddenntu:hiddenntu@cluster0-wjufh.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(mongoURL, {useNewUrlParser: true});

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

function loop(){
    rl.question('Enter user: ', (user) => {
        rl.question(`Are you sure to reset ${user}'s progress? (Y or N): `, (reply) => {
            if (reply === 'Y' || reply === 'y'){
                Message.deleteMany({user: user}, (err)=>{
                    if(err) console.log(err);
                    else console.log(`Delete ${user}'s messages`)
                })
                User.findOne({account: user}, (err, user)=>{
                    if (err) console.log(err);
                    user.progress = 0;
                    user.save().then((user)=>{
                        console.log(`Set ${user.name}'s progress to ${user.progress}`);
                        loop();
                    }, (err)=>{
                        console.log(err);
                    });
                })
            }
        });
    });
}

loop();