const router = require('express').Router()

var authentication = require('../Controller/authentication')

router.get('/auth/login', authentication.login)
router.get('/auth/register', authentication.register)
router.get('/auth/resetPassword', authentication.resetPassword)
router.get('/auth/changePassword', authentication.changePassword)
router.get('/auth/deleteAccount', authentication.deleteAccount)
router.get('/auth/confirmEmail', authentication.confirmEmail)

module.exports = router