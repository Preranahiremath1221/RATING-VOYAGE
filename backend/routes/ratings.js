const express = require('express');
const { body, validationResult } = require('express-validator');
const Rating = require('../models/Rating');
const Store = require('../models/Store');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/ratings
// @desc    Get all ratings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, store, user, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    
    if (store) query.store = store;
    if (user) query.user = user;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const ratings = await Rating.find(query)
      .populate('user', 'name')
      .populate('store', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Rating.countDocuments(query);

    res.json({
      ratings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ratings/:id
// @desc    Get rating by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id)
      .populate('user', 'name')
      .populate('store', 'name');
    
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json(rating);
  } catch (error) {
    console.error('Get rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ratings
// @desc    Create new rating
// @access  Private
router.post('/', [
  auth,
  body('store').isMongoId().withMessage('Valid store ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { store, rating, review, images } = req.body;

    // Check if store exists
    const storeExists = await Store.findById(store);
    if (!storeExists) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user has already rated this store
    const existingRating = await Rating.findOne({ user: req.user.userId, store });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this store' });
    }

    const newRating = new Rating({
      user: req.user.userId,
      store,
      rating,
      review,
      images
    });

    await newRating.save();

    // Populate user and store data
    await newRating.populate('user', 'name');
    await newRating.populate('store', 'name');

    res.status(201).json({
      message: 'Rating created successfully',
      rating: newRating
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/ratings/:id
// @desc    Update rating
// @access  Private
router.put('/:id', [
  auth,
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Check if user owns this rating or is admin
    if (rating.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this rating' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        rating[key] = req.body[key];
      }
    });

    await rating.save();

    // Populate user and store data
    await rating.populate('user', 'name');
    await rating.populate('store', 'name');

    res.json({
      message: 'Rating updated successfully',
      rating
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/ratings/:id
// @desc    Delete rating
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Check if user owns this rating or is admin
    if (rating.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this rating' });
    }

    await Rating.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ratings/my-ratings
// @desc    Get current user's ratings
// @access  Private
router.get('/my-ratings', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user.userId })
      .populate('store', 'name images averageRating')
      .sort({ createdAt: -1 });
    
    res.json(ratings);
  } catch (error) {
    console.error('Get my ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ratings/:id/helpful
// @desc    Mark rating as helpful
// @access  Private
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    rating.helpfulVotes += 1;
    await rating.save();

    res.json({ message: 'Marked as helpful', helpfulVotes: rating.helpfulVotes });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
