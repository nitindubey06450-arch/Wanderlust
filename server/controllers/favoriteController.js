const User = require('../models/User');

// @desc    Add destination to favorites
// @route   POST /api/users/favorites/:destinationId
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(destinationId)) {
      user.favorites.push(destinationId);
      await user.save();
    }

    const updatedUser = await User.findById(req.user._id).populate('favorites');

    res.json({
      success: true,
      favorites: updatedUser.favorites,
      message: 'Destination added to favorites'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove single destination from favorites
// @route   DELETE /api/users/favorites/:destinationId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== destinationId
    );

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('favorites');

    res.json({
      success: true,
      favorites: updatedUser.favorites,
      message: 'Destination removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk remove selected destinations from favorites
// @route   DELETE /api/users/favorites (or POST /api/users/favorites/bulk-delete)
// @access  Private
const removeBulkFavorites = async (req, res, next) => {
  try {
    const { destinationIds = [] } = req.body;

    if (!Array.isArray(destinationIds) || destinationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of destination IDs to remove'
      });
    }

    const user = await User.findById(req.user._id);
    const idSet = new Set(destinationIds.map(id => id.toString()));

    user.favorites = user.favorites.filter(
      (favId) => !idSet.has(favId.toString())
    );

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('favorites');

    res.json({
      success: true,
      favorites: updatedUser.favorites,
      message: `${destinationIds.length} place(s) removed from favorites successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all favorites
// @route   DELETE /api/users/favorites-all
// @access  Private
const clearAllFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = [];
    await user.save();

    res.json({
      success: true,
      favorites: [],
      message: 'All favorite destinations cleared'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user favorite destinations
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');

    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  removeBulkFavorites,
  clearAllFavorites,
  getFavorites
};
