const Movie = require('./../model/movieModel');
const User = require('./../model/userModel');
const Review = require('./../model/reviewModel');

const axios = require('axios');

exports.getOverview = async (req, res) => {
    try {

        const highIMDBRating = await Movie.aggregate([
            {
                $match: { ratings: { $gte: 7 } }
            },
            {
                $limit: 6
            },
            {
                $sort: { ratings: -1 }
            }
        ]);

        const action = await axios.get('https://metamovies.herokuapp.com/api/v1/movie?genre=action');
        const drama = await axios.get('https://metamovies.herokuapp.com/api/v1/movie?genre=drama');
        const comedy = await axios.get('https://metamovies.herokuapp.com/api/v1/movie?genre=comedy');
        const horror = await axios.get('https://metamovies.herokuapp.com/api/v1/movie?genre=horror');

        // console.log(drama);

        // find movies
        const movies = await Movie.find().populate('reviews');
        // send to template
        res.status(200).render('overview', {
            title: 'Home of Entertainment',
            movies,
            highIMDBRating,
            action,
            horror,
            comedy,
            drama
        });
    } catch (err) {
        res.status(200).json({
            status: 'error',
            message: err
        });
    }
};

exports.getMovie = async (req, res) => {
    // find movie
    const movie = await Movie.findOne({ slug: req.params.slug }).populate('reviews');
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
};

exports.subscriptionPage = (req, res) => {
    res.status(200).render('subscription', {
        title: 'Subscriptions'
    });
};

exports.signUpPage = (req, res) => {
    res.status(200).render('signup', {
        title: 'Subscriptions'
    });
};

exports.signInPage = (req, res) => {
    res.status(200).render('login', {
        title: 'Subscriptions'
    });
};

exports.errorPage = (req, res) => {
    res.status(200).render('404', {
        title: 'Subscriptions'
    });
};

exports.about = (req, res) => {
    res.status(200).render('about', {
        title: 'Subscriptions'
    });
};

exports.catalogue = async (req, res) => {
    const movies = await Movie.find();
    const genres = await axios.get('https://metamovies.herokuapp.com/api/v1/movie/genre');
    // console.log(genres.data.data.genArr);
    res.status(200).render('catalogue', {
        title: 'Catalogue',
        movies,
        genres
    });
};

exports.getMe = async (req, res) => {
    if (req.user.role == 'admin') {
        const movies = await Movie.find().populate('reviews');
        const users = await User.find();
        const reviews = await Review.find().populate('movie').populate('user');

        res.status(200).render('account', {
            title: 'My Account',
            movies,
            users,
            reviews
        });
    } else {
        res.status(200).render('account', {
            title: 'My Account'
        });
    }
};

exports.forgotPassword = (req, res) => {
    res.status(200).render('forgotPassword', {

    });
};

exports.test = (req, res) => {
    res.status(200).render('test', {

    });
};


exports.resetPasswordSet = async (req, res) => {
    res.status(200).render('resetPassword', {
        token: req.params.token
    });
};