const express = require('express');
const router = express.Router();
const videoController = require('./../controller/videoController');

router.get('/video/:slug', videoController.sendStream);

module.exports = router;