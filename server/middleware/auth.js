// Auth middleware: checks for a valid JWT in the request header.
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// "protect" makes sure the user is logged in before reaching a route.
const protect = async (req, res, next) => {
  let token;

  // The token is sent as "Authorization: Bearer <token>".
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get the token part after "Bearer ".
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret and find the user.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password'); // exclude password
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
