const express = require('express');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics (admin only)
// @access  Private/Admin
router.get('/stats', [auth, authorize('admin')], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();
    
    const activeUsers = await User.countDocuments({ isActive: true });
    const activeStores = await Store.countDocuments({ isActive: true });
    
    const usersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    
    const storesThisMonth = await Store.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    
    const ratingsThisMonth = await Rating.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
      activeUsers,
      activeStores,
      usersThisMonth,
      storesThisMonth,
      ratingsThisMonth
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/user-stats
// @desc    Get user dashboard statistics
// @access  Private
router.get('/user-stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's ratings count
    const userRatings = await Rating.countDocuments({ user: userId });
    
    // Get user's stores count (if store owner)
    const userStores = await Store.countDocuments({ owner: userId });
    
    // Get recent ratings by user
    const recentRatings = await Rating.find({ user: userId })
      .populate('store', 'name images')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      userRatings,
      userStores,
      recentRatings
    });
  } catch (error) {
    console.error('Get user dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/store-stats/:storeId
// @desc    Get store dashboard statistics (store owner only)
// @access  Private
router.get('/store-stats/:storeId', auth, async (req, res) => {
  try {
    const { storeId } = req.params;
    
    // Verify store ownership
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    if (store.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this store dashboard' });
    }

    // Get store ratings count and average
    const storeRatings = await Rating.find({ store: storeId });
    const totalRatings = storeRatings.length;
    const averageRating = totalRatings > 0 
      ? storeRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings 
      : 0;

    // Get recent ratings
    const recentRatings = await Rating.find({ store: storeId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get monthly rating trend
    const monthlyTrend = await Rating.aggregate([
      { $match: { store: store._id } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    res.json({
      totalRatings,
      averageRating: Math.round(averageRating * 10) / 10,
      recentRatings,
      monthlyTrend
    });
  } catch (error) {
    console.error('Get store dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/top-rated-stores
// @desc    Get top rated stores
// @access  Public
router.get('/top-rated-stores', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const topStores = await Store.find({ isActive: true })
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(parseInt(limit))
      .select('name images averageRating totalRatings category');

    res.json(topStores);
  } catch (error) {
    console.error('Get top rated stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/recent-activity
// @desc    Get recent activity across the platform
// @access  Private/Admin
router.get('/recent-activity', [auth, authorize('admin')], async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email createdAt role');

    const recentStores = await Store.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name category createdAt owner');

    const recentRatings = await Rating.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name')
      .populate('store', 'name');

    res.json({
      recentUsers,
      recentStores,
      recentRatings
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
