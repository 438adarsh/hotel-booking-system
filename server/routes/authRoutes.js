// Auth routes: register, login, and get own profile.
const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - create account
router.post('/register', registerUser);

// POST /api/auth/login - log in
router.post('/login', loginUser);

// GET /api/auth/me - get logged-in user's profile
router.get('/me', protect, getMe);

module.exports = router;
