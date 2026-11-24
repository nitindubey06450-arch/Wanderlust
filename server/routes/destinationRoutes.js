const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getMyPlaces,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} = require('../controllers/destinationController');
const { getDestinationReviews, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/my-places')
  .get(protect, getMyPlaces);

router.route('/')
  .get(getDestinations)
  .post(protect, createDestination);

router.route('/:id')
  .get(getDestinationById)
  .put(protect, updateDestination)
  .delete(protect, deleteDestination);

// Reviews sub-routes
router.route('/:id/reviews')
  .get(getDestinationReviews)
  .post(protect, addReview);

module.exports = router;
