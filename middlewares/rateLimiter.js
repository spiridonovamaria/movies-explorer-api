const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  max: 120,
  windowMS: 50000,
  message: 'Превышено количество запросов на сервер. Попробуйте повторить немного позже',
});

module.exports = limiter;
