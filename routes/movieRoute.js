const express = require('express');
const movieController = require('./../controller/movieController');
const router = express.Router();

router
    .route('/')
    .get(movieController.getAllMovie)
    .post(movieController.addMovie);

router
    .route('/:id')
    .get(movieController.getMovieUsingId)
    .patch(movieController.updateMovie)
    .delete(movieController.deleteMovie);

// router.get('/api/v1/movie/movieGenres/:genre', movieController.movieGenre);

// router.get('/api/v1/movie/latestMovies', movieController.latestMovies);

// router.get('/api/v1/movie/trendingMovies', movieController.trendingMovies);

module.exports = router;