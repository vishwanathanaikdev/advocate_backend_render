// helpers/awsUpload.helper.js
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3-v3");
const path = require("path");
require("dotenv").config();

// ✅ Validate env vars
if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.S3_BUCKET ||
  !process.env.S3_REGION
) {
  console.error("❌ Missing AWS credentials or bucket info in .env");
  process.exit(1);
}

// ✅ Create S3 Client (v3)
const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  },
});

// ✅ File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|zip|csv/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.test(ext)) {
    return cb(
      new Error(
        "Only jpeg, jpg, png, pdf, doc, docx, xls, xlsx, zip, csv files allowed!"
      ),
      false
    );
  }
  cb(null, true);
};

// ✅ Reusable uploader (no ACL, since bucket ACLs are disabled)
const createUploader = (folder) =>
  multer({
    fileFilter,
    storage: multerS3({
      s3,
      bucket: process.env.S3_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      // ❌ Do NOT add `acl` here since your bucket disables ACLs
      key: (req, file, cb) => {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const key = `${folder}/${base}_${timestamp}_${random}${ext}`;
        console.log(`📤 Uploading file to S3: ${key}`);
        cb(null, key);
      },
    }),
  });

// ✅ Define all uploaders
const upload_case_docs = createUploader("case_docs");
const upload_employee_docs = createUploader("employee_docs");
const upload_files = createUploader("files");

module.exports = { upload_case_docs, upload_employee_docs, upload_files };







//===>> Old 222

// const { S3Client } = require("@aws-sdk/client-s3");
// const multer = require("multer");
// const multerS3 = require("multer-s3-v3");
// const path = require("path");
// require("dotenv").config();

// // ✅ Validate env vars
// if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_BUCKET || !process.env.S3_REGION) {
//   console.error("❌ Missing AWS credentials or bucket info in .env");
//   process.exit(1);
// }

// // ✅ Create S3 Client (v3)
// const s3 = new S3Client({
//   region: process.env.S3_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
//   },
// });

