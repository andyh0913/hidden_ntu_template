var named = require('named');
var moment = require('moment');
//var Promise = require('bluebird');

const winston = require('winston');
const wcf = require('winston-console-formatter');
const logger = new winston.Logger({
  level: 'silly'
});
const { formatter, timestamp } = wcf();

logger.add(winston.transports.Console, { formatter, timestamp });

var db = require('./database');

var server = named.createServer();
var ttl = 5;

var okAns = new named.ARecord('1.1.1.1');
var rejAns = new named.ARecord('2.2.2.2');

server.listen(53, '::ffff:0.0.0.0', () => {
    console.log('DNS server started');
});

/*var timestamp = () => {
    return moment().utcOffset(480).format('YYYY-MM-DD HH:mm:ss');
};*/

function trigPoint(card, point) {
    var promises = [ db.Point.findOne({ number: point }).exec(), db.Team.findOne({ 'cards.uid': card }, { 'cards.$': 1, name: 1, number: 1, score: 1, points: 1 }).exec(), db.Admin.findOne({ 'uid': card }).exec() ];
    return Promise.all(promises)
    .then((results) => {
        var promises = [];
        if(results[0] && results[1]) {
            if(results[0].valid) {
                //if(((results[0].number % 2 == 1) && (['A', 'B', 'C'].indexOf(results[1].cards[0].part) >= 0)) || ((results[0].number % 2 == 0) && (['D', 'E', 'F'].indexOf(results[1].cards[0].part) >= 0))) {
                if(results[0].part == results[1].cards[0].part || results[0].part == 'all') {
                //if(true) {
                    if(results[1].points.indexOf(results[0]._id) == -1) {
                        logger.log('info', 'team %s card %s at point #%d %s', results[1].name, results[1].cards[0].name, results[0].number, results[0].name);
                        ++results[1].score;
                        ++results[0].counter;
                        results[1].points.push(results[0]._id);
                        promises.push(results[1].save());
                        promises.push(results[0].save());
                        var l = new db.Log({
                            team: results[1]._id,
                            point: results[0]._id,
                            card: results[1].cards[0].name,
                            time: new Date()
                        });
                        promises.push(l.save());
                    } else {
                        logger.log('info', 'team %s card %s repeat activating point #%d %s', results[1].name, results[1].cards[0].name, results[0].number, results[0].name);
                        return;
                    }
                } else {
                    logger.log('info', 'team %s card %s part %s at point #%d %s but correct part is %s', results[1].name, results[1].cards[0].name, results[1].cards[0].part, results[0].number, results[0].name, results[0].part);
                    throw 'part wrong';
                }
            } else {
                throw 'point invalid';
            }
        }
        if(!results[0]) {
            logger.log('warn', 'point num #%d not found!', point);
            throw 'point not found!';
        }
        if(!results[1]) {
            if(results[2]) {
                logger.log('info', 'admin name %s uid %s at point #%d %s', results[2].name, card, results[0].number, results[0].name);
                return;
            }
            logger.log('warn', 'team with card %s not found!', card);
            throw 'team not found!';
        }
        return Promise.all(promises);
    });
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
                    db.Point.findOne({ number: point }).exec().then((result) => {
                        if(result) {
                            result.lastAlive = new Date();
                            result.save();
                        } else {
                            throw 'point not found';
                        }
                    })
                    .then(() => {
                        var promises = [];
                        for(var i = 2; i < args.length-1; ++i) {
                            var card = args[i];
                            promises.push(trigPoint(card, point));
                        }
                        return Promise.all(promises);
                    })
                    .then(() => {
                        query.addAnswer(domain, okAns, ttl);
                        server.send(query);
                    })
                    .catch((err) => {
                        console.log(err);
                        query.addAnswer(domain, rejAns, ttl);
                        server.send(query);
                    });
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
