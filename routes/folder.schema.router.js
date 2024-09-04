const router = require('express').Router()
const folderSchemaController = require('../controllers/folder.schema.controller')
const { upload_files } = require('../helpers/awsUpload.helper')
const jwt = require('../middlewares/jwt')

router.get('/get/:id?', folderSchemaController.get)
router.get('/get_deleted/:id?', folderSchemaController.get_deleted)
router.get('/get_starred/:id?', folderSchemaController.get_starred)
router.post('/create',jwt.verifyToken, folderSchemaController.create)
router.put('/update/:id',jwt.verifyToken, folderSchemaController.update)
router.put('/delete/:id',jwt.verifyToken, folderSchemaController.delete)
router.delete('/delete_admin/:id',jwt.verifyToken, folderSchemaController.delete1)
router.delete('/delete_all', folderSchemaController.delete_all)
router.post('/upload_file',upload_files.single('file'),folderSchemaController.fileUpload)

module.exports = router
