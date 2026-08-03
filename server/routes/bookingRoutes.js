// Booking routes: users manage their own bookings, admin sees all.
const express = require('express');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelMyBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// POST /api/bookings - create a booking (logged-in user)
router.post('/', protect, createBooking);

// GET /api/bookings/my - get the logged-in user's bookings
router.get('/my', protect, getMyBookings);

// GET /api/bookings - get all bookings (admin only)
router.get('/', protect, admin, getAllBookings);

// PUT /api/bookings/:id/status - update booking status (admin only)
router.put('/:id/status', protect, admin, updateBookingStatus);

// PUT /api/bookings/:id/cancel - cancel own booking (logged-in user)
router.put('/:id/cancel', protect, cancelMyBooking);

module.exports = router;
