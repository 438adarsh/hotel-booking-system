// Auth controller: handles register and login logic.
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate a JWT token for a user id.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
// Creates a new user account and returns the user + token.
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation: make sure all fields are filled.
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Check if a user with this email already exists.
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  // Create the user. New users are always "user" role (never admin here).
  const user = await User.create({ name, email, password });

  // Send back the user info and a token to log them in right away.
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// POST /api/auth/login
// Checks email/password and returns the user + token.
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email. We need the password field to compare.
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Compare the entered password with the stored hashed password.
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// GET /api/auth/me
// Returns the logged-in user's profile (uses protect middleware).
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
