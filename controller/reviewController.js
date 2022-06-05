const Review = require('./../model/reviewModel');
const Movie = require('./../model/movieModel');
const User = require('./../model/userModel');
exports.setTourUserIds = (req, res, next) => {    // used for review creation
    if (!req.body.tour) {   // if tour is not found in the body then param is used
        req.body.tour = req.params.tourId;
    }
    if (!req.body.user) {  // if user is not set then took from the user set by protect middleware
        req.body.user = req.user.id;
    }
    next();
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({
            status: 'success',
            result: reviews.length,
            data: {
                data: reviews
            }
        });
    } catch (err) {
        console.log(err);
    }
};

exports.createReview = async (req, res) => {
    try {
        console.log(req.body);
        const review = await Review.create(req.body);
        const movie = await Movie.findById(req.body.movie);
        const user = await User.findById(req.body.user);

        movie.reviews.push(review.id);
        await movie.save({ validateBeforeSave: false });

        user.reviews.push(review.id);
        await user.save({ validateBeforeSave: false });

        res.status(201).json({
            status: 'success',
            data: {
                data: review
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
};

exports.getReview = async (req, res) => {
    try {
        const review = await Review.findOne({ id: req.params.id });
        res.status(200).json({
            status: 'success',
            data: {
                data: review
            }
        });
    } catch (err) {
        console.log(err);
    }
};

exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                data: review
            }
        });
    } catch (err) {
        console.log(err);
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndRemove(req.params.id);
        res.status(200).json({
            status: 'success',
            message: 'review deleted successfully'
        });
    } catch (err) {
        console.log(err);
    }
};