const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');
const { listReports, updateReport, deleteReport } = require('../controllers/reportController');

const router = express.Router();

// moi route admin deu phai dang nhap + role admin
router.use(protect, adminOnly);

router.get('/reports', listReports);
router.patch('/reports/:id', updateReport);
router.delete('/reports/:id', deleteReport);

module.exports = router;
