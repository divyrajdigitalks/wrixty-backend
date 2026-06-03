const express = require('express');
const router = express.Router();
const { getOrders, createOrder, updateOrder, deleteOrder, exportOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.route('/export')
  .get(protect, exportOrders);

router.route('/:id')
  .put(protect, updateOrder)
  .delete(protect, deleteOrder);

module.exports = router;
