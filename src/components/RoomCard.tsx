// RoomCard: a small card showing a room's photo, name, type, price, and a "View" button.
// Used on the Rooms page and the Home page.

import { Link } from 'react-router-dom';
import { Users, DollarSign } from 'lucide-react';
import type { Room } from '../types';

function RoomCard({ room }: { room: Room }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">
      {/* Room image */}
      <div className="h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Room info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{room.name}</h3>
          <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">
            {room.roomType}
          </span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{room.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {room.capacity} guests
          </span>
          <span className="flex items-center gap-1 font-medium text-gray-900">
            <DollarSign className="w-4 h-4" /> {room.price} / night
          </span>
        </div>

        {/* Status badge */}
        <div className="mt-1">
          {room.availability ? (
            <span className="text-xs font-medium text-emerald-600">Available</span>
          ) : (
            <span className="text-xs font-medium text-red-500">Booked</span>
          )}
        </div>

        {/* View details button */}
        <Link
          to={`/rooms/${room._id}`}
          className="mt-3 text-center bg-slate-900 text-white text-sm py-2 rounded-lg hover:bg-slate-800 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default RoomCard;
