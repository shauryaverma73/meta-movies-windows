const express = require('express');
const movieController = require('./../controller/movieController');
const router = express.Router();

router
    .route('/genre')
    .get(movieController.getAllGenre);

router
    .route('/')
    .get(movieController.getAllMovie)
    .post(movieController.addMovie);

router
    .route('/:id')
    .get(movieController.getMovieUsingId)
    .patch(movieController.updateMovie)
    .delete(movieController.deleteMovie);



module.exports = router;