const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

// Маршруты для пользователей и фильмов
const userRouter = require('./users');
const movieRouter = require('./movies');

const {
  loginValidator,
  createUserValidator,
} = require('../middlewares/validation');

const NotFoundError = require('../errors/NotFoundError ');

// Маршрут регистрации пользователя
router.post('/signup', createUserValidator, createUser);

// Маршрут входа пользователя
router.post('/signin', loginValidator, login);

router.use(auth);

router.use('/', userRouter);
router.use('/', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
