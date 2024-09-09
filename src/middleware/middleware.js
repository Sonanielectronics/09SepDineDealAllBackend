var multer = require("multer");

var path = require("path");

const MIME_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_SIZE = 1024 * 1024 * 5;
const upload = multer({
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.upload_error = true;
      cb(new Error("Only .png, .jpg, or .jpeg format allowed!"));
    }
  }, 
});

module.exports = { upload };