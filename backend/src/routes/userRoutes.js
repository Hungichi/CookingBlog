const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  getMyProfile,
  getUserProfile,
  updateMyProfile,
} = require('../controllers/userController');

const router = express.Router();


// '/me' phai dat truoc '/:id/ khong bi hieu la mot id
router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/:id', getUserProfile);

module.exports = router;