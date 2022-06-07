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
    .get(authController.protect, reviewController.getReview)
    .delete(authController.protect, reviewController.deleteReview)
    .patch(authController.protect, reviewController.updateReview);

module.exports = router;