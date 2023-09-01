const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFound = require('../errors/NotFound');
const { validateSignin, validateSignup } = require('../middlewares/validation');

router.post('/signin', validateSignin, login);
router.post('/signup', validateSignup, createUser);
router.use(auth, usersRouter);
router.use(auth, moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
