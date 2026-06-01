const mongoose = require('mongoose');

const courierSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a courier name'],
    unique: true,
    trim: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Courier', courierSchema);
