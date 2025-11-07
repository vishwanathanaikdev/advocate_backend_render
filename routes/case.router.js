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
router.get('/get_admin/:id?',jwt.verifyToken, caseController.get_admin)
router.post('/create', jwt.verifyToken,caseController.create)
router.put('/update/:id',jwt.verifyToken, caseController.update)
router.post('/update_mass',jwt.verifyToken, caseController.updateNextHearingDateMax)
router.post('/upload_excel',[jwt.verifyToken],caseController.upload_excel(upload1,multer))
router.delete('/delete/:id?',jwt.verifyToken, caseController.delete)
router.delete('/delete_all',jwt.verifyToken, caseController.delete_all)
router.get('/filter',jwt.verifyToken, caseController.filter)
router.get('/filter_date',jwt.verifyToken, caseController.filter_date)
router.get('/filter_date_excel',jwt.verifyToken, caseController.filter_date_excel)
router.post('/upload_file',upload_case_docs.single('file'),caseController.fileUpload)
router.post('/upload_case_attachment_file',jwt.verifyToken,upload_case_docs.single('file'),caseController.upload_case_attachment_file)

module.exports = router








//========>> Old one case 


// const router = require('express').Router()
// const multer = require('multer')
// const path = require('path')
// const caseController = require("../controllers/case.controller")
// const jwt  = require("../middlewares/jwt")
// const { upload_case_docs } = require('../helpers/awsUpload.helper')


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/customer_docs');
//     },

//     filename: (req, file, cb) => {
//         cb(null, file.originalname.split('.').slice(0, -1).join('.') + '_' + Date.now() + path.extname(file.originalname));
//     }
// })


// let upload1 = multer({ storage: storage}).single('file')


// router.get('/get/:id?',jwt.verifyToken, caseController.get)
// router.get('/get_admin/:id?',jwt.verifyToken, caseController.get_admin)
// router.post('/create', jwt.verifyToken,caseController.create)
// router.put('/update/:id',jwt.verifyToken, caseController.update)
// router.post('/update_mass',jwt.verifyToken, caseController.updateNextHearingDateMax)
// router.post('/upload_excel',[jwt.verifyToken],caseController.upload_excel(upload1,multer))
// router.delete('/delete/:id?',jwt.verifyToken, caseController.delete)
// router.delete('/delete_all',jwt.verifyToken, caseController.delete_all)
// router.get('/filter',jwt.verifyToken, caseController.filter)
// router.get('/filter_date',jwt.verifyToken, caseController.filter_date)
// router.get('/filter_date_excel',jwt.verifyToken, caseController.filter_date_excel)
// router.post('/upload_file',upload_case_docs.single('file'),caseController.fileUpload)
// router.post('/upload_case_attachment_file',jwt.verifyToken,upload_case_docs.single('file'),caseController.upload_case_attachment_file)

// module.exports = router
