const express = require('express');
const router = express.Router();
const viewController = require('./../controller/viewController');
const authController = require('./../controller/authController');

router.get('/forgotPassword', viewController.forgotPassword);

router.get('/me', authController.protect, viewController.getMe);

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);

router.get('/movie/:slug', authController.protect, authController.checkSubscription, viewController.getMovie);


// router.get('/movie/:movieSlug', async (req, res) => {
//     try {
//         // find movie
//         // const movie = await Movie.findOne({ slug: req.params.slug });
//         // // Highest IMDB Rated
//         // const highIMDBRating = await Movie.aggregate([
//         //     {
//         //         $match: { rating: { $gte: 8 } }
//         //     },
//         //     {
//         //         $limit: 5
//         //     }
//         // ]);
//         res.status(200).render('movieDetail', {
//             title: 'Movie Name',
//             // movie,
//             // highIMDBRating
//         });
//     } catch (err) {
//         console.log(err);
//     }


// });



router.get('/buy-subscription', viewController.subscriptionPage);

router.get('/signup', viewController.signUpPage);

router.get('/signin', viewController.signInPage);

router.get('/404', viewController.errorPage);

router.get('/about', viewController.about);

router.get('/catalogue', viewController.catalogue);



router.get('/test', viewController.test);

module.exports = router;