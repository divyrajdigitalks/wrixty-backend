const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  phone_number: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true
  },
  isDeleted: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
