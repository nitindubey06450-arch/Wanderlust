const Review = require('../models/Review');
const Destination = require('../models/Destination');

// @desc    Get reviews for a destination
// @route   GET /api/destinations/:id/reviews
// @access  Public
const getDestinationReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ destination: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for a destination
// @route   POST /api/destinations/:id/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const destinationId = req.params.id;

    const destination = await Destination.findById(destinationId);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      destination: destinationId
    });

    if (alreadyReviewed) {
      alreadyReviewed.rating = rating;
      alreadyReviewed.comment = comment;
      await alreadyReviewed.save();
      await Review.getAverageRating(destinationId);

      const updatedReview = await Review.findById(alreadyReviewed._id).populate('user', 'name avatar');

      return res.json({
        success: true,
        review: updatedReview,
        message: 'Review updated successfully'
      });
    }

    const review = await Review.create({
      user: req.user._id,
      destination: destinationId,
      rating: Number(rating),
      comment
    });

    await Review.getAverageRating(destinationId);
    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      review: populatedReview,
      message: 'Review added successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDestinationReviews,
  addReview
};
