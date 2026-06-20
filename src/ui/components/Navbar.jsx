import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, Trash2, X, AlertTriangle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { removePurchase, removeRental, clearCart } from '../../redux/slices/cartSlice';
import { useTheme } from '../../Providers/ThemeContext.jsx';
import HemetValleyLogo from './HemetValleyLogo.jsx';

const Navbar = ({ activePage = 'home' }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  // Get cart states from Redux
  const stagedPurchases = useSelector((state) => state.cart.stagedPurchases);
  const stagedRentals = useSelector((state) => state.cart.stagedRentals);

  // Total item count in cart
  const cartCount = stagedPurchases.reduce((acc, item) => acc + item.quantity, 0) + stagedRentals.length;

  // Toggle dropdown visibility
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCartDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const isHome = activePage === 'home';

  const linkClass = (page) => {
    return activePage === page
      ? 'text-amber-500 transition-colors'
      : 'text-zinc-400 hover:text-white transition-colors';
  };

  const handleRemovePurchase = (productId) => {
    dispatch(removePurchase(productId));
  };

  const handleRemoveRental = (productId) => {
    dispatch(removeRental(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <nav className="border-b border-zinc-800 bg-[#0F0F0F] sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <HemetValleyLogo className="w-12 h-12" />
            <div className="flex flex-col text-left">
              <span className="text-white font-black font-header text-lg sm:text-xl tracking-wider leading-none">HEMET VALLEY TOOLS</span>
              <span className="text-[9px] sm:text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-1">EST. 1985 / WEAPONS OF MASS CONSTRUCTION</span>
            </div>
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-8 font-header uppercase tracking-wider text-xs lg:text-sm font-semibold">
            {isHome ? (
              <a 
                href="#hero" 
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`${linkClass('home')} cursor-pointer`}
                aria-current="page"
              >
                Home
              </a>
            ) : (
              <Link to="/" className={linkClass('home')} aria-current={activePage === 'home' ? "page" : undefined}>Home</Link>
            )}
            <Link to="/services" className={linkClass('services')} aria-current={activePage === 'services' ? "page" : undefined}>Services</Link>
            <Link to="/rentals" className={linkClass('rentals')} aria-current={activePage === 'rentals' ? "page" : undefined}>Rentals</Link>
            <Link to="/products" className={linkClass('products')} aria-current={activePage === 'products' ? "page" : undefined}>Products</Link>
            <Link to="/repair" className={linkClass('repair')} aria-current={activePage === 'repair' ? "page" : undefined}>Repairs</Link>
            <Link to="/b2b" className={linkClass('b2b')} aria-current={activePage === 'b2b' ? "page" : undefined}>Pro B2B</Link>
          </div>

          {/* Action Hub (Theme Toggle, Shopping Cart, Instant Reserve) */}
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            
            {/* Interactive Cart Button with Floating Count Badge */}
            <button
              onClick={() => setShowCartDropdown(!showCartDropdown)}
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center relative"
              aria-label="Open Staging Cart"
              aria-expanded={showCartDropdown}
              aria-haspopup="true"
              aria-controls="cart-dropdown-menu"
              title="View Staged Tool Reservations"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-mono font-black px-1.5 py-0.5 rounded-none border border-black animate-pulse flex items-center justify-center min-w-5 h-5">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Cart Dropdown Modal/Panel */}
            {showCartDropdown && (
              <div 
                id="cart-dropdown-menu"
                role="dialog"
                aria-label="Staged Reservations"
                className="absolute right-0 top-14 w-80 sm:w-96 bg-[#0F0F0F] border border-zinc-800 rounded-none shadow-2xl p-5 z-50 text-left animate-fadeIn"
              >
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                  <h4 className="font-header uppercase tracking-wider text-sm font-black text-white flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-amber-500" /> Staged Reservations
                  </h4>
                  <button 
                    onClick={() => setShowCartDropdown(false)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {stagedPurchases.length === 0 && stagedRentals.length === 0 ? (
                  <div className="py-8 text-center text-zinc-500">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
                    <p className="text-xs font-mono uppercase tracking-widest">No tools staged yet</p>
                    <p className="text-[10px] font-light text-zinc-600 mt-1">Browse our products or rentals to secure equipment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                      
                      {/* Staged Purchases */}
                      {stagedPurchases.map((item) => (
                        <div key={item.product.id} className="bg-zinc-950 border border-zinc-900 px-3 py-2 flex justify-between items-center gap-3">
                          <div className="min-w-0 flex-1 text-left">
                            <span className="text-[8px] font-mono uppercase tracking-widest text-amber-500 font-bold block">RETAIL PURCHASE</span>
                            <span className="text-xs text-zinc-200 font-header uppercase tracking-wide truncate block">{item.product.name}</span>
                            <span className="text-[10px] font-mono text-zinc-500 mt-0.5 block">{item.quantity}x @ ${item.product.price}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-white">${item.product.price * item.quantity}</span>
                            <button
                              onClick={() => handleRemovePurchase(item.product.id)}
                              className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                              aria-label={`Remove ${item.product.name} from cart`}
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Staged Rentals */}
                      {stagedRentals.map((item) => (
                        <div key={item.product.id} className="bg-zinc-950 border border-zinc-900 px-3 py-2 flex justify-between items-center gap-3">
                          <div className="min-w-0 flex-1 text-left">
                            <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">FLEET RENTAL</span>
                            <span className="text-xs text-zinc-200 font-header uppercase tracking-wide truncate block">{item.product.name}</span>
                            <span className="text-[10px] font-mono text-zinc-500 mt-0.5 block">Starts: {item.rentDate} ({item.rentalDays} Days)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleRemoveRental(item.product.id)}
                              className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                              aria-label={`Remove ${item.product.name} from cart`}
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                    </div>

                    {/* Footer Staged Summary */}
                    <div className="border-t border-zinc-900 pt-4 space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-zinc-500 uppercase">Staged items:</span>
                        <span className="text-white font-bold">{cartCount} Total</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleClearCart}
                          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 py-2.5 px-3 text-2xs uppercase font-header tracking-wider font-bold transition-all text-center rounded-none cursor-pointer"
                        >
                          Clear Staging
                        </button>
                        <Link
                          to="/checkout"
                          onClick={() => setShowCartDropdown(false)}
                          className="bg-amber-500 hover:bg-white text-black font-header uppercase tracking-wider font-black py-2.5 px-3 text-2xs text-center transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center"
                        >
                          Book Dispatch
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Staff Pro Portal — separate from public Pro B2B contractor applications */}
            <Link
              to="/pro-portal"
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-500 hover:text-white transition-all duration-300 rounded-none cursor-pointer flex items-center gap-1.5 text-2xs font-mono font-bold tracking-wider uppercase"
              title="Staff Pro Portal Login"
            >
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
              Pro Portal
            </Link>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-500 transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center"
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              title="Toggle Light / Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {/* Instant Reserve button */}
            {isHome ? (
              <a 
                href="#scheduler" 
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('scheduler');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-zinc-900 border border-zinc-700 text-white font-header uppercase tracking-widest text-xs py-2.5 px-5 hover:bg-white hover:text-black transition-all duration-300 rounded-none font-bold hidden sm:block shrink-0 cursor-pointer"
              >
                Instant Reserve
              </a>
            ) : (
              <Link 
                to="/" 
                state={{ scrollToSection: 'scheduler' }}
                className="bg-zinc-900 border border-zinc-700 text-white font-header uppercase tracking-widest text-xs py-2.5 px-5 hover:bg-white hover:text-black transition-all duration-300 rounded-none font-bold hidden sm:block shrink-0 text-center"
              >
                Instant Reserve
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;