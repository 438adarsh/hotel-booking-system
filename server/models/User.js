// User model: stores account info and handles password hashing.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the shape of a user document.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // role can be "admin" or "user". Default is "user".
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Before saving a user, hash the password if it was changed.
userSchema.pre('save', async function (next) {
  // Only hash if the password field was modified.
  if (!this.isModified('password')) return next();

  // Generate a salt and hash the password.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper method to compare a plain password with the stored hashed password.
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
