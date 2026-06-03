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
  .get(getReturnOrders)
  .post(createReturnOrder);

router.route('/stats/staff')
  .get(getStaffReturnStats);

router.route('/export')
  .get(exportReturnOrders);

router.route('/:id')
  .get(getReturnOrderById)
  .put(updateReturnOrder)
  .delete(deleteReturnOrder);

module.exports = router;
