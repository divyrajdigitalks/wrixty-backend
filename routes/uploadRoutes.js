const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadToExternalAPI } = require('../middlewares/uploadMiddleware');

// @desc    Upload file to premium CDN
// @route   POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = await uploadToExternalAPI(req.file, 'wrixty', 'users');
    if (!fileUrl) {
      return res.status(500).json({ message: 'Failed to upload file to premium CDN service' });
    }

    res.status(200).json({ file_url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
