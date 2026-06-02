const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user']
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  action: {
    type: String,
    required: [true, 'Please add an action']
  },
  message: {
    type: String,
    required: [true, 'Please add a message']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
