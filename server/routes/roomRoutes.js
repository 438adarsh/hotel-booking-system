// Room routes: public read access, admin-only create/update/delete.
const express = require('express');
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// GET /api/rooms - list rooms (supports search, filter, sort)
router.get('/', getRooms);

// GET /api/rooms/:id - get one room
router.get('/:id', getRoomById);

// POST /api/rooms - create a room (admin only)
router.post('/', protect, admin, createRoom);

// PUT /api/rooms/:id - update a room (admin only)
router.put('/:id', protect, admin, updateRoom);

// DELETE /api/rooms/:id - delete a room (admin only)
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;
