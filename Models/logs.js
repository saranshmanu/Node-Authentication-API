var mongoose = require('mongoose')
var Schema = mongoose.Schema

var LogSchema = new Schema({
    uuid: String,
    ip: String,
    time: Date,
    route: String
})

var UserEventLogModel = mongoose.model('logs', UserEventLogSchema )

module.exports = UserEventLogMode