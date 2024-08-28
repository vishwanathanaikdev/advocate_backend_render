const router = require('express').Router()
const folderSchemaController = require('../controllers/folder.schema.controller')
const { upload_files } = require('../helpers/awsUpload.helper')

router.get('/get/:id?', folderSchemaController.get)
router.post('/create', folderSchemaController.create)
router.put('/update/:id', folderSchemaController.update)
router.delete('/delete/:id', folderSchemaController.delete)
router.delete('/delete_all', folderSchemaController.delete_all)
router.post('/upload_file',upload_files.single('file'),folderSchemaController.fileUpload)

module.exports = router
