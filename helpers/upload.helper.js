exports.imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF extensions are allowed!'), false);
    }
    cb(null, true);
}