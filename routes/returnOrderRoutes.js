const express = require('express');
const router = express.Router();
const {
  getReturnOrders,
  createReturnOrder,
  updateReturnOrder,
  deleteReturnOrder
} = require('../controllers/returnOrderController');

router.route('/')
  .get(getReturnOrders)
  .post(createReturnOrder);

router.route('/:id')
  .put(updateReturnOrder)
  .delete(deleteReturnOrder);

module.exports = router;
