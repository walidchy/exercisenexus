
# Backend API Setup Guide for GymPro

This guide explains how to set up your backend API to work with the GymPro React frontend.

## 1. API Authentication

The GymPro frontend expects your API to support token-based authentication.

```bash
# Install required packages
npm install express jsonwebtoken bcrypt cors dotenv
```

## 2. Configure CORS

Ensure your API allows cross-origin requests from the frontend:

```js
// Example CORS configuration
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'https://your-production-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 3. API Routes

Your API should implement the following endpoints:

```js
// Public routes
app.post('/api/login', authController.login);
app.post('/api/register', authController.register);

// Protected routes (applying auth middleware)
app.get('/api/user', authMiddleware, authController.user);
app.post('/api/logout', authMiddleware, authController.logout);

// Activities
app.get('/api/activities', authMiddleware, activityController.index);
app.post('/api/activities', authMiddleware, activityController.store);
app.get('/api/activities/:activity', authMiddleware, activityController.show);
app.put('/api/activities/:activity', authMiddleware, activityController.update);
app.delete('/api/activities/:activity', authMiddleware, activityController.destroy);

// Bookings
app.get('/api/bookings', authMiddleware, bookingController.index);
app.post('/api/bookings', authMiddleware, bookingController.store);
app.get('/api/bookings/:booking', authMiddleware, bookingController.show);
app.patch('/api/bookings/:booking/cancel', authMiddleware, bookingController.cancel);

// Memberships
app.get('/api/membership-plans', authMiddleware, membershipController.getPlans);
app.get('/api/my-membership', authMiddleware, membershipController.getUserMembership);
app.post('/api/subscribe', authMiddleware, membershipController.subscribe);

// Admin routes
app.get('/api/users', [authMiddleware, adminMiddleware], userController.index);
app.patch('/api/users/:user/verify', [authMiddleware, adminMiddleware], userController.verify);
```

## 4. Example Auth Controller

The auth controller should handle login, registration, and user data:

```js
// Example authentication controller
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid login details' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };
```

## 5. API Authentication Middleware

Create middleware to protect private routes:

```js
// Example auth middleware
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
```

## 6. Running Your Backend API

```bash
# Start the development server
npm run dev
```

The server will typically run on http://localhost:8000 by default.
