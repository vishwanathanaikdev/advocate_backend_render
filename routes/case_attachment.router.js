const router = require('express').Router()
const caseAttachmentController = require('../controllers/case_attachment.controller')
const jwt = require('../middlewares/jwt')
const multer = require('multer')
const path = require('path')



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/case_attachment');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.').slice(0, -1).join('.') + '_' + Date.now() + path.extname(file.originalname));
    }
})

let upload = multer({ storage: storage,}).single('file')


router.get('/get/:id?',jwt.verifyToken, caseAttachmentController.get)
router.post('/create',jwt.verifyToken, caseAttachmentController.create(upload, multer))
router.put('/update/:id',jwt.verifyToken, caseAttachmentController.update(upload, multer))
router.delete('/delete/:id',jwt.verifyToken, caseAttachmentController.delete)

module.exports = router
