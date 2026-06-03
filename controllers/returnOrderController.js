const ReturnOrder = require('../models/returnOrderModel');

// @desc    Get all return orders
// @route   GET /api/return-orders
// @access  Public
const getReturnOrders = async (req, res) => {
  try {
    const { page = 1, limit = 100, search = '', assginTo, product, startDate, endDate } = req.query;
    const query = { isDeleted: { $ne: true } };

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone_number: { $regex: search, $options: 'i' } }
      ];
    }
    if (assginTo && assginTo !== 'all') query.assginTo = assginTo;
    if (product && product !== 'all') query['products.name'] = { $regex: product, $options: 'i' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const returnOrders = await ReturnOrder.find(query)
      .populate('assginTo', 'name')
      .populate('orderId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await ReturnOrder.countDocuments(query);

    res.status(200).json({
      data: returnOrders,
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a return order
// @route   POST /api/return-orders
// @access  Public
const createReturnOrder = async (req, res) => {
  try {
    const returnOrder = await ReturnOrder.create(req.body);
    res.status(201).json(returnOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a return order
// @route   PUT /api/return-orders/:id
// @access  Public
const updateReturnOrder = async (req, res) => {
  try {
    const returnOrder = await ReturnOrder.findById(req.params.id);
    if (!returnOrder) return res.status(404).json({ message: 'Return order not found' });

    const updated = await ReturnOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a return order
// @route   DELETE /api/return-orders/:id
// @access  Public
const deleteReturnOrder = async (req, res) => {
  try {
    const returnOrder = await ReturnOrder.findById(req.params.id);
    if (!returnOrder) return res.status(404).json({ message: 'Return order not found' });

    await ReturnOrder.findByIdAndUpdate(req.params.id, { isDeleted: true, deleteDate: new Date() });
    res.status(200).json({ message: 'Return order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get return order by ID
// @route   GET /api/return-orders/:id
// @access  Public
const getReturnOrderById = async (req, res) => {
  try {
    const returnOrder = await ReturnOrder.findById(req.params.id)
      .populate('assginTo', 'name')
      .populate('orderId');
      
    if (!returnOrder) return res.status(404).json({ message: 'Return order not found' });
    
    res.status(200).json(returnOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get staff return order stats
// @route   GET /api/return-orders/stats/staff
// @access  Public
const getStaffReturnStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const User = require('../models/userModel');
    const users = await User.find({ isDeleted: { $ne: true } }).select('_id name');
    
    const matchStage = { isDeleted: { $ne: true } };
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchStage.createdAt.$lte = end;
      }
    }
    
    const returnOrders = await ReturnOrder.aggregate([
      { $match: matchStage },
      { $group: { _id: "$assginTo", returns: { $sum: 1 } } }
    ]);

    const returnMap = {};
    returnOrders.forEach(ro => {
      if (ro._id) returnMap[ro._id.toString()] = ro.returns;
    });

    const stats = users.map(user => ({
      id: user._id,
      name: user.name,
      returns: returnMap[user._id.toString()] || 0
    }));

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportReturnOrders = async (req, res) => {
  try {
    const { search = '', assginTo, product, startDate, endDate } = req.query;
    const query = { isDeleted: { $ne: true } };

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone_number: { $regex: search, $options: 'i' } }
      ];
    }
    if (assginTo && assginTo !== 'all') query.assginTo = assginTo;
    if (product && product !== 'all') query['products.name'] = { $regex: product, $options: 'i' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const returnOrders = await ReturnOrder.find(query)
      .populate('assginTo', 'name')
      .populate('orderId')
      .sort({ createdAt: -1 });

    res.status(200).json(returnOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReturnOrders, getReturnOrderById, createReturnOrder, updateReturnOrder, deleteReturnOrder, getStaffReturnStats, exportReturnOrders };
