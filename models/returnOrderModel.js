const mongoose = require('mongoose');

const returnOrderSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  customerName: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  assginTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    default: 'RTO'
  },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    amount: Number,
    quantity: Number,
    subtotal: Number
  }],
  amount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deleteDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReturnOrder', returnOrderSchema);
