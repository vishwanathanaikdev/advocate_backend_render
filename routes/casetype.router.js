const router = require('express').Router()

const casetypeController = require('../controllers/case_type.controller')

router.get('/get/:id?',  casetypeController.get)
router.post('/create',  casetypeController.create)
router.post('/create-temp', casetypeController.create)
router.put('/update/:id',  casetypeController.update)
router.delete('/delete/:id',  casetypeController.delete)
router.get('/filter',  casetypeController.filter)

// [jwt.verifyToken, isRole.isRole(['admin', 'controller'])],
module.exports = router