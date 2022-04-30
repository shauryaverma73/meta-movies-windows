const express = require('express');
const router = express.Router();
const reviewController = require('./../controller/reviewController');

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.createReview);

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview);

module.exports = router;