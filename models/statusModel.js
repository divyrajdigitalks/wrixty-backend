const mongoose = require('mongoose');

const statusSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a status name']
  },
  color: {
    type: String,
    required: [true, 'Please add a color'],
    default: '#3b82f6'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Status', statusSchema);
