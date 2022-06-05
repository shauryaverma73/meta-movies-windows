const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const router = express.Router();


// For All Users
router
    .route('/signup')
    .post(authController.signUp);

router
    .route('/login')
    .post(authController.login);

router
    .route('/forgotPassword')
    .post(authController.forgotPassword);

router
    .route('/resetPassword/:token')
    .patch(authController.resetPassword);

// Protected Routes
router.use(authController.protect);


// User Logged in
// protected routes must be logged in (protect middleware)

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/logout', authController.logout);

router
    .route('/me')
    .get(userController.getMe);

router
    .route('/updateMyPassword')
    .patch(authController.updatePassword);

router
    .route('/updateMe')
    .patch(userController.updateMe);

router
    .route('/updatePicture')
    .patch(userController.uploadUserPhoto, userController.saveUserPhoto);

router
    .route('/deleteMe')
    .delete(userController.deleteMe);

router
    .route('/addToWatchlist/:movieId')
    .put(userController.addToWatchList);

router
    .route('/removeFromWatchList/:movieId')
    .delete(userController.removeFromWatchList);


// ADMIN ONLY
// restriction middleware
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUserUsingId)
    .post(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;