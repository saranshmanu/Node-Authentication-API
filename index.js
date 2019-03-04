var express = require('express')
var app = express()

const adminRoutes = require('./Routes/admin')
const userRoutes = require('./Routes/user')

app.use('/user', userRoutes)
app.use('/admin', adminRoutes)

app.listen(8888, () => {
    console.log("Server starting up ....")
})