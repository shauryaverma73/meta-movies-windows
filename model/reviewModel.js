const mongoose = require('mongoose');
const Movie = require('./movieModel');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review belongs to a user']
    },
    movie: {
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
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// reviewSchema.pre(/^find/, function (next) {
//     this.populate('movie', 'name').populate('user', 'name profilePicture');
//     next();
// });


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;