const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a team name'],
    unique: true,
    trim: true,
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please select a team head']
  },
  member: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
