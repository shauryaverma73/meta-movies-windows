const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const router = express.Router();


// For All Users

router
    .route('/signup')
    .post(authController.signUp); //authcontroller
router.post('/login', authController.login);//authcontroller
router.get('/logout', authController.logout);//authcontroller

// router.post('forgotPassword',); //authcontroller 
// router.patch('resetPassword/:token',); //authcontroller 

// User Logged in
// protected routes must be logged in (protect middleware)
router
    .route('/me')
    .get(userController.getMe);

router
    .route('/updateMyPassword')
    .patch(userController.updateMyPassword);

router
    .route('/updateMe')
    .patch(userController.updateMe);

router
    .route('/deleteMe')
    .patch(userController.deleteMe);


// ADMIN ONLY
// restriction middleware
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