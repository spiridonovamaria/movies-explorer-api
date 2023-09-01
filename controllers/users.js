require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/autherror');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUser(req, res, next) {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) return res.status(200).send(user);

      throw new NotFound('Пользователь не найден');
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
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      return res.status(201).send({
        email,
        name,
        _id,
      });
    })
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
  const { userId } = req.user;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.status(200).send(user);

      throw new NotFound('Пользователь не найден');
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные пользователя'));
      } else {
        next(error);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign({ userId }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

        // вернём токен
        return res.status(200).send({ token });
      }

      throw new Unauthorized('Неправильные почта или пароль');
    })
    .catch(next);
}

module.exports = {
  createUser,
  login,
  getUser,
  updateUser,
};
