const aiService = require('../services/aiService');
const ChatConversation = require('../models/ChatConversation');
const SavedTrip = require('../models/SavedTrip');

// @desc    Send chat message to AI assistant
// @route   POST /api/ai/chat
// @access  Public (Guest & Logged-in)
const chatWithAI = async (req, res, next) => {
  try {
    const { message, conversation = [], conversationId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    // Limit message length to 2000 chars for safety
    if (message.length > 2000) {
      return res.status(400).json({ success: false, message: 'Message exceeds maximum allowed length of 2000 characters' });
    }

    // Process chat with AI service and database destination lookup
    const { responseText, matchedDestinations } = await aiService.processChat({
      message: message.trim(),
      conversation
    });

    let savedConversationId = conversationId || null;

    // If user is authenticated, save conversation history in MongoDB
    if (req.user) {
      try {
        let chatDoc;
        if (conversationId) {
          chatDoc = await ChatConversation.findOne({ _id: conversationId, user: req.user._id });
        }

        if (!chatDoc) {
          // Generate a title from the first message
          const title = message.trim().slice(0, 30) + (message.length > 30 ? '...' : '');
          chatDoc = new ChatConversation({
            user: req.user._id,
            title,
            messages: []
          });
        }

        chatDoc.messages.push({ role: 'user', content: message.trim() });
        chatDoc.messages.push({ role: 'assistant', content: responseText });

        await chatDoc.save();
        savedConversationId = chatDoc._id;
      } catch (saveErr) {
        console.error('Error saving chat history:', saveErr.message);
      }
    }

    res.json({
      success: true,
      message: responseText,
      destinations: matchedDestinations || [],
      conversationId: savedConversationId
    });
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, Wanderlust AI is temporarily unavailable. Please try again.'
    });
  }
};

// @desc    Get all chat conversations for logged-in user
// @route   GET /api/ai/conversations
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    const conversations = await ChatConversation.find({ user: req.user._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single conversation by ID
// @route   GET /api/ai/conversations/:id
// @access  Private
const getConversationById = async (req, res, next) => {
  try {
    const conversation = await ChatConversation.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({
      success: true,
      conversation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete conversation
// @route   DELETE /api/ai/conversations/:id
// @access  Private
const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await ChatConversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save trip itinerary
// @route   POST /api/ai/saved-trips
// @access  Private
const saveTrip = async (req, res, next) => {
  try {
    const { title, destination, startLocation, duration, budget, travelStyle, itinerary } = req.body;

    if (!title || !destination || !itinerary) {
      return res.status(400).json({ success: false, message: 'Title, destination, and itinerary content are required' });
    }

    const savedTrip = await SavedTrip.create({
      user: req.user._id,
      title,
      destination,
      startLocation: startLocation || 'Flexible',
      duration: duration || 'Multi-day',
      budget: budget || 'Moderate',
      travelStyle: travelStyle || 'Sightseeing',
      itinerary
    });

    res.status(201).json({
      success: true,
      savedTrip,
      message: 'Travel plan saved successfully to your profile!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user saved trips
// @route   GET /api/ai/saved-trips
// @access  Private
const getSavedTrips = async (req, res, next) => {
  try {
    const savedTrips = await SavedTrip.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      savedTrips
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete saved trip
// @route   DELETE /api/ai/saved-trips/:id
// @access  Private
const deleteSavedTrip = async (req, res, next) => {
  try {
    const trip = await SavedTrip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Saved trip not found' });
    }

    res.json({
      success: true,
      message: 'Saved trip removed'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tourist places for a specific Indian State / UT using OpenAI
// @route   POST /api/ai/state-tourist-places
// @access  Public
const getStateTouristPlaces = async (req, res, next) => {
  try {
    const { state } = req.body;
    if (!state || typeof state !== 'string' || !state.trim()) {
      return res.status(400).json({
        success: false,
        message: 'State name is required (e.g. Rajasthan, Kerala, Goa, etc.)'
      });
    }

    const result = await aiService.getStateTouristPlaces(state.trim());
    res.json({
      success: true,
      state: result.state,
      guide: result.guide,
      matchedDestinations: result.matchedDestinations
    });
  } catch (error) {
    console.error('State tourist places error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tourist places for state'
    });
  }
};

module.exports = {
  chatWithAI,
  getStateTouristPlaces,
  getConversations,
  getConversationById,
  deleteConversation,
  saveTrip,
  getSavedTrips,
  deleteSavedTrip
};
