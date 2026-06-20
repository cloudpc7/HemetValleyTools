import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import hemetValleyLogoImg from '../assets/hemet_valley_logo_clean.png';
import { useTheme } from '../Providers/ThemeContext';
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

// --- BADASS CUSTOM INDUSTRIAL LOGO (WEAPONS OF MASS CONSTRUCTION) ---
const HemetValleyLogo = ({ className = "w-12 h-12", watermark = false }) => {
  return (
    <img 
      src={hemetValleyLogoImg} 
      alt="Weapons of Mass Construction Logo" 
      className={`${className} transition-all duration-300 object-cover object-center aspect-square rounded-full ${
        watermark 
          ? "opacity-5 pointer-events-none select-none" 
          : "hover:scale-105 border border-zinc-800"
      }`}
    />
  );
};

const HomePage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  // --- STATE FOR INTERACTIVE RESERVATION WIZARD ---
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Rentals'); // Rentals, Repair, Supply
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('Daily'); // 4-hour, Daily, Weekly
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    projectNote: ''
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  // --- HARDCODED MOCK INVENTORY/RESOURCES ---
  const categories = [
    { id: 'Rentals', name: 'Equipment Rentals', icon: Hammer, desc: 'Heavy hitters & landscaping machinery' },
    { id: 'Repair', name: 'Certified Repairs', icon: Wrench, desc: 'Expert in-house diagnostic & tune-ups' },
    { id: 'Supply', name: 'Supply Pickups', icon: Package, desc: 'Professional-grade saw blades & diamond bits' }
  ];

  const toolsByCategory = {
    Rentals: [
      { id: 't1', name: 'Milwaukee Demolition Jackhammer', price: 85, durationRates: { '4-hour': 55, 'Daily': 85, 'Weekly': 340 } },
      { id: 't2', name: 'Makita Rotary Hammer Drill', price: 45, durationRates: { '4-hour': 30, 'Daily': 45, 'Weekly': 180 } },
      { id: 't3', name: 'Honda Commercial Power Washer', price: 75, durationRates: { '4-hour': 50, 'Daily': 75, 'Weekly': 300 } },
      { id: 't4', name: 'Stihl Landscaping Brushcutter', price: 60, durationRates: { '4-hour': 40, 'Daily': 60, 'Weekly': 240 } },
      { id: 't5', name: 'Husqvarna Walk-Behind Concrete Saw (14")', price: 120, durationRates: { '4-hour': 80, 'Daily': 120, 'Weekly': 480 } },
      { id: 't6', name: 'Bosch Self-Leveling Rotary Laser System', price: 55, durationRates: { '4-hour': 35, 'Daily': 55, 'Weekly': 220 } }
    ],
    Repair: [
      { id: 'r1', name: 'Small Engine Performance Tune-Up', price: 65, durationRates: { 'Daily': 65 } },
      { id: 'r2', name: 'Circular/Table Saw Calibration', price: 40, durationRates: { 'Daily': 40 } },
      { id: 'r3', name: 'Hydraulic Seal Replacement', price: 120, durationRates: { 'Daily': 120 } }
    ],
    Supply: [
      { id: 's1', name: 'Premium 14" Diamond Asphalt Saw Blade', price: 35, durationRates: { 'Daily': 35 } },
      { id: 's2', name: 'Premium 14" Diamond Core Drill Rig', price: 95, durationRates: { 'Daily': 95 } },
      { id: 's3', name: 'Contractor Safety & Rigging Pack', price: 55, durationRates: { 'Daily': 55 } }
    ]
  };

  const timeSlots = ['08:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'];

  // --- DERIVED CALCULATIONS ---
  const currentTools = toolsByCategory[selectedCategory] || [];
  
  // Set default tool when category changes
  useEffect(() => {
    if (currentTools.length > 0) {
      setSelectedTool(currentTools[0]);
    }
  }, [selectedCategory]);

  // Handle passed location state redirects from RentalsPage
  useEffect(() => {
    if (location.state) {
      const { preselectedCategory, preselectedToolId } = location.state;
      if (preselectedCategory) {
        setSelectedCategory(preselectedCategory);
      }
      if (preselectedToolId) {
        const found = (toolsByCategory[preselectedCategory] || []).find(t => t.id === preselectedToolId);
        if (found) {
          setSelectedTool(found);
          setBookingStep(2); // Jump straight to duration/schedule screen
        }
      }
    }
  }, [location.state]);

  const calculatePrice = () => {
    if (!selectedTool) return 0;
    if (selectedCategory === 'Rentals' && selectedTool.durationRates) {
      return selectedTool.durationRates[selectedDuration] || selectedTool.price;
    }
    return selectedTool.price;
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot || !customerInfo.name || !customerInfo.phone) {
      alert('Please fill out all required fields.');
      return;
    }
    setIsConfirmed(true);
  };

  const resetBooking = () => {
    setBookingStep(1);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setCustomerInfo({ name: '', phone: '', email: '', projectNote: '' });
    setIsConfirmed(false);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>

      {/* --- PREMIUM NAVBAR --- */}
      <nav className="border-b border-zinc-800 bg-[#0F0F0F] sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <HemetValleyLogo className="w-12 h-12" color="text-amber-500" />
              <div className="flex flex-col">
                <span className="text-white font-black font-header text-lg sm:text-xl tracking-wider leading-none">HEMET VALLEY TOOLS</span>
                <span className="text-[9px] sm:text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-1">EST. 1985 / WEAPONS OF MASS CONSTRUCTION</span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="hidden md:flex items-center space-x-8 font-header uppercase tracking-wider text-sm font-semibold">
              <a href="#hero" className="text-amber-500 transition-colors">Home</a>
              <Link to="/services" className="text-zinc-400 hover:text-white transition-colors">Services</Link>
              <Link to="/rentals" className="text-zinc-400 hover:text-white transition-colors">Rentals</Link>
              <Link to="/repair" className="text-zinc-400 hover:text-white transition-colors">Repairs</Link>
              <a href="#scheduler" className="text-zinc-400 hover:text-white transition-colors">Reserve</a>
              <a href="#testimonials" className="text-zinc-400 hover:text-white transition-colors">Testimonials</a>
            </div>

            {/* Hot Action Button & Theme Toggle */}
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-500 transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center"
                aria-label="Toggle Theme"
                title="Toggle Light / Dark Mode"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <a 
                href="#scheduler" 
                className="bg-zinc-900 border border-zinc-700 text-white font-header uppercase tracking-widest text-xs py-2.5 px-5 hover:bg-white hover:text-black transition-all duration-300 rounded-none font-bold"
              >
                Instant Reserve
              </a>
            </div>
          </div>
        </div>
      </nav>

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
                <a 
                  href="#scheduler" 
                  className="bg-amber-500 text-black hover:bg-white hover:text-black font-header uppercase tracking-wider font-bold py-3.5 px-7 flex items-center justify-center gap-3 transition-all duration-300"
                >
                  Book Rental Reservation <ArrowRight className="w-5 h-5" />
                </a>
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
              <a href="#scheduler" onClick={() => { setSelectedCategory('Rentals'); }} className="text-amber-500 font-header uppercase tracking-wider text-xs font-bold flex items-center gap-2 hover:text-white transition-colors">
                View Rental Catalog <ChevronRight className="w-4 h-4" />
              </a>
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
              <a href="#scheduler" onClick={() => { setSelectedCategory('Supply'); }} className="text-amber-500 font-header uppercase tracking-wider text-xs font-bold flex items-center gap-2 hover:text-white transition-colors">
                Browse Supply Catalog <ChevronRight className="w-4 h-4" />
              </a>
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
            <a href="#scheduler" className="bg-zinc-900 border border-zinc-800 text-white font-header uppercase tracking-wider py-3.5 px-7 hover:bg-amber-500 hover:text-black transition-colors duration-300">
              Go To Reservation Engine
            </a>
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
                <a href="#scheduler" onClick={() => { setSelectedCategory('Rentals'); setSelectedTool(toolsByCategory.Rentals[0]); }} className="bg-zinc-800 text-zinc-300 p-2 hover:bg-amber-500 hover:text-black transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </a>
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
                <a href="#scheduler" onClick={() => { setSelectedCategory('Rentals'); setSelectedTool(toolsByCategory.Rentals[2]); }} className="bg-zinc-800 text-zinc-300 p-2 hover:bg-amber-500 hover:text-black transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </a>
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
                <a href="#scheduler" onClick={() => { setSelectedCategory('Rentals'); setSelectedTool(toolsByCategory.Rentals[1]); }} className="bg-zinc-800 text-zinc-300 p-2 hover:bg-amber-500 hover:text-black transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </a>
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
                <a href="#scheduler" onClick={() => { setSelectedCategory('Rentals'); setSelectedTool(toolsByCategory.Rentals[2]); }} className="bg-zinc-800 text-zinc-300 p-2 hover:bg-amber-500 hover:text-black transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </a>
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
              <div className="grid grid-cols-4 gap-4 mb-8 text-center border-b border-zinc-800 pb-6 font-mono text-xs font-bold">
                <button 
                  onClick={() => setBookingStep(1)} 
                  className={`pb-2 border-b-2 transition-all ${bookingStep >= 1 ? 'border-amber-500 text-white' : 'border-transparent text-zinc-600'}`}
                >
                  01. CATEGORY
                </button>
                <button 
                  onClick={() => bookingStep >= 2 ? setBookingStep(2) : null} 
                  disabled={bookingStep < 2}
                  className={`pb-2 border-b-2 transition-all ${bookingStep >= 2 ? 'border-amber-500 text-white' : 'border-transparent text-zinc-600'}`}
                >
                  02. RESOURCE
                </button>
                <button 
                  onClick={() => bookingStep >= 3 ? setBookingStep(3) : null} 
                  disabled={bookingStep < 3}
                  className={`pb-2 border-b-2 transition-all ${bookingStep >= 3 ? 'border-amber-500 text-white' : 'border-transparent text-zinc-600'}`}
                >
                  03. CONTACT
                </button>
                <button 
                  disabled={true}
                  className={`pb-2 border-b-2 transition-all ${bookingStep === 4 ? 'border-amber-500 text-white' : 'border-transparent text-zinc-600'}`}
                >
                  04. CONFIRM
                </button>
              </div>

              {/* Step 1 Content: Category Selection */}
              {bookingStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold uppercase font-header text-white">Select Service or Tool Fleet</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {categories.map((cat) => {
                      const IconComp = cat.icon;
                      return (
                        <div 
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setBookingStep(2);
                          }}
                          className={`border p-6 cursor-pointer hover:bg-zinc-900 transition-all text-left group ${selectedCategory === cat.id ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 bg-[#141414]'}`}
                        >
                          <IconComp className={`w-8 h-8 mb-4 ${selectedCategory === cat.id ? 'text-amber-500' : 'text-zinc-400 group-hover:text-amber-500'}`} />
                          <h4 className="font-header font-bold text-white uppercase text-md mb-1">{cat.name}</h4>
                          <p className="text-zinc-400 text-xs font-light">{cat.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end pt-6">
                    <button 
                      onClick={() => setBookingStep(2)} 
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
                    <label className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Select Tool/Service Model</label>
                    <select 
                      value={selectedTool ? selectedTool.id : ''}
                      onChange={(e) => {
                        const tool = currentTools.find(t => t.id === e.target.value);
                        setSelectedTool(tool);
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
                    <div className="space-y-3">
                      <label className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Rental Duration</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['4-hour', 'Daily', 'Weekly'].map((dur) => (
                          <button
                            key={dur}
                            onClick={() => setSelectedDuration(dur)}
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
                      <label className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Select Target Date</label>
                      <input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-[#161616] border border-zinc-800 text-white p-3 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Available Time Grid</label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((ts) => (
                          <button
                            key={ts}
                            onClick={() => setSelectedTimeSlot(ts)}
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
                      onClick={() => setBookingStep(1)} 
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-header uppercase font-bold py-3 px-6 hover:bg-zinc-800"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => setBookingStep(3)} 
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
                      <label className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input 
                          type="text" 
                          required
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          placeholder="John Contractor"
                          className="w-full bg-[#161616] border border-zinc-800 text-white py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">SMS Reminder Mobile *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input 
                          type="tel" 
                          required
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          placeholder="(951) 555-0199"
                          className="w-full bg-[#161616] border border-zinc-800 text-white py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Email Address (Optional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                      <input 
                        type="email" 
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="john@constructionfirm.com"
                        className="w-full bg-[#161616] border border-zinc-800 text-white py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 block font-mono">Project Scope / Repair Model details</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                      <textarea 
                        rows="3"
                        value={customerInfo.projectNote}
                        onChange={(e) => setCustomerInfo({...customerInfo, projectNote: e.target.value})}
                        placeholder="e.g. Model Stihl ts420 engine repair, or yard landscaping demolition work requirements."
                        className="w-full bg-[#161616] border border-zinc-800 text-white py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-zinc-800 mt-6">
                    <button 
                      type="button"
                      onClick={() => setBookingStep(2)} 
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-header uppercase font-bold py-3 px-6 hover:bg-zinc-800"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="bg-amber-500 text-black font-header uppercase font-bold py-3 px-6 hover:bg-white transition-colors"
                    >
                      Review &amp; Lock-In
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4 Content: Instant Confirmation Screen */}
              {isConfirmed && (
                <div className="space-y-6 text-center py-8">
                  <div className="bg-green-500/15 border border-green-500/30 text-green-400 p-4 inline-block rounded-full">
                    <ShieldCheck className="w-16 h-16" />
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
                      className="bg-zinc-900 border border-zinc-800 text-white font-header uppercase py-3 px-8 hover:bg-white hover:text-black transition-colors"
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
            <a 
              href="#scheduler" 
              className="w-full sm:w-auto bg-amber-500 text-black font-header uppercase tracking-wider font-bold py-4 px-10 hover:bg-white hover:text-black transition-colors"
            >
              Lock-In Reservation Now
            </a>
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
      <footer className="bg-[#050505] text-zinc-500 py-16 text-sm text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-900">
            
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <HemetValleyLogo className="w-12 h-12" color="text-amber-500" />
                <div className="text-white font-header uppercase tracking-wider font-bold leading-tight">
                  HEMET VALLEY<br />TOOLS
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Premium tool sales, high-powered rentals, and expert machinery repairs for professionals and DIY builders in the Inland Empire.
              </p>
              <p className="text-xs text-zinc-400 font-mono">Ph: (951) 925-1106</p>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="text-white font-header uppercase tracking-wider font-bold">EXPLORE</div>
              <ul className="space-y-2 text-xs">
                <li><a href="#hero" className="hover:text-amber-500 transition-colors">Home</a></li>
                <li><Link to="/services" className="hover:text-amber-500 transition-colors">Services</Link></li>
                <li><Link to="/rentals" className="hover:text-amber-500 transition-colors">Rentals</Link></li>
                <li><Link to="/repair" className="hover:text-amber-500 transition-colors">Repairs</Link></li>
                <li><a href="#scheduler" className="hover:text-amber-500 transition-colors">Schedule Slot</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <div className="text-white font-header uppercase tracking-wider font-bold">LOCATION &amp; CONTACT</div>
              <ul className="space-y-2 text-xs text-zinc-500">
                <li>Hemet Storefront Yard:</li>
                <li className="text-zinc-400 font-mono">1430 E Florida Ave<br />Hemet, CA 92544</li>
                <li>Yard Loading Hours:</li>
                <li className="text-zinc-400">Mon - Fri: 7am - 5pm</li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-4">
              <div className="text-white font-header uppercase tracking-wider font-bold">SERVICES STATUS</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-zinc-400">Rentals: Fully Operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-zinc-400">Repairs: 48hr Diagnostic Turnaround</span>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} Hemet Valley Tools. All rights reserved. Powered By CloudDropDesigns LLC.</p>
            <div className="flex gap-4">
              <a href="#hero" className="hover:text-white">Privacy Policy</a>
              <a href="#hero" className="hover:text-white">Terms of Use</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default HomePage;