const mongoose = require('mongoose');
const slugify = require('slugify');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A movie must have name'],
        unique: true,
        trim: true
        // validate: [validator.isAlpha, 'Movie name must be in character.']
    },
    slug: String,
    runTime: {
        type: Number,
        required: [true, 'A Movie must have duration']
    },
    ratings: {
        type: Number,
        min: [1, 'A movie rating must be above 1.'],
        max: [10, 'A movie rating must be less than 10.']
    },
    description: {
        type: String,
        required: [true, 'A movie must have a description'],
        trim: true
    },
    poster: {
        type: String
    },
    year: {
        type: Number,
        required: [true, 'Movie must have launch Year']
    },
    movieLink: {
        type: String,
        required: [true, 'A movie must have a link'],
        trim: true
    },
    trailerLink: {
        type: String,
        required: [true, 'A movie must have trailer'],
        trim: true            // removing spaces at start and end from the input
    },
    stars: [String],
    genre: {
        type: [String],
        required: [true, 'A movie must have genre']
    },
    language: {
        type: String
    },
    pgRating: {
        type: String
    },
    backdrop: {
        type: String
    }
    // comments: {
    //     type: mongoose.isValidObjectId.SchemaId,
    //     ref: 'Comments'
    // }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// setting slug and path of tmdb pics
movieSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    this.poster = process.env.TMDB_PICTURE_PATH + this.poster;
    this.backdrop = process.env.TMDB_PICTURE_PATH + this.backdrop;
    next();
});


const Movie = mongoose.model('movie', movieSchema);
module.exports = Movie;