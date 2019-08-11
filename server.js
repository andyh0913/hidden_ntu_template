const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStorage = require('connect-mongo')(session);
const apiRoute = require('./src/route/api');

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

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRoute);

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
})



server = app.listen(port , () => console.log('Listening on port ' + port))