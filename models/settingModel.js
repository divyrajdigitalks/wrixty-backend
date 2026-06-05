const mongoose = require('mongoose');

const settingSchema = mongoose.Schema({
  appName: {
    type: String,
    default: "CRM"
  },
  appLogo: {
    type: String,
    default: ""
  },
  appIcon: {
    type: String,
    default: "Spa"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
