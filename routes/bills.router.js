const router = require('express').Router()
const billsController = require('../controllers/bills.controller')
const jwt = require('../middlewares/jwt')



router.get('/get/:id?',jwt.verifyToken, billsController.get)
router.get('/get_all/:id?',jwt.verifyToken, billsController.getbills)
router.post('/create',jwt.verifyToken,billsController.create)
router.put('/update/:id',jwt.verifyToken,billsController.update)
router.delete('/delete/:id',jwt.verifyToken,billsController.delete)

module.exports = router
