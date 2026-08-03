// Navbar: the top navigation bar shown on every page.
// Links change based on whether the user is logged in and whether they are admin.

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, LogOut, User as UserIcon, Shield } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle the logout button: clear the user and go to the home page.
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        {/* Logo / brand */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Hotel className="w-6 h-6 text-sky-400" />
          StayEase
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-1 sm:gap-4 text-sm flex-wrap">
          <Link to="/" className="px-3 py-2 rounded hover:bg-slate-800 transition">
            Home
          </Link>
          <Link to="/rooms" className="px-3 py-2 rounded hover:bg-slate-800 transition">
            Rooms
          </Link>

          {/* If logged in, show links that need auth */}
          {user && (
            <Link to="/my-bookings" className="px-3 py-2 rounded hover:bg-slate-800 transition">
              My Bookings
            </Link>
          )}

          {/* If admin, show admin links */}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className="px-3 py-2 rounded hover:bg-slate-800 transition flex items-center gap-1">
                <Shield className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/admin/rooms" className="px-3 py-2 rounded hover:bg-slate-800 transition">
                Manage Rooms
              </Link>
              <Link to="/admin/bookings" className="px-3 py-2 rounded hover:bg-slate-800 transition">
                Bookings
              </Link>
              <Link to="/admin/users" className="px-3 py-2 rounded hover:bg-slate-800 transition">
                Users
              </Link>
            </>
          )}

          {/* If not logged in, show login/register. If logged in, show profile + logout. */}
          {!user ? (
            <>
              <Link to="/login" className="px-3 py-2 rounded hover:bg-slate-800 transition">
                Login
              </Link>
              <Link to="/register" className="px-3 py-2 rounded bg-sky-500 hover:bg-sky-600 transition">
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <Link to="/profile" className="px-3 py-2 rounded hover:bg-slate-800 transition flex items-center gap-1">
                <UserIcon className="w-4 h-4" /> {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded hover:bg-slate-800 transition flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
