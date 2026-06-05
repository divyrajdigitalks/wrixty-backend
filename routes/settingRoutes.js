const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/')
  .get(getSettings)
  .put(protect, upload.single('appLogo'), updateSettings);

module.exports = router;
