import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../Providers/ThemeContext';
import { clearCart } from '../redux/slices/cartSlice';
import { submitTransactionThunk } from '../redux/slices/data.slice';
import { 
  ShieldCheck, 
  Trash2, 
  X, 
  MapPin, 
  Clock, 
  Truck, 
  Store, 
  CreditCard, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  Building, 
  Percent, 
  ChevronRight, 
  ArrowRight,
  Package,
  Wrench,
  Hammer
} from 'lucide-react';

import Navbar from '../ui/components/Navbar';
import Footer from '../ui/components/Footer';
import HemetValleyLogo from '../ui/components/HemetValleyLogo';
import SEO from '../ui/components/SEO';

const CheckoutPage = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();

  // Get cart states from Redux
  const stagedPurchases = useSelector((state) => state.cart.stagedPurchases);
  const stagedRentals = useSelector((state) => state.cart.stagedRentals);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [b2bId, setB2bId] = useState('');
  const [notes, setNotes] = useState('');
  
  // Dispatch Toggle: 'pickup' vs 'delivery'
  const [dispatchType, setDispatchType] = useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Submit and checkout states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [transactionReceipt, setTransactionReceipt] = useState(null);

  // Synchronous submit blocker
  const checkoutSubmitRef = useRef(false);

  // Calculations
  const purchasesSubtotal = stagedPurchases.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Rentals subtotal: rate * rentalDays
  const rentalsSubtotal = stagedRentals.reduce((acc, item) => {
    const rate = item.product.price; // Daily default fallback
    const totalRate = rate * (item.rentalDays || 1);
    return acc + totalRate;
  }, 0);

  const cartSubtotal = purchasesSubtotal + rentalsSubtotal;

  // 10% B2B Pro Account discount if a B2B ID is provided (any ID of 4+ characters matches)
  const isB2bDiscountApplied = b2bId.trim().length >= 4;
  const discountAmount = isB2bDiscountApplied ? Math.round(cartSubtotal * 0.1) : 0;
  
  const deliveryFee = dispatchType === 'delivery' ? 15 : 0;
  const estimatedTax = Math.round((cartSubtotal - discountAmount) * 0.08); // 8% local CA tax
  const cartTotal = cartSubtotal - discountAmount + deliveryFee + estimatedTax;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (checkoutSubmitRef.current || isSubmitting) return;

    if (!name || !phone) {
      alert('Please fill out all required contact fields.');
      return;
    }

    if (dispatchType === 'delivery' && !deliveryAddress) {
      alert('Please enter a target Jobsite address for delivery.');
      return;
    }

    checkoutSubmitRef.current = true;
    setIsSubmitting(true);

    try {
      const uniqueReceiptId = `HVT-TX-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const transactionData = {
        receiptId: uniqueReceiptId,
        customerName: name,
        phone,
        email,
        company: company || 'Walk-in Contractor',
        b2bId: b2bId || null,
        dispatchType,
        deliveryAddress: dispatchType === 'delivery' ? deliveryAddress : null,
        notes: notes || '',
        purchases: stagedPurchases.map(item => ({
          id: item.product.id,
          name: item.product.name,
          category: item.product.category,
          price: item.product.price,
          quantity: item.quantity
        })),
        rentals: stagedRentals.map(item => ({
          id: item.product.id,
          name: item.product.name,
          category: item.product.category,
          price: item.product.price,
          rentDate: item.rentDate,
          rentalDays: item.rentalDays
        })),
        pricing: {
          subtotal: cartSubtotal,
          discount: discountAmount,
          deliveryFee,
          tax: estimatedTax,
          total: cartTotal
        }
      };

      // Save to Firestore
      await dispatch(submitTransactionThunk(transactionData)).unwrap();

      // Save receipt state to display success state
      setTransactionReceipt(transactionData);
      setCheckoutSuccess(true);

      // Clear Redux Cart & LocalStorage
      dispatch(clearCart());
    } catch (err) {
      alert(`Checkout failed: ${err.message}`);
    } finally {
      checkoutSubmitRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      <SEO 
        title="Dispatch Checkout Terminal | Hemet Valley Tools"
        description="Finalize your staged equipment rentals and retail supply purchases. Select storefront pickup or jobsite dispatch delivery."
        keywords="equipment checkout, tool dispatch, construction rental checkout, secure tool booking, Hemet Valley Tools"
      />
      
      {/* Navbar navigation */}
      <Navbar activePage="checkout" />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {checkoutSuccess && transactionReceipt ? (
          /* --- SEAMLESS HIGH-FIDELITY SUCCESS receipt STATE --- */
          <div className="max-w-3xl mx-auto bg-[#111111] border-2 border-zinc-800 p-8 md:p-12 text-center relative glow-white overflow-hidden animate-fadeIn">
            {/* Corner industrial brackets decoration */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500 -mt-0.5 -ml-0.5"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500 -mt-0.5 -mr-0.5"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500 -mb-0.5 -ml-0.5"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500 -mb-0.5 -mr-0.5"></div>

            <div className="absolute -right-16 -bottom-16 w-48 h-48 pointer-events-none select-none z-0 opacity-10">
              <HemetValleyLogo className="w-full h-full" watermark={true} />
            </div>

            <div className="bg-green-500/15 border border-green-500/30 text-green-400 p-4 inline-block rounded-full mb-6">
              <ShieldCheck className="w-14 h-14 animate-pulse" />
            </div>

            <h2 className="text-3xl font-black font-header uppercase tracking-tight text-white mb-2">Dispatch Order Authorized!</h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-8 font-light">
              Your tool staging transaction has been successfully processed in our Hemet database system. Your active dispatch ticket is locked-in.
            </p>

            {/* Industrial Receipt Receipt Slip */}
            <div className="bg-[#161616] border border-zinc-800 text-left p-6 font-mono text-xs text-zinc-300 space-y-4 mb-8">
              <div className="border-b border-zinc-800 pb-3 flex justify-between items-center text-zinc-500">
                <span>RECEIPT: {transactionReceipt.receiptId}</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3 pb-3 border-b border-zinc-800">
                <span className="text-zinc-500 block uppercase font-bold text-2xs tracking-wider">SECURED ASSETS</span>
                {transactionReceipt.purchases.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <span>{item.quantity}x {item.name} (Retail)</span>
                    <span className="text-white">${item.price * item.quantity}</span>
                  </div>
                ))}
                {transactionReceipt.rentals.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div>
                      <span>{item.name} (Rental)</span>
                      <span className="text-zinc-500 text-[10px] block mt-0.5">Start: {item.rentDate} | Duration: {item.rentalDays} days</span>
                    </div>
                    <span className="text-white">${item.price * item.rentalDays}</span>
                  </div>
                ))}
              </div>

              {/* Dispatch Mode */}
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800 text-zinc-400">
                <span className="uppercase text-2xs font-bold tracking-wider text-zinc-500">DISPATCH COORDINATES</span>
                <span className="text-white uppercase font-bold text-2xs bg-zinc-800 border border-zinc-700 px-2 py-0.5">
                  {transactionReceipt.dispatchType === 'pickup' ? 'Storefront Pickup' : 'Jobsite Dispatch'}
                </span>
              </div>

              {transactionReceipt.dispatchType === 'delivery' && (
                <div className="pb-3 border-b border-zinc-800 text-zinc-400">
                  <span className="block text-zinc-500 text-2xs uppercase font-bold mb-1">TARGET DELIVERY SITE</span>
                  <span className="text-white text-xs">{transactionReceipt.deliveryAddress}</span>
                </div>
              )}

              {/* Pricing breakdown */}
              <div className="space-y-2 pt-1 font-mono">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Subtotal:</span>
                  <span>${transactionReceipt.pricing.subtotal}</span>
                </div>
                {transactionReceipt.pricing.discount > 0 && (
                  <div className="flex justify-between items-center text-green-400">
                    <span>10% Contractor Discount:</span>
                    <span>-${transactionReceipt.pricing.discount}</span>
                  </div>
                )}
                {transactionReceipt.pricing.deliveryFee > 0 && (
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Dispatch &amp; Flat Delivery:</span>
                    <span>+${transactionReceipt.pricing.deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Estimated local tax (8%):</span>
                  <span>+${transactionReceipt.pricing.tax}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-amber-500 border-t border-zinc-800 pt-3">
                  <span>TOTAL AUTHORIZED:</span>
                  <span>${transactionReceipt.pricing.total}</span>
                </div>
              </div>

              <div className="text-center text-zinc-500 text-[10px] pt-2 border-t border-zinc-900 border-dashed">
                * No charge online. Present matching corporate ID or contractor card at Storefront or at Dispatch arrival.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link
                to="/"
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-header uppercase tracking-wider font-bold py-3.5 px-8 transition-colors text-center"
              >
                Return to Home
              </Link>
              <Link
                to="/products"
                className="bg-amber-500 hover:bg-white text-black font-header uppercase tracking-wider font-black py-3.5 px-8 transition-colors text-center"
              >
                Secure More Gear <ArrowRight className="w-4 h-4 inline ml-2" />
              </Link>
            </div>
          </div>
        ) : (
          /* --- DUAL COLUMN CHECKOUT WORKSPACE --- */
          <div className="space-y-8 text-left">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-extrabold font-header uppercase leading-none text-white tracking-tight">Staging Dispatch Terminal</h1>
              <p className="text-zinc-400 text-sm max-w-2xl font-light">
                Complete your billing authorization below to lock-in your inventory dispatch reservation. There is no active online credit charge — payment is fully settled in-store or upon dispatch arrival.
              </p>
            </div>

            {stagedPurchases.length === 0 && stagedRentals.length === 0 ? (
              /* --- EMPTY STAGED STATE --- */
              <div className="bg-[#111111] border border-zinc-800 p-12 text-center max-w-xl mx-auto space-y-6 glow-white">
                <HemetValleyLogo className="w-20 h-24 mx-auto opacity-30" />
                <h3 className="text-2xl font-bold font-header uppercase text-white">Staging Terminal Empty</h3>
                <p className="text-zinc-500 text-sm max-w-sm mx-auto font-light">
                  You do not have any retail items or fleet equipment reservations currently staged in your active session cart.
                </p>
                <div className="pt-2">
                  <Link
                    to="/rentals"
                    className="bg-amber-500 hover:bg-white text-black font-header uppercase tracking-wider font-black py-3 px-6 transition-colors inline-block"
                  >
                    Browse Fleet Catalog
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side: Coordinates Form */}
                <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 bg-[#111111] border border-zinc-800 p-8 space-y-8 relative">
                  {/* Subtle corner highlight */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-amber-500"></div>

                  {/* Dispatch Toggle Module */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold uppercase font-header text-white pb-2 border-b border-zinc-800 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-amber-500" /> Dispatch Delivery Method
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Dispatch Delivery Method">
                      {/* Storefront Pickup Card */}
                      <div
                        role="radio"
                        aria-checked={dispatchType === 'pickup'}
                        tabIndex={0}
                        onClick={() => setDispatchType('pickup')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setDispatchType('pickup');
                          }
                        }}
                        className={`border-2 p-5 cursor-pointer flex gap-4 transition-all relative focus:ring-2 focus:ring-amber-500 focus:outline-none ${dispatchType === 'pickup' ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 bg-[#141414] hover:border-zinc-700'}`}
                      >
                        <Store className={`w-7 h-7 shrink-0 ${dispatchType === 'pickup' ? 'text-amber-500' : 'text-zinc-500'}`} />
                        <div className="space-y-1">
                          <span className="font-header font-bold text-white uppercase text-sm block">Hemet Storefront Pickup</span>
                          <span className="text-zinc-500 text-2xs block font-mono">FREE - PICK UP IN-STORE</span>
                          <span className="text-zinc-400 text-xs block font-light leading-snug">Present matching commercial ID inside our main yard storefront.</span>
                        </div>
                        {dispatchType === 'pickup' && (
                          <div className="absolute top-2 right-2 bg-amber-500 text-black p-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      {/* Jobsite Delivery Card */}
                      <div
                        role="radio"
                        aria-checked={dispatchType === 'delivery'}
                        tabIndex={0}
                        onClick={() => setDispatchType('delivery')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setDispatchType('delivery');
                          }
                        }}
                        className={`border-2 p-5 cursor-pointer flex gap-4 transition-all relative focus:ring-2 focus:ring-amber-500 focus:outline-none ${dispatchType === 'delivery' ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 bg-[#141414] hover:border-zinc-700'}`}
                      >
                        <Truck className={`w-7 h-7 shrink-0 ${dispatchType === 'delivery' ? 'text-amber-500' : 'text-zinc-500'}`} />
                        <div className="space-y-1">
                          <span className="font-header font-bold text-white uppercase text-sm block">Jobsite Delivery &amp; Dispatch</span>
                          <span className="text-zinc-500 text-2xs block font-mono">+$15 FLAT - FLAT DISPATCH FEE</span>
                          <span className="text-zinc-400 text-xs block font-light leading-snug">Expedited delivery directly to your jobsite coordinates in the Valley.</span>
                        </div>
                        {dispatchType === 'delivery' && (
                          <div className="absolute top-2 right-2 bg-amber-500 text-black p-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Coordinates */}
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold uppercase font-header text-white pb-2 border-b border-zinc-800 flex items-center gap-2">
                      <User className="w-5 h-5 text-amber-500" /> Dispatch Customer Coordinates
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label htmlFor="checkout-name" className="text-xs uppercase font-mono tracking-wider text-zinc-400 block">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <input
                            id="checkout-name"
                            type="text"
                            required
                            aria-required="true"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Contractor"
                            className="w-full bg-[#161616] border border-zinc-800 focus:border-amber-500 focus:outline-none text-white py-3 pl-10 pr-4 text-sm font-sans"
                          />
                        </div>
                      </div>

                      {/* Phone input */}
                      <div className="space-y-2">
                        <label htmlFor="checkout-phone" className="text-xs uppercase font-mono tracking-wider text-zinc-400 block">Mobile Phone *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <input
                            id="checkout-phone"
                            type="tel"
                            required
                            aria-required="true"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(951) 555-0199"
                            className="w-full bg-[#161616] border border-zinc-800 focus:border-amber-500 focus:outline-none text-white py-3 pl-10 pr-4 text-sm font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Email input */}
                      <div className="space-y-2">
                        <label htmlFor="checkout-email" className="text-xs uppercase font-mono tracking-wider text-zinc-400 block">Email Address (Optional)</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <input
                            id="checkout-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@constructionfirm.com"
                            className="w-full bg-[#161616] border border-zinc-800 focus:border-amber-500 focus:outline-none text-white py-3 pl-10 pr-4 text-sm font-sans"
                          />
                        </div>
                      </div>

                      {/* Company input */}
                      <div className="space-y-2">
                        <label htmlFor="checkout-company" className="text-xs uppercase font-mono tracking-wider text-zinc-400 block">Company Name (Optional)</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <input
                            id="checkout-company"
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Sonora Concrete & Grading"
                            className="w-full bg-[#161616] border border-zinc-800 focus:border-amber-500 focus:outline-none text-white py-3 pl-10 pr-4 text-sm font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Conditionally Revealed Jobsite Address Input */}
                    {dispatchType === 'delivery' && (
                      <div className="space-y-2 animate-slideDown">
                        <label htmlFor="checkout-delivery-address" className="text-xs uppercase font-mono tracking-wider text-zinc-400 block">Jobsite Target Address *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <input
                            id="checkout-delivery-address"
                            type="text"
                            required={dispatchType === 'delivery'}
                            aria-required={dispatchType === 'delivery' ? 'true' : 'false'}
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="e.g. 1430 E Florida Ave, Hemet, CA 92544"
                            className="w-full bg-[#161616] border border-zinc-800 focus:border-amber-500 focus:outline-none text-white py-3 pl-10 pr-4 text-sm font-sans"
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono block">* Flat shipping fee applies to all local Hemet / San Jacinto / Menifee areas.</span>
                      </div>
                    )}

                    {/* Special Instructions */}
                    <div className="space-y-2">
                      <label htmlFor="checkout-notes" className="text-xs uppercase font-mono tracking-wider text-zinc-400 block">Special Dispatch Details / Access notes</label>
                      <textarea
                        id="checkout-notes"
                        rows="3"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Specify gate codes, drop-off location specifics, or heavy lifting details."
                        className="w-full bg-[#161616] border border-zinc-800 focus:border-amber-500 focus:outline-none text-white p-4 text-sm font-sans"
                      ></textarea>
                    </div>
                  </div>

                  {/* B2B Contractor Discount Section */}
                  <div className="space-y-4 pt-3">
                    <h3 className="text-md font-bold uppercase font-header text-white pb-2 border-b border-zinc-800 flex items-center gap-2">
                      <Percent className="w-4 h-4 text-amber-500" /> B2B Pro Account Benefits
                    </h3>
                    <div className="bg-[#161616] border border-zinc-800 p-4 space-y-3">
                      <label htmlFor="checkout-b2b-id" className="text-xs text-zinc-400 leading-relaxed font-light block">
                        Are you a registered commercial member or Net-30 credit partner? Enter your registered <strong>B2B Member ID</strong> to instantly apply a <strong>10% Discount</strong> on staging.
                      </label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          id="checkout-b2b-id"
                          type="text"
                          value={b2bId}
                          onChange={(e) => setB2bId(e.target.value)}
                          placeholder="e.g. HVT-PRO-10"
                          className="w-full bg-[#0F0F0F] border border-zinc-850 focus:border-amber-500 focus:outline-none text-white py-2.5 pl-10 pr-4 text-sm font-mono tracking-wider"
                        />
                      </div>
                      {isB2bDiscountApplied && (
                        <div className="text-xs text-green-400 font-mono flex items-center gap-1.5 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Commercial Net-30 ID validated! 10% Contractor discount applied.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submission Row */}
                  <div className="pt-6 border-t border-zinc-850 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link
                      to="/products"
                      className="text-zinc-500 hover:text-white font-header uppercase tracking-wider text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className={`bg-amber-500 hover:bg-white text-black font-header uppercase tracking-wider font-black py-4 px-8 flex items-center justify-center gap-2 relative transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-black animate-infinite" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.01 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing Dispatch...
                        </>
                      ) : (
                        <>
                          Authorize &amp; Dispatch Reservation <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>

                {/* Right side: Staged Items Review Pane */}
                <div className="lg:col-span-5 bg-[#141414] border border-zinc-800 p-6 space-y-6 sticky top-24 relative">
                  <h3 className="text-lg font-bold uppercase font-header text-white pb-3 border-b border-zinc-800 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-500" /> Staged Dispatch Summary
                  </h3>

                  <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
                    {/* Retail Purchases */}
                    {stagedPurchases.map((item) => (
                      <div key={item.product.id} className="bg-zinc-950 border border-zinc-900 p-4 flex gap-4 relative group">
                        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-600 shrink-0">
                          <Package className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-amber-500 font-bold block">RETAIL PURCHASE</span>
                          <span className="text-sm font-semibold text-white font-header uppercase truncate block">{item.product.name}</span>
                          <span className="text-xs text-zinc-500 font-mono mt-0.5 block">{item.quantity}x @ ${item.product.price}</span>
                        </div>
                        <div className="text-right flex flex-col justify-between items-end shrink-0">
                          <span className="text-sm font-mono font-bold text-white">${item.product.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}

                    {/* Fleet Rentals */}
                    {stagedRentals.map((item) => (
                      <div key={item.product.id} className="bg-zinc-950 border border-zinc-900 p-4 flex gap-4 relative group">
                        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-600 shrink-0">
                          {item.product.category === 'Rentals' ? <Hammer className="w-6 h-6" /> : <Wrench className="w-6 h-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">FLEET RENTAL</span>
                          <span className="text-sm font-semibold text-white font-header uppercase truncate block">{item.product.name}</span>
                          <span className="text-xs text-zinc-500 font-mono mt-0.5 block">{item.rentalDays} days @ ${item.product.price}/daily</span>
                          <span className="text-[10px] text-zinc-400 font-sans block mt-1">Starts: {item.rentDate}</span>
                        </div>
                        <div className="text-right flex flex-col justify-between items-end shrink-0">
                          <span className="text-sm font-mono font-bold text-white">${item.product.price * item.rentalDays}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary slip */}
                  <div className="bg-[#1C1C1C] border border-zinc-800 p-5 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-zinc-500">
                      <span>Staged Subtotal:</span>
                      <span className="text-white font-bold">${cartSubtotal}</span>
                    </div>

                    {isB2bDiscountApplied && (
                      <div className="flex justify-between items-center text-green-400">
                        <span>B2B Commercial (10%):</span>
                        <span>-${discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-zinc-500">
                      <span>Dispatch/Delivery Fee:</span>
                      <span className="text-white">{dispatchType === 'pickup' ? 'FREE' : `+$${deliveryFee}`}</span>
                    </div>

                    <div className="flex justify-between items-center text-zinc-500">
                      <span>Estimated local tax (8%):</span>
                      <span className="text-white">+${estimatedTax}</span>
                    </div>

                    <div className="border-t border-zinc-800 pt-3 flex justify-between items-baseline gap-2 text-white">
                      <span className="font-header uppercase tracking-wider text-sm font-bold">ESTIMATED ESTIMATE:</span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-amber-500 block leading-none">${cartTotal}</span>
                        <span className="text-[8px] text-zinc-500 font-mono block mt-1">* Payable upon pickup/delivery.</span>
                      </div>
                    </div>
                  </div>

                  {/* Security/Assurance details */}
                  <div className="space-y-3.5 pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Hemet Depot Yard: 1430 E Florida Ave, Hemet, CA</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Yard Working Hours: Mon - Fri 7 AM - 5 PM</span>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer navigation */}
      <Footer />

    </div>
  );
};

export default CheckoutPage;
