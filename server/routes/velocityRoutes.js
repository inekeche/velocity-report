const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage
const { uploadAndAnalyze } = require('../controllers/velocityController');

router.post('/analyze', upload.single('file'), uploadAndAnalyze);

module.exports = router;