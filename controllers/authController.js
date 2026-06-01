const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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
      // Generate token
      const token = jwt.sign(
        { id: user._id, email: user.email, roles: user.roles },
        process.env.JWT_SECRET || 'wrixtysecret123',
        { expiresIn: '30d' }
      );

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
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
