const mongoose = require('mongoose');

const returnOrderTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a return order type name'],
    unique: true,
    trim: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReturnOrderType', returnOrderTypeSchema);
