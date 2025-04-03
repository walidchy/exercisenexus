
# Express Backend Setup Guide for GymPro

This guide explains how to set up your Express backend API to work with the GymPro React frontend.

## 1. Initial Setup

First, create a new directory for your backend and initialize a new Node.js project:

```bash
mkdir gympro-backend
cd gympro-backend
npm init -y
```

## 2. Install Required Dependencies

```bash
npm install express mongoose jsonwebtoken bcrypt cors dotenv
npm install nodemon --save-dev
```

## 3. Create Basic Server Structure

Create a `.env` file in the root of your backend project:

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/gympro
JWT_SECRET=your_jwt_secret_key
```

Create an `index.js` file for your server:

```js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-production-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/memberships', require('./routes/memberships'));
app.use('/api/users', require('./routes/users'));

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GymPro API' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
```

## 4. Create Models

Example User model (`models/User.js`):

```js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'trainer', 'admin'],
    default: 'member'
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  joined_date: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

## 5. Create Routes and Controllers

Example auth routes (`routes/auth.js`):

```js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/user', authMiddleware, authController.getUser);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
```

Example auth controller (`controllers/authController.js`):

```js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    const user = new User({
      name: full_name,
      email,
      password,
      role: role || 'member',
      is_verified: false
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'User registered successfully. Awaiting account verification.' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid login details' });
    }
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  // JWT tokens are stateless, so we just tell the client it was successful
  // In a real app, you might want to invalidate the token on the server side
  res.json({ message: 'User logged out successfully' });
};
```

## 6. Create Middleware

Auth middleware (`middleware/authMiddleware.js`):

```js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
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
```

Admin middleware (`middleware/adminMiddleware.js`):

```js
module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
};
```

## 7. Update your package.json scripts

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

## 8. Running Your Express Backend

```bash
# Start the development server with hot reloading
npm run dev

# Start the production server
npm start
```

The server will run on http://localhost:8000 by default.
