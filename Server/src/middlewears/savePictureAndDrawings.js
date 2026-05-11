const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';

    if (file.fieldname == 'image') {
      uploadPath = "../static/uploads/items";
    }

    if (file.fieldname == 'tds') {
      uploadPath = "../static/uploads/drawings/item/tds";
    }

    if (file.fieldname == 'itemDrawing') {
      uploadPath = "../static/uploads/drawings/item";
    }

    if (file.fieldname == 'immDrawing') {
      uploadPath = "../static/uploads/drawings/imm";
    }

    if (file.fieldname == 'moldDrawing') {
      uploadPath = "../static/uploads/drawings/mold";
    }

    cb(null, path.join(__dirname, uploadPath));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

const uploadPicturesAndDrawings = multer({ storage });

module.exports = uploadPicturesAndDrawings;