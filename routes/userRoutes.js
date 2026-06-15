const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', protect, getUsers);
router.get('/:id', getUser);
router.post('/', protect, upload.single('check_photo'), createUser);
router.put('/:id', protect, upload.single('check_photo'), updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
