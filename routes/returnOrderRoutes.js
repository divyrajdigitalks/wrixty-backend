const express = require('express');
const router = express.Router();
const {
  getReturnOrders,
  getReturnOrderById,
  createReturnOrder,
  updateReturnOrder,
  deleteReturnOrder,
  getStaffReturnStats
} = require('../controllers/returnOrderController');

router.route('/')
  .get(getReturnOrders)
  .post(createReturnOrder);

router.route('/stats/staff')
  .get(getStaffReturnStats);

router.route('/:id')
  .get(getReturnOrderById)
  .put(updateReturnOrder)
  .delete(deleteReturnOrder);

module.exports = router;
