const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  cod_dicount: {
    type: Number,
    default: 0
  },
  prepad_disocount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
