const router = require('express').Router();
const { validateAddMovie, validateDeleteMovie } = require('../middlewares/validation');

const {
  getInitialMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getInitialMovies);
router.post('/movies', validateAddMovie, addMovie);
router.delete('/movies/:_id', validateDeleteMovie, deleteMovie);

module.exports = router;
