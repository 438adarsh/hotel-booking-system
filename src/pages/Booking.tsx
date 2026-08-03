// Booking page: lets a logged-in user pick check-in/out dates and confirm a booking.

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { roomApi, bookingApi } from '../services/api';
import type { Room } from '../types';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, DollarSign } from 'lucide-react';

// Helper: calculate number of nights between two date strings.
const nightsBetween = (checkIn: string, checkOut: string) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
};

function Booking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Date inputs. Default check-in = today, check-out = tomorrow.
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);

  // Load the room so we can show its price and details.
  useEffect(() => {
    if (!id) return;
    roomApi
      .getRoomById(id)
      .then((data: Room) => setRoom(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Calculate the total price based on selected nights.
  const nights = nightsBetween(checkInDate, checkOutDate);
  const totalPrice = room ? room.price * (nights > 0 ? nights : 0) : 0;

  // Handle the confirm booking button.
  const handleConfirm = async () => {
    setError('');

    // Validation: dates must be selected.
    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    // Validation: check-out must be after check-in.
    if (nights <= 0) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setSubmitting(true);
    try {
      await bookingApi.createBooking(id!, checkInDate, checkOutDate);
      showToast('Booking confirmed!', 'success');
      navigate('/my-bookings');
    } catch (err: any) {
      setError(err.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error && !room) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        <Link to="/rooms" className="text-sky-600 mt-4 inline-block">
          ← Back to rooms
        </Link>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Room</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Room summary */}
        <div className="flex gap-4 mb-6">
          <img
            src={room.image}
            alt={room.name}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div>
            <h2 className="font-semibold text-gray-900">{room.name}</h2>
            <p className="text-sm text-gray-500">{room.roomType}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              ${room.price} / night
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Date pickers */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" /> Check-in
            </label>
            <input
              type="date"
              value={checkInDate}
              min={today}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" /> Check-out
            </label>
            <input
              type="date"
              value={checkOutDate}
              min={checkInDate || today}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Price summary */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>${room.price} × {nights > 0 ? nights : 0} nights</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 mt-2">
            <span className="flex items-center">
              <DollarSign className="w-4 h-4" /> Total
            </span>
            <span>${totalPrice}</span>
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
        >
          {submitting ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}

export default Booking;
