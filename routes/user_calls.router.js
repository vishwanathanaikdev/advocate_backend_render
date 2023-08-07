const router = require('express').Router()
const jwt = require('../middlewares/jwt')
const isRole = require('../middlewares/is_role')
const userCallsController = require('../controllers/user_calls.controller')

router.get('/get/:id?',jwt.verifyToken, userCallsController.get)
router.post('/create',jwt.verifyToken,  userCallsController.create)
router.put('/update/:id',jwt.verifyToken,  userCallsController.update)
router.delete('/delete/:id',jwt.verifyToken,  userCallsController.delete)
router.get('/filter',jwt.verifyToken, userCallsController.filter)

module.exports = router