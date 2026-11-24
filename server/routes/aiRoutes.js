const express = require('express');
const router = express.Router();
const {
  chatWithAI,
  getStateTouristPlaces,
  getConversations,
  getConversationById,
  deleteConversation,
  saveTrip,
  getSavedTrips,
  deleteSavedTrip
} = require('../controllers/aiController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public / Optional Auth Route for AI Chatbot
router.post('/chat', optionalAuth, chatWithAI);

// Dedicated OpenAI State Tourist Places Explorer Route
router.post('/state-tourist-places', getStateTouristPlaces);

// Protected Conversation History Routes
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversationById);
router.delete('/conversations/:id', protect, deleteConversation);

// Protected Saved Trips Routes
router.post('/saved-trips', protect, saveTrip);
router.get('/saved-trips', protect, getSavedTrips);
router.delete('/saved-trips/:id', protect, deleteSavedTrip);

module.exports = router;
