// Booking controller: handles creating, viewing, and managing bookings.
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Helper: calculate number of nights between two dates.
const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end - start;
  const nights = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1; // at least 1 night
};

// POST /api/bookings  (logged-in users)
// Creates a booking for the logged-in user.
const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    // Find the room to get its price.
    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check the room is available.
    if (!roomDoc.availability) {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Calculate total price = price per night * number of nights.
    const nights = calculateNights(checkInDate, checkOutDate);
    const totalPrice = roomDoc.price * nights;

    // Create the booking.
    const booking = await Booking.create({
      user: req.user._id, // from protect middleware
      room,
      checkInDate,
      checkOutDate,
      totalPrice,
      bookingStatus: 'confirmed',
    });

    // Mark the room as unavailable so it can't be double-booked.
    roomDoc.availability = false;
    await roomDoc.save();

    // Return the booking with room and user info populated.
    const populated = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/bookings/my  (logged-in users)
// Returns all bookings for the logged-in user.
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings  (admin only)
// Returns all bookings in the system.
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('room')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/bookings/:id/status  (admin only)
// Updates the status of a booking (pending, confirmed, cancelled, completed).
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.bookingStatus = bookingStatus;
    await booking.save();

    // If cancelled or completed, make the room available again.
    if (bookingStatus === 'cancelled' || bookingStatus === 'completed') {
      await Room.findByIdAndUpdate(booking.room, { availability: true });
    }

    const populated = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'name email');
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/bookings/:id/cancel  (logged-in users)
// Lets a user cancel their own booking.
const cancelMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Make sure the booking belongs to the logged-in user.
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Make the room available again.
    await Room.findByIdAndUpdate(booking.room, { availability: true });

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelMyBooking,
};
