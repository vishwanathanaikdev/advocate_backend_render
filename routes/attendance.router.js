const router = require('express').Router()
const attendanceController = require('../controllers/attendance.controller')
const jwt = require('../middlewares/jwt')


router.get('/get/:id?', attendanceController.get)
router.get('/get_today',jwt.verifyToken, attendanceController.get_today)
router.post('/create',jwt.verifyToken,attendanceController.create)
router.get('/filter',jwt.verifyToken,attendanceController.filter)
router.get('/downloadExcel',jwt.verifyToken,attendanceController.downLoadExcel)
router.post('/create-temp', attendanceController.create)
router.put('/update/:id',  attendanceController.update)
router.put('/update_admin/:id',  attendanceController.update_by_admin)
router.delete('/delete/:id', attendanceController.delete)

module.exports = router