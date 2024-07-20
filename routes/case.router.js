const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const caseController = require("../controllers/case.controller")
const jwt  = require("../middlewares/jwt")
const { upload_case_docs } = require('../helpers/awsUpload.helper')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/customer_docs');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.').slice(0, -1).join('.') + '_' + Date.now() + path.extname(file.originalname));
    }
})


let upload1 = multer({ storage: storage}).single('file')


router.get('/get/:id?',jwt.verifyToken, caseController.get)
router.post('/create', jwt.verifyToken,caseController.create)
router.put('/update/:id',jwt.verifyToken, caseController.update)
router.post('/upload_excel',[jwt.verifyToken],caseController.upload_excel(upload1,multer))
router.delete('/delete/:id?',jwt.verifyToken, caseController.delete)
router.delete('/delete_all',jwt.verifyToken, caseController.delete_all)
router.get('/filter',jwt.verifyToken, caseController.filter)
router.post('/upload_file',upload_case_docs.single('file'),caseController.fileUpload)
router.post('/upload_case_attachment_file',jwt.verifyToken,upload_case_docs.single('file'),caseController.upload_case_attachment_file)

module.exports = router
