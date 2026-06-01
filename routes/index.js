const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const statusRoutes = require('./statusRoutes');
const returnOrderTypeRoutes = require('./returnOrderTypeRoutes');
const reasonToCallRoutes = require('./reasonToCallRoutes');
const roleRoutes = require('./roleRoutes');
const teamRoutes = require('./teamRoutes');
const authRoutes = require('./authRoutes');
const courierRoutes = require('./courierRoutes');
const uploadRoutes = require('./uploadRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/statuses', statusRoutes);
router.use('/return-order-types', returnOrderTypeRoutes);
router.use('/reason-to-calls', reasonToCallRoutes);
router.use('/roles', roleRoutes);
router.use('/teams', teamRoutes);
router.use('/auth', authRoutes);
router.use('/couriers', courierRoutes);
router.use('/upload', uploadRoutes);

// Future routes can be added here, e.g.:
// router.use('/leads', require('./leadRoutes'));

module.exports = router;
