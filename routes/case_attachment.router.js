const router = require('express').Router()
const caseAttachmentController = require('../controllers/case_attachment.controller')
const { upload_case_docs } = require('../helpers/awsUpload.helper')
const jwt = require('../middlewares/jwt')
const multer = require('multer')
const path = require('path')



router.get('/get/:id?',jwt.verifyToken, caseAttachmentController.get)
router.post('/create',jwt.verifyToken,caseAttachmentController.create)
router.put('/update/:id',jwt.verifyToken,caseAttachmentController.update)
router.delete('/delete/:id',jwt.verifyToken,caseAttachmentController.delete)

module.exports = router
