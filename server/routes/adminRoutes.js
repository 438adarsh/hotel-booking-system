// Admin routes: dashboard stats and user management.
const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// All admin routes require login + admin role.
router.use(protect, admin);

// GET /api/admin/dashboard - summary counts
router.get('/dashboard', getDashboardStats);

// GET /api/admin/users - list all users
router.get('/users', getAllUsers);

// PUT /api/admin/users/:id - update a user
router.put('/users/:id', updateUser);

// DELETE /api/admin/users/:id - delete a user
router.delete('/users/:id', deleteUser);

module.exports = router;
