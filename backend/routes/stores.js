const express = require('express');
const { body, validationResult } = require('express-validator');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/stores
// @desc    Get all stores
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const stores = await Store.find(query)
      .populate('owner', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Store.countDocuments(query);

    res.json({
      stores,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stores/:id
// @desc    Get store by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate('owner', 'name email');
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json(store);
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/stores
// @desc    Create new store (store owner only)
// @access  Private
router.post('/', [
  auth,
  authorize('store-owner', 'admin'),
  body('name').trim().isLength({ min: 2 }).withMessage('Store name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['restaurant', 'retail', 'service', 'entertainment', 'health', 'education', 'other']).withMessage('Invalid category'),
  body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('phone').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please enter a valid phone number'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const storeData = {
      ...req.body,
      owner: req.user.userId
    };

    const store = new Store(storeData);
    await store.save();

    // Update user's storeId
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.userId, { storeId: store._id });

    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/stores/:id
// @desc    Update store (owner or admin)
// @access  Private
router.put('/:id', [
  auth,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Store name must be at least 2 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').optional().isIn(['restaurant', 'retail', 'service', 'entertainment', 'health', 'education', 'other']).withMessage('Invalid category'),
  body('address').optional().trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please enter a valid phone number'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user is owner or admin
    if (store.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this store' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        store[key] = req.body[key];
      }
    });

    await store.save();

    res.json({
      message: 'Store updated successfully',
      store
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/stores/:id
// @desc    Delete store (owner or admin)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user is owner or admin
    if (store.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this store' });
    }

    await Store.findByIdAndDelete(req.params.id);
    
    // Remove storeId from user
    const User = require('../models/User');
    await User.findByIdAndUpdate(store.owner, { storeId: null });

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stores/my-stores
// @desc    Get stores owned by current user
// @access  Private
router.get('/my-stores', auth, async (req, res) => {
  try {
    const stores = await Store.find({ owner: req.user.userId })
      .populate('owner', 'name email');
    
    res.json(stores);
  } catch (error) {
    console.error('Get my stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
