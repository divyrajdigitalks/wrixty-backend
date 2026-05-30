const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');

// GET /api/users
router.get('/', getUsers);

// POST /api/users
router.post('/', createUser);

module.exports = router;
