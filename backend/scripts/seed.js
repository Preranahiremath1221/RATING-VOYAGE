const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rating_voyage');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Store.deleteMany();
    await Rating.deleteMany();

    console.log('Data cleared');

    // Create users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@ratingvoyage.com',
        password: 'admin123',
        address: '123 Admin Street, Admin City',
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        address: '456 User Street, User City',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        address: '789 User Avenue, User City',
        role: 'user'
      },
      {
        name: 'Bob Restaurant',
        email: 'bob@restaurant.com',
        password: 'password123',
        address: '321 Restaurant Blvd, Food City',
        role: 'store-owner'
      },
      {
        name: 'Alice Retail',
        email: 'alice@retail.com',
        password: 'password123',
        address: '654 Retail Road, Shop City',
        role: 'store-owner'
      }
    ];

    // Hash passwords and create users
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
    }

    console.log('Users created:', createdUsers.length);

    // Create stores
    const stores = [
      {
        name: 'The Gourmet Kitchen',
        description: 'Fine dining restaurant serving exquisite cuisine with a modern twist',
        category: 'restaurant',
        address: '123 Gourmet Street, Food City',
        phone: '+1234567890',
        email: 'info@gourmetkitchen.com',
        owner: createdUsers[3]._id,
        averageRating: 4.5,
        totalRatings: 25,
        images: ['https://example.com/gourmet1.jpg', 'https://example.com/gourmet2.jpg']
      },
      {
        name: 'Fashion Boutique',
        description: 'Trendy fashion boutique offering the latest styles and accessories',
        category: 'retail',
        address: '456 Fashion Avenue, Style City',
        phone: '+1234567891',
        email: 'info@fashionboutique.com',
        owner: createdUsers[4]._id,
        averageRating: 4.2,
        totalRatings: 18,
        images: ['https://example.com/fashion1.jpg', 'https://example.com/fashion2.jpg']
      },
      {
        name: 'Tech Service Center',
        description: 'Professional tech services and repairs for all your electronic needs',
        category: 'service',
        address: '789 Tech Street, Tech City',
        phone: '+1234567892',
        email: 'info@techservice.com',
        owner: createdUsers[4]._id,
        averageRating: 4.8,
        totalRatings: 32,
        images: ['https://example.com/tech1.jpg', 'https://example.com/tech2.jpg']
      }
    ];

    const createdStores = [];
    for (const storeData of stores) {
      const store = new Store(storeData);
      await store.save();
      createdStores.push(store);
    }

    console.log('Stores created:', createdStores.length);

    // Update users with store IDs
    await User.findByIdAndUpdate(createdUsers[3]._id, { storeId: createdStores[0]._id });
    await User.findByIdAndUpdate(createdUsers[4]._id, { storeId: createdStores[1]._id });

    // Create ratings
    const ratings = [
      {
        user: createdUsers[1]._id,
        store: createdStores[0]._id,
        rating: 5,
        review: 'Absolutely amazing food and service! The ambiance was perfect for a special dinner.'
      },
      {
        user: createdUsers[2]._id,
        store: createdStores[0]._id,
        rating: 4,
        review: 'Great food, but service was a bit slow during peak hours.'
      },
      {
        user: createdUsers[1]._id,
        store: createdStores[1]._id,
        rating: 4,
        review: 'Good selection of clothes and reasonable prices.'
      },
      {
        user: createdUsers[2]._id,
        store: createdStores[2]._id,
        rating: 5,
        review: 'Excellent service! Fixed my laptop quickly and professionally.'
      }
    ];

    const createdRatings = [];
    for (const ratingData of ratings) {
      const rating = new Rating(ratingData);
      await rating.save();
      createdRatings.push(rating);
    }

    console.log('Ratings created:', createdRatings.length);

    // Update store ratings
    for (const store of createdStores) {
      await store.calculateAverageRating();
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seedData();
}

module.exports = seedData;
