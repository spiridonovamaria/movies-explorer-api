const Movie = require('../models/movie');

const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');

const getInitialMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

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
  } = req.body;
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
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFound('Запрашиваемое кино не найдено');
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id === owner) {
        Movie.deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      } else {
        throw new Forbidden('Удаление запрещено');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest(
            'Переданы некорректные данные для удаления фильма',
          ),
        );
      } else {
        next(err);
      }
    });
}
module.exports = {
  getInitialMovies,
  addMovie,
  deleteMovie,
};
