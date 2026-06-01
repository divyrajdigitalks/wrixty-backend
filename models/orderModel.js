const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String },
  amount: { type: Number },
  quantity: { type: Number, default: 1 }
}, { _id: false });

const orderSchema = mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  name: {
    type: String,
    required: [true, 'Please add a customer name']
  },
  phone_number: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  products: {
    type: [orderProductSchema],
    default: []
  },
  // Kept for display
  product: { type: String },
  amount: { type: Number },
  quantity: { type: Number },
  grandTotal: { type: Number },
  paymentType: {
    type: String,
    enum: ['COD', 'Prepaid'],
    default: 'COD'
  },
  courier: { type: String },
  assginTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  transactionId: { type: String },
  status: {
    type: String,
    default: 'Dispatched'
  },
  isDeleted: { type: Boolean, default: false },
  deleteDate: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
