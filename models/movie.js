const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const movieSchema = Schema({
  // страна создания фильма.
  country: {
    type: String,
    required: true,
  },
  // режиссёр фильма.
  director: {
    type: String,
    required: true,
  },
  // длительность фильма.
  duration: {
    type: Number,
    required: true,
  },
  // год выпуска фильма.
  year: {
    type: String,
    required: true,
  },
  // описание фильма.
  description: {
    type: String,
    required: true,
  },
  // ссылка на постер к фильму.
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },
  // ссылка на трейлер фильма.
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },
  // мини изображение постера к фильму.
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },
  // ID пользователя, который сохранил фильм.
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true,
  },
  // ID фильма, который содержится в ответе сервиса MoviesExplorer.
  movieId: {
    type: Number,
    required: true,
  },
  // название фильма на русском языке.
  nameRU: {
    type: String,
    required: true,
  },
  // название фильма на английском языке.
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
