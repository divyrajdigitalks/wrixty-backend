const Setting = require('../models/settingModel');
const { uploadToExternalAPI } = require('../middlewares/uploadMiddleware');

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public (or Private if preferred)
const getSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({
        appName: "CRM",
        appLogo: "",
        appIcon: "Spa"
      });
    }
    res.status(200).json(setting);
  } catch (error) {
        if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `A record with this ${field} already exists.` });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private (Admin)
const updateSettings = async (req, res) => {
  try {
    let { appName, appLogo, appIcon } = req.body;
    
    if (req.file) {
      const fileUrl = await uploadToExternalAPI(req.file, 'wrixty', 'settings');
      if (fileUrl) {
        appLogo = fileUrl;
      }
    }

    let setting = await Setting.findOne();
    
    if (!setting) {
      setting = await Setting.create({ appName, appLogo, appIcon });
      return res.status(201).json(setting);
    }

    setting.appName = appName !== undefined ? appName : setting.appName;
    setting.appLogo = appLogo !== undefined ? appLogo : setting.appLogo;
    setting.appIcon = appIcon !== undefined ? appIcon : setting.appIcon;

    await setting.save();
    res.status(200).json(setting);
  } catch (error) {
        if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `A record with this ${field} already exists.` });
    }
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
