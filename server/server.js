// Main server file: sets up Express, connects routes, and starts the server.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to MongoDB.
connectDB();

const app = express();

// Allow the frontend (running on a different port) to call this API.
app.use(cors());

// Parse incoming JSON bodies.
app.use(express.json());

// A simple health-check route so you know the server is running.
app.get('/', (req, res) => {
  res.json({ message: 'Hotel Booking API is running...' });
});

// Mount the route files.
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handler (must be after routes).
app.use(errorHandler);

// Start listening on the configured port.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
