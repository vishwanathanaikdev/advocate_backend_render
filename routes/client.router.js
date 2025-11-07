const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const clientController = require('../controllers/client.controller');
const jwt = require('../middlewares/jwt');

// ✅ Make sure upload folder exists
const uploadDir = path.join(__dirname, '../public/customer_docs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created folder:", uploadDir);
}

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure folder exists before saving
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_'); // replace spaces
    const timestamp = Date.now();
    cb(null, `${path.parse(safeName).name}_${timestamp}${path.extname(safeName)}`);
  },
});

// ✅ File filter (allow image & PDF)
// const fileFilter = (req, file, cb) => {
//   if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) {
//     req.fileValidationError = 'Only image or PDF files are allowed!';
//     return cb(new Error('Only jpg, jpeg, png, gif, pdf extensions are allowed!'), false);
//   }
//   cb(null, true);
// };

// ✅ File filter (allow image, PDF, DOC, DOCX)
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|webp|heic)$/i)) {
    req.fileValidationError = 'Only JPG, PNG, GIF, WEBP, HEIC, PDF, or DOC files are allowed!';
    return cb(new Error('Invalid file type!'), false);
  }
  cb(null, true);
};


// ✅ Multer upload setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'aadhar_file', maxCount: 1 },
  { name: 'pan_file', maxCount: 1 },
  { name: 'dl_file', maxCount: 1 },
]);

// ✅ Excel upload
const upload1 = multer({ storage }).single('file');

// ✅ Routes
router.get('/get/:id?', jwt.verifyToken, clientController.get);
router.post('/create', jwt.verifyToken, clientController.create(upload, multer));
router.post('/update/:id', jwt.verifyToken, clientController.update(upload, multer));
router.post('/upload_excel', jwt.verifyToken, clientController.upload_excel(upload1, multer));
router.delete('/delete/:id?', jwt.verifyToken, clientController.delete);
router.delete('/delete_all', jwt.verifyToken, clientController.delete_all);
router.get('/filter', jwt.verifyToken, clientController.filter);

module.exports = router;







//===>> Old routers 

// const router = require('express').Router()
// const multer = require('multer')
// const path = require('path')
// const clientContoller = require("../controllers/client.controller")
// const jwt  = require("../middlewares/jwt")


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/customer_docs');
//     },

//     filename: (req, file, cb) => {
//         cb(null, file.originalname.split('.').slice(0, -1).join('.') + '_' + Date.now() + path.extname(file.originalname));
//     }
// })

// let upload = multer({ storage: storage}).fields([
//     {name:"photo",maxCount:1},
//     {name:"aadhar_file",maxCount:1},
//     {name:"pan_file",maxCount:1},
//     {name:"dl_file",maxCount:1}
//   ])

// let upload1 = multer({ storage: storage}).single('file')


// router.get('/get/:id?',jwt.verifyToken, clientContoller.get)
// router.post('/create', jwt.verifyToken,clientContoller.create(upload, multer))
// router.post('/update/:id',jwt.verifyToken, clientContoller.update(upload, multer))
// router.post('/upload_excel',[jwt.verifyToken],clientContoller.upload_excel(upload1,multer))
// router.delete('/delete/:id?',jwt.verifyToken, clientContoller.delete)
// router.delete('/delete_all',jwt.verifyToken, clientContoller.delete_all)
// router.get('/filter',jwt.verifyToken, clientContoller.filter)

// module.exports = router
