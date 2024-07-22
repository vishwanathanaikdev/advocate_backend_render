const router = require('express').Router()
const paymentController = require('../controllers/payment.controller')
const jwt = require('../middlewares/jwt')



router.get('/get/:id?',jwt.verifyToken, paymentController.get)
router.post('/create',jwt.verifyToken,paymentController.create)
router.put('/update/:id',jwt.verifyToken,paymentController.update)
router.delete('/delete/:id',jwt.verifyToken,paymentController.delete)

module.exports = router
