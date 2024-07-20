const router = require('express').Router()

const designationController = require('../controllers/designation.controller')

router.get('/get/:id?',  designationController.get)
router.post('/create',  designationController.create)
router.post('/create-temp', designationController.create)
router.put('/update/:id',  designationController.update)
router.delete('/delete/:id',  designationController.delete)

// [jwt.verifyToken, isRole.isRole(['admin', 'controller'])],
module.exports = router