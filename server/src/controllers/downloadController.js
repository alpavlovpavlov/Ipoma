const router = require('express').Router();
const path = require('path');

const { parseError } = require('../utils/parser');

router.get('/mold/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, `../static/uploads/drawings/mold/${fileName}`);

    try {
        res.download(filePath);
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    };
});

router.get('/item/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, `../static/uploads/drawings/item/${fileName}`);

    try {
        res.download(filePath);
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    };
});

router.get('/item/tds/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, `../static/uploads/drawings/item/tds/${fileName}`);

    try {
        res.download(filePath);
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    };
});

router.get('/imm/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, `../static/uploads/drawings/imm/${fileName}`);

    try {
        res.download(filePath);
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    };
});

module.exports = router;