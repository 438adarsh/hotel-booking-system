// MyBookings page: shows the logged-in user's bookings, grouped into
// upcoming stays and completed bookings. Users can cancel their own bookings.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../services/api';
import type { Booking as BookingType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { Calendar, X, CheckCircle2, Clock } from 'lucide-react';

function MyBookings() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  // Load the user's bookings.
  const loadBookings = () => {
    setLoading(true);
    bookingApi
      .getMyBookings()
      .then((data: BookingType[]) => setBookings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Cancel a booking.
  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking? The room will become available again.')) return;
    try {
      await bookingApi.cancelMyBooking(id);
      showToast('Booking cancelled', 'success');
      loadBookings(); // refresh the list
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel', 'error');
    }
  };

  // Split bookings into groups for the dashboard cards.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const active = bookings.filter(
    (b) => b.bookingStatus === 'confirmed' && new Date(b.checkOutDate) >= today
  );
  const completed = bookings.filter(
    (b) => b.bookingStatus === 'completed' || new Date(b.checkOutDate) < today
  );
  const cancelled = bookings.filter((b) => b.bookingStatus === 'cancelled');

  // Helper to render a single booking row.
  const renderBooking = (b: BookingType) => (
    <div
      key={b._id}
      className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
    >
      {/* Room image */}
      <img
        src={b.room?.image}
        alt={b.room?.name}
        className="w-full sm:w-32 h-32 object-cover rounded-lg"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-semibold text-gray-900">{b.room?.name}</h3>
          <StatusBadge status={b.bookingStatus} />
        </div>
        <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {new Date(b.checkInDate).toLocaleDateString()} → {new Date(b.checkOutDate).toLocaleDateString()}
          </span>
          <span className="font-medium text-gray-900">${b.totalPrice}</span>
        </div>
        {/* Cancel button (only for confirmed bookings) */}
        {b.bookingStatus === 'confirmed' && (
          <button
            onClick={() => handleCancel(b._id)}
            className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Cancel Booking
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard label="Total Bookings" value={bookings.length} icon={<Calendar className="w-5 h-5" />} color="sky" />
        <SummaryCard label="Upcoming Stays" value={active.length} icon={<Clock className="w-5 h-5" />} color="amber" />
        <SummaryCard label="Completed" value={completed.length} icon={<CheckCircle2 className="w-5 h-5" />} color="emerald" />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500">You have no bookings yet.</p>
          <Link to="/rooms" className="text-sky-600 font-medium mt-2 inline-block">
            Browse rooms →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <section>
              <h2 className="font-semibold text-gray-900 mb-3">Upcoming Stays</h2>
              <div className="space-y-3">{active.map(renderBooking)}</div>
            </section>
          )}
          {completed.length > 0 && (
            <section>
              <h2 className="font-semibold text-gray-900 mb-3">Completed Bookings</h2>
              <div className="space-y-3">{completed.map(renderBooking)}</div>
            </section>
          )}
          {cancelled.length > 0 && (
            <section>
              <h2 className="font-semibold text-gray-900 mb-3">Cancelled</h2>
              <div className="space-y-3">{cancelled.map(renderBooking)}</div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

// Small component for a status badge.
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-sky-100 text-sky-700',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colors[status] || colors.pending}`}>
      {status}
    </span>
  );
}

// Small summary card used at the top.
function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    sky: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  slate: 'bg-slate-50 text-slate-700',
  violet: 'bg-violet-50 text-violet-700',
  rose: 'bg-rose-50 text-rose-700',
  indigo: 'bg-indigo-50 text-indigo-700',
  teal: 'bg-teal-50 text-teal-700',
    orange: 'bg-orange-50 text-orange-700',
    lime: 'bg-lime-50 text-lime-700',
    cyan: 'bg-cyan-50 text-cyan-700',
    fuchsia: 'bg-fuchsia-50 text-fuchsia-700',
    pink: 'bg-pink-50 text-pink-700',
    purple: 'bg-purple-50 text-purple-700',
  green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    gray: 'bg-gray-50 text-gray-700',
    neutral: 'bg-neutral-50 text-neutral-700',
    stone: 'bg-stone-50 text-stone-700',
    zinc: 'bg-zinc-50 text-zinc-700',
  };
  return (
    <div className={`rounded-xl border border-gray-200 p-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default MyBookings;
