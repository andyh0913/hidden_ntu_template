const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStorage = require('connect-mongo')(session);
const apiRoute = require('./src/route/api');
const authRoute = require('./src/route/auth')
const Message = require('./src/model/Message');
const User = require('./src/model/User');

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
app.use('/auth', authRoute);

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// load script.csv and reply.csv
const fs = require('fs');
const csv = require('csv-parser');

const script = [];
const reply = [];

fs.createReadStream('script.csv')
.pipe(csv())
.on('data', (data) => {
	data.progress = parseInt(data.progress);
	data.system = parseInt(data.system);
	data.wait = parseInt(data.wait);
	script.push(data);
})
.on('end', () => {
	console.log(script);
	console.log("Script loaded!");
})

fs.createReadStream('reply.csv')
.pipe(csv())
.on('data', (data) => {
	data.progress = parseInt(data.progress);
	data.system = parseInt(data.system);
	data.wait = parseInt(data.wait);
	script.push(data);
})
.on('end', () => {
	console.log(script);
	console.log("Script loaded!");
})

const sendSystemMessage = (socket, progress, user) => {
	const message = script[progress];
	var systemMessage = {
		progress: progress,
		user: user,
		text: message.content,
		isUser: !message.system,
		image: "none",
		date: new Date()
	}
	newSystemMessage = new Message(systemMessage);
	newSystemMessage.save().then( (message) => {
		socket.emit('message', message)
		User.findOne({account: user}, (err, user)=>{
			if (err) console.log(err);
			user.progress = progress;
			user.save((err)=>{console.log(err)});
		})
	})
}

const waitAndSend = (socket, progress, user) => {
	let timeout = script[progress].wait;
	sendSystemMessage(socket, progress, user);
	if (timeout > 0){
		setTimeout(() => {
			waitAndSend(socket, progress + 1, user);
		}, 1000 * timeout);
	}
	else if (timeout === 0){ // enable user input
		socket.emit("enable")
	}
}

// socket.io
var onlineUsers = {};
var onlineCount = 0;
io.on('connection', function (socket) {
	socket.on('login', function(obj) {
		socket.id = obj._id;
		if(!onlineUsers.hasOwnProperty(obj._id)) {
			onlineUsers[obj._id] = obj.name;
			onlineCount++;
		}
		console.log(`${obj.name} has logged in.`);

		// check progress and send message
		if (script[obj.progress].wait > 0){
			if(obj.progress === 0) waitAndSend(socket, obj.progress, obj.account);
			else waitAndSend(socket, obj.progress+1, obj.account);
		}
	})

	socket.on('disconnect', function() {
		if(onlineUsers.hasOwnProperty(socket.id)){
			console.log(`${onlineUsers[socket.id]} has logged out.`);
			delete onlineUsers[socket.id];
			onlineCount--;
			
		}
	})

	socket.on('message', function(messageObj) {
		var newMessage = new Message(messageObj);
		newMessage.save().then( (message) => {
			console.log("Message saved");
			User.findOne({account: messageObj.user}, (err, user)=>{
				if (err) console.log(err);
				user.progress = messageObj.progress;
				user.save((err)=>{console.log(err)});
			})
		})

	})
})

server.listen(port , () => console.log('Listening on port ' + port))