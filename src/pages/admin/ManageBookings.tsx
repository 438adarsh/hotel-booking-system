// ManageBookings page (admin): view all bookings and update their status.

import { useEffect, useState } from 'react';
import { bookingApi } from '../../services/api';
import type { Booking } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  // Load all bookings.
  const loadBookings = () => {
    setLoading(true);
    bookingApi
      .getAllBookings()
      .then((data: Booking[]) => setBookings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Change a booking's status.
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await bookingApi.updateBookingStatus(id, status);
      showToast('Booking status updated', 'success');
      loadBookings();
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  // Color helper for status badges.
  const badgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-sky-100 text-sky-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Bookings</h1>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Check-in</th>
                <th className="px-4 py-3">Check-out</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{b.user?.name}</td>
                  <td className="px-4 py-3">{b.room?.name}</td>
                  <td className="px-4 py-3">{new Date(b.checkInDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(b.checkOutDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium">${b.totalPrice}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${badgeColor(b.bookingStatus)}`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={b.bookingStatus}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                      <option value="completed">completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageBookings;
