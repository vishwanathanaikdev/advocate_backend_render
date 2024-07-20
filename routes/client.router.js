const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const clientContoller = require("../controllers/client.controller")
const jwt  = require("../middlewares/jwt")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/customer_docs');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.').slice(0, -1).join('.') + '_' + Date.now() + path.extname(file.originalname));
    }
})

let upload = multer({ storage: storage}).fields([
    {name:"photo",maxCount:1},
    {name:"aadhar_file",maxCount:1},
    {name:"pan_file",maxCount:1},
    {name:"dl_file",maxCount:1}
  ])

let upload1 = multer({ storage: storage}).single('file')


router.get('/get/:id?',jwt.verifyToken, clientContoller.get)
router.post('/create', jwt.verifyToken,clientContoller.create(upload, multer))
router.post('/update/:id',jwt.verifyToken, clientContoller.update(upload, multer))
router.post('/upload_excel',[jwt.verifyToken],clientContoller.upload_excel(upload1,multer))
router.delete('/delete/:id?',jwt.verifyToken, clientContoller.delete)
router.delete('/delete_all',jwt.verifyToken, clientContoller.delete_all)
router.get('/filter',jwt.verifyToken, clientContoller.filter)

module.exports = router
