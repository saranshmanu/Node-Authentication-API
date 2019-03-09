const router = require('express').Router()

var authentication = require('../Controllers/authentication')

router.post('/auth/login', (req, res) => {
    var email = req.body['email']
    var password = req.body['password']
    authentication.login(email, password).then(result => res.send(result)).catch(error => res.send(error))
})

router.post('/auth/register', (req, res) => {
    var email = req.body['email']
    var password = req.body['password']
    var name = req.body['name']
    authentication.register(email, password, name).then(result => res.send(result)).catch(error => res.send(error))
})

router.post('/auth/resetPassword', authentication.resetPassword)
router.post('/auth/changePassword', authentication.changePassword)
router.post('/auth/deleteAccount', authentication.deleteAccount)
router.get('/auth/confirmEmail', authentication.confirmEmail)
router.post('/auth/test', authentication.testRoute)

module.exports = router