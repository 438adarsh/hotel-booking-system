// Shared TypeScript types used across the frontend.
// Keeping them in one place makes them easy to reuse.

// A user account (returned by the auth API, password excluded).
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  token?: string;
}

// A hotel room.
export interface Room {
  _id: string;
  name: string;
  roomNumber: string;
  roomType: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  availability: boolean;
}

// A booking made by a user for a room.
export interface Booking {
  _id: string;
  user: { _id: string; name: string; email: string };
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

// Dashboard summary stats returned by the admin API.
export interface DashboardStats {
  totalUsers: number;
  totalRooms: number;
  availableRooms: number;
  totalBookings: number;
}
