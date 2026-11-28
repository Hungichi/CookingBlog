const express = require('express');
const { list, featured } = require('../controllers/postController');

const router = express.Router();

router.get('/', list);
router.get('/featured', featured);

module.exports = router;
