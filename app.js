
/**
 * Module dependencies.
 * Functions: Routing, Jade Templating
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: "This is a secret key"}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Mongodb schema define
mongoose.connect("mongodb://localhost/AppLogin");

var UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	age: Number
}),
	Users = mongoose.model('Users', UserSchema);

//Basic routes
app.get('/', routes.index);

//Display all users
app.get('/users', function(req, res) {
	Users.find({}, function(err, docs) {
		res.render("users/index",  {users: docs});
	});
});

//Create route
app.get('/users/new', function(req, res) {
	res.render('users/new');
});


//Create User post route
app.post('/users', function(req, res) {
	var b = req.body;
	new Users({
		name: b.name,
		email: b.email,
		age: b.age
	}).save(function(err, user){
		if(err) res.json(err);
		res.redirect('/users/'+ user.name);
	});	
});

//Show the Inserted User
app.param('name', function(req, res, next, name) {
	Users.find({name: name}, function(err,docs) {
		req.user = docs[0];
		next();
	});
});

app.get('/users/:name', function(req, res) {
	res.render('users/show', { user: req.user });
});


//Edit Route
app.get('/users/:name/edit', function(req, res) {
	res.render('users/edit', { user: req.user});
});

//Update Route
app.put('/users/:name', function(req, res) {
	var b = req.body;
	Users.update(
		{name: req.params.name},
		{name: b.name, email: b.email, age: b.age},
		function(err) {
			res.redirect('/users/' + b.name);
		}
	);
});

//Delete Route
app.get('/users/:name/delete', function(req, res) {
	Users.remove(
		{name: req.params.name},
		function(err) {
			res.redirect('/users/'); 
		});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
