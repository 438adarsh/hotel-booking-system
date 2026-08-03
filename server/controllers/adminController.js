// Admin controller: dashboard stats and user management.
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// GET /api/admin/dashboard  (admin only)
// Returns summary counts for the admin dashboard.
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ availability: true });
    const totalBookings = await Booking.countDocuments();

    res.json({
      totalUsers,
      totalRooms,
      availableRooms,
      totalBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/users  (admin only)
// Returns all users.
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/users/:id  (admin only)
// Updates a user's name or role.
const updateUser = async (req, res) => {
  try {
    const { name, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:id  (admin only)
// Deletes a user.
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
};
