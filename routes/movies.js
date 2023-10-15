const movieRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  createMovieValidator,
  deleteMovieValidator,
} = require('../middlewares/validation');

// Маршрут для получения фильмов
movieRouter.get('/movies', getMovies);

// Маршрут создания нового фильма
movieRouter.post('/movies', createMovieValidator, createMovie);

// Маршрут для удаления фильма
movieRouter.delete('/movies/:movieId', deleteMovieValidator, deleteMovie);

module.exports = movieRouter;
