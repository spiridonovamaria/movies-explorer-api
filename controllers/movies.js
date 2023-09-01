const Movie = require('../models/movie');

const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');

function getInitialMovies(req, res, next) {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
}

function addMovie(req, res, next) {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.user;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные при создании фильма'),
        );
      } else {
        next(error);
      }
    });
}

function deleteMovie(req, res, next) {
  const { id: movieId } = req.params;
  const { userId } = req.user;
  Movie.findById({ _id: movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Запрашиваемое кино не найдено');
      }

      const { owner: movieOwnerId } = movie;
      if (movieOwnerId.valueOf() !== userId) {
        throw new Forbidden('Удаление запрещено');
      }

      return Movie.findByIdAndDelete(movieId);
    })
    .then((deleted) => {
      if (!deleted) {
        throw new NotFound('Кино удалено');
      }

      res.send({ data: deleted });
    })
    .catch(next);
}

module.exports = {
  getInitialMovies,
  addMovie,
  deleteMovie,
};
