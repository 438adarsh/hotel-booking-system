// Rooms page: lists all rooms with search, filter, and sort controls.

import { useEffect, useState } from 'react';
import { roomApi } from '../services/api';
import type { Room } from '../types';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal } from 'lucide-react';

function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter/sort/search state
  const [search, setSearch] = useState('');
  const [roomType, setRoomType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [sort, setSort] = useState('');

  // Fetch rooms whenever the filters change.
  useEffect(() => {
    setLoading(true);
    // Build the query object from the current filter values.
    const query: Record<string, string> = {};
    if (search) query.search = search;
    if (roomType) query.roomType = roomType;
    if (maxPrice) query.maxPrice = maxPrice;
    if (capacity) query.capacity = capacity;
    if (sort) query.sort = sort;

    roomApi
      .getRooms(query)
      .then((data: Room[]) => setRooms(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, roomType, maxPrice, capacity, sort]);

  // Clear all filters.
  const clearFilters = () => {
    setSearch('');
    setRoomType('');
    setMaxPrice('');
    setCapacity('');
    setSort('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Rooms</h1>

      {/* Search + filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by room name or type..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">All types</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Family">Family</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Max Price / night
            </label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Any price</option>
              <option value="100">Up to $100</option>
              <option value="200">Up to $200</option>
              <option value="300">Up to $300</option>
              <option value="500">Up to $500</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Min Capacity
            </label>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Any capacity</option>
              <option value="2">2+ guests</option>
              <option value="3">3+ guests</option>
              <option value="4">4+ guests</option>
              <option value="5">5+ guests</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              <SlidersHorizontal className="w-3 h-3 inline mr-1" /> Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Default</option>
              <option value="price_low">Lowest Price</option>
              <option value="price_high">Highest Price</option>
              <option value="name">Room Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Clear filters button */}
        <button
          onClick={clearFilters}
          className="mt-3 text-sm text-sky-600 hover:text-sky-700 font-medium"
        >
          Clear all filters
        </button>
      </div>

      {/* Rooms grid */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : rooms.length === 0 ? (
        <p className="text-gray-500">No rooms match your filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Rooms;
