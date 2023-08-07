const router = require('express').Router()
const departmentController = require('../controllers/department.controller')

router.get('/get/:id?', departmentController.get)
router.post('/create', departmentController.create)
router.post('/create-temp', departmentController.create)
router.put('/update/:id',  departmentController.update)
router.delete('/delete/:id', departmentController.delete)

module.exports = router

