const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Calculate average rating after save
reviewSchema.statics.getAverageRating = async function (destinationId) {
  const obj = await this.aggregate([
    { $match: { destination: destinationId } },
    {
      $group: {
        _id: '$destination',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    if (obj.length > 0) {
      await mongoose.model('Destination').findByIdAndUpdate(destinationId, {
        rating: Math.round(obj[0].averageRating * 10) / 10
      });
    }
  } catch (err) {
    console.error('Error updating destination rating:', err);
  }
};

reviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.destination);
});

module.exports = mongoose.model('Review', reviewSchema);
