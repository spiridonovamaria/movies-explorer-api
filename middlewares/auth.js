const jwt = require('jsonwebtoken');
const { JWT_SECRET_DEV } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
const Unauthorized = require('../errors/autherror');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new Unauthorized('Необходима авторизация'));
  }
  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
    );
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;

  return next();
};
