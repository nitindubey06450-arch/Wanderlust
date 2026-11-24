const User = require('../models/User');
const Destination = require('../models/Destination');
const Review = require('../models/Review');

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Aggregate total favorites across all users
    const usersWithFavorites = await User.aggregate([
      { $project: { favoritesCount: { $size: { $ifNull: ['$favorites', []] } } } },
      { $group: { _id: null, totalFavorites: { $sum: '$favoritesCount' } } }
    ]);

    const totalFavorites = usersWithFavorites.length > 0 ? usersWithFavorites[0].totalFavorites : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDestinations,
        totalFavorites,
        totalReviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminUsers
};
