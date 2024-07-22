const router = require('express').Router()
const opinionFileAttachmentController = require('../controllers/opinion_file_attachment.controller')
const { upload_case_docs } = require('../helpers/awsUpload.helper')
const jwt = require('../middlewares/jwt')
const multer = require('multer')
const path = require('path')



router.get('/get/:id?',jwt.verifyToken, opinionFileAttachmentController.get)
router.post('/create',jwt.verifyToken, opinionFileAttachmentController.create)
router.put('/update/:id',jwt.verifyToken, opinionFileAttachmentController.update)
router.delete('/delete/:id',jwt.verifyToken,opinionFileAttachmentController.delete)

module.exports = router
