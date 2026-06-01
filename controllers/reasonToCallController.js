const ReasonToCall = require('../models/reasonToCallModel');

// @desc    Get all reason to calls (with pagination & search)
// @route   GET /api/reason-to-calls?page=1&limit=10&search=name
const getReasonToCalls = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const filter = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const [reasons, total] = await Promise.all([
      ReasonToCall.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      ReasonToCall.countDocuments(filter)
    ]);

    res.status(200).json({
      data: reasons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single reason to call
// @route   GET /api/reason-to-calls/:id
const getReasonToCall = async (req, res) => {
  try {
    const reason = await ReasonToCall.findById(req.params.id);
    if (!reason) return res.status(404).json({ message: 'Reason to call not found' });
    res.status(200).json(reason);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create reason to call
// @route   POST /api/reason-to-calls
const createReasonToCall = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Reason to call name is required' });
    }
    const reason = await ReasonToCall.create({ name });
    res.status(201).json(reason);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reason to call
// @route   PUT /api/reason-to-calls/:id
const updateReasonToCall = async (req, res) => {
  try {
    const reason = await ReasonToCall.findById(req.params.id);
    if (!reason) return res.status(404).json({ message: 'Reason to call not found' });
    const updated = await ReasonToCall.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete reason to call
// @route   DELETE /api/reason-to-calls/:id
const deleteReasonToCall = async (req, res) => {
  try {
    const reason = await ReasonToCall.findById(req.params.id);
    if (!reason) return res.status(404).json({ message: 'Reason to call not found' });
    await ReasonToCall.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Reason to call deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export all reason to calls (with optional search, no pagination)
// @route   GET /api/reason-to-calls/export?search=name
const exportReasonToCalls = async (req, res) => {
  try {
    const search = req.query.search || '';
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
    const reasons = await ReasonToCall.find(filter).sort({ createdAt: -1 });
    res.status(200).json(reasons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReasonToCalls, getReasonToCall, createReasonToCall, updateReasonToCall, deleteReasonToCall, exportReasonToCalls };
