const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');

// Mount routes
router.use('/users', userRoutes);

// Future routes can be added here, e.g.:
// router.use('/auth', require('./authRoutes'));
// router.use('/products', require('./productRoutes'));

module.exports = router;
