const express = require('express');
const router = express.Router();
const reviewController = require('./../controller/reviewController');

router
    .route('/')
    .get();

module.exports = router;