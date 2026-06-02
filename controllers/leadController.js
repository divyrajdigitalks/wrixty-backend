const Lead = require('../models/leadModel');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Public
const getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', assgin, status, reason_call, product } = req.query;
    const query = {
      isDeleted: { $ne: true },
      ...(search ? { name: { $regex: search, $options: 'i' } } : {})
    };
    if (assgin) query.assgin = assgin;
    if (status) query.status = status;
    if (reason_call) query.reason_call = reason_call;
    if (product) query['products.productId'] = product;
    
    const leads = await Lead.find(query)
      .populate('assgin', 'name')
      .populate('status', 'name color')
      .populate('reason_call', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const count = await Lead.countDocuments(query);
    
    res.status(200).json({
      data: leads,
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Public
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a lead (soft delete)
// @route   DELETE /api/leads/:id
// @access  Public
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    await Lead.findByIdAndUpdate(req.params.id, { isDeleted: true, deleteDate: new Date() }, { new: true });
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead
};
