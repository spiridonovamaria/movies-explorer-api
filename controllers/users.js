require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');

const { CREATED_CODE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../utils/constants');

function getUser(req, res, next) {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные пользователя'));
      } else {
        next(error);
      }
    });
}

function createUser(req, res, next) {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(CREATED_CODE).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch((error) => {
      if (error.code === 11000) {
        next(new Conflict('Пользователь уже существует'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании аккаунта'));
      } else {
        next(error);
      }
    });
}

function updateUser(req, res, next) {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new Conflict('Пользователь уже существует'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(error);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
}
module.exports = {
  createUser,
  login,
  getUser,
  updateUser,
};
