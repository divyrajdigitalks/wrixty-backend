const mongoose = require('mongoose');

const reasonToCallSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a reason to call name'],
    unique: true,
    trim: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReasonToCall', reasonToCallSchema);
