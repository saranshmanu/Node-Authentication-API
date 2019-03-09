var express = require('express')
var bodyParser = require('body-parser')
var helmet = require('helmet')
var compression = require('compression')
var mongoose = require('mongoose');

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(helmet());
app.use(compression());

const adminRoutes = require('./Routes/admin')
const userRoutes = require('./Routes/user')
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)

//Set up default mongoose connection
var mongoDB = 'mongodb://saransh.xyz';
mongoose.connect(mongoDB, { useNewUrlParser: false }, (err) => {
    if(err) {
        console.log(err)
    } else {
        var db = mongoose.user
        app.listen(8888, () => {
            console.log("Server starting up ....")
        })
    }
});