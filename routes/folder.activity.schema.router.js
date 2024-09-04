const router = require('express').Router()
const folderActivitySchemaController = require('../controllers/folderactivity.schema.controller')
const jwt = require('../middlewares/jwt')

router.get('/get/:id?', folderActivitySchemaController.get)
router.post('/create',jwt.verifyToken, folderActivitySchemaController.create)
router.put('/update/:id',jwt.verifyToken, folderActivitySchemaController.update)
router.put('/delete/:id',jwt.verifyToken, folderActivitySchemaController.delete)

module.exports = router
