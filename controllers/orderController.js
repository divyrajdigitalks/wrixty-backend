const Order = require('../models/orderModel');
const Lead = require('../models/leadModel');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 100, search = '', assginTo, status, courier, product } = req.query;
    const query = {
      isDeleted: { $ne: true },
      ...(search ? { name: { $regex: search, $options: 'i' } } : {})
    };
    if (assginTo) query.assginTo = assginTo;
    if (status) query.status = status;
    if (courier) query.courier = courier;
    if (product) query['products.productId'] = product;

    const orders = await Order.find(query)
      .populate('assginTo', 'name')
      .populate('leadId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments(query);

    res.status(200).json({
      data: orders,
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an order
// @route   PUT /api/orders/:id
// @access  Public
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an order (soft delete)
// @route   DELETE /api/orders/:id
// @access  Public
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await Order.findByIdAndUpdate(req.params.id, { isDeleted: true, deleteDate: new Date() });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrders, createOrder, updateOrder, deleteOrder };
