const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  removeBulkFavorites,
  clearAllFavorites,
  getFavorites
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.get('/favorites', protect, getFavorites);
router.post('/favorites/:destinationId', protect, addFavorite);
router.delete('/favorites/:destinationId', protect, removeFavorite);
router.delete('/favorites', protect, removeBulkFavorites);
router.post('/favorites/bulk-delete', protect, removeBulkFavorites);
router.delete('/favorites-all', protect, clearAllFavorites);

module.exports = router;
