const router = require('express').Router()

var admin = require('../Controller/admin')

router.get('/admin/banAccount', admin.banAccount)

module.exports = router