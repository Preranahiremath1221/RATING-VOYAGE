# Rating Voyage

A comprehensive store rating and review platform built with React, TypeScript, Express.js, and MongoDB. This application allows users to browse stores, submit ratings and reviews, and provides administrative tools for managing users and stores.

## 🚀 Features

### User Features
- **User Authentication**: Secure login and registration system
- **Store Browsing**: Browse and search through various stores
- **Rating System**: Submit 1-5 star ratings with optional reviews
- **Personal Dashboard**: View and manage personal ratings
- **User Profiles**: Manage personal information and preferences

### Store Owner Features
- **Store Management**: Create and manage store listings
- **Rating Analytics**: View and analyze store ratings and reviews
- **Store Dashboard**: Monitor store performance and customer feedback

### Admin Features
- **User Management**: Manage all users (admin, store-owners, regular users)
- **Store Management**: Oversee all store listings
- **Analytics Dashboard**: Comprehensive platform analytics and insights
- **Content Moderation**: Manage ratings and reviews

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with shadcn/ui components
- **React Router** for navigation
- **TanStack Query (React Query)** for server state management
- **React Hook Form** for form handling
- **Zod** for validation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** and **Helmet** for security
- **Morgan** for logging

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm, yarn, or bun package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/rating_voyage
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🗄️ Database Schema

### Users
- Name, email, password, address
- Roles: admin, user, store-owner
- Store association for store owners
- Authentication and authorization controls

### Stores
- Name, description, category, address, contact info
- Average rating and total ratings count
- Operating hours and location data
- Owner association

### Ratings
- User and store references
- 1-5 star rating with optional review
- Image support for reviews
- Helpful votes and moderation flags

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Stores
- `GET /api/stores` - Get all stores (with search/filter)
- `POST /api/stores` - Create store (store-owner/admin)
- `GET /api/stores/:id` - Get store details
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

### Ratings
- `POST /api/ratings` - Create rating
- `PUT /api/ratings/:id` - Update rating
- `GET /api/ratings/my-ratings` - Get user's ratings
- `GET /api/ratings?store=:storeId` - Get store ratings

### Dashboard
- `GET /api/dashboard/stats` - Platform statistics
- `GET /api/dashboard/analytics` - Analytics data

## 🧪 Testing

The project includes comprehensive testing with Vitest and React Testing Library:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Run UI test runner
npm run test:ui
```

## 📱 Usage

### User Roles

1. **Admin Users**:
   - Full access to all administrative features
   - Can manage users, stores, and content
   - Access to analytics dashboard

2. **Store Owners**:
   - Can create and manage their stores
   - View analytics for their stores
   - Respond to customer reviews

3. **Regular Users**:
   - Browse and search stores
   - Submit ratings and reviews
   - Manage personal profile and ratings

### Key Features

- **Store Browsing**: Use the search functionality to find stores by name or category
- **Rating Submission**: Click on any store to view details and submit a rating
- **Dashboard**: Access personalized dashboard for your activities
- **Admin Panel**: Manage platform content and users (admin only)

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred hosting platform (Heroku, Railway, etc.)
3. Ensure MongoDB connection string is configured

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting platform (Vercel, Netlify, etc.)
3. Update API_BASE_URL in production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please check the issues section or create a new issue with detailed information about your problem.

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication and authorization
  - Store management system
  - Rating and review system
  - Admin dashboard
  - Comprehensive testing suite

---

Built with ❤️ using modern web technologies.
