const User = require('../models/userModel');
const Lead = require('../models/leadModel');
const { encryptPassword, decryptPassword } = require('../utils/cryptoUtils');

// @desc    Get all users (with pagination & search)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobile_number: { $regex: search, $options: 'i' } },
            { company_number: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const isAdmin = req.user && (
      req.user.roles.includes('admin') || 
      req.user.roles.includes('superadmin') || 
      req.user.email === 'superadmin@gmail.com'
    );
    const isManager = req.user && req.user.roles.some(r => ['manager', 'main manager', 'maneger', 'main maneger'].includes(r.toLowerCase()));

    if (!isAdmin && isManager) {
      const Team = require('../models/teamModel');
      const teams = await Team.find({ head: req.user._id });
      let allowedUsers = [req.user._id.toString()];
      teams.forEach(team => {
        if (team.member) {
          team.member.forEach(m => {
            if (m) allowedUsers.push(m.toString());
          });
        }
      });
      allowedUsers = [...new Set(allowedUsers)];
      filter._id = { $in: allowedUsers };
    } else if (!isAdmin) {
      // Regular users only see themselves? Or maybe they shouldn't fetch users at all.
      // We will restrict to themselves to be safe
      filter._id = req.user ? req.user._id : null;
    }

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter)
    ]);

    const userIds = users.map(u => u._id);

    const leadCounts = await Lead.aggregate([
      { 
        $match: { 
          assgin: { $in: userIds },
          isDeleted: { $ne: true },
          orderStatus: { $ne: true }
        } 
      },
      {
        $group: {
          _id: '$assgin',
          count: { $sum: 1 }
        }
      }
    ]);

    const leadCountMap = {};
    leadCounts.forEach(lc => {
      if (lc._id) leadCountMap[lc._id.toString()] = lc.count;
    });

    const enrichedUsers = users.map(u => {
      const obj = u.toObject();
      obj.activeLeadCount = leadCountMap[obj._id.toString()] || 0;
      return obj;
    });

    res.status(200).json({
      data: enrichedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const userObj = user.toObject();
    if (userObj.password) {
      userObj.password = decryptPassword(userObj.password);
    }
    
    res.status(200).json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new user
// @route   POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, password, mobile_number, company_number, aadhar_card, bank_number, roles } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let fileUrl = req.body.check_photo || '';
    if (req.file) {
      const { uploadToExternalAPI } = require('../middlewares/uploadMiddleware');
      const uploadedUrl = await uploadToExternalAPI(req.file, 'wrixty', 'users');
      if (uploadedUrl) {
        fileUrl = uploadedUrl;
      }
    }

    const user = await User.create({
      name,
      email,
      password: encryptPassword(password),
      mobile_number,
      company_number,
      aadhar_card,
      check_photo: fileUrl,
      bank_number,
      roles: roles ? (Array.isArray(roles) ? roles : [roles]) : []
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user details
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // In case password is changed
    const updateData = { ...req.body };
    if (!updateData.password) {
      delete updateData.password;
    } else {
      updateData.password = encryptPassword(updateData.password);
    }

    if (req.file) {
      const { uploadToExternalAPI, deleteFromExternalAPI } = require('../middlewares/uploadMiddleware');
      const uploadedUrl = await uploadToExternalAPI(req.file, 'wrixty', 'users');
      if (uploadedUrl) {
        updateData.check_photo = uploadedUrl;
        if (user.check_photo) {
          deleteFromExternalAPI(user.check_photo).catch(err => console.error(err));
        }
      }
    }

    // Make sure roles is formatted correctly if it comes as non-array
    if (updateData.roles && !Array.isArray(updateData.roles)) {
      updateData.roles = [updateData.roles];
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email });
    if (user && decryptPassword(user.password) === password) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        themeColor: user.themeColor,
        darkMode: user.darkMode
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser
};
