// Room model: stores information about each hotel room.
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // friendly name, e.g. "Deluxe Ocean View"
    roomNumber: { type: String, required: true }, // number shown on the door
    roomType: { type: String, required: true }, // e.g. Standard, Deluxe, Suite
    description: { type: String, default: '' },
    price: { type: Number, required: true }, // price per night
    capacity: { type: Number, required: true }, // max guests
    image: { type: String, default: '' }, // URL to a room photo
    availability: { type: Boolean, default: true }, // is it bookable right now?
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
