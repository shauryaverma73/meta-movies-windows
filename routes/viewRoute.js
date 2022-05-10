const express = require('express');
const router = express.Router();
const Movie = require('./../model/movieModel');
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        // find movies
        const movies = await Movie.find();
        // send to template
        res.status(200).render('overview', {
            title: 'Home of Entertainment',
            movies
        });
    } catch (err) {
        console.log(err);
    }
});

router.get('/movie/:slug', async (req, res) => {
    // find movie
    const movie = await Movie.findOne({ slug: req.params.slug });
    // Highest IMDB Rated
    const highIMDBRating = await Movie.aggregate([
        {
            $match: { ratings: { $gte: 7 } }
        },
        {
            $limit: 4
        }
    ]);
    // get review only specific

    res.status(200).render('movieDetail', {
        title: movie.name,
        link: movie.movieLink,
        movie,
        highIMDBRating
    });
});


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



router.get('/buy-subscription', (req, res) => {
    res.status(200).render('subscription', {
        title: 'Subscriptions'
    });
});

router.get('/signup', (req, res) => {
    res.status(200).render('signup', {
        title: 'Subscriptions'
    });
});

router.get('/signin', (req, res) => {
    res.status(200).render('login', {
        title: 'Subscriptions'
    });
});

router.get('/404', (req, res) => {
    res.status(200).render('404', {
        title: 'Subscriptions'
    });
});

router.get('/about', (req, res) => {
    res.status(200).render('about', {
        title: 'Subscriptions'
    });
});

router.get('/catalogue', async (req, res) => {
    const movies = await Movie.find();
    const genres = await axios.get('http://127.0.0.1:3000/api/v1/movie/genre');
    // console.log(genres.data.data.genArr);
    res.status(200).render('catalogue', {
        title: 'Catalogue',
        movies,
        genres
    });
});

router.get('/me', async (req, res) => {
    res.status(200).render('account', {

    });
});




module.exports = router;