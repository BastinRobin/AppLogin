//Mongodb schema define
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/Login");

var UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	age: Number
}),
	Users = mongoose.model('Users', UserSchema);