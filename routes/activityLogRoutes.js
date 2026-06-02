const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLogController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getActivityLogs);

module.exports = router;
