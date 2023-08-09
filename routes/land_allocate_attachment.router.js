const router = require('express').Router()
const landAllocateAttachmentController = require('../controllers/land_allocate_attachment.controller')
const jwt = require('../middlewares/jwt')
const multer = require('multer')
const path = require('path')



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/customer_docs');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.').slice(0, -1).join('.') + '_' + Date.now() + path.extname(file.originalname));
    }
})

let upload = multer({ storage: storage,}).single('file')


router.get('/get/:id?',jwt.verifyToken, landAllocateAttachmentController.get)
router.post('/create',jwt.verifyToken, landAllocateAttachmentController.create(upload, multer))
router.put('/update/:id',jwt.verifyToken, landAllocateAttachmentController.update(upload, multer))
router.delete('/delete/:id',jwt.verifyToken, landAllocateAttachmentController.delete)

module.exports = router
