const userRouter = require('express').Router();

const {
  getCurrentUserInfo,
  editProfileUserInfo,
} = require('../controllers/users');
const {
  getCurrentUserInfoValidator,
  editProfileUserInfoValidator,
} = require('../middlewares/validation');

userRouter.get('/users/me', getCurrentUserInfoValidator, getCurrentUserInfo);

userRouter.patch(
  '/users/me',
  editProfileUserInfoValidator,
  editProfileUserInfo,
);

module.exports = userRouter;
