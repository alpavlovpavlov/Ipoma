const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/pictures', (req, res) => {
    const uploadsDir = path.join(__dirname, '../static/uploads/pictures');

    fs.readdir(uploadsDir, { withFileTypes: true }, (err, files) => {
      if (err) {
      return res.status(500).send({ message: 'Cannot read files' });
    };

    const result = files
      .filter(f => f.isFile())
      .map(f => ({
        name: f.name,
        path: `upload/items/${f.name}`
    }));

    res.json(result);
  });
});

router.get('/drawings', (req, res) => {
  const uploadsDir = path.join(__dirname, '../static/uploads/drawings');

  fs.readdir(uploadsDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).send('Cannot read files');
    };

    const result = files
      .filter(f => f.isFile())
      .map(f => ({
        name: f.name,
        path: `uploads/imm/${f.name}`
    }));

    res.json(result);
  });
});

router.get('/data', (req, res) => {
    const uploadsDir = path.join(__dirname, '../static/data');

    fs.readdir(uploadsDir, { withFileTypes: true }, (err, files) => {
      if (err) {
      return res.status(500).json({ message: 'Cannot read files' });
    };

    const result = files
      .filter(f => f.isFile())
      .map(f => ({
        name: f.name,
        path: `data/${f.name}`
    }));

    res.json(result);
  });
});

module.exports = router;