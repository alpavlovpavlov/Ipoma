const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {

    let folder = 'ipoma/other';

    if (file.fieldname == 'image') {
      folder = 'ipoma/items/images';
    }

    if (file.fieldname == 'tds') {
      folder = 'ipoma/items/tds';
    }

    if (file.fieldname == 'itemDrawing') {
      folder = 'ipoma/items/drawings';
    }

    if (file.fieldname == 'immDrawing') {
      folder = 'ipoma/imms/drawings';
    }

    if (file.fieldname == 'moldDrawing') {
      folder = 'ipoma/molds/drawings';
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