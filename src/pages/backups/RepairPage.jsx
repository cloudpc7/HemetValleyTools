import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Moon,
  FileText,
  DollarSign,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

const HemetValleyLogo = ({ className = "w-12 h-12" }) => {
  return (
    <img 
      src={hemetValleyLogoImg} 
      alt="Weapons of Mass Construction Logo" 
      className={`${className} transition-all duration-300 object-cover object-center aspect-square rounded-full border border-zinc-800 hover:scale-105`}
    />
  );
};

const RepairPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // --- STATE FOR BEFORE/AFTER SHOWROOM ---
  const [activeGalleryTab, setActiveGalleryTab] = useState('engine'); // engine, saw, drill
  const [showAfterState, setShowAfterState] = useState(true); // Toggle before/after for selected tool

  // --- STATE FOR ESTIMATOR ---
  const [selectedToolClass, setSelectedToolClass] = useState('small-gas'); // small-gas, cut-saw, power-tool, heavy-hydraulic
  
  const toolClassEstimates = {
    'small-gas': {
      title: 'Small Gas Engines (GX Engines, Pressure Washers)',
      diagnostic: '$45.00',
      hourly: '$65 - $85 / hr',
      turnaround: '2 - 3 Days',
      commonRepairs: ['Carburetor ultrasonic clean & rebuild', 'Governor speed calibration', 'Spark plug & coil replacement', 'Pull-start recoil refitting'],
      guarantee: '90-Day Operational Warranty'
    },
    'cut-saw': {
      title: 'Concrete Saws & Power Cut-Off Saws',
      diagnostic: '$45.00',
      hourly: '$55 - $75 / hr',
      turnaround: '1 - 2 Days (Rapid)',
      commonRepairs: ['Vibration mounts inspection & replacement', 'Drive belt tensioning & swap', 'Centrifugal clutch replacement', 'Arbor bearing calibration'],
      guarantee: '90-Day Parts & Labor Warranty'
    },
    'power-tool': {
      title: 'Electric & Cordless Power Tools (SDS-Max, Demolition)',
      diagnostic: '$35.00',
      hourly: '$45 - $60 / hr',
      turnaround: '24 - 48 Hours',
      commonRepairs: ['Carbon brushes inspection & replacement', 'Power cord double-insulation fit', 'Gearbox lubrication & sealing', 'Armature/field winding replacement'],
      guarantee: '60-Day Workmanship Warranty'
    },
    'heavy-hydraulic': {
      title: 'Hydraulic Compaction & Grading Equipment',
      diagnostic: '$55.00',
      hourly: '$75 - $95 / hr',
      turnaround: '3 - 4 Days',
      commonRepairs: ['Hydraulic seals & seal ring replacement', 'Impact shoe spring calibration', 'Exhaust muffler decarbonization', 'Fuel lines & tank flush'],
      guarantee: '120-Day Heavy Duty Warranty'
    }
  };

  const currentEstimate = toolClassEstimates[selectedToolClass];

  // --- INTAKE FORM STATE ---
  const [intakeForm, setIntakeForm] = useState({
    name: '',
    phone: '',
    email: '',
    toolBrand: 'Milwaukee',
    toolModel: '',
    symptom: 'Engine fails to spark/run',
    notes: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!intakeForm.name || !intakeForm.phone || !intakeForm.notes) {
      alert('Please fill out all required fields.');
      return;
    }
    setFormSubmitted(true);
  };

  const handleBookingRedirect = () => {
    // Navigate home and pre-select the "Repair" category for the booking scheduler
    navigate('/', { 
      state: { 
        preselectedCategory: 'Repair' 
      } 
    });
    setTimeout(() => {
      const el = document.getElementById('scheduler');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      
      {/* --- REPAIRS GLASS NAVBAR --- */}
      <nav className="border-b border-zinc-800 bg-[#0F0F0F] sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <HemetValleyLogo className="w-12 h-12" />
              <div className="flex flex-col">
                <span className="text-white font-black font-header text-lg sm:text-xl tracking-wider leading-none">HEMET VALLEY TOOLS</span>
                <span className="text-[9px] sm:text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-1">EST. 1985 / WEAPONS OF MASS CONSTRUCTION</span>
              </div>
            </Link>

            {/* Navigation links */}
            <div className="hidden md:flex items-center space-x-8 font-header uppercase tracking-wider text-sm font-semibold">
              <Link to="/" className="text-zinc-400 hover:text-white transition-colors">Home</Link>
              <Link to="/services" className="text-zinc-400 hover:text-white transition-colors">Services</Link>
              <Link to="/rentals" className="text-zinc-400 hover:text-white transition-colors">Rentals</Link>
              <Link to="/repair" className="text-amber-500 transition-colors">Repairs</Link>
              <Link to="/#scheduler" className="text-zinc-400 hover:text-white transition-colors">Reserve</Link>
              <Link to="/#testimonials" className="text-zinc-400 hover:text-white transition-colors">Testimonials</Link>
            </div>

            {/* Theme Toggle & Instant Reserve */}
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-500 transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center"
                aria-label="Toggle Theme"
                title="Toggle Light / Dark Mode"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link 
                to="/#scheduler" 
                className="bg-zinc-900 border border-zinc-700 text-white font-header uppercase tracking-widest text-xs py-2.5 px-5 hover:bg-white hover:text-black transition-all duration-300 rounded-none font-bold"
              >
                Instant Reserve
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-[#0F0F0F] to-[#050505] py-12 lg:py-16">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>

        <div className="absolute right-4 lg:right-12 bottom-4 lg:bottom-6 pointer-events-none z-0 select-none opacity-10">
          <img src={hemetValleyLogoImg} alt="" className="w-[22rem] h-[22rem] lg:w-[32rem] lg:h-[32rem] rounded-full object-cover" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold mb-6">
            <Wrench className="w-4 h-4 animate-spin-slow" /> Certified Workshop &amp; Repairs
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-header uppercase leading-none tracking-tight text-white mb-4">
            Expert Tool &amp;<br />
            <span className="text-amber-500">Equipment Repairs</span>
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
            Fast, reliable diagnostic checks and full engine overhauls by trained, local professionals. Restoring your heavy-duty construction gear to absolute factory-spec tolerances since 1985.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <a 
              href="#intake-form-section" 
              className="bg-amber-500 text-black hover:bg-white hover:text-black font-header uppercase tracking-wider font-bold py-3.5 px-7 flex items-center justify-center gap-3 transition-all duration-300"
            >
              Book In-Shop Diagnostic <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="tel:9515550190" 
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-header uppercase tracking-wider font-bold py-3.5 px-7 flex items-center justify-center gap-2 transition-all duration-300"
            >
              Speak to a Machinist
            </a>
          </div>
        </div>
      </header>

      {/* --- MAIN REPAIR INTERACTION LAYOUT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* --- WHY CHOOSE REPAIR (ADVANTAGE GRID) --- */}
        <section className="mb-24 text-left">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Workshop Credentials</span>
            <h2 className="text-3xl font-black font-header uppercase text-white mt-1">Our Certified Workshop Standards</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#111111] border border-zinc-850 p-6 space-y-4">
              <div className="bg-amber-500/10 p-3 inline-block border border-amber-500/20 text-amber-500">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-header uppercase text-white">41+ Years Experience</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Our counter technicians and machine specialists bring decades of hands-on small-engine and electrical component wisdom. We diagnose what box-stores ignore.
              </p>
            </div>

            <div className="bg-[#111111] border border-zinc-850 p-6 space-y-4">
              <div className="bg-amber-500/10 p-3 inline-block border border-amber-500/20 text-amber-500">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-header uppercase text-white">Flat Upfront Diagnostic</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                A flat fee guarantees a complete diagnostic overhaul. If you approve the repair, the full amount is credited 100% back to your final labor bill. No double charging.
              </p>
            </div>

            <div className="bg-[#111111] border border-zinc-850 p-6 space-y-4">
              <div className="bg-amber-500/10 p-3 inline-block border border-amber-500/20 text-amber-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-header uppercase text-white">OSHA &amp; Safety Verification</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                We don’t just swap plugs. Every repaired tool undergoes electrical insulation testing, RPM check-outs, and safety shield verifications before it leaves our bay.
              </p>
            </div>

            <div className="bg-[#111111] border border-zinc-850 p-6 space-y-4">
              <div className="bg-amber-500/10 p-3 inline-block border border-amber-500/20 text-amber-500">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-header uppercase text-white">Direct OEM Accessories</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                We maintain direct channels with Milwaukee, Makita, Honda, and Husqvarna to source genuine replacement filters, belts, and carbon brushes.
              </p>
            </div>
          </div>
        </section>

        {/* --- BEFORE/AFTER DYNAMIC SHOWROOM --- */}
        <section className="mb-24 py-16 border-t border-zinc-850 text-left">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Selector and descriptive info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="inline-flex items-center gap-2 border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold">
                <Activity className="w-4 h-4" /> Mechanical Showroom
              </div>
              <h2 className="text-3xl font-bold font-header uppercase tracking-tight text-white leading-none">
                Real Diagnostics,<br />
                <span className="text-amber-500">Proven Results</span>
              </h2>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Step inside our diagnostics lab. Toggle between the "Before" and "After" status views of our most common heavy contractor repair work. We take pride in restoring lost power.
              </p>

              {/* Tab Selector */}
              <div className="space-y-2.5 pt-4">
                <button
                  onClick={() => { setActiveGalleryTab('engine'); setShowAfterState(true); }}
                  className={`w-full p-4 border text-left flex justify-between items-center transition-all ${
                    activeGalleryTab === 'engine' 
                      ? 'bg-[#141414] border-amber-500 text-white' 
                      : 'bg-zinc-950/20 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-amber-500" />
                    <span className="font-header uppercase tracking-wider text-xs font-bold">Honda GX390 Small Engine</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>

                <button
                  onClick={() => { setActiveGalleryTab('saw'); setShowAfterState(true); }}
                  className={`w-full p-4 border text-left flex justify-between items-center transition-all ${
                    activeGalleryTab === 'saw' 
                      ? 'bg-[#141414] border-amber-500 text-white' 
                      : 'bg-zinc-950/20 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sliders className="w-5 h-5 text-amber-500" />
                    <span className="font-header uppercase tracking-wider text-xs font-bold">Stihl TS420 Concrete Saw</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>

                <button
                  onClick={() => { setActiveGalleryTab('drill'); setShowAfterState(true); }}
                  className={`w-full p-4 border text-left flex justify-between items-center transition-all ${
                    activeGalleryTab === 'drill' 
                      ? 'bg-[#141414] border-amber-500 text-white' 
                      : 'bg-zinc-950/20 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-amber-500" />
                    <span className="font-header uppercase tracking-wider text-xs font-bold">Milwaukee SDS-Max Drill</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>

            {/* Right Column: Visual Interactive Interactive Card mimicking Photoshop details */}
            <div className="lg:col-span-8 bg-[#111111] border border-zinc-800 p-8 relative">
              <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-500 p-2 font-mono text-xs font-bold">CASE FILE: 1985-{activeGalleryTab.toUpperCase()}</div>
              
              {/* Dynamic Before / After Toggle Buttons */}
              <div className="flex gap-2 border-b border-zinc-850 pb-6 mb-6">
                <button
                  onClick={() => setShowAfterState(false)}
                  className={`px-4 py-2 text-xs font-mono uppercase border ${
                    !showAfterState 
                      ? 'bg-red-500/10 text-red-500 border-red-500/30 font-bold' 
                      : 'bg-zinc-950 text-zinc-500 border-zinc-850 hover:text-white'
                  }`}
                >
                  [ SHOW INTAKE "BEFORE" STATE ]
                </button>
                <button
                  onClick={() => setShowAfterState(true)}
                  className={`px-4 py-2 text-xs font-mono uppercase border ${
                    showAfterState 
                      ? 'bg-green-500/10 text-green-400 border-green-500/30 font-bold' 
                      : 'bg-zinc-950 text-zinc-500 border-zinc-850 hover:text-white'
                  }`}
                >
                  [ SHOW DELIVERED "AFTER" STATE ]
                </button>
              </div>

              {/* Dynamic Content Display */}
              {activeGalleryTab === 'engine' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold font-header uppercase text-white">Honda GX390 OHV Commercial Engine</h4>
                      <p className="text-xs text-zinc-500 font-mono mt-1">Symptom: Will not start, backfires on choke pull</p>
                    </div>
                    <span className={`text-xs font-mono px-3 py-1 border uppercase font-bold ${showAfterState ? 'text-green-400 bg-green-500/5 border-green-500/20' : 'text-red-500 bg-red-500/5 border-red-500/20'}`}>
                      {showAfterState ? 'Operational spec verified' : 'Intake check-in'}
                    </span>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-850 p-6">
                    <p className="text-sm text-zinc-300 leading-relaxed font-light italic">
                      {showAfterState 
                        ? '"Cleaned and synchronized fuel system completely. Re-calibrated governor speed under generator load to limit max RPM to flat 3600. Replaced gaskets and compression holds. Starts instantly on first easy pull."' 
                        : '"Varnished gasoline completely clogged float-bowl jets. Piston head carbon buildup is severe, reducing combustion chambers PSI to a low 65. Ignitions coil is highly corroded."'}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">Fuel system:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? 'Ultrasonic Cleaned & Sync Rebuilt' : 'Clogged & Gunked gasoline'}
                      </span>
                    </div>
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">Compression Rating:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? '95 PSI (Factory Spec)' : '65 PSI (Low compression limit)'}
                      </span>
                    </div>
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">Ignition Coil check:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? 'Replaced (Genuine OEM Honda Part)' : 'Weak Spark / Corroded terminals'}
                      </span>
                    </div>
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">Governor Calibration:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? '3600 RPM Load Lock' : 'Fluctuating / Erratic Engine Speed'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeGalleryTab === 'saw' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold font-header uppercase text-white">Stihl TS420 Cut-Off Concrete Saw</h4>
                      <p className="text-xs text-zinc-500 font-mono mt-1">Symptom: Blade bogs down completely during concrete cut</p>
                    </div>
                    <span className={`text-xs font-mono px-3 py-1 border uppercase font-bold ${showAfterState ? 'text-green-400 bg-green-500/5 border-green-500/20' : 'text-red-500 bg-red-500/5 border-red-500/20'}`}>
                      {showAfterState ? 'Safety test certified' : 'Intake check-in'}
                    </span>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-850 p-6">
                    <p className="text-sm text-zinc-300 leading-relaxed font-light italic">
                      {showAfterState 
                        ? '"Replaced worn drive belt with Stihl high-tension replacement. Replaced slipping centrifugal clutch springs. Repacked arbor bearings. Restored massive torque during concrete stress-testing."' 
                        : '"Drive belt worn flat with severe cracking, losing tension under pressure. Centrifugal clutch springs stretched beyond limits, slipping under load. Air filtration completely packed with concrete sludge."'}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">Drive Belt Tension:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? 'Tuned to Stihl standard' : 'Cracked, flat, slipping'}
                      </span>
                    </div>
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">Centrifugal Clutch:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? 'Springs Replaced' : 'Stretched springs, slipping'}
                      </span>
                    </div>
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">Air Filtration System:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? 'Cleaned & Pre-filter Replaced' : 'Concrete sediment mud filter'}
                      </span>
                    </div>
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">Water Spray System:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? 'Flushed & Calibrated' : 'Clogged nozzles'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeGalleryTab === 'drill' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold font-header uppercase text-white">Milwaukee SDS-Max Demolition Rotary Drill</h4>
                      <p className="text-xs text-zinc-500 font-mono mt-1">Symptom: Severe sparking at vents, intermittent power drops</p>
                    </div>
                    <span className={`text-xs font-mono px-3 py-1 border uppercase font-bold ${showAfterState ? 'text-green-400 bg-green-500/5 border-green-500/20' : 'text-red-500 bg-red-500/5 border-red-500/20'}`}>
                      {showAfterState ? 'OSHA insulation certified' : 'Intake check-in'}
                    </span>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-850 p-6">
                    <p className="text-sm text-zinc-300 leading-relaxed font-light italic">
                      {showAfterState 
                        ? '"Replaced worn carbon brushes with premium Milwaukee OEM brushes. Cleaned armature commutator face of copper slag. Swapped frayed power cable with 12ft double-insulated commercial cord. Ground tested 100% stable."' 
                        : '"Carbon brushes worn flat to the wire trigger, arcing extensively against commutator. Armature has significant copper slag carbon buildup. Rubber strain relief is shredded, exposing hot wiring."'}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">Carbon Brushes:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? 'OEM Replaced & Seated' : 'Worn to copper trigger'}
                      </span>
                    </div>
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">Commutator Status:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? 'Cleaned & Polished' : 'Copper slag and carbon glaze'}
                      </span>
                    </div>
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">Power Cord Insulation:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? 'Fitted 12ft double-insulated' : 'Frayed hot wiring exposed'}
                      </span>
                    </div>
                    <div className="bg-[#181818] p-4 border border-zinc-850">
                      <span className="text-zinc-500 uppercase block mb-1">OSHA Ground Test:</span>
                      <span className={showAfterState ? 'text-green-400' : 'text-red-400'}>
                        {showAfterState ? 'Passed (0.01 Ohms resist)' : 'Failed (High hazard short)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* --- FIVE STEP PROCESS TIMELINE --- */}
        <section className="py-20 border-t border-zinc-850 mb-16 text-left">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">WORKSHOP TIMELINE</span>
            <h2 className="text-3xl sm:text-4xl font-black font-header uppercase text-white">Our 5-Step Repair Process</h2>
            <p className="text-zinc-400 font-light text-sm max-w-2xl mx-auto">We follow a strict, certified framework to guarantee complete mechanical and electrical safety before restoring tools back to active service.</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 text-left font-sans">
            {/* Step 1 */}
            <div className="bg-[#111111] border border-zinc-850 p-6 relative">
              <div className="text-amber-500 font-black font-header text-3xl mb-4">01</div>
              <h4 className="text-base font-header uppercase font-bold text-white mb-2">Drop-Off or Pickup</h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Bring your tool directly to our Hemet storefront yard, or request job-site logistics pickup.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#111111] border border-zinc-850 p-6 relative">
              <div className="text-amber-500 font-black font-header text-3xl mb-4">02</div>
              <h4 className="text-base font-header uppercase font-bold text-white mb-2">Intake Diagnosis</h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                We collect diagnostic deposit fee and perform a complete teardown and combustion analysis.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#111111] border border-zinc-850 p-6 relative">
              <div className="text-amber-500 font-black font-header text-3xl mb-4">03</div>
              <h4 className="text-base font-header uppercase font-bold text-white mb-2">Estimate Approval</h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                We phone or text you with a precise parts and labor quotation. We never start without your green light.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#111111] border border-zinc-850 p-6 relative">
              <div className="text-amber-500 font-black font-header text-3xl mb-4">04</div>
              <h4 className="text-base font-header uppercase font-bold text-white mb-2">Certified Repair</h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Our certified machinist team replaces components, flushes lines, and recalibrates settings.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-[#111111] border border-zinc-850 p-6 relative">
              <div className="text-amber-500 font-black font-header text-3xl mb-4">05</div>
              <h4 className="text-base font-header uppercase font-bold text-white mb-2">Safety Pick Up</h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Multi-point safety stress-tests passed. Pick up tool, diagnostic fee credited back, return to project!
              </p>
            </div>
          </div>
        </section>

        {/* --- LIVE WORKSHOP ESTIMATOR --- */}
        <section className="bg-zinc-900 border border-zinc-800 p-8 sm:p-12 mb-24 relative overflow-hidden text-left rounded-none">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}></div>

          <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Workshop Rates</span>
              <h3 className="text-2xl sm:text-3xl font-black font-header uppercase text-white mt-1">Diagnostics &amp; Rates Estimator</h3>
            </div>
            <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-3 py-1 border border-amber-500/20 uppercase">No Hidden Surcharges</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Left selector buttons */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <button
                onClick={() => setSelectedToolClass('small-gas')}
                className={`p-4 border text-left flex justify-between items-center transition-all ${
                  selectedToolClass === 'small-gas' 
                    ? 'border-amber-500 bg-amber-500/5 text-white' 
                    : 'border-zinc-800 bg-[#161616] text-zinc-400 hover:text-white'
                }`}
              >
                <span className="font-header uppercase tracking-wider text-xs font-bold">Small Gas Engines (GX Carb)</span>
                <Settings className="w-4 h-4 text-amber-500" />
              </button>

              <button
                onClick={() => setSelectedToolClass('cut-saw')}
                className={`p-4 border text-left flex justify-between items-center transition-all ${
                  selectedToolClass === 'cut-saw' 
                    ? 'border-amber-500 bg-amber-500/5 text-white' 
                    : 'border-zinc-800 bg-[#161616] text-zinc-400 hover:text-white'
                }`}
              >
                <span className="font-header uppercase tracking-wider text-xs font-bold">Concrete Cut-Off Saws</span>
                <Sliders className="w-4 h-4 text-amber-500" />
              </button>

              <button
                onClick={() => setSelectedToolClass('power-tool')}
                className={`p-4 border text-left flex justify-between items-center transition-all ${
                  selectedToolClass === 'power-tool' 
                    ? 'border-amber-500 bg-amber-500/5 text-white' 
                    : 'border-zinc-800 bg-[#161616] text-zinc-400 hover:text-white'
                }`}
              >
                <span className="font-header uppercase tracking-wider text-xs font-bold">Electric Power Tools</span>
                <Cpu className="w-4 h-4 text-amber-500" />
              </button>

              <button
                onClick={() => setSelectedToolClass('heavy-hydraulic')}
                className={`p-4 border text-left flex justify-between items-center transition-all ${
                  selectedToolClass === 'heavy-hydraulic' 
                    ? 'border-amber-500 bg-amber-500/5 text-white' 
                    : 'border-zinc-800 bg-[#161616] text-zinc-400 hover:text-white'
                }`}
              >
                <span className="font-header uppercase tracking-wider text-xs font-bold">Hydraulic Compactor / Rammers</span>
                <Hammer className="w-4 h-4 text-amber-500" />
              </button>
            </div>

            {/* Right Estimator results box */}
            <div className="lg:col-span-7 bg-[#141414] border border-zinc-850 p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Current Selection Class</span>
                  <h4 className="text-xl font-bold font-header text-white uppercase tracking-wider mt-1">{currentEstimate.title}</h4>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 pt-4 border-t border-zinc-850 font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Intake Deposit:</span>
                    <span className="text-amber-500 text-lg font-bold">{currentEstimate.diagnostic}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Average Labor:</span>
                    <span className="text-white text-lg font-bold">{currentEstimate.hourly}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Est. Turnaround:</span>
                    <span className="text-green-400 text-lg font-bold">{currentEstimate.turnaround}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Common Workshop Operations Included:</span>
                  <ul className="text-xs text-zinc-400 space-y-1.5 pl-1">
                    {currentEstimate.commonRepairs.map((repair, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{repair}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-zinc-850 pt-6 mt-6 flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-500">Guarantee: <strong className="text-white">{currentEstimate.guarantee}</strong></span>
                <button 
                  onClick={handleBookingRedirect}
                  className="text-amber-500 hover:text-white uppercase font-bold tracking-wider font-header flex items-center gap-1.5"
                >
                  Schedule Workshop drops <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- INTAKE TICKET REQUEST FORM --- */}
        <section id="intake-form-section" className="border border-zinc-850 p-6 sm:p-10 bg-zinc-950/20 max-w-4xl mx-auto rounded-none text-left">
          
          <div className="text-center sm:text-left mb-8 border-b border-zinc-900 pb-6">
            <h3 className="text-2xl sm:text-3xl font-bold font-header uppercase text-white">Book Your Workshop Drops</h3>
            <p className="text-sm text-zinc-500 font-light mt-1">
              Complete the mechanical check-in form below. Our technicians will have a workbench ready and print your intake receipt in 30 seconds upon storefront dropoff.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-zinc-900/50 border border-green-500/20 p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-header uppercase tracking-wider text-white mb-2">Repair Ticket Created Successfully</h4>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                Thank you, {intakeForm.name}. Your intake reservation is logged. Bring your <strong className="text-white">{intakeForm.toolBrand} {intakeForm.toolModel || 'machinery'}</strong> to our Hemet storefront during workshop hours.
              </p>
              <button 
                onClick={() => { setFormSubmitted(false); setIntakeForm({ name:'', phone:'', email:'', toolBrand:'Milwaukee', toolModel:'', symptom:'Engine fails to spark/run', notes:'' }); }}
                className="mt-6 px-5 py-2 border border-zinc-855 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-mono uppercase"
              >
                File Another Repair Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Name */}
                <div>
                  <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Your Name / Contact *</label>
                  <input 
                    type="text" 
                    required
                    value={intakeForm.name}
                    onChange={(e) => setIntakeForm({ ...intakeForm, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">SMS Update Mobile *</label>
                  <input 
                    type="tel" 
                    required
                    value={intakeForm.phone}
                    onChange={(e) => setIntakeForm({ ...intakeForm, phone: e.target.value })}
                    placeholder="e.g., (951) 555-0190"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Brand select */}
                <div>
                  <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Equipment Brand</label>
                  <select 
                    value={intakeForm.toolBrand}
                    onChange={(e) => setIntakeForm({ ...intakeForm, toolBrand: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500 font-sans rounded-none"
                  >
                    <option value="Milwaukee">Milwaukee Tool</option>
                    <option value="Makita">Makita Industrial</option>
                    <option value="Honda">Honda Engines</option>
                    <option value="Stihl">Stihl Outdoor Power</option>
                    <option value="Husqvarna">Husqvarna Construction</option>
                    <option value="Bosch">Bosch Power Tools</option>
                    <option value="DeWalt">DeWalt / Other</option>
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Model Number / Code</label>
                  <input 
                    type="text" 
                    value={intakeForm.toolModel}
                    onChange={(e) => setIntakeForm({ ...intakeForm, toolModel: e.target.value })}
                    placeholder="e.g. GX390, TS420, or MX-FUEL"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

              </div>

              {/* Symptom categories */}
              <div>
                <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Primary Mechanical Symptom</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {['Engine fails to spark/run', 'Slipping belt / lost torque', 'Frayed cord / electrical short'].map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => setIntakeForm({ ...intakeForm, symptom: sym })}
                      className={`py-3 px-4 text-xs uppercase tracking-wider font-header font-bold transition-all border text-center ${
                        intakeForm.symptom === sym 
                          ? 'bg-amber-500 text-black border-amber-500' 
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details notes */}
              <div>
                <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Detailed Symptom Description *</label>
                <textarea 
                  required
                  rows="4"
                  value={intakeForm.notes}
                  onChange={(e) => setIntakeForm({ ...intakeForm, notes: e.target.value })}
                  placeholder="Tell us what is failing (e.g., table saw smells like hot plastic after 3 minutes, or honda carburetor keeps bogging down under pressure, or drive clutch doesn't engage when throttle pulled)..."
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit"
                className="w-full bg-amber-500 text-black hover:bg-white font-header uppercase tracking-wider font-black py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300"
              >
                Transmit In-Shop Diagnostic Ticket <ArrowRight className="w-5 h-5" />
              </button>

            </form>
          )}

        </section>

        {/* --- TESTIMONIALS SECTION --- */}
        <section className="py-24 border-t border-zinc-850 mt-16 text-left">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold">CLIENT LOGS</h2>
            <p className="text-3xl sm:text-4xl font-bold font-header uppercase text-white">Trusted by Inland Empire Machinists</p>
            <p className="text-zinc-400 font-light text-sm max-w-2xl mx-auto">See how our quick diagnostics have saved deadlines and extended machinery lifespans for real local contractors.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#111111] border border-zinc-850 p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                </div>
                <p className="text-zinc-300 text-sm font-light leading-relaxed italic">
                  "Brought my heavy-duty concrete saw all the way from Oceanside to get fixed here. Everything I heard about this repair shop's expertise was absolutely great... turned out to be totally true. Thanks guys, saved me a major project delay."
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-header uppercase">Marcus G.</h4>
                <p className="text-xs text-zinc-500 font-mono">Oceanside Demolition Crew Leader</p>
              </div>
            </div>

            <div className="bg-[#111111] border border-zinc-850 p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                </div>
                <p className="text-zinc-300 text-sm font-light leading-relaxed italic">
                  "Most shops take two weeks just to tell you what's wrong. These guys had my Honda generator carburetor rebuilt, fully speed-tested, and back on our framing site in 48 hours. Incredible service, no nonsense."
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-header uppercase">Dave L.</h4>
                <p className="text-xs text-zinc-500 font-mono">Inland Framing Foreman</p>
              </div>
            </div>

            <div className="bg-[#111111] border border-zinc-850 p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                </div>
                <p className="text-zinc-300 text-sm font-light leading-relaxed italic">
                  "We have a fleet of 12 SDS Max concrete rotary drills. Hemet Valley Tool handles all our carbon brush swap-outs and OSHA electrical ground verifications. Keeps our operations safe and compliant every single quarter."
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-header uppercase">Sarah H.</h4>
                <p className="text-xs text-zinc-500 font-mono">Hemet Masonry &amp; Core drilling</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-zinc-900 bg-gradient-to-r from-[#0F0F0F] via-zinc-950 to-[#0F0F0F] py-16 text-zinc-500 font-light text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-12">
            
            {/* Column 1: Core details */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <HemetValleyLogo className="w-10 h-10" />
                <span className="text-white font-black font-header tracking-wider text-base">HEMET VALLEY TOOLS</span>
              </div>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                Weapons of Mass Construction. Supplying contractors, landscapers, and residential crews with heavy machinery, diamond accessories, and certified tool repairs since 1985.
              </p>
              <div className="flex items-center gap-2 text-zinc-400 pt-2 text-xs font-mono">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Hemet, California / Serving the Entire Inland Empire</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-white font-header uppercase tracking-widest text-xs font-bold mb-4">Core Divisions</h4>
              <ul className="space-y-2 text-xs font-mono uppercase text-zinc-400">
                <li><Link to="/rentals" className="hover:text-amber-500 transition-colors">Equipment Rentals</Link></li>
                <li><Link to="/repair" className="hover:text-amber-500 transition-colors">Certified Repairs</Link></li>
                <li><Link to="/services" className="hover:text-amber-500 transition-colors">Custom Sales &amp; Sourcing</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact details */}
            <div>
              <h4 className="text-white font-header uppercase tracking-widest text-xs font-bold mb-4">Hemet Headquarters</h4>
              <ul className="space-y-2 text-xs font-mono text-zinc-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-500" /> (951) 555-0190
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-500" /> service@hemetvalleytools.com
                </li>
                <li className="pt-2 text-zinc-500">
                  Mon – Fri: 7:00 AM – 5:00 PM<br />
                  Saturday: 8:00 AM – 2:00 PM
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-600 gap-4">
            <span>&copy; {new Date().getFullYear()} HEMET VALLEY TOOL &amp; SUPPLY. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-zinc-400 transition-colors">TERMS OF SERVICE</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">PRIVACY POLICY</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">OSHA SAFETY</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default RepairPage;
