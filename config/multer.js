const multer = require('multer');
const path = require('path');

// Define storage options
const storage = multer.diskStorage({
  // Specify destination folder where the files will be stored
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 'uploads' folder
  },
  // Define the file name when saving the file
  filename: (req, file, cb) => {
    // Get file extension
    const ext = path.extname(file.originalname);
    // Use timestamp to avoid filename conflicts
    cb(null, Date.now() + ext);
  }
});

// Set file upload limits and allowed file types
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|jpeg|png|gif|bmp/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    
    if (extName && mimeType) {
      return cb(null, true); // Accept the file
    } else {
      cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, bmp).'), false);
    }
  }
});

module.exports = upload;
