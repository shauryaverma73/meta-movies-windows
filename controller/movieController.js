const Movie = require('./../model/movieModel');

exports.getAllMovie = async (req, res, next) => {
    try {
        const queryObject = { ...req.query };
        
        queryObject.genre = queryObject.genre.replace(/\b\w/g, c => c.toUpperCase());

        let queryStr = JSON.stringify(queryObject);

        queryStr = queryStr.replace(/\b(gte|lte|gt|lt|eq)\b/g, match => `$${match}`);

        console.log(queryStr);

        const query = Movie.find(JSON.parse(queryStr));

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
        const movie = await Movie.findById(req.params.id);
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

exports.latestMovies = (req, res) => {

};

exports.trendingMovies = (req, res) => {

};

exports.getMovieUsingGenre = (req, res) => {

};
