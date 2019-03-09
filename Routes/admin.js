const router = require('express').Router()

var admin = require('../Controllers/admin')

router.get('/admin/banAccount', admin.banAccount)

module.exports = router