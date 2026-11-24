const Destination = require('../models/Destination');
const User = require('../models/User');

// @desc    Get all destinations with search, filter, sort & pagination
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res, next) => {
  try {
    const {
      search,
      country,
      region,
      category,
      maxBudget,
      minRating,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Text search or regex search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { region: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    if (region) {
      query.region = { $regex: region, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (maxBudget) {
      query.estimatedBudget = { $lte: Number(maxBudget) };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Sort options
    let sortOptions = {};
    if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'price-low') {
      sortOptions = { estimatedBudget: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { estimatedBudget: -1 };
    } else if (sort === 'name') {
      sortOptions = { name: 1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .populate('owner', 'name email avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: destinations.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      destinations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get destinations owned by currently logged-in user
// @route   GET /api/destinations/my-places
// @access  Private
const getMyPlaces = async (req, res, next) => {
  try {
    const destinations = await Destination.find({ owner: req.user._id })
      .populate('owner', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: destinations.length,
      destinations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate('owner', 'name email avatar');

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.json({
      success: true,
      destination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a destination
// @route   POST /api/destinations
// @access  Private (Authenticated Users)
const createDestination = async (req, res, next) => {
  try {
    // Automatically associate logged in user as owner
    const destinationData = {
      ...req.body,
      owner: req.user._id
    };

    // Parse image or array of images
    if (typeof destinationData.images === 'string') {
      destinationData.images = [destinationData.images];
    }
    if (!destinationData.images || destinationData.images.length === 0) {
      destinationData.images = ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'];
    }

    const destination = await Destination.create(destinationData);
    await destination.populate('owner', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Place added successfully!',
      destination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a destination (Owner or Admin only)
// @route   PUT /api/destinations/:id
// @access  Private (Owner or Admin)
const updateDestination = async (req, res, next) => {
  try {
    let destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Check ownership authorization
    const isOwner = destination.owner && destination.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit places that you own'
      });
    }

    const updateData = { ...req.body };
    if (typeof updateData.images === 'string') {
      updateData.images = [updateData.images];
    }

    destination = await Destination.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('owner', 'name email avatar');

    res.json({
      success: true,
      message: 'Place updated successfully!',
      destination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a destination (Owner or Admin only)
// @route   DELETE /api/destinations/:id
// @access  Private (Owner or Admin)
const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Check ownership authorization
    const isOwner = destination.owner && destination.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete places that you own'
      });
    }

    await destination.deleteOne();

    // Clean up references from users' favorites
    await User.updateMany(
      { favorites: req.params.id },
      { $pull: { favorites: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Place deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDestinations,
  getMyPlaces,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
};
