// ProtectedRoute: a wrapper that only lets logged-in users (or admins) see a page.
// If not allowed, it sends them to the login page.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean; // if true, only admins can access
}

function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // While we check the token, show a loading message.
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // Not logged in -> go to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin, and the page is admin-only -> go to home.
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show the page.
  return <>{children}</>;
}

export default ProtectedRoute;
