// Room controller: handles all CRUD for rooms and search/filter/sort.
const Room = require('../models/Room');

// GET /api/rooms
// Returns a list of rooms. Supports search, filter, and sort via query params.
const getRooms = async (req, res) => {
  try {
    // Build a MongoDB query object based on the query params.
    const query = {};

    // Search by name or room type (case-insensitive).
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [{ name: searchRegex }, { roomType: searchRegex }];
    }

    // Filter by room type.
    if (req.query.roomType) {
      query.roomType = req.query.roomType;
    }

    // Filter by maximum price (rooms cheaper than or equal to this).
    if (req.query.maxPrice) {
      query.price = { ...query.price, $lte: Number(req.query.maxPrice) };
    }

    // Filter by minimum capacity (rooms that fit at least this many guests).
    if (req.query.capacity) {
      query.capacity = { ...query.capacity, $gte: Number(req.query.capacity) };
    }

    // Filter by availability (true/false).
    if (req.query.availability) {
      query.availability = req.query.availability === 'true';
    }

    // Sorting. Default is by createdAt descending (newest first).
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      if (req.query.sort === 'price_low') sort = { price: 1 };
      else if (req.query.sort === 'price_high') sort = { price: -1 };
      else if (req.query.sort === 'name') sort = { name: 1 };
    }

    const rooms = await Room.find(query).sort(sort);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/rooms/:id
// Returns a single room by its id.
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/rooms  (admin only)
// Creates a new room.
const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/rooms/:id  (admin only)
// Updates a room.
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true,
    });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/rooms/:id  (admin only)
// Deletes a room.
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
