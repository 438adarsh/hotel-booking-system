// This file connects the server to MongoDB using Mongoose.
const mongoose = require('mongoose');

// connectDB reads the MongoDB connection string from environment variables
// and tries to connect. If it fails, it stops the server.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // stop the app if the database is not available
  }
};

module.exports = connectDB;
