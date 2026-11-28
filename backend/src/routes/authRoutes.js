const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middlewares/authMiddleware');
const {
  register, login, logout, forgotPassword, resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// chan spam (max 20 lan va 15 phut voi moi IP)
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Bạn thử quá nhiều lần, vui lòng quay lại sau ít phút',
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Bạn thử đăng nhập quá nhiều lần, vui lòng quay lại sau ít phút',
  },
});

const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Bạn yêu cầu quá nhiều lần, vui lòng quay lại sau ít phút',
  },
});

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotLimiter, forgotPassword);
router.post('/reset-password', forgotLimiter, resetPassword);

module.exports = router;