const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Beach', 'Mountain', 'Historical', 'City', 'Nature', 'Adventure', 'Luxury', 'Cultural', 'Spiritual', 'Wildlife']
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  estimatedBudget: {
    type: Number,
    required: [true, 'Estimated budget is required']
  },
  bestTimeToVisit: {
    type: String,
    default: 'All Year Round'
  },
  attractions: [{
    type: String
  }],
  thingsToDo: [{
    type: String
  }],
  travelTips: [{
    type: String
  }],
  latitude: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  }
}, {
  timestamps: true
});

// Text index for search
destinationSchema.index({ name: 'text', country: 'text', region: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);
