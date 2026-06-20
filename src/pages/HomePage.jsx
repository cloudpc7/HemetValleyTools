import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../Providers/ThemeContext';
import { 
  updateBookingDraft,
  updateBookingCustomerInfo,
  clearBookingDraft
} from '../redux/slices/formDraftsSlice';
import { getProducts, getRentals } from '../utils/firebaseHelpers';
import { submitBookingThunk } from '../redux/slices/data.slice';
import { setProducts } from '../redux/slices/productsSlice';
import { setRentals } from '../redux/slices/rentalsSlice';
import { 
  Wrench, 
  Settings, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Sliders, 
  Truck, 
  Cpu, 
  Activity, 
  Hammer, 
  Scissors, 
  Package, 
  ChevronRight, 
  MapPin, 
  Map, 
  Info,
  Layers,
  Flame,
  Award,
  Sun,
  Moon
} from 'lucide-react';

import Navbar from '../ui/components/Navbar';
import Footer from '../ui/components/Footer';
import HemetValleyLogo from '../ui/components/HemetValleyLogo';
import SEO from '../ui/components/SEO';

const HomePage = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // --- GLOBAL REDUX STATE FOR INTERACTIVE RESERVATION WIZARD ---
  const { 
    bookingStep, 
    selectedCategory, 
    selectedToolId, 
    selectedDuration, 
    selectedDate, 
    selectedTimeSlot, 
    customerInfo, 
    isConfirmed 
  } = useSelector(state => state.formDrafts.bookingForm);

  // --- FETCH PRODUCTS & RENTALS FROM FIRESTORE ON MOUNT ---
  const { catalog: products } = useSelector(state => state.products);
  const { catalog: rentals } = useSelector(state => state.rentals);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const liveProducts = await getProducts();
        dispatch(setProducts(liveProducts));
      } catch (err) {
        console.error("Failed to load products on Home:", err);
      }
      try {
        const liveRentals = await getRentals();
        dispatch(setRentals(liveRentals));
      } catch (err) {
        console.error("Failed to load rentals on Home:", err);
      }
    };
    fetchAllData();
  }, [dispatch]);

  // --- DYNAMICALLY RESOLVED INVENTORY/RESOURCES ---
  const categories = [
    { id: 'Rentals', name: 'Equipment Rentals', icon: Hammer, desc: 'Heavy hitters & landscaping machinery' },
    { id: 'Repair', name: 'Certified Repairs', icon: Wrench, desc: 'Expert in-house diagnostic & tune-ups' },
    { id: 'Supply', name: 'Supply Pickups', icon: Package, desc: 'Professional-grade saw blades & diamond bits' }
  ];

  const dynamicRentals = rentals
    .filter(r => r.category !== 'Blades & Bits' && r.category !== 'Blades & Accessories')
    .map(r => ({
      id: r.id,
      name: r.name,
      price: r.price,
      durationRates: r.durationRates || { '4-hour': Math.round(r.price * 0.6), 'Daily': r.price, 'Weekly': Math.round(r.price * 4) }
    }));

  const dynamicSupply = [
    ...rentals
      .filter(r => r.category === 'Blades & Bits' || r.category === 'Blades & Accessories')
      .map(r => ({
        id: r.id,
        name: r.name,
        price: r.price,
        durationRates: r.durationRates || { 'Daily': r.price }
      })),
    ...products
      .filter(p => p.category === 'Blades & Accessories' || p.category === 'Supply')
      .map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        durationRates: { 'Daily': p.price }
      }))
  ];

  const dynamicRepair = [
    { id: 'r1', name: 'Small Engine Performance Tune-Up', price: 65, durationRates: { 'Daily': 65 } },
    { id: 'r2', name: 'Circular/Table Saw Calibration', price: 40, durationRates: { 'Daily': 40 } },
    { id: 'r3', name: 'Hydraulic Seal Replacement', price: 120, durationRates: { 'Daily': 120 } }
  ];

  const toolsByCategory = {
    Rentals: dynamicRentals.length > 0 ? dynamicRentals : [
      { id: 't1', name: 'Milwaukee Demolition Jackhammer', price: 85, durationRates: { '4-hour': 55, 'Daily': 85, 'Weekly': 340 } },
      { id: 't2', name: 'Makita Rotary Hammer Drill', price: 45, durationRates: { '4-hour': 30, 'Daily': 45, 'Weekly': 180 } },
      { id: 't3', name: 'Honda Commercial Power Washer', price: 75, durationRates: { '4-hour': 50, 'Daily': 75, 'Weekly': 300 } },
      { id: 't4', name: 'Stihl Landscaping Brushcutter', price: 60, durationRates: { '4-hour': 40, 'Daily': 60, 'Weekly': 240 } },
      { id: 't5', name: 'Husqvarna Walk-Behind Concrete Saw (14")', price: 120, durationRates: { '4-hour': 80, 'Daily': 120, 'Weekly': 480 } },
      { id: 't6', name: 'Bosch Self-Leveling Rotary Laser System', price: 55, durationRates: { '4-hour': 35, 'Daily': 55, 'Weekly': 220 } }
    ],
    Repair: dynamicRepair,
    Supply: dynamicSupply.length > 0 ? dynamicSupply : [
      { id: 's1', name: 'Premium 14" Diamond Asphalt Saw Blade', price: 35, durationRates: { 'Daily': 35 } },
      { id: 's2', name: 'Premium 14" Diamond Core Drill Rig', price: 95, durationRates: { 'Daily': 95 } },
      { id: 's3', name: 'Contractor Safety & Rigging Pack', price: 55, durationRates: { 'Daily': 55 } }
    ]
  };

  const timeSlots = ['08:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'];

  // --- DERIVED CALCULATIONS ---
  const currentTools = toolsByCategory[selectedCategory] || [];
  const selectedTool = currentTools.find(t => t.id === selectedToolId) || currentTools[0] || null;

  // Set default tool when category changes
  useEffect(() => {
    if (currentTools.length > 0 && (!selectedToolId || !currentTools.some(t => t.id === selectedToolId))) {
      dispatch(updateBookingDraft({ selectedToolId: currentTools[0].id }));
    }
  }, [selectedCategory, currentTools, selectedToolId, dispatch]);

  // Use a synchronous ref to completely block duplicate/rapid double-click submissions
  const isSubmittingRef = useRef(false);

  // Handle passed location state redirects from RentalsPage & Navbar
  useEffect(() => {
    if (location.state) {
      const { preselectedCategory, preselectedToolId, scrollToSection } = location.state;
      const updates = {};
      if (preselectedCategory) {
        updates.selectedCategory = preselectedCategory;
      }
      if (preselectedToolId && bookingStep === 1 && !isConfirmed) {
        updates.selectedToolId = preselectedToolId;
        updates.bookingStep = 2; // Jump straight to duration/schedule screen
      }
      if (Object.keys(updates).length > 0) {
        dispatch(updateBookingDraft(updates));
      }
      if (scrollToSection) {
        setTimeout(() => {
          const el = document.getElementById(scrollToSection);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location.state, dispatch, bookingStep, isConfirmed]);

  const calculatePrice = () => {
    if (!selectedTool) return 0;
    if (selectedCategory === 'Rentals' && selectedTool.durationRates) {
      return selectedTool.durationRates[selectedDuration] || selectedTool.price;
    }
    return selectedTool.price;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    // Synchronous short-circuit
    if (isSubmittingRef.current || isBookingSubmitting) return;
    if (!selectedDate || !selectedTimeSlot || !customerInfo.name || !customerInfo.phone) {
      alert('Please fill out all required fields.');
      return;
    }
    isSubmittingRef.current = true;
    setIsBookingSubmitting(true);
    try {
      const bookingData = {
        selectedCategory,
        selectedToolId,
        selectedToolName: selectedTool?.name || '',
        selectedDuration,
        selectedDate,
        selectedTimeSlot,
        customerInfo,
        price: calculatePrice()
      };
      await dispatch(submitBookingThunk(bookingData)).unwrap();
      dispatch(updateBookingDraft({ isConfirmed: true, bookingStep: 4 }));
    } catch (err) {
      alert(`Booking failed: ${err.message}`);
    } finally {
      isSubmittingRef.current = false;
      setIsBookingSubmitting(false);
    }
  };

  const resetBooking = () => {
    dispatch(clearBookingDraft());
  };

  const handleScrollToScheduler = (e, category = null, toolId = null, step = null) => {
    e?.preventDefault();
    const updates = {};
    if (category) updates.selectedCategory = category;
    if (toolId) updates.selectedToolId = toolId;
    if (step) updates.bookingStep = step;
    if (Object.keys(updates).length > 0) {
      dispatch(updateBookingDraft(updates));
    }
    const el = document.getElementById('scheduler');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    "name": "Hemet Valley Tools",
    "image": "https://hemetvalleytools.com/assets/hemet_valley_logo_clean-DamuFsws.png",
    "@id": "https://hemetvalleytools.com/#localbusiness",
    "url": "https://hemetvalleytools.com",
    "telephone": "+19515550190",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1200 State St",
      "addressLocality": "Hemet",
      "addressRegion": "CA",
      "postalCode": "92543",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.7475,
      "longitude": -116.9719
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "07:30",
        "closes": "17:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/HemetValleyTools",
      "https://www.yelp.com/biz/hemet-valley-tools-hemet"
    ],
    "description": "Premium industrial hardware rentals, certified tool repairs, and professional saw blades pickup in Hemet, CA."
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      <SEO 
        title="Hemet Valley Tools | Heavy-Duty Equipment Rentals & Repairs"
        description="Your premium source for professional-grade industrial equipment rentals, certified tool diagnostics/repairs, and high-performance saw blades in Hemet, CA. Est. 1985."
        keywords="heavy tool rentals Hemet, equipment repairs Hemet, saw blades, diamond core bits, concrete drill rental, Husqvarna, Milwaukee, Makita"
        schema={homeSchema}
      />

      {/* --- PREMIUM NAVBAR --- */}
      <Navbar activePage="home" />

      {/* --- HERO SECTION --- */}
      <header id="hero" className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-[#0F0F0F] to-[#050505] py-14 lg:py-18">
        {/* Subtle grid pattern background overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>

        {/* Stunning high-contrast background watermark logo replicating the Photoshop design */}
        <div className="absolute right-4 lg:right-12 bottom-4 lg:bottom-6 pointer-events-none z-0 select-none">
          <HemetValleyLogo className="w-[22rem] h-[22rem] lg:w-[32rem] lg:h-[32rem]" watermark={true} />
        </div>



        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Text Copy */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                PREMIUM INDUSTRIAL HARDWARE
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-header uppercase leading-tight tracking-tight text-white">
                Tools for <span className="text-amber-500 underline decoration-amber-500/30 underline-offset-8">Performance</span>,<br />
                Power for Production &amp; Mass Construction
              </h1>
              
              <p className="text-base sm:text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
                Hemet Valley Tools offers the professional-grade services, high-performance machinery, and heavy-duty tool repairs needed to get the job done right. Built tough, serving DIYers and heavy contractor crews alike.
              </p>
 
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button 
                  onClick={(e) => handleScrollToScheduler(e)} 
                  className="bg-amber-500 text-black hover:bg-white hover:text-black font-header uppercase tracking-wider font-bold py-3.5 px-7 flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer"
                >
                  Book Rental Reservation <ArrowRight className="w-5 h-5" />
                </button>
                <Link 
                  to="/services" 
                  className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-header uppercase tracking-wider font-bold py-3.5 px-7 flex items-center justify-center gap-2 transition-all duration-300"
                >
                  Explore Services
                </Link>
              </div>
 
              {/* Simple Stats / Trust Bar */}
              <div className="grid grid-cols-3 gap-6 pt-5 border-t border-zinc-900">
                <div>
                  <div className="text-2xl font-bold font-header text-white">41+ YEARS</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Expert Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-header text-amber-500">100% SECURE</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Availability Guarantee</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-header text-white">#1 IN IE</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Hemet Storefront</div>
                </div>
              </div>
            </div>
 
            {/* Visual Hero Panel / Live Status Indicator */}
            <div className="lg:col-span-5 relative">
              {/* Stunning Watermark behind panel replicating Photoshop logo */}
              <div className="absolute -top-10 -left-10 w-40 h-40 pointer-events-none select-none z-0">
                <HemetValleyLogo className="w-full h-full" watermark={true} />
              </div>
              <div className="bg-[#111111] border-2 border-zinc-800 p-8 relative glow-white z-10 overflow-hidden">
                {/* Subtle background watermark inside panel */}
                <div className="absolute right-4 bottom-4 w-32 h-32 pointer-events-none select-none z-0">
                  <HemetValleyLogo className="w-full h-full" watermark={true} />
                </div>
                {/* Corner industrial brackets decoration */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500 -mt-0.5 -ml-0.5"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500 -mt-0.5 -mr-0.5"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500 -mb-0.5 -ml-0.5"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500 -mb-0.5 -mr-0.5"></div>

                <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                    <span className="text-xs font-mono text-zinc-400 tracking-wider">LIVE HEMET YARD STATUS</span>
                  </div>
                  <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20">FULLY STOCKED</span>
                </div>

                <div className="space-y-6 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Industrial Demolition Saws</span>
                    <span className="text-sm text-green-400 font-mono">Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Heavy Landscaping Augers</span>
                    <span className="text-sm text-green-400 font-mono">Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Small Engine Repair Slot</span>
                    <span className="text-sm text-amber-400 font-mono">2 slots left today</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Diamond Saw Blades (14")</span>
                    <span className="text-sm text-green-400 font-mono">In-Stock</span>
                  </div>
                </div>

                <div className="bg-[#1A1A1A] p-4 mt-8 border border-zinc-800 text-center">
                  <p className="text-xs text-zinc-400 mb-2">Need immediate equipment advice?</p>
                  <p className="font-header text-lg text-white font-bold tracking-wider">(951) 925-1106</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>


      {/* --- THREE CORE PILLARS (SERVICE CARDS) --- */}
      <section id="pillars" className="py-24 bg-gradient-to-b from-[#050505] to-[#0A0A0A] border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold">EXPERTISE IN ACTION</h2>
            <p className="text-3xl sm:text-4xl font-bold font-header uppercase text-white">Expert Support for Every Stage of the Job</p>
            <p className="text-zinc-400 font-light">From renting heavy-duty machinery to calibrating your custom table saws, our crew ensures your project hits deadline without structural delays.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-[#111111] border border-zinc-800 p-8 flex flex-col justify-between hover:border-zinc-600 transition-all duration-300 relative group">
              <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-500 p-2 font-mono text-xs font-bold group-hover:bg-amber-500 group-hover:text-black transition-colors">01</div>
              <div className="space-y-4 mb-8">
                <div className="bg-amber-500/10 p-3 inline-block border border-amber-500/20">
                  <Hammer className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold font-header uppercase text-white">Equipment Rentals</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Daily, weekly, or monthly rental options of highly calibrated pro-grade machinery. Guaranteed safety-checked and fully fueled before it leaves our yard.
                </p>
                <ul className="text-xs text-zinc-500 space-y-2 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-500" /> 4-hour quick turnarounds available</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Landscaping gear &amp; heavy augers</li>
                </ul>
              </div>
              <button 
                onClick={(e) => handleScrollToScheduler(e, 'Rentals')} 
                className="text-amber-500 font-header uppercase tracking-wider text-xs font-bold flex items-center gap-2 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-left align-baseline"
              >
                View Rental Catalog <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-[#111111] border border-zinc-800 p-8 flex flex-col justify-between hover:border-zinc-600 transition-all duration-300 relative group">
              <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-500 p-2 font-mono text-xs font-bold group-hover:bg-amber-500 group-hover:text-black transition-colors">02</div>
              <div className="space-y-4 mb-8">
                <div className="bg-amber-500/10 p-3 inline-block border border-amber-500/20">
                  <Wrench className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold font-header uppercase text-white">Certified Repair Shop</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  In-house engine tuning, structural calibration, and warranty repair works for small gas engines, hydraulics, electric power drills, and table saws.
                </p>
                <ul className="text-xs text-zinc-500 space-y-2 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Over 41 years of expert diagnostics</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Fast turnaround to keep you operating</li>
                </ul>
              </div>
              <Link to="/repair" className="text-amber-500 font-header uppercase tracking-wider text-xs font-bold flex items-center gap-2 hover:text-white transition-colors">
                Book a Repair <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-[#111111] border border-zinc-800 p-8 flex flex-col justify-between hover:border-zinc-600 transition-all duration-300 relative group">
              <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-500 p-2 font-mono text-xs font-bold group-hover:bg-amber-500 group-hover:text-black transition-colors">03</div>
              <div className="space-y-4 mb-8">
                <div className="bg-amber-500/10 p-3 inline-block border border-amber-500/20">
                  <Package className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold font-header uppercase text-white">Supply &amp; Tool Sales</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Direct sales of professional saw blades, heavy-duty core bits, rigging hardware, and replacement consumables. We source hard-to-find components.
                </p>
                <ul className="text-xs text-zinc-500 space-y-2 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Milwaukee, Makita, Honda, Husqvarna</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Bulk contractor pricing accounts</li>
                </ul>
              </div>
              <button 
                onClick={(e) => handleScrollToScheduler(e, 'Supply')} 
                className="text-amber-500 font-header uppercase tracking-wider text-xs font-bold flex items-center gap-2 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-left align-baseline"
              >
                Browse Supply Catalog <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* --- RENTAL SHOWCASE & TEASER --- */}
      <section id="rentals" className="py-24 bg-[#070707] border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
            <div className="space-y-4 text-left">
              <h2 className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold">RENTAL TEASER</h2>
              <p className="text-3xl sm:text-4xl font-bold font-header uppercase text-white">Pro Power, Pro Tools for Pro Construction</p>
              <p className="text-zinc-400 font-light max-w-2xl">Discover our heavy selection of high-quality power tools from trusted industry leaders, including Milwaukee, Makita, and Honda. Ready to deploy.</p>
            </div>
            <button 
              onClick={(e) => handleScrollToScheduler(e)} 
              className="bg-zinc-900 border border-zinc-800 text-white font-header uppercase tracking-wider py-3.5 px-7 hover:bg-amber-500 hover:text-black transition-colors duration-300 cursor-pointer"
            >
              Go To Reservation Engine
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tool 1 */}
            <div className="bg-[#111111] border border-zinc-850 p-6 space-y-4 group">
              <div className="bg-[#181818] h-48 flex items-center justify-center relative overflow-hidden border border-zinc-800">
                <Hammer className="w-16 h-16 text-zinc-700 group-hover:text-amber-500 transition-colors" />
                <span className="absolute top-2 left-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 text-[10px] font-mono uppercase">HEAVY INDUSTRY</span>
              </div>
              <div>
                <span className="text-zinc-500 text-xs uppercase font-mono">MILWAUKEE</span>
                <h4 className="text-lg font-bold font-header text-white group-hover:text-amber-500 transition-colors">Demolition Jackhammer</h4>
                <p className="text-xs text-zinc-400 mt-1">High-impact concrete breaker for roadwork and foundation demolitions.</p>
              </div>
              <div className="pt-4 border-t border-zinc-850 flex justify-between items-center">
                <div>
                  <span className="text-zinc-500 text-[10px] block font-mono">DAILY RATE</span>
                  <span className="text-white font-header font-bold text-lg">$85.00</span>
                </div>
                <button 
                  onClick={(e) => handleScrollToScheduler(e, 'Rentals', 't1', 2)} 
                  className="bg-zinc-800 text-zinc-300 p-2 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer border-none"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="bg-[#111111] border border-zinc-850 p-6 space-y-4 group">
              <div className="bg-[#181818] h-48 flex items-center justify-center relative overflow-hidden border border-zinc-800">
                <Wrench className="w-16 h-16 text-zinc-700 group-hover:text-amber-500 transition-colors" />
                <span className="absolute top-2 left-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 text-[10px] font-mono uppercase">LANDSCAPING GEAR</span>
              </div>
              <div>
                <span className="text-zinc-500 text-xs uppercase font-mono">STIHL / HONDA</span>
                <h4 className="text-lg font-bold font-header text-white group-hover:text-amber-500 transition-colors">Heavy Power Auger</h4>
                <p className="text-xs text-zinc-400 mt-1">Heavy-duty landscaping post-hole digger for fencing &amp; landscaping.</p>
              </div>
              <div className="pt-4 border-t border-zinc-850 flex justify-between items-center">
                <div>
                  <span className="text-zinc-500 text-[10px] block font-mono">DAILY RATE</span>
                  <span className="text-white font-header font-bold text-lg">$75.00</span>
                </div>
                <button 
                  onClick={(e) => handleScrollToScheduler(e, 'Rentals', 't3', 2)} 
                  className="bg-zinc-800 text-zinc-300 p-2 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer border-none"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tool 3 */}
            <div className="bg-[#111111] border border-zinc-850 p-6 space-y-4 group">
              <div className="bg-[#181818] h-48 flex items-center justify-center relative overflow-hidden border border-zinc-800">
                <Sliders className="w-16 h-16 text-zinc-700 group-hover:text-amber-500 transition-colors" />
                <span className="absolute top-2 left-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 text-[10px] font-mono uppercase">DIAMOND BLADES</span>
              </div>
              <div>
                <span className="text-zinc-500 text-xs uppercase font-mono">HEMET SELECTION</span>
                <h4 className="text-lg font-bold font-header text-white group-hover:text-amber-500 transition-colors">Premium Saw Blades</h4>
                <p className="text-xs text-zinc-400 mt-1">High-end diamond-edge blades for masonry, stone, and heavy brick cutting.</p>
              </div>
              <div className="pt-4 border-t border-zinc-850 flex justify-between items-center">
                <div>
                  <span className="text-zinc-500 text-[10px] block font-mono">DAILY RATE</span>
                  <span className="text-white font-header font-bold text-lg">$45.00</span>
                </div>
                <button 
                  onClick={(e) => handleScrollToScheduler(e, 'Rentals', 't2', 2)} 
                  className="bg-zinc-800 text-zinc-300 p-2 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer border-none"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tool 4 */}
            <div className="bg-[#111111] border border-zinc-850 p-6 space-y-4 group">
              <div className="bg-[#181818] h-48 flex items-center justify-center relative overflow-hidden border border-zinc-800">
                <Cpu className="w-16 h-16 text-zinc-700 group-hover:text-amber-500 transition-colors" />
                <span className="absolute top-2 left-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 text-[10px] font-mono uppercase">HIGH PERFORMANCE</span>
              </div>
              <div>
                <span className="text-zinc-500 text-xs uppercase font-mono">HONDA MOTOR</span>
                <h4 className="text-lg font-bold font-header text-white group-hover:text-amber-500 transition-colors">Commercial Power Washer</h4>
                <p className="text-xs text-zinc-400 mt-1">Industrial 4000 PSI high-impact pressure washer for exterior clearing.</p>
              </div>
              <div className="pt-4 border-t border-zinc-850 flex justify-between items-center">
                <div>
                  <span className="text-zinc-500 text-[10px] block font-mono">DAILY RATE</span>
                  <span className="text-white font-header font-bold text-lg">$75.00</span>
                </div>
                <button 
                  onClick={(e) => handleScrollToScheduler(e, 'Rentals', 't3', 2)} 
                  className="bg-zinc-800 text-zinc-300 p-2 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer border-none"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* --- DYNAMIC RESERVATION SCHEDULING ENGINE --- */}
      <section id="scheduler" className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F] relative">
        <div className="absolute top-0 inset-x-0 h-px bg-zinc-800"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold">REAL-TIME INVENTORY BOOKING</h2>
            <p className="text-4xl font-bold font-header uppercase text-white">Reserve Your Gear In Seconds</p>
            <p className="text-zinc-400 font-light">Select your equipment or service below to see real-time availability at our Hemet location and build your customized project timeline.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hand: Interactive Multi-Step Builder */}
            <div className="lg:col-span-8 bg-[#111111] border border-zinc-800 p-8">
              
              {/* Stepper Navigation Headers */}
              <div className="grid grid-cols-4 gap-4 mb-8 text-center border-b border-zinc-800 pb-6 font-mono text-xs font-bold" aria-label="Booking Progress">
                <button 
                  onClick={() => dispatch(updateBookingDraft({ bookingStep: 1 }))} 
                  className={`pb-2 border-b-2 transition-all ${bookingStep >= 1 ? 'border-amber-500 text-white' : 'border-transparent text-zinc-600'}`}
                  aria-current={bookingStep === 1 ? "step" : undefined}
                >
                  01. CATEGORY
                </button>
                <button 
                  onClick={() => bookingStep >= 2 ? dispatch(updateBookingDraft({ bookingStep: 2 })) : null} 
                  disabled={bookingStep < 2}
                  className={`pb-2 border-b-2 transition-all ${bookingStep >= 2 ? 'border-amber-500 text-white' : 'border-transparent text-zinc-600'}`}
                  aria-current={bookingStep === 2 ? "step" : undefined}
                >
                  02. RESOURCE
                </button>
                <button 
                  onClick={() => bookingStep >= 3 ? dispatch(updateBookingDraft({ bookingStep: 3 })) : null} 
                  disabled={bookingStep < 3}
                  className={`pb-2 border-b-2 transition-all ${bookingStep >= 3 ? 'border-amber-500 text-white' : 'border-transparent text-zinc-600'}`}
                  aria-current={bookingStep === 3 ? "step" : undefined}
                >
                  03. CONTACT
                </button>
                <button 
                  disabled={true}
                  className={`pb-2 border-b-2 transition-all ${bookingStep === 4 ? 'border-amber-500 text-white' : 'border-transparent text-zinc-600'}`}
                  aria-current={bookingStep === 4 ? "step" : undefined}
                >
                  04. CONFIRM
                </button>
              </div>

              {/* Step 1 Content: Category Selection */}
              {bookingStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold uppercase font-header text-white">Select Service or Tool Fleet</h3>
                  <div className="grid sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Select Booking Category">
                    {categories.map((cat) => {
                      const IconComp = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <div 
                          key={cat.id}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={() => {
                            const newTools = toolsByCategory[cat.id] || [];
                            dispatch(updateBookingDraft({
                              selectedCategory: cat.id,
                              selectedToolId: newTools[0]?.id || '',
                              bookingStep: 2
                            }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              const newTools = toolsByCategory[cat.id] || [];
                              dispatch(updateBookingDraft({
                                selectedCategory: cat.id,
                                selectedToolId: newTools[0]?.id || '',
                                bookingStep: 2
                              }));
                            }
                          }}
                          className={`border p-6 cursor-pointer hover:bg-zinc-900 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-amber-500 ${isSelected ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 bg-[#141414]'}`}
                        >
                          <IconComp className={`w-8 h-8 mb-4 ${isSelected ? 'text-amber-500' : 'text-zinc-400 group-hover:text-amber-500'}`} />
                          <h4 className="font-header font-bold text-white uppercase text-md mb-1">{cat.name}</h4>
                          <p className="text-zinc-400 text-xs font-light">{cat.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end pt-6">
                    <button 
                      onClick={() => dispatch(updateBookingDraft({ bookingStep: 2 }))} 
                      className="bg-amber-500 text-black font-header uppercase font-bold py-3 px-6 hover:bg-white transition-colors"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 Content: Resource & Time Grid */}
              {bookingStep === 2 && (
                <div className="space-y-6 text-left">
                  <h3 className="text-lg font-bold uppercase font-header text-white">Select Specific Gear &amp; Time Slot</h3>
                  
                  {/* Tool Picker */}
                  <div className="space-y-3">
                    <label htmlFor="tool-select" className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Select Tool/Service Model</label>
                    <select 
                      id="tool-select"
                      value={selectedToolId}
                      onChange={(e) => {
                        dispatch(updateBookingDraft({ selectedToolId: e.target.value }));
                      }}
                      className="w-full bg-[#161616] border border-zinc-800 text-white p-3 focus:outline-none focus:border-amber-500 font-sans"
                    >
                      {currentTools.map((t) => (
                        <option key={t.id} value={t.id}>{t.name} - ${t.price}/daily</option>
                      ))}
                    </select>
                  </div>

                  {/* Rentals Duration Picker */}
                  {selectedCategory === 'Rentals' && (
                    <div className="space-y-3" role="radiogroup" aria-label="Rental Duration">
                      <span className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Rental Duration</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['4-hour', 'Daily', 'Weekly'].map((dur) => (
                          <button
                            key={dur}
                            type="button"
                            role="radio"
                            aria-checked={selectedDuration === dur}
                            onClick={() => dispatch(updateBookingDraft({ selectedDuration: dur }))}
                            className={`py-2 px-3 border text-xs font-bold font-header uppercase tracking-wider transition-colors ${selectedDuration === dur ? 'border-amber-500 bg-amber-500/5 text-amber-500' : 'border-zinc-800 bg-[#161616] text-zinc-400 hover:text-white'}`}
                          >
                            {dur} - ${selectedTool?.durationRates?.[dur] || selectedTool?.price}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date Picker & Time slot combined module */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <label htmlFor="booking-date" className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Select Target Date</label>
                      <input 
                        id="booking-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => dispatch(updateBookingDraft({ selectedDate: e.target.value }))}
                        className="w-full bg-[#161616] border border-zinc-800 text-white p-3 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2" role="radiogroup" aria-label="Available Time Grid">
                      <span className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Available Time Grid</span>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((ts) => (
                          <button
                            key={ts}
                            type="button"
                            role="radio"
                            aria-checked={selectedTimeSlot === ts}
                            onClick={() => dispatch(updateBookingDraft({ selectedTimeSlot: ts }))}
                            className={`py-2.5 text-xs font-mono border tracking-tighter ${selectedTimeSlot === ts ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold' : 'border-zinc-800 bg-[#161616] text-zinc-400 hover:text-white'}`}
                          >
                            {ts}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-zinc-800 mt-6">
                    <button 
                      onClick={() => dispatch(updateBookingDraft({ bookingStep: 1 }))} 
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-header uppercase font-bold py-3 px-6 hover:bg-zinc-800"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => dispatch(updateBookingDraft({ bookingStep: 3 }))} 
                      className="bg-amber-500 text-black font-header uppercase font-bold py-3 px-6 hover:bg-white transition-colors"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 Content: Minimalist Customer Form */}
              {bookingStep === 3 && (
                <form onSubmit={handleBookingSubmit} className="space-y-6 text-left">
                  <h3 className="text-lg font-bold uppercase font-header text-white">Contact &amp; Project Coordinates</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="customer-name" className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input 
                          id="customer-name"
                          type="text" 
                          required
                          value={customerInfo.name}
                          onChange={(e) => dispatch(updateBookingCustomerInfo({ name: e.target.value }))}
                          placeholder="John Contractor"
                          className="w-full bg-[#161616] border border-zinc-800 text-white py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="customer-phone" className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">SMS Reminder Mobile *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input 
                          id="customer-phone"
                          type="tel" 
                          required
                          value={customerInfo.phone}
                          onChange={(e) => dispatch(updateBookingCustomerInfo({ phone: e.target.value }))}
                          placeholder="(951) 555-0199"
                          className="w-full bg-[#161616] border border-zinc-800 text-white py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="customer-email" className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Email Address (Optional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                      <input 
                        id="customer-email"
                        type="email" 
                        value={customerInfo.email}
                        onChange={(e) => dispatch(updateBookingCustomerInfo({ email: e.target.value }))}
                        placeholder="john@constructionfirm.com"
                        className="w-full bg-[#161616] border border-zinc-800 text-white py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="customer-notes" className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Project Scope / Repair Model details</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                      <textarea 
                        id="customer-notes"
                        rows="3"
                        value={customerInfo.projectNote}
                        onChange={(e) => dispatch(updateBookingCustomerInfo({ projectNote: e.target.value }))}
                        placeholder="e.g. Model Stihl ts420 engine repair, or yard landscaping demolition work requirements."
                        className="w-full bg-[#161616] border border-zinc-800 text-white py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-zinc-800 mt-6">
                    <button 
                      type="button"
                      onClick={() => dispatch(updateBookingDraft({ bookingStep: 2 }))} 
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-header uppercase font-bold py-3 px-6 hover:bg-zinc-800"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={isBookingSubmitting}
                      className={`bg-amber-500 text-black font-header uppercase font-bold py-3 px-6 hover:bg-white transition-colors flex items-center justify-center gap-2 ${isBookingSubmitting ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {isBookingSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-black animate-infinite" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.01 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Locking In...
                        </>
                      ) : 'Review & Lock-In'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4 Content: Instant Confirmation Screen */}
              {bookingStep === 4 && (
                <div className="space-y-6 text-center py-8">
                  <div className="bg-green-500/15 border border-green-500/30 text-green-400 p-4 inline-block rounded-full">
                    <ShieldCheck className="w-16 h-16 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-bold font-header uppercase text-white">Reservation Pre-Locked!</h3>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    We have reserved the <strong className="text-white">{selectedTool?.name}</strong> for you on <strong className="text-white">{selectedDate}</strong> at <strong className="text-white">{selectedTimeSlot}</strong>. 
                  </p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    A text notification and summary details has been sent to your mobile terminal. Please present your matching ID at our Hemet Valley storefront.
                  </p>

                  <div className="pt-6">
                    <button 
                      onClick={resetBooking}
                      className="bg-zinc-900 border border-zinc-800 text-white font-header uppercase py-3 px-8 hover:bg-white hover:text-black transition-colors cursor-pointer"
                    >
                      Book Another Slot
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Hand: Review / Dynamic Summary Sidebar */}
            <div className="lg:col-span-4 bg-[#141414] border border-zinc-850 p-6 space-y-6 sticky top-24 text-left">
              <h3 className="text-lg font-bold uppercase font-header text-white pb-3 border-b border-zinc-800">Review Pane</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-zinc-500 uppercase font-mono">
                  <span>Selected Pillar:</span>
                  <span className="text-white font-bold">{selectedCategory}</span>
                </div>
                
                {selectedTool && (
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-500 uppercase font-mono block">Selected Asset:</span>
                    <span className="text-sm font-semibold text-white block">{selectedTool.name}</span>
                  </div>
                )}

                {selectedCategory === 'Rentals' && (
                  <div className="flex justify-between items-center text-xs text-zinc-500 uppercase font-mono">
                    <span>Duration tier:</span>
                    <span className="text-white font-bold">{selectedDuration}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-zinc-500 uppercase font-mono">
                  <span>Date Required:</span>
                  <span className="text-white font-bold">{selectedDate || 'Not specified'}</span>
                </div>

                <div className="flex justify-between items-center text-xs text-zinc-500 uppercase font-mono">
                  <span>Time Grid Slot:</span>
                  <span className="text-white font-bold">{selectedTimeSlot || 'Not selected'}</span>
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="bg-[#1C1C1C] p-4 border border-zinc-800">
                <span className="text-xs text-zinc-500 uppercase font-mono block mb-1">Estimated Deposit/Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-header text-amber-500">${calculatePrice()}</span>
                  <span className="text-xs text-zinc-400">Total</span>
                </div>
                <span className="text-[10px] text-zinc-500 block mt-2 font-mono">* No charge until pickup. Paid in-store.</span>
              </div>

              {/* Counter details */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>1430 E Florida Ave, Hemet, CA 92544</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Mon - Fri: 7:00 AM - 5:00 PM</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* --- LOCAL LEGACY & STORE HISTORY (ABOUT US STORY) --- */}
      <section className="py-24 bg-[#050505] border-b border-zinc-900 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-xs uppercase tracking-widest font-mono text-zinc-400">
                LOCAL LEGACY SINCE 1985
              </div>
              <h2 className="text-4xl font-bold font-header uppercase text-white">
                Serving the Valley with Tough, No-Nonsense Hardware
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Hemet Valley Tools is not your national big-box chain store. We are a dedicated, local staple that has been supplying both commercial construction crews and hands-on DIYers in the Inland Empire for over 41 combined years.
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Our philosophy is simple: source the absolute best equipment, provide diagnostic and technical small-engine advice that saves you money, and stand by our service. When you talk to our counter guy, you are getting decades of real tool repair wisdom.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 font-header uppercase tracking-wider text-xs">
                <div className="bg-[#111111] border border-zinc-850 p-4">
                  <div className="text-amber-500 text-lg font-bold">COMMERCIAL DEPOT</div>
                  <div className="text-zinc-500">Tiered Volume accounts</div>
                </div>
                <div className="bg-[#111111] border border-zinc-850 p-4">
                  <div className="text-amber-500 text-lg font-bold">WARRANTY DEPT</div>
                  <div className="text-zinc-500">Certified small-engine crew</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent z-10 pointer-events-none"></div>
              <div className="bg-[#111111] border-2 border-zinc-800 p-8 glow-white relative">
                <div className="border border-dashed border-zinc-700 p-6 space-y-6">
                  <h3 className="text-xl font-bold font-header text-white uppercase tracking-wider border-b border-zinc-800 pb-2">Why Choose Us?</h3>
                  
                  <div className="flex gap-4">
                    <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-white uppercase">Technical Consultations</h4>
                      <p className="text-xs text-zinc-400 mt-1">Not sure which core drill bit or diamond blade is required? We walk you through it.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Truck className="w-6 h-6 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-white uppercase">Flexible Rental Cycles</h4>
                      <p className="text-xs text-zinc-400 mt-1">From a quick 4-hour quick hit to long-term monthly heavy equipment contracts.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Award className="w-6 h-6 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-white uppercase">OSHA Compliant Repairs</h4>
                      <p className="text-xs text-zinc-400 mt-1">Every repaired engine and machine undergoes safety analysis before client turnover.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- TESTIMONIALS SECTION --- */}
      <section id="testimonials" className="py-24 bg-[#070707] border-b border-zinc-900 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold">CLIENT SATISFACTION</h2>
            <p className="text-3xl sm:text-4xl font-bold font-header uppercase text-white">Rated #1 Tool and Supply Shop in the IE</p>
            <p className="text-zinc-400 font-light">Don't take our word for it. Read honest feedback from our local general contractors, mechanics, and homeowners who build with us.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Quote 1 */}
            <div className="bg-[#111111] border border-zinc-850 p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                </div>
                <p className="text-zinc-300 text-sm font-light leading-relaxed italic">
                  "The best place for tools and equipment is this little shop in Hemet, while the other places are high priced, here you still get quality tools and equipment that are half the price of what you'd get at the other stores. Highly recommend getting your equipment here."
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-header uppercase">Inland Empire Builder</h4>
                <p className="text-xs text-zinc-500 font-mono">Hemet local / GC</p>
              </div>
            </div>

            {/* Quote 2 */}
            <div className="bg-[#111111] border border-zinc-850 p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                </div>
                <p className="text-zinc-300 text-sm font-light leading-relaxed italic">
                  "Brought my heavy concrete saw all the way from Oceanside to get fixed here. Everything I heard about this repair shop's expertise was absolutely great... turned out to be totally true. Thanks guys, saved me a major project delay."
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-header uppercase">Marcus G.</h4>
                <p className="text-xs text-zinc-500 font-mono">Oceanside Demolition Crew Leader</p>
              </div>
            </div>

            {/* Quote 3 */}
            <div className="bg-[#111111] border border-zinc-850 p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                </div>
                <p className="text-zinc-300 text-sm font-light leading-relaxed italic">
                  "Their customer service is courteous and highly professional. Hemet Valley Tools will definitely be my go-to depot for tool &amp; equipment rental going forward. Quick checkout and friendly advice."
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-header uppercase">Sarah D.</h4>
                <p className="text-xs text-zinc-500 font-mono">Landscaping Architect</p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* --- FINAL ACTION PRODUCER (CTA SECTION) --- */}
      <section className="bg-gradient-to-r from-[#0F0F0F] via-zinc-950 to-[#0F0F0F] py-24 border-b border-zinc-900 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 p-2.5 inline-block font-mono text-xs uppercase tracking-widest font-bold">
            READY TO BUILD YOUR MASS PLAN?
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold font-header uppercase tracking-tight text-white leading-tight">
            Stop Overpaying at Chains.<br />
            Secure Professional-Grade Power Gear Today.
          </h2>
          
          <p className="text-zinc-400 text-md max-w-2xl mx-auto font-light leading-relaxed">
            We offer premium power tools, professional repair services, and industrial equipment rentals to support your construction projects. Click below to confirm your real-time slot.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button 
              onClick={(e) => handleScrollToScheduler(e)} 
              className="w-full sm:w-auto bg-amber-500 text-black font-header uppercase tracking-wider font-bold py-4 px-10 hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              Lock-In Reservation Now
            </button>
            <a 
              href="tel:9519251106" 
              className="w-full sm:w-auto bg-transparent border border-zinc-700 hover:bg-zinc-900 text-white font-header uppercase tracking-wider font-bold py-4 px-10 transition-colors"
            >
              Speak to a Specialist
            </a>
          </div>
        </div>
      </section>


      {/* --- FOOTER --- */}
      <Footer />

    </div>
  );
};

export default HomePage;