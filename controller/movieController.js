const Movie = require('./../model/movieModel');
const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/movies');
    },
    filename: (req, file, cb) => {
        // user-currentTime
        const ext = file.mimetype.split('/')[1];
        cb(null, `movie-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video')) {
        cb(null, true);
    } else {
        cb(null, false, req.typeError = 'Please upload video files only');
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadMovie = upload.single('movieLink');

exports.getAllMovie = async (req, res, next) => {
    try {
        const queryObject = { ...req.query };

        if (queryObject.genre) {
            queryObject.genre = queryObject.genre.replace(/\b\w/g, c => c.toUpperCase());
        }

        let queryStr = JSON.stringify(queryObject);

        queryStr = queryStr.replace(/\b(gte|lte|gt|lt|eq)\b/g, match => `$${match}`);

        console.log(queryStr);

        // queryStr = queryStr.limit(req.query.limit);

        const query = Movie.find(JSON.parse(queryStr)).populate('reviews');

        // pagination
        // const page = req.params.page * 1 | 1;
        // const limit = req.params.limit * 1 | 100;
        // const skip = (page - 1) * limit;

        // query = query.skip(skip).limit(limit);


        const movies = await query;
        if (movies) {
            res.status(201).json({
                status: 'success',
                data: {
                    movies
                }
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Error with create method'
            });
        }
    } catch (err) {
        console.log(err);
    }
};


exports.getMovieUsingId = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('reviews');
        if (movie) {
            res.status(200).json({
                status: 'success',
                data: {
                    movie
                }
            });
        }
        else {
            res.status(200).json({
                status: 'error',
                message: 'Movie not Found'
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.addMovie = async (req, res) => {
    try {
        if (req.file) {
            req.body.movieLink = req.file.filename;
        }
        req.body.genre = req.body.genre.split(',');
        const movie = await Movie.create(req.body);
        if (movie) {
            res.status(200).json({
                status: 'success',
                data: {
                    movie
                }
            });
        } else {
            res.status(200).json({
                status: 'error',
                message: 'Can\'t add movie.'
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.updateMovie = async (req, res) => {
    try {
        if (req.file) {
            req.body.movieLink = req.file.filename;
        }
        req.body.genre = req.body.genre.split(',');
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body);
        if (movie) {
            res.status(200).json({
                status: 'success',
                data: {
                    movie
                }
            });
        } else {
            res.status(200).json({
                status: 'error',
                message: 'Can\'t update movie.'
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (movie) {
            res.status(200).json({
                status: 'success',
                message: 'Movie Deleted'
            });
        } else {
            res.status(200).json({
                status: 'error',
                message: 'Can\'t delete movie.'
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.getAllGenre = async (req, res, next) => {
    try {
        const movies = await Movie.find();
        let genreSet = new Set();
        movies.forEach((el) => {
            el.genre.forEach((gen) => {
                genreSet.add(gen);
            });
        });

        const genArr = Array.from(genreSet);

        // console.log(genArr);

        if (genArr) {
            res.status(201).json({
                status: 'success',
                data: {
                    genArr
                }
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Error with create method'
            });
        }
    } catch (err) {
        console.log(err);
    }
};




exports.latestMovies = (req, res) => {

};

exports.trendingMovies = (req, res) => {

};

exports.getMovieUsingGenre = (req, res) => {

};
