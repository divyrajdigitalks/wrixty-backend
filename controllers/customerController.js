const Customer = require('../models/customerModel');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Public
const getCustomers = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const query = {
      isDeleted: { $ne: true },
      ...(search ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { phone_number: { $regex: search, $options: 'i' } }
        ]
      } : {})
    };
    
    const customers = await Customer.find(query).sort({ createdAt: -1 });
      
    res.status(200).json({
      data: customers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a customer
// @route   POST /api/customers
// @access  Public
const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Public
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Public
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await Customer.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
