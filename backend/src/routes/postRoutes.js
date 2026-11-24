const express = require('express');
const { list, featured } = require('../controllers/postController');
const { toggle, status } = require('../controllers/likeController');
const { rate, getUserRating } = require('../controllers/ratingController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', list);
router.get('/featured', featured);

router.post('/:postId/like', protect, toggle);
router.get('/:postId/like', protect, status);

router.post('/:postId/rate', protect, rate);
router.get('/:postId/rate', protect, getUserRating);

module.exports = router;
