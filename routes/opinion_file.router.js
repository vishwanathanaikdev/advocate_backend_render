const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const opinionFileController = require("../controllers/opinion_file.controller")
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


router.get('/get/:id?',jwt.verifyToken, opinionFileController.get)
router.post('/create', jwt.verifyToken,opinionFileController.create)
router.put('/update/:id',jwt.verifyToken, opinionFileController.update)
router.post('/upload_excel',[jwt.verifyToken],opinionFileController.upload_excel(upload1,multer))
router.delete('/delete/:id?',jwt.verifyToken, opinionFileController.delete)
router.delete('/delete_all',jwt.verifyToken, opinionFileController.delete_all)
router.get('/filter',jwt.verifyToken, opinionFileController.filter)
router.post('/upload_file',upload_case_docs.single('file'),opinionFileController.fileUpload)

module.exports = router
