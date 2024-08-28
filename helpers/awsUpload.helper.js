const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');

const s3 = require('./s3.util');

const upload_case_docs = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      cb(null, `case_docs/${file.originalname.split('.')[0]}_${fileName}${path.extname(file.originalname)}`);
    },
  }),
});

const upload_employee_docs = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      cb(null, `employee_docs/${file.originalname.split('.')[0]}_${fileName}${path.extname(file.originalname)}`);
    },
  }),
});


const upload_files = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      cb(null, `files/${file.originalname.split('.')[0]}_${fileName}${path.extname(file.originalname)}`);
    },
  }),
});

module.exports = {upload_case_docs,upload_employee_docs,upload_files};
