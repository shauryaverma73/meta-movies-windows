const express = require('express');
const router = express.Router();
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, reviewController.createReview); // authController.restrictTo('user')

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview);

module.exports = router;