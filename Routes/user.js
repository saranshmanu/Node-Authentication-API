const router = require('express').Router()

var authentication = require('../Controllers/authentication')

router.post('/auth/login', (req, res) => {
    var email = req.body['email']
    var password = req.body['password']
    authentication.login(email, password).then(result => res.send(result)).catch(error => res.send(error))
})

router.post('/auth/register', (req, res) => {
    var name = req.body['name']
    var email = req.body['email']
    var password = req.body['password']
    authentication.register(email, password, name).then(result => res.send(result)).catch(error => res.send(error))
})

router.post('/auth/forgetPasswordEmail', (req, res) => {
    authentication.forgetPasswordMail().then(result => res.send(result)).catch(error => res.send(error))
})

router.post('/auth/forgetPassword', (req, res) => {
    authentication.forgetPassword().then(result => res.send(result)).catch(error => res.send(error))
})

router.post('/auth/changePassword', (req, res) => {
    var email = req.body['email']
    var currentPassword = req.body['currentPassword']
    var newPassword = req.body['newPassword']
    authentication.changePassword(email, currentPassword, newPassword).then(result => res.send(result)).catch(error => res.send(error))
})

router.post('/auth/deleteAccount', (req, res) => {
    var email = req.body['email']
    var password = req.body['password']
    authentication.deleteAccount(email, password).then(result => res.send(result)).catch(error => res.send(error))
})

router.get('/auth/sendConfirmEmail', (req, res) => {
    let email = req.body['email']
    authentication.sendConfirmEmail(email).then(result => res.send(result)).catch(error => res.send(error))
})

router.get('/auth/confirmEmail/:token', (req, res) => {
    let token = req.params.token
    authentication.confirmEmail(token).then(result => res.send(result)).catch(error => res.send(error))
})

router.post('/auth/test', authentication.testRoute)

module.exports = router