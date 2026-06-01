const Role = require('../models/roleModel');

// @desc    Get all roles (with pagination & search)
// @route   GET /api/roles?page=1&limit=10&search=name
const getRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const filter = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const [roles, total] = await Promise.all([
      Role.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Role.countDocuments(filter)
    ]);

    res.status(200).json({
      data: roles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single role
// @route   GET /api/roles/:id
const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create role
// @route   POST /api/roles
const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Role name is required' });
    }
    const role = await Role.create({ name, permissions: permissions || {} });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
const updateRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    const updated = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    await Role.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export all roles (with optional search, no pagination)
// @route   GET /api/roles/export?search=name
const exportRoles = async (req, res) => {
  try {
    const search = req.query.search || '';
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
    const roles = await Role.find(filter).sort({ createdAt: -1 });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRoles, getRole, createRole, updateRole, deleteRole, exportRoles };
