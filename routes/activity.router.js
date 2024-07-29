const router = require('express').Router()
const activityController = require('../controllers/activity.controller')
const jwt = require('../middlewares/jwt')

router.post('/create',jwt.verifyToken,activityController.create)
router.get('/get',jwt.verifyToken,activityController.get)
router.put('/update/:id',jwt.verifyToken,activityController.update)
router.delete('/delete/:id',jwt.verifyToken,activityController.delete)

module.exports = router
