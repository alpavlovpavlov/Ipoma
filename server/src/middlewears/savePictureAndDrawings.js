const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const extension = file.originalname.split('.').pop();

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

    const safeName = file.originalname
      .replace(/\.[^/.]+$/, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '')
    ;

    return {
      folder,
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
      public_id: `${Date.now()}-${safeName}.${extension}`,
    };
  }
});

const uploadPicturesAndDrawings = multer({ storage });

module.exports = uploadPicturesAndDrawings;