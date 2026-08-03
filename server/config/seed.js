// Seed script: creates the admin user and 8 sample rooms.
// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const User = require('../models/User');
const Room = require('../models/Room');

const runSeed = async () => {
  try {
    // Connect to the database.
    await connectDB();

    // Clear existing users and rooms so seeding is repeatable.
    await User.deleteMany({});
    await Room.deleteMany({});
    console.log('Cleared existing users and rooms.');

    // Create the admin user.
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin123', // hashed automatically by the User model
      role: 'admin',
    });
    console.log(`Admin user created: ${admin.email}`);

    // Create 8 sample rooms with different types and prices.
    const rooms = await Room.insertMany([
      {
        name: 'Cozy Standard Room',
        roomNumber: '101',
        roomType: 'Standard',
        description:
          'A comfortable standard room with a queen bed, free Wi-Fi, and a private bathroom. Perfect for solo travelers or couples on a budget.',
        price: 80,
        capacity: 2,
        image:
          'https://images.pexels.com/photos/2889618/pexels-photo-2889618.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        availability: true,
      },
      {
        name: 'Garden View Standard',
        roomNumber: '102',
        roomType: 'Standard',
        description:
          'A bright standard room overlooking the hotel garden. Includes a work desk, flat-screen TV, and complimentary breakfast.',
        price: 95,
        capacity: 2,
        image:
          'https://images.pexels.com/photos/26139/pexels-photo-26139.jpg?auto=compress&cs=tinysrgb&h=650&w=940',
        availability: true,
      },
      {
        name: 'Deluxe Twin Room',
        roomNumber: '201',
        roomType: 'Deluxe',
        description:
          'A spacious deluxe room with two twin beds, a sitting area, and a modern en-suite bathroom with premium toiletries.',
        price: 140,
        capacity: 3,
        image:
          'https://images.pexels.com/photos/3688261/pexels-photo-3688261.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        availability: true,
      },
      {
        name: 'Deluxe City View',
        roomNumber: '202',
        roomType: 'Deluxe',
        description:
          'Enjoy panoramic city views from this deluxe room. Features a king bed, mini-bar, and a large flat-screen TV.',
        price: 160,
        capacity: 3,
        image:
          'https://images.pexels.com/photos/36386162/pexels-photo-36386162.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        availability: true,
      },
      {
        name: 'Executive Suite',
        roomNumber: '301',
        roomType: 'Suite',
        description:
          'An elegant one-bedroom suite with a separate living room, sofa, and a marble bathroom. Ideal for business travelers.',
        price: 250,
        capacity: 4,
        image:
          'https://images.pexels.com/photos/2725675/pexels-photo-2725675.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        availability: true,
      },
      {
        name: 'Honeymoon Suite',
        roomNumber: '302',
        roomType: 'Suite',
        description:
          'A romantic suite with a king bed, a private balcony, and a whirlpool tub. Champagne and flowers on arrival.',
        price: 300,
        capacity: 2,
        image:
          'https://images.pexels.com/photos/26859049/pexels-photo-26859049.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        availability: true,
      },
      {
        name: 'Family Grand Room',
        roomNumber: '401',
        roomType: 'Family',
        description:
          'A large room with one king bed and two single beds. Includes a kitchenette and plenty of space for the whole family.',
        price: 180,
        capacity: 5,
        image:
          'https://images.pexels.com/photos/8082217/pexels-photo-8082217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        availability: true,
      },
      {
        name: 'Presidential Suite',
        roomNumber: '501',
        roomType: 'Suite',
        description:
          'Our top-tier suite with a bedroom, living room, dining area, and a private terrace. Includes 24/7 butler service.',
        price: 500,
        capacity: 4,
        image:
          'https://images.pexels.com/photos/34645081/pexels-photo-34645081.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        availability: true,
      },
    ]);
    console.log(`Created ${rooms.length} sample rooms.`);

    console.log('\nSeeding complete!');
    console.log('Admin login -> email: admin@gmail.com  password: admin123');
    process.exit(0);
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

runSeed();
