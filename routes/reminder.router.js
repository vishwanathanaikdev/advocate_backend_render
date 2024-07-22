const router = require('express').Router()
const reminderController = require('../controllers/reminder.controller')
const jwt = require('../middlewares/jwt')

router.get('/get/:id?',jwt.verifyToken, reminderController.get)
router.post('/create',jwt.verifyToken,reminderController.create)
router.put('/update/:id',jwt.verifyToken,reminderController.update)
router.delete('/delete/:id',jwt.verifyToken,reminderController.delete)

module.exports = router
