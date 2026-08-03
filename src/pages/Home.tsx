// Home page: a hero section with a welcome message and a few featured rooms.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roomApi } from '../services/api';
import type { Room } from '../types';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Hotel, Search, Shield, Calendar } from 'lucide-react';

function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Load the first 3 rooms to show as featured.
  useEffect(() => {
    roomApi
      .getRooms()
      .then((data: Room[]) => setRooms(data.slice(0, 3)))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero section */}
      <section className="relative bg-slate-900 text-white">
        <img
          src="https://images.pexels.com/photos/14011664/pexels-photo-14011664.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Hotel lobby"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Find your perfect stay
          </h1>
          <p className="mt-4 text-lg text-slate-200 max-w-xl">
            Book comfortable rooms in seconds. Browse, filter, and reserve your
            next getaway with StayEase.
          </p>
          <div className="mt-8 flex gap-3 flex-wrap">
            <Link
              to="/rooms"
              className="bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition"
            >
              <Search className="w-5 h-5" /> Browse Rooms
            </Link>
            <Link
              to="/register"
              className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg font-medium transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <Search className="w-8 h-8 mx-auto text-sky-600" />
          <h3 className="mt-3 font-semibold">Search & Filter</h3>
          <p className="text-sm text-gray-500 mt-1">
            Find rooms by type, price, and capacity.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <Calendar className="w-8 h-8 mx-auto text-sky-600" />
          <h3 className="mt-3 font-semibold">Easy Booking</h3>
          <p className="text-sm text-gray-500 mt-1">
            Reserve your room in just a few clicks.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <Shield className="w-8 h-8 mx-auto text-sky-600" />
          <h3 className="mt-3 font-semibold">Secure Accounts</h3>
          <p className="text-sm text-gray-500 mt-1">
            Protected login with role-based access.
          </p>
        </div>
      </section>

      {/* Featured rooms */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Hotel className="w-6 h-6 text-sky-600" /> Featured Rooms
          </h2>
          <Link to="/rooms" className="text-sky-600 hover:text-sky-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : rooms.length === 0 ? (
          <p className="text-gray-500">No rooms available yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
