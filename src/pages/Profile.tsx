// Profile page: shows the logged-in user's account info.

import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Shield } from 'lucide-react';

function Profile() {
  const { user } = useAuth();

  // If there's no user (shouldn't happen because of ProtectedRoute), show nothing.
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Avatar circle with first letter of name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                user.role === 'admin'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-sky-100 text-sky-700'
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>

        {/* Account details */}
        <div className="mt-6 space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <UserIcon className="w-4 h-4 text-gray-400" />
            <span>Name: {user.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>Email: {user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Shield className="w-4 h-4 text-gray-400" />
            <span>Role: {user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
