const express = require('express');
const router = express.Router();
const streamController = require('./../controller/streamController');

router.get('/:slug', streamController.stream);

module.exports = router;
