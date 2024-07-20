const router = require('express').Router()
const userController = require('../controllers/user.controller')
const jwt = require('../middlewares/jwt')
const isRole = require('../middlewares/is_role')
const multer = require('multer')
const path = require('path')
const imageValidation = require('../helpers/upload.helper')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/profile_photo');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.').slice(0, -1).join('.') + '_' + Date.now() + path.extname(file.originalname));
    }
})

let upload = multer({ storage: storage, fileFilter: imageValidation.imageFilter }).single('image')


// [jwt.verifyToken, isRole.isRole(['admin', 'controller', 'hod', 'db_head', 'db_user'])],
router.get('/get/:id?/:status?',  userController.get)
router.get('/search', jwt.verifyToken, userController.filter)
router.get('/profile/:id', jwt.verifyToken, userController.profile)
router.post('/login', userController.userLogin)
router.post('/create', userController.create(upload, multer))
router.post('/update/:id', [jwt.verifyToken], userController.update(upload, multer))
router.post('/update-profile-photo', jwt.verifyToken, userController.changeProfilePhoto(upload, multer))
router.post('/send-reset-password-link', userController.sendResetPasswordLink)
router.get('/verify-reset-token', userController.verifyResetToken)
router.post('/reset-password', userController.resetPassword)
router.put('/change-password', jwt.verifyToken, userController.changePassword)
router.post('/change-password-admin',[jwt.verifyToken,isRole.isRole(['admin', 'controller'])], userController.changepassword_admin)
router.get('/logout', jwt.verifyToken, userController.userLogOut)
router.put('/assign-user-roles', userController.assignRoles)

router.post('/verify_otp',userController.verifyOtp)
router.post('/reset_password',userController.resetPassword1)


router.put('/disableAppAccess/:id',userController.disableAppAccess)
module.exports = router
