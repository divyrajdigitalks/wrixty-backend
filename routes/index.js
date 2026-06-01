const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const statusRoutes = require('./statusRoutes');
const returnOrderTypeRoutes = require('./returnOrderTypeRoutes');
const reasonToCallRoutes = require('./reasonToCallRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/statuses', statusRoutes);
router.use('/return-order-types', returnOrderTypeRoutes);
router.use('/reason-to-calls', reasonToCallRoutes);

// Future routes can be added here, e.g.:
// router.use('/leads', require('./leadRoutes'));

module.exports = router;

