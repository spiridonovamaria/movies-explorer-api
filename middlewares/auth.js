const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/AuthenticationError');
const { JWT_SECRET_DEV } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthenticationError('Неправильные почта или пароль');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
    );
  } catch (err) {
    next(new AuthenticationError('Неправильные почта или пароль'));
    return;
  }
  req.user = payload;
  next();
};
