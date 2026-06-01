const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT Token Helper
const generateToken = (id, email, roles) => {
  return jwt.sign(
    { id, email, roles },
    process.env.JWT_SECRET || 'wrixtysecret123',
    { expiresIn: process.env.JWT_EXPIRE || '1d' }
  );
};

const Role = require('../models/roleModel');

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      // Fetch the roles' permissions
      const roleDocs = await Role.find({ name: { $in: user.roles } });
      let permissions = {};
      roleDocs.forEach(r => {
        if (r.permissions) {
          permissions = { ...permissions, ...r.permissions };
        }
      });

      // Generate token using helper
      const token = generateToken(user._id, user.email, user.roles);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        permissions: permissions,
        token: token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginUser };
