const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  review: {
    type: String,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?.*\.(jpg|jpeg|png|gif|webp)$/.test(v);
      },
      message: 'Please enter a valid image URL'
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure one rating per user per store
ratingSchema.index({ user: 1, store: 1 }, { unique: true });

// Update store average rating after save
ratingSchema.post('save', async function() {
  const Store = mongoose.model('Store');
  const store = await Store.findById(this.store);
  if (store) {
    await store.calculateAverageRating();
  }
});

// Update store average rating after remove
ratingSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Store = mongoose.model('Store');
    const store = await Store.findById(doc.store);
    if (store) {
      await store.calculateAverageRating();
    }
  }
});

module.exports = mongoose.model('Rating', ratingSchema);
