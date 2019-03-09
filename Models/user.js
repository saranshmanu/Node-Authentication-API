var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    registeredDate: String,
    verifiedEmail: Boolean,
    banned: Boolean,
    passwordHistory: [String]
})

var LogSchema = new Schema({
    uuid: String,
    ip: String,
    time: Date,
    route: String
})

var UserModel = mongoose.model('user', UserSchema )

module.exports = UserModel