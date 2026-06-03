const express = require('express');
const router = express.Router();
const {
  getReturnOrders,
  getReturnOrderById,
  createReturnOrder,
  updateReturnOrder,
  deleteReturnOrder,
  getStaffReturnStats,
  exportReturnOrders
} = require('../controllers/returnOrderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getReturnOrders)
  .post(protect, createReturnOrder);

router.route('/stats/staff')
  .get(protect, getStaffReturnStats);

router.route('/export')
  .get(exportReturnOrders);

router.route('/:id')
  .get(protect, getReturnOrderById)
  .put(protect, updateReturnOrder)
  .delete(protect, deleteReturnOrder);

module.exports = router;
