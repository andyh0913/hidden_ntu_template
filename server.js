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
	data.speaker = parseInt(data.speaker);
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
	data.speaker = parseInt(data.speaker);
	reply.push(data);
})
.on('end', () => {
	console.log(reply);
	console.log("Reply loaded!");
})

const sendMessage = (id, progress, content, speaker) => {
	console.log(progress, onlineUsers[id], content, speaker);
	var newMessage = new Message({
		progress: progress,
		user: id,
		text: content,
		speaker: speaker,
		isImage: content[0]==='/',
		date: new Date()
	});
	newMessage.save().then( (message) => {
		io.to(id).emit('message', message);
		User.findById(id, (err, user)=>{
			if (err) console.log(err);
			if (user.progress<progress) user.progress = progress;
			user.save().then((user)=>{
				console.log(`Update progress: ${user.name}-${user.progress}`);
			}, (err)=>{
				console.log(err);
			});
		})
	})
}

const waitAndSend = (id, progress) => {
	const message = script[progress];
	var timeout = message.wait;
	sendMessage(id, progress, message.content, message.speaker);
	setSender(id, progress);
	if(!onlineUsers.hasOwnProperty(id)) return; // stop sending message
	if (timeout > 0){
		setTimeout(() => {
			waitAndSend(id, progress + 1);
		}, 1000 * timeout);
	}
	else if (timeout === 0){ // enable user input
		io.to(id).emit("enable", {progress: progress+1});
		User.findById(id, (err, user)=>{
			if (err) console.log(err);
			if (user.progress<progress+1) user.progress = progress+1;
			user.save().then((user)=>{
				console.log(`Update progress: ${user.name}-${user.progress}`);
			}, (err)=>{
				console.log(err);
			});
		})
	}
}

const setSender = (id, progress) => {
	let isGroup = progress<=158?false:true;
	let name = "";
	if (progress<=9) name = "不明人士";
	else if (progress<=158) name = "漢森‧丹尼斯";
	else if (progress<=162) name = "漢森‧丹尼斯、不明人士";
	else name = "漢森‧丹尼斯、喬伊";
	io.to(id).emit('setSender', {senderName: name, isGroup: isGroup})
}

// socket.io
// TODO: Change message user into _id
var onlineUsers = {};
var onlineCount = 0;
io.on('connection', function (socket) {
	socket.on('login', function(obj) {
		if(onlineUsers.hasOwnProperty(obj._id)) {
			console.log('Delete extra socket')
			socket.disconnect();
			return;
		}
		else {
			socket.join(obj._id)
			socket.id = obj._id;
			onlineUsers[obj._id] = obj.name;
			onlineCount++;
			console.log(`${obj.name} has logged in.`);
			// check progress and send message
			if (script[obj.progress].wait > 0){
				if(obj.progress === 0){
					console.log("Initial progress")
					waitAndSend(obj._id, obj.progress);
				}
				else{
					console.log("Continued progress");
					waitAndSend(obj._id, obj.progress+1);
				}
			}
			else if(script[obj.progress].wait === 0){
				socket.emit("enable", {progress: obj.progress+1});
				User.findById(obj._id, (err, user)=>{
					if (err) console.log(err);
					if (user.progress<obj.progress+1) user.progress = obj.progress+1;
					user.save().then((user)=>{
						console.log(`Update progress: ${user.name}-${user.progress}`);
					}, (err)=>{
						console.log(err);
					});
				})
			}
			else{
				socket.emit("enable", {progress: obj.progress});
			}
			// check progress and set sender name and icon
			setSender(obj._id, obj.progress);
		}
	})

	socket.on('disconnect', function() {
		if(onlineUsers.hasOwnProperty(socket.id)){
			socket.leave(socket.id)
			console.log(`${onlineUsers[socket.id]} has logged out.`);
			delete onlineUsers[socket.id];
			onlineCount--;
		}
	})

	socket.on('message', function(messageObj) {
		var newMessage = new Message(messageObj);
		newMessage.save().then( (message) => {
			console.log(`Message-${message.progress} saved`);
			User.findById(message.user, (err, user)=>{
				if (err) console.log(err);
				if (user.progress<message.progress) user.progress = message.progress;
				user.save().then((user)=>{
					console.log(`Update progress: ${user.name}-${user.progress}`);
				}, (err)=>{
					console.log(err);
				});
			})
			var replyMessage = reply.find((x)=> x.progress=== message.progress);
			if (!replyMessage.answer||replyMessage.answer === message.text){ // correct answer
				socket.emit("disable", {progress: message.progress+1});
				waitAndSend(message.user, message.progress+1);
			}
			else{ // wrong answer, send default reply
				sendMessage(message.user, message.progress, replyMessage.content, replyMessage.speaker);
			}
		})
		.catch((err)=>{console.log(err)})

	})

	// for dns-server
	socket.on('rfid', function(obj){
		console.log("receive rfid socket");
		//obj = user: user._id, progress: progress}
		waitAndSend(obj.user, obj.progress+1);
	})
})

server.listen(port , () => console.log('Listening on port ' + port))