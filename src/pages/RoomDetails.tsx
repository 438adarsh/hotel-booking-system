// RoomDetails page: shows full info about one room and a "Book Now" button.

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { roomApi } from '../services/api';
import type { Room } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Users, DollarSign, BedDouble, ArrowLeft } from 'lucide-react';

function RoomDetails() {
  // Get the room id from the URL.
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load the room by id.
  useEffect(() => {
    if (!id) return;
    roomApi
      .getRoomById(id)
      .then((data: Room) => setRoom(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Handle the "Book Now" button.
  const handleBook = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/book/${id}`);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        <Link to="/rooms" className="text-sky-600 mt-4 inline-block">
          ← Back to rooms
        </Link>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/rooms" className="text-sky-600 hover:text-sky-700 text-sm mb-4 inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to rooms
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Room image */}
        <div className="h-72 w-full overflow-hidden bg-gray-100">
          <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
        </div>

        {/* Room info */}
        <div className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
            <span className="text-sm bg-sky-100 text-sky-700 px-3 py-1 rounded-full">
              {room.roomType}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" /> Room {room.roomNumber}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" /> Up to {room.capacity} guests
            </span>
            <span className="flex items-center gap-1 font-medium text-gray-900">
              <DollarSign className="w-4 h-4" /> {room.price} / night
            </span>
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed">{room.description}</p>

          {/* Availability + book button */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
            <span
              className={`text-sm font-medium ${
                room.availability ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {room.availability ? 'Available for booking' : 'Currently booked'}
            </span>
            <button
              onClick={handleBook}
              disabled={!room.availability}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {user ? 'Book Now' : 'Login to Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
