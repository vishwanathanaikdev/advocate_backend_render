const router = require('express').Router()
const homeDataController = require('../controllers/home_data.controller')
const jwt = require('../middlewares/jwt')


router.get('/get',jwt.verifyToken,homeDataController.get)

module.exports = router
