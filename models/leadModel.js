const mongoose = require('mongoose');

const leadProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String },
  amount: { type: Number },
  quantity: { type: Number, default: 1 }
}, { _id: false });

const leadSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  phone_number: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  // Products array (separate objects)
  products: {
    type: [leadProductSchema],
    default: []
  },
  // Kept for backward compat / display
  product: { type: String },
  amount: { type: Number },
  quantity: { type: Number },
  // Store IDs for relational fields
  assgin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status'
  },
  reason_call: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReasonToCall'
  },
  note: { type: String },
  reminder: { type: String },
  orderStatus: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deleteDate: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
