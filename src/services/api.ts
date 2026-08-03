// This file is the single place that talks to the backend API.
// Every page imports from here instead of writing fetch() calls directly.

import type { Room } from '../types';

// The backend URL. In development, the Express server runs on port 5000.
const API_URL = 'http://localhost:5000/api';

// Helper: get the saved JWT token from localStorage.
const getToken = () => localStorage.getItem('token') || '';

// Helper: a wrapper around fetch that adds JSON headers and the auth token,
// parses the JSON response, and throws on errors.
async function request(method: string, path: string, body?: any) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  // If the response status is not OK, throw an error with the message.
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// --- Auth API ---
export const authApi = {
  register: (name: string, email: string, password: string) =>
    request('POST', '/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    request('POST', '/auth/login', { email, password }),
  getMe: () => request('GET', '/auth/me'),
};

// --- Rooms API ---
export const roomApi = {
  // query is an object of search/filter/sort params.
  getRooms: (query: Record<string, string> = {}) => {
    // Convert the query object to a URL query string.
    const qs = new URLSearchParams(query).toString();
    return request('GET', `/rooms${qs ? `?${qs}` : ''}`);
  },
  getRoomById: (id: string) => request('GET', `/rooms/${id}`),
  createRoom: (room: Partial<Room>) => request('POST', '/rooms', room),
  updateRoom: (id: string, room: Partial<Room>) =>
    request('PUT', `/rooms/${id}`, room),
  deleteRoom: (id: string) => request('DELETE', `/rooms/${id}`),
};

// --- Bookings API ---
export const bookingApi = {
  createBooking: (roomId: string, checkInDate: string, checkOutDate: string) =>
    request('POST', '/bookings', { room: roomId, checkInDate, checkOutDate }),
  getMyBookings: () => request('GET', '/bookings/my'),
  getAllBookings: () => request('GET', '/bookings'),
  updateBookingStatus: (id: string, bookingStatus: string) =>
    request('PUT', `/bookings/${id}/status`, { bookingStatus }),
  cancelMyBooking: (id: string) => request('PUT', `/bookings/${id}/cancel`),
};

// --- Admin API ---
export const adminApi = {
  getDashboardStats: () => request('GET', '/admin/dashboard'),
  getAllUsers: () => request('GET', '/admin/users'),
  updateUser: (id: string, data: { name?: string; role?: string }) =>
    request('PUT', `/admin/users/${id}`, data),
  deleteUser: (id: string) => request('DELETE', `/admin/users/${id}`),
};
