const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {

    let folder = 'ipoma/other';

    if (file.fieldname == 'image') {
      folder = 'ipoma/items';
    }

    if (file.fieldname == 'tds') {
      folder = 'ipoma/drawings/item/tds';
    }

    if (file.fieldname == 'itemDrawing') {
      folder = 'ipoma/drawings/item';
    }

    if (file.fieldname == 'immDrawing') {
      folder = 'ipoma/drawings/imm';
    }

    if (file.fieldname == 'moldDrawing') {
      folder = 'ipoma/drawings/mold';
    }

    return {
      folder,
      resource_type: 'auto',
      public_id: `${Date.now()}-${file.originalname}`
    };
  }
});

const uploadPicturesAndDrawings = multer({ storage });

module.exports = uploadPicturesAndDrawings;