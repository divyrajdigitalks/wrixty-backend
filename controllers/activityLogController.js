const ActivityLog = require('../models/activityLogModel');

// @desc    Get all activity logs
// @route   GET /api/activity-logs
// @access  Private
const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 100, userId } = req.query;
    const query = {};

    // Check if current user is admin/superadmin
    const isAdmin = req.user && (
      req.user.roles.includes('admin') || 
      req.user.roles.includes('superadmin') || 
      req.user.email === 'superadmin@gmail.com'
    );

    if (isAdmin) {
      // Admin can view all logs, optionally filtered by a specific user
      if (userId && userId !== 'all') {
        query.user = userId;
      }
    } else {
      // Non-admin can ONLY view their own logs
      query.user = req.user._id;
    }

    const logs = await ActivityLog.find(query)
      .populate('user', 'name email')
      .populate({
        path: 'lead',
        populate: {
          path: 'customer',
          select: 'name phone_number'
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await ActivityLog.countDocuments(query);

    res.status(200).json({
      data: logs,
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActivityLogs
};
