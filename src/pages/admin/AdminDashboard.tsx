// AdminDashboard page: shows summary cards for the admin.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import type { DashboardStats } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Users, BedDouble, CalendarCheck, DoorOpen } from 'lucide-react';

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load the dashboard stats from the admin API.
  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then((data: DashboardStats) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  // Card definitions.
  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: <Users className="w-6 h-6" />, color: 'bg-sky-50 text-sky-700', link: '/admin/users' },
    { label: 'Total Rooms', value: stats?.totalRooms ?? 0, icon: <BedDouble className="w-6 h-6" />, color: 'bg-violet-50 text-violet-700', link: '/admin/rooms' },
    { label: 'Total Bookings', value: stats?.totalBookings ?? 0, icon: <CalendarCheck className="w-6 h-6" />, color: 'bg-amber-50 text-amber-700', link: '/admin/bookings' },
    { label: 'Available Rooms', value: stats?.availableRooms ?? 0, icon: <DoorOpen className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-700', link: '/admin/rooms' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.link}
            className={`rounded-xl border border-gray-200 p-5 hover:shadow-md transition ${c.color}`}
          >
            <div className="flex items-center gap-2">
              {c.icon}
              <span className="text-sm font-medium">{c.label}</span>
            </div>
            <p className="text-3xl font-bold mt-3">{c.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to="/admin/rooms" className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
            Manage Rooms
          </Link>
          <Link to="/admin/bookings" className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
            View All Bookings
          </Link>
          <Link to="/admin/users" className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
