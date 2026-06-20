import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RefreshCw } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, isAdmin, initializing } = useSelector((state) => state.auth);

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-400">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-amber-500 mb-3" />
          <p className="text-xs font-mono uppercase tracking-widest">Verifying staff credentials...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/pro-login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;