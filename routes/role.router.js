const router = require('express').Router()
const roleController = require('../controllers/role.controller')

router.get('/get/:id?', roleController.get)
router.post('/create', roleController.create)
router.put('/update/:id', roleController.update)
router.delete('/delete/:id', roleController.delete)

module.exports = router
