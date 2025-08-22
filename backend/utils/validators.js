const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Common validators
const userValidators = {
  register: [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters')
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required')
  ]
};

const storeValidators = {
  create: [
    body('name').trim().isLength({ min: 2 }).withMessage('Store name must be at least 2 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('category').isIn(['restaurant', 'retail', 'service', 'entertainment', 'health', 'education', 'other']).withMessage('Invalid category'),
    body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
    body('phone').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please enter a valid phone number'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email')
  ],
  update: [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Store name must be at least 2 characters'),
    body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('category').optional().isIn(['restaurant', 'retail', 'service', 'entertainment', 'health', 'education', 'other']).withMessage('Invalid category'),
    body('address').optional().trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
    body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please enter a valid phone number'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Please enter a valid email')
  ]
};

const ratingValidators = {
  create: [
    body('store').isMongoId().withMessage('Valid store ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters')
  ],
  update: [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters')
  ]
};

module.exports = {
  validate,
  userValidators,
  storeValidators,
  ratingValidators
};
