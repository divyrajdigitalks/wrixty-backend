const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  mobile_number: {
    type: String,
  },
  company_number: {
    type: String,
  },
  aadhar_card: {
    type: String,
  },
  check_photo: {
    type: String,
  },
  bank_number: {
    type: String,
  },
  roles: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
