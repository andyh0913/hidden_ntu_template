const mongoose = require('mongoose')
const User = require('../src/model/User')

var socket = require('socket.io-client')('https://hiddenntu2019test.herokuapp.com')

mongoose.Promise = global.Promise;
mongoURL = "mongodb+srv://hiddenntu:hiddenntu@cluster0-wjufh.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(mongoURL, {useNewUrlParser: true});

var named = require('node-named');

const winston = require('winston');
const wcf = require('winston-console-formatter');
const logger = winston.createLogger({
  level: 'silly'
});
const { formatter, timestamp } = wcf();

logger.add(new winston.transports.Console, { formatter, timestamp });

var server = named.createServer();
var ttl = 5;

var okAns = new named.ARecord('1.1.1.1');
var rejAns = new named.ARecord('2.2.2.2');

server.listen(53, '::ffff:0.0.0.0', () => {
    console.log('DNS server started');
});

const point2progress = {

}	

async function trigPoint(card, point) {
    user = await User.findOne({rfid: card}).exec()
    if (point2progress[point] !== user.progress) throw 'wrong progress'
    socket.emit('rfid', {
        user: user._id,
        progress: progress
    })
    return user;
}

server.on('query', (query) => {
    // console.log("on query:");
    // console.log(query);
    try {
        var domain = query.name();
        var arr = domain.split('.');
        var target = new named.SOARecord(domain, { serial: 123 });
        query.addAnswer(domain, target, ttl);
        if(arr.length == 4) {
            if(arr[2] == 'ggt' && arr[3] == 'tw') {
                var q = arr[0];
                logger.log('info', 'received command %s', q);
                var cmd = q.split(',')[0];
                if(cmd == 'c') {
                    var card = q.split(',')[1];
                    var point = q.split(',')[2];
                    trigPoint(card, point)
                    .then(() => {
                        query.addAnswer(domain, okAns, ttl);
                        server.send(query);
                    })
                    .catch((err) => {
                        console.log(err);
                        query.addAnswer(domain, rejAns, ttl);
                        server.send(query);
                    });
                } else if(cmd == 'a') {
                    var args = q.split(',');
                    var point = args[1];
                    try{
                        query.addAnswer(domain, okAns, ttl);
                        server.send(query);
                    }
                    catch(err) {
                        console.log(err);
                    }
                } else {
                    throw 'no such command';
                }
            } else {
                throw 'rejected';
            }
        } else {
            throw 'rejected';
        }
    } catch(e) {
        //console.log(e);
        query.addAnswer(domain, rejAns, ttl);
        server.send(query);
    }
});