// // ✅ File filter for allowed types
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|zip|csv/;
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (!allowedTypes.test(ext)) {
//     return cb(new Error("Only jpeg, jpg, png, pdf, doc, docx, xls, xlsx, zip, csv files allowed!"), false);
//   }
//   cb(null, true);
// };

// // ✅ Reusable uploader function
// const createUploader = (folder) =>
//   multer({
//     fileFilter,
//     storage: multerS3({
//       s3,
//       bucket: process.env.S3_BUCKET,
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       key: (req, file, cb) => {
//         const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
//         cb(null, `case_docs/${file.originalname.split('.')[0]}_${fileName}${path.extname(file.originalname)}`);
//       },
//     })    
//   });

// const upload_case_docs = createUploader("case_docs");
// const upload_employee_docs = createUploader("employee_docs");
// const upload_files = createUploader("files");

// module.exports = { upload_case_docs, upload_employee_docs, upload_files };







//========>>> old 

// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const path = require('path');
// require('dotenv').config();

// // ✅ Check .env configuration
// if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_REGION || !process.env.S3_BUCKET) {
//   console.error('❌ AWS S3 configuration missing in .env file.');
//   console.log(`
//   AWS_ACCESS_KEY_ID=your-access-key
//   AWS_SECRET_ACCESS_KEY=your-secret-key
//   S3_REGION=ap-south-1
//   S3_BUCKET=your-bucket-name
//   `);
// }

// // ✅ AWS SDK v2 S3 instance
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.S3_REGION,
// });

// // ✅ File filter (allow common formats)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|zip|csv/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only jpeg, jpg, png, pdf, doc, docx, xls, xlsx, zip, csv files allowed!'));
//   }
// };

// // ✅ Generic uploader creator
// const createUploader = (folderName) =>
//   multer({
//     fileFilter,
//     storage: multerS3({
//       s3,
//       bucket: process.env.S3_BUCKET,
//       acl: 'public-read',
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       key: (req, file, cb) => {
//         const timestamp = Date.now();
//         const random = Math.round(Math.random() * 1e9);
//         const ext = path.extname(file.originalname);
//         const name = path.basename(file.originalname, ext);
//         const fileKey = `${folderName}/${name}_${timestamp}_${random}${ext}`;
//         console.log(`📤 Uploading file to S3: ${fileKey}`);
//         cb(null, fileKey);
//       },
//     }),
//   });

// // ✅ Create uploaders
// const upload_case_docs = createUploader('case_docs');
// const upload_employee_docs = createUploader('employee_docs');
// const upload_files = createUploader('files');

// // ✅ Export all
// module.exports = { upload_case_docs, upload_employee_docs, upload_files };









//===========>>


// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const path = require('path');
// require('dotenv').config();

// // ✅ Validate environment variables
// if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_REGION || !process.env.S3_BUCKET) {
//   console.error('❌ AWS S3 configuration missing in .env file.');
//   console.log('Make sure you have the following in .env:\n');
//   console.log(`
//   AWS_ACCESS_KEY_ID=your-access-key
//   AWS_SECRET_ACCESS_KEY=your-secret-key
//   S3_REGION=ap-south-1
//   S3_BUCKET=your-bucket-name
//   `);
// }

// // ✅ Initialize AWS S3 client
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.S3_REGION,
// });

// // ✅ File filter
// // const fileFilter = (req, file, cb) => {
// //   const allowed = /jpeg|jpg|png|pdf|doc|docx/;
// //   const ext = path.extname(file.originalname).toLowerCase();
// //   if (!allowed.test(ext)) {
// //     req.fileValidationError = 'Only image and document files are allowed!';
// //     return cb(new Error('Only jpeg, jpg, png, pdf, doc, docx files allowed!'), false);
// //   }
// //   cb(null, true);
// // };

// const fileFilter = (req, file, cb) => {
//   // const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
//   const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|zip|csv/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Only jpeg, jpg, png, pdf, doc, docx files allowed!'));
//   }
// };


// // ✅ Helper for S3 folder uploads
// const createUploader = (folder) =>
//   multer({
//     fileFilter,
//     storage: multerS3({
//       s3,
//       bucket: process.env.S3_BUCKET,
//       acl: 'public-read',
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       key: (req, file, cb) => {
//         const timestamp = Date.now();
//         const random = Math.round(Math.random() * 1e9);
//         const ext = path.extname(file.originalname);
//         const name = path.basename(file.originalname, ext);
//         const key = `${folder}/${name}_${timestamp}_${random}${ext}`;
//         console.log(`📤 Uploading file to S3: ${key}`);
//         cb(null, key);
//       },
//     }),
//   });

// // const upload_case_docs = createUploader('case_docs');
// const upload_case_docs = multer({
//   storage: multerS3({
//     s3,
//     acl: 'public-read',
//     bucket: process.env.S3_BUCKET,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//       const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
//       cb(null, `case_docs/${file.originalname.split('.')[0]}_${fileName}${path.extname(file.originalname)}`);
//     },
//   }),
//   fileFilter, // ✅ add this line
// });

// const upload_employee_docs = createUploader('employee_docs');
// const upload_files = createUploader('files');

// module.exports = { upload_case_docs, upload_employee_docs, upload_files };









//=======>> OLD ONE


// // 📁 helpers/awsUpload.helper.js
// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const path = require('path');

// // ✅ Load environment variables
// require('dotenv').config();

// // ✅ Validate environment setup
// if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY || !process.env.S3_REGION || !process.env.S3_BUCKET) {
//   console.error('❌ AWS S3 configuration missing in .env file.');
//   console.log('Make sure you have the following in your .env:');
//   console.log(`
//   S3_ACCESS_KEY=your-access-key
//   S3_SECRET_KEY=your-secret-key
//   S3_REGION=ap-south-1
//   S3_BUCKET=your-bucket-name
//   `);
// }

// // ✅ Initialize AWS S3 instance
// const s3 = new AWS.S3({
//   accessKeyId: process.env.S3_ACCESS_KEY,
//   secretAccessKey: process.env.S3_SECRET_KEY,
//   region: process.env.S3_REGION,
// });

// // ✅ Common file filter (only allow certain file types)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
//   const ext = path.extname(file.originalname).toLowerCase().substring(1);
//   if (!allowedTypes.test(ext)) {
//     req.fileValidationError = 'Only image and document files are allowed!';
//     return cb(new Error('Only jpeg, jpg, png, pdf, doc, docx files allowed!'), false);
//   }
//   cb(null, true);
// };

// // ✅ Common multerS3 storage creator
// const createS3Uploader = (folderName) =>
//   multer({
//     fileFilter,
//     storage: multerS3({
//       s3,
//       bucket: process.env.S3_BUCKET,
//       acl: 'public-read',
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       key: (req, file, cb) => {
//         try {
//           const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
//           const finalName = `${folderName}/${file.originalname.split('.')[0]}_${fileName}${path.extname(file.originalname)}`;
//           console.log('📤 Uploading file to S3 path:', finalName);
//           cb(null, finalName);
//         } catch (err) {
//           console.error('❌ Error generating file name:', err);
//           cb(err);
//         }
//       },
//     }),
//   });

// // ✅ Different uploaders for specific use cases
// const upload_case_docs = createS3Uploader('case_docs');
// const upload_employee_docs = createS3Uploader('employee_docs');
// const upload_files = createS3Uploader('files');

// module.exports = { upload_case_docs, upload_employee_docs, upload_files };









//=======>> Old one 


// const multerS3 = require('multer-s3');
// const multer = require('multer');
// const path = require('path');

// const s3 = require('./s3.util');

// const upload_case_docs = multer({
//   storage: multerS3({
//     s3,
//     acl: 'public-read',
//     bucket: process.env.S3_BUCKET,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//       const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
//       cb(null, `case_docs/${file.originalname.split('.')[0]}_${fileName}${path.extname(file.originalname)}`);
//     },
//   }),
// });

// const upload_employee_docs = multer({
//   storage: multerS3({
//     s3,
//     acl: 'public-read',
//     bucket: process.env.S3_BUCKET,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//       const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
//       cb(null, `employee_docs/${file.originalname.split('.')[0]}_${fileName}${path.extname(file.originalname)}`);
//     },
//   }),
// });


// const upload_files = multer({
//   storage: multerS3({
//     s3,
//     acl: 'public-read',
//     bucket: process.env.S3_BUCKET,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//       const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
//       cb(null, `files/${file.originalname.split('.')[0]}_${fileName}${path.extname(file.originalname)}`);
//     },
//   }),
// });


// module.exports = {upload_case_docs,upload_employee_docs,upload_files};
