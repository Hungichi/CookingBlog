const express = require('express');
const rateLimit = require('express-rate-limit');
const { register } = require('../controllers/authController');

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

router.post('/register', registerLimiter, register);

module.exports = router;