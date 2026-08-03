// Booking model: stores a user's reservation for a room.
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Reference to the user who made the booking.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Reference to the room that was booked.
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true }, // price * number of nights
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
