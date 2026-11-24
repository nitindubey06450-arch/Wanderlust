const mongoose = require('mongoose');

const savedTripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true
  },
  startLocation: {
    type: String,
    default: 'Flexible'
  },
  duration: {
    type: String,
    default: 'Multi-day'
  },
  budget: {
    type: String,
    default: 'Moderate'
  },
  travelStyle: {
    type: String,
    default: 'Sightseeing & Culture'
  },
  itinerary: {
    type: String,
    required: [true, 'Itinerary content is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SavedTrip', savedTripSchema);
