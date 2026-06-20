import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, LogIn, AlertTriangle } from 'lucide-react';
import { signIn, clearAuthError } from '../redux/slices/auth.slice';
import { useTheme } from '../Providers/ThemeContext';
import HemetValleyLogo from '../ui/components/HemetValleyLogo';

const ProPortalLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from || '/pro-portal';

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(signIn({ email, password }));
    if (signIn.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#050505] flex items-center justify-center px-4">
        <div className="w-full max-w-md border border-zinc-800 bg-[#0F0F0F] p-8 relative">
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-amber-500/40" />

          <div className="flex items-center gap-3 mb-8">
            <HemetValleyLogo className="w-12 h-12" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">Internal Staff Only</p>
              <h1 className="text-xl font-black font-header uppercase text-white">Pro Portal Login</h1>
            </div>
          </div>

          <p className="text-xs text-zinc-500 font-light mb-6 leading-relaxed">
            Sign in to manage customer transactions, fleet bookings, cancellations, and operational adjustments. This is separate from the public Pro B2B contractor application.
          </p>

          {error && (
            <div className="mb-4 border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2 text-red-400 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="staff-email" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">
                Staff Email
              </label>
              <input
                id="staff-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="team@hemetvalleytools.com"
              />
            </div>

            <div>
              <label htmlFor="staff-password" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">
                Password
              </label>
              <input
                id="staff-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-white text-black font-header uppercase tracking-wider font-black py-3 px-6 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : (
                <>
                  <LogIn className="w-4 h-4" /> Access Pro Portal
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Authorized personnel
            </span>
            <Link to="/" className="hover:text-amber-500 transition-colors">Back to storefront</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProPortalLoginPage;