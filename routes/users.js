const router = require('express').Router();
const { validateGetUser, validateUpdateUser } = require('../middlewares/validation');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', validateGetUser, getUser);
router.patch('/users/me', validateUpdateUser, updateUser);

module.exports = router;
