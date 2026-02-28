import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogIn, Home } from 'lucide-react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-14 h-14 overflow-hidden">
              <img src="/logo.png" alt="Zim-REC Logo" className="w-full h-full object-contain" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">You've been logged out</h2>
              <p className="text-sm text-gray-500">
                Your session has ended. Please log in again to continue.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/?login=true')}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-sm font-semibold shadow-sm transition-colors"
              >
                <LogIn size={18} />
                Log In
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 rounded-xl py-3 text-sm font-semibold transition-colors"
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (adminOnly && !user?.is_superuser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
