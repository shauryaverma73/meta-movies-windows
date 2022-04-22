const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review belongs to a user']
    },
    movieID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Movie',
        required: [true, 'review belongs to a movie']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    reviewTitle: {
        type: String,
        required: [true, 'review title not be empty']
    },
    reviewContent: {
        type: String,
        required: [true, 'review must not be empty']
    },
    reviewRating: {
        type: Number,
        min: 1,
        max: 10
    }
});

const Review = mongoose.model('Reviews', reviewSchema);
module.exports = Review;