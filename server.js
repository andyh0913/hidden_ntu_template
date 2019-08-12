var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var session = require('express-session')
var MongoStorage = require('connect-mongo')(session);
var apiRoute = require('./src/route/api');
var Message = require('./src/model/Message');

// mongodb
mongoURL = "mongodb+srv://hiddenntu:hiddenntu@cluster0-wjufh.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(mongoURL, {useNewUrlParser: true});
db = mongoose.connection;

db.on('error', e => {
	console.log(e);
})

db.once('open', () => {
	console.log('MongoDB connected!');
})

app.use(session({
	store: new MongoStorage({mongooseConnection: mongoose.connection}),
	secret: "hiddenntu",
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge: 24*60*60*1000}
}))

// express middleware and routing
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRoute);

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// socket.io
var onlineUsers = {};
var onlineCount = 0;
io.on('connection', function (socket) {
	socket.on('login', function(obj) {
		socket.id = obj.uid;
		if(!onlineUsers.hasOwnProperty(obj.uid)) {
			onlineUsers[obj.uid] = obj.username;
			onlineCount++;
		}
		console.log(`${obj.username} has logged in.`);
	})

	socket.on('disconnect', function() {
		if(onlineUsers.hasOwnProperty(socket.id)){
			delete onlineUsers[socket.id];
			onlineCount--;
			console.log(`${obj.username} has logged out.`);
		}
	})

	socket.on('message', function(obj) {
		var newMessage = new Message(obj);
		newMessage.save().then( (message) => {
			console.log("Message saved");
		})
		var systemMessage = {
			user: obj.user,
			text: "test",
			isUser: false,
			image: "none",
			date: new Date()
		}
		newSystemMessage = new Message(systemMessage);
		newSystemMessage.save().then( (message) => {
			socket.emit('message', message)
		})
	})
})

server.listen(port , () => console.log('Listening on port ' + port))