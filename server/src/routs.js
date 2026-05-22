const router = require('express').Router();

const itemController = require('./controllers/itemController');
const moldController = require('./controllers/moldController');
const authController = require('./controllers/authController');
const fileController = require('./controllers/fileController');
const mailController = require('./controllers/mailController');
const immController = require('./controllers/immController');
const optionController = require('./controllers/optionController');
const downloadController = require('./controllers/downloadController');

router.use('/itemData', itemController);
router.use('/moldData', moldController);
router.use('/immData', immController);
router.use('/users', authController);
router.use('/files', fileController);
router.use('/api', mailController);
router.use('/options', optionController);

router.use((req, res) => {
    res.status(404).json({ message: 'Rout not found' })
})

module.exports = router;
