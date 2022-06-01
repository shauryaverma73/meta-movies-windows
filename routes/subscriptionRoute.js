const express = require('express');
const subscriptionController = require('../controller/subscriptionController');
const authController = require('../controller/authController');
const router = express.Router();

router.get('/premium/checkout-session', authController.protect, subscriptionController.checkoutPremiumSubscription);
router.get('/cinematic/checkout-session', authController.protect, subscriptionController.checkoutCinematicSubscription);

module.exports = router;