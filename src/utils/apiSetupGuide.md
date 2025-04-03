
# Backend API Setup Guide for GymPro

This guide explains how to set up your backend API to work with the GymPro React frontend.

## 1. API Authentication

The GymPro frontend expects your API to support token-based authentication.

```bash
# Example setup for JWT authentication
npm install jsonwebtoken
```

## 2. Configure CORS

Ensure your API allows cross-origin requests from the frontend:

```js
// Example CORS configuration
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
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.use(authMiddleware);
router.get('/user', authController.user);
router.post('/logout', authController.logout);

// Activities
router.get('/activities', activityController.index);
router.post('/activities', activityController.store);
router.get('/activities/:activity', activityController.show);
router.put('/activities/:activity', activityController.update);
router.delete('/activities/:activity', activityController.destroy);

// Bookings
router.get('/bookings', bookingController.index);
router.post('/bookings', bookingController.store);
router.get('/bookings/:booking', bookingController.show);
router.patch('/bookings/:booking/cancel', bookingController.cancel);

// Memberships
router.get('/membership-plans', membershipController.getPlans);
router.get('/my-membership', membershipController.getUserMembership);
router.post('/subscribe', membershipController.subscribe);

// Admin routes
router.use('/admin', adminMiddleware);
router.get('/users', userController.index);
router.patch('/users/:user/verify', userController.verify);
```

## 4. Example Auth Controller

The auth controller should handle login, registration, and user data:

```js
// Example authentication controller
const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid login details' });
    }
    
    const token = generateToken(user);
    
    return res.json({
      token,
      user: {
        id: user.id,
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
```

## 5. API Authentication Middleware

Create middleware to protect private routes:

```js
// Example auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
```

## 6. Running Your Backend API

```bash
# Start the development server
npm run start
```

The server will typically run on http://localhost:8000 by default.
