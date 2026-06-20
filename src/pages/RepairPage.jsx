import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
  RotateCcw,
  Search,
  X
} from 'lucide-react';

import Navbar from '../ui/components/Navbar';
import Footer from '../ui/components/Footer';
import HemetValleyLogo from '../ui/components/HemetValleyLogo';
import SEO from '../ui/components/SEO';

import { 
  setSearchedTicket, 
  addSearchHistory, 
  clearSearch, 
  clearSearchHistory,
  setActiveGalleryTab,
  setShowAfterState,
  setSelectedToolClass,
  setRepairFormSubmitted,
  setTracerSearchInput,
  setTracerError,
  setIsTracing
} from '../redux/slices/repairsSlice';
import { updateRepairDraft, clearRepairDraft } from '../redux/slices/formDraftsSlice';
import { submitRepairTicketThunk, traceRepairTicketThunk } from '../redux/slices/data.slice';

const RepairPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- REDUX REPAIR TRACER STATE ---
  const { 
    activeTicketId, 
    activeTicketStatus, 
    searchHistory,
    activeGalleryTab,
    showAfterState,
    selectedToolClass,
    formSubmitted,
    tracerSearchInput,
    tracerError,
    isTracing
  } = useSelector((state) => state.repairs);
  const intakeForm = useSelector((state) => state.formDrafts.repairForm);

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

  // --- TRACER QUERY FUNCTION ---
  const handleTracerSearch = async (e, ticketCode = null) => {
    if (e) e.preventDefault();
    const query = (ticketCode || tracerSearchInput).trim().toUpperCase();
    if (!query) {
      dispatch(setTracerError('Please enter a ticket ID.'));
      return;
    }
    dispatch(setTracerError(''));
    dispatch(setIsTracing(true));

    try {
      const ticketData = await dispatch(traceRepairTicketThunk(query)).unwrap();
      if (ticketData) {
        dispatch(setSearchedTicket({
          ticketId: query,
          status: {
            ...ticketData,
            tool: ticketData.modelName || ticketData.tool || 'Unknown Tool Model'
          }
        }));
        dispatch(addSearchHistory(query));
      } else {
        dispatch(setTracerError(`Ticket ${query} not found. Try HVT-8802 or HVT-4901.`));
        dispatch(clearSearch());
      }
    } catch (err) {
      dispatch(setTracerError(`Search error: ${err.message}`));
      dispatch(clearSearch());
    } finally {
      dispatch(setIsTracing(false));
    }
  };

  // --- INTAKE FORM SUBMIT ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const notes = intakeForm.notes || intakeForm.issueDescription;
    if (!intakeForm.name || !intakeForm.phone || !notes) {
      alert('Please fill out all required fields.');
      return;
    }
    try {
      const ticketId = await dispatch(submitRepairTicketThunk({
        ...intakeForm,
        notes
      })).unwrap();
      // Set searched ticket state so user can see it
      dispatch(setSearchedTicket({
        ticketId,
        status: {
          tool: `${intakeForm.brand || 'Milwaukee'} ${intakeForm.modelName || ''}`,
          status: 'Diagnostic Intake Check-in',
          eta: 'TBD (Teardown Pending)',
          tech: 'Triage Queue',
          diagnostics: 'Tool registered in shop database. Bench technician assigned for upcoming teardown and inspection phase.',
          cost: '$45.00 Deposit Paid',
          progress: 25
        }
      }));
      dispatch(setTracerSearchInput(ticketId));
      dispatch(setRepairFormSubmitted(true));
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    }
  };

  const handleBookingRedirect = () => {
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

  const repairSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Hemet Valley Tools Certified Repairs",
    "image": "https://hemetvalleytools.com/assets/hemet_valley_logo_clean-DamuFsws.png",
    "@id": "https://hemetvalleytools.com/repair/#localbusiness",
    "url": "https://hemetvalleytools.com/repair",
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
    "description": "Certified mechanical repairs, diagnostic teardowns, and small engine overhauls for major brands with dynamic client ticket tracing."
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      <SEO 
        title="Certified Tool & Engine Repair Shop | Live Status Tracer | Hemet Valley Tools"
        description="Get fast diagnostic teardowns and engine overhauls for Milwaukee, Makita, Husqvarna, and more. Track your live repair status using our physical receipt tracer."
        keywords="tool repair Hemet, generator service, small engine diagnostics, tool tracer, Husqvarna concrete saw repair, Milwaukee warranty service"
        schema={repairSchema}
      />
      
      {/* --- REPAIRS GLASS NAVBAR --- */}
      <Navbar activePage="repair" />

      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-[#0F0F0F] to-[#050505] py-12 lg:py-16">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>

        <div className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 pointer-events-none z-0 select-none">
          <HemetValleyLogo className="w-[16rem] h-[16rem] lg:w-[24rem] lg:h-[24rem]" watermark={true} />
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
            <button 
              onClick={() => {
                const el = document.getElementById('intake-form-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-amber-500 text-black hover:bg-white hover:text-black font-header uppercase tracking-wider font-bold py-3.5 px-7 flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer"
            >
              Book In-Shop Diagnostic <ArrowRight className="w-5 h-5" />
            </button>
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

        {/* --- REAL-TIME REPAIR TRACER SECTION --- */}
        <section className="mb-24 text-left">
          <div className="bg-[#111111] border border-zinc-800 p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
              backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`,
              backgroundSize: '16px 16px'
            }}></div>
            
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold">
                  <Activity className="w-4 h-4 animate-pulse" /> Live Status Tracking
                </div>
                <h2 className="text-3xl font-bold font-header uppercase tracking-tight text-white leading-none">
                  Repair Ticket <span className="text-amber-500">Tracer</span>
                </h2>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  Enter your 8-digit shop intake ticket code (e.g., <span className="text-amber-500 font-mono font-bold hover:underline cursor-pointer" onClick={() => { dispatch(setTracerSearchInput('HVT-8802')); handleTracerSearch(null, 'HVT-8802'); }}>HVT-8802</span> or <span className="text-amber-500 font-mono font-bold hover:underline cursor-pointer" onClick={() => { dispatch(setTracerSearchInput('HVT-4901')); handleTracerSearch(null, 'HVT-4901'); }}>HVT-4901</span>) printed on your physical receipt to retrieve real-time diagnostic bench logs and ETA statuses.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <form onSubmit={handleTracerSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input 
                      type="text"
                      aria-label="Enter 8-digit Repair Ticket ID"
                      placeholder="Enter Ticket ID (e.g. HVT-8802)"
                      value={tracerSearchInput}
                      onChange={(e) => dispatch(setTracerSearchInput(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wider font-mono uppercase rounded-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isTracing}
                    aria-label="Trace Ticket ID"
                    className="bg-amber-500 hover:bg-white text-black font-header uppercase tracking-wider font-black px-6 py-3.5 flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
                  >
                    {isTracing ? (
                      <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>Trace <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </form>

                {tracerError && (
                  <p className="text-xs text-red-500 font-mono flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> {tracerError}
                  </p>
                )}

                {/* Search History */}
                {searchHistory.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase mr-2">Recent Queries:</span>
                    {searchHistory.map((histId) => (
                      <button
                        key={histId}
                        onClick={() => { dispatch(setTracerSearchInput(histId)); handleTracerSearch(null, histId); }}
                        className={`px-3 py-1.5 border font-mono text-xs transition-all uppercase flex items-center gap-1.5 ${
                          activeTicketId === histId
                            ? 'border-amber-500 bg-amber-500/5 text-amber-500'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {histId}
                      </button>
                    ))}
                    <button 
                      onClick={() => { dispatch(clearSearchHistory()); dispatch(clearSearch()); }}
                      className="text-[10px] text-zinc-500 hover:text-red-400 font-mono uppercase ml-auto flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Clear History
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tracer Result Details Container */}
            {activeTicketId && activeTicketStatus && (
              <div className="mt-8 border-t border-zinc-850 pt-8 animate-fade-in text-left">
                <div className="bg-zinc-950 border border-zinc-850 p-6 relative">
                  <button 
                    onClick={() => dispatch(clearSearch())}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                    title="Close Diagnostic Report"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <div className="text-[10px] text-zinc-500 font-mono uppercase">Ticket ID: {activeTicketId}</div>
                      <h4 className="text-xl font-bold font-header text-white uppercase tracking-wider mt-1">{activeTicketStatus.tool}</h4>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-mono text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 uppercase">
                        {activeTicketStatus.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-500 uppercase">Bench Calibration Completion Progress</span>
                      <span className="text-amber-500 font-bold">{activeTicketStatus.progress}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-none border border-zinc-800 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full transition-all duration-1000" 
                        style={{ width: `${activeTicketStatus.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6 font-mono text-xs pt-4 border-t border-zinc-900">
                    <div>
                      <span className="text-zinc-500 uppercase block mb-1">Lead Machinist:</span>
                      <span className="text-white font-bold">{activeTicketStatus.tech}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 uppercase block mb-1">Est. Pickup Date:</span>
                      <span className="text-white font-bold">{activeTicketStatus.eta}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 uppercase block mb-1">Accumulated Cost:</span>
                      <span className="text-green-400 font-bold">{activeTicketStatus.cost}</span>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-850 p-4 font-mono text-xs text-zinc-300 leading-relaxed mt-6">
                    <span className="text-zinc-500 uppercase block mb-2 font-bold">[ BENCH TECHNICIAN DIAGNOSTICS LOG ]</span>
                    {activeTicketStatus.diagnostics}
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

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
                  onClick={() => { dispatch(setActiveGalleryTab('engine')); dispatch(setShowAfterState(true)); }}
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
                  onClick={() => { dispatch(setActiveGalleryTab('saw')); dispatch(setShowAfterState(true)); }}
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
                  onClick={() => { dispatch(setActiveGalleryTab('drill')); dispatch(setShowAfterState(true)); }}
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
                  onClick={() => dispatch(setShowAfterState(false))}
                  className={`px-4 py-2 text-xs font-mono uppercase border ${
                    !showAfterState 
                      ? 'bg-red-500/10 text-red-500 border-red-500/30 font-bold' 
                      : 'bg-zinc-950 text-zinc-500 border-zinc-855 hover:text-white'
                  }`}
                >
                  [ SHOW INTAKE "BEFORE" STATE ]
                </button>
                <button
                  onClick={() => dispatch(setShowAfterState(true))}
                  className={`px-4 py-2 text-xs font-mono uppercase border ${
                    showAfterState 
                      ? 'bg-green-500/10 text-green-400 border-green-500/30 font-bold' 
                      : 'bg-zinc-950 text-zinc-500 border-zinc-855 hover:text-white'
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
            <div className="lg:col-span-5 flex flex-col gap-3" role="tablist" aria-label="Tool Class Estimates">
              <button
                type="button"
                role="tab"
                aria-selected={selectedToolClass === 'small-gas'}
                aria-controls="panel-small-gas"
                id="tab-small-gas"
                onClick={() => dispatch(setSelectedToolClass('small-gas'))}
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
                type="button"
                role="tab"
                aria-selected={selectedToolClass === 'cut-saw'}
                aria-controls="panel-cut-saw"
                id="tab-cut-saw"
                onClick={() => dispatch(setSelectedToolClass('cut-saw'))}
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
                type="button"
                role="tab"
                aria-selected={selectedToolClass === 'power-tool'}
                aria-controls="panel-power-tool"
                id="tab-power-tool"
                onClick={() => dispatch(setSelectedToolClass('power-tool'))}
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
                type="button"
                role="tab"
                aria-selected={selectedToolClass === 'heavy-hydraulic'}
                aria-controls="panel-heavy-hydraulic"
                id="tab-heavy-hydraulic"
                onClick={() => dispatch(setSelectedToolClass('heavy-hydraulic'))}
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
            <div 
              id={`panel-${selectedToolClass}`}
              role="tabpanel"
              aria-labelledby={`tab-${selectedToolClass}`}
              className="lg:col-span-7 bg-[#141414] border border-zinc-850 p-8 flex flex-col justify-between"
            >
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
              <p className="text-sm text-zinc-400 max-w-md mx-auto mb-3">
                Your Live Ticket ID: <strong className="text-amber-500 font-mono font-bold text-lg select-all">{tracerSearchInput}</strong>
              </p>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Thank you, {intakeForm.name}. Your intake reservation is logged. Bring your <strong className="text-white">{intakeForm.toolBrand || intakeForm.brand || 'Milwaukee'} {intakeForm.toolModel || intakeForm.modelName || 'machinery'}</strong> to our Hemet storefront during workshop hours.
              </p>
              <button 
                onClick={() => { dispatch(setRepairFormSubmitted(false)); dispatch(clearRepairDraft()); }}
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
                  <label htmlFor="repair-name" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Your Name / Contact *</label>
                  <input 
                    id="repair-name"
                    type="text" 
                    required
                    value={intakeForm.name || ''}
                    onChange={(e) => dispatch(updateRepairDraft({ name: e.target.value }))}
                    placeholder="Enter full name"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="repair-phone" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">SMS Update Mobile *</label>
                  <input 
                    id="repair-phone"
                    type="tel" 
                    required
                    value={intakeForm.phone || ''}
                    onChange={(e) => dispatch(updateRepairDraft({ phone: e.target.value }))}
                    placeholder="e.g., (951) 555-0190"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Brand select */}
                <div>
                  <label htmlFor="repair-brand" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Equipment Brand</label>
                  <select 
                    id="repair-brand"
                    value={intakeForm.toolBrand || intakeForm.brand || 'Milwaukee'}
                    onChange={(e) => dispatch(updateRepairDraft({ toolBrand: e.target.value, brand: e.target.value }))}
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
                  <label htmlFor="repair-model" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Model Number / Code</label>
                  <input 
                    id="repair-model"
                    type="text" 
                    value={intakeForm.toolModel || intakeForm.modelName || ''}
                    onChange={(e) => dispatch(updateRepairDraft({ toolModel: e.target.value, modelName: e.target.value }))}
                    placeholder="e.g. GX390, TS420, or MX-FUEL"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

              </div>

              {/* Symptom categories */}
              <div role="radiogroup" aria-label="Primary Mechanical Symptom">
                <span className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Primary Mechanical Symptom</span>
                <div className="grid sm:grid-cols-3 gap-3">
                  {['Engine fails to spark/run', 'Slipping belt / lost torque', 'Frayed cord / electrical short'].map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      role="radio"
                      aria-checked={(intakeForm.symptom || 'Engine fails to spark/run') === sym}
                      onClick={() => dispatch(updateRepairDraft({ symptom: sym }))}
                      className={`py-3 px-4 text-xs uppercase tracking-wider font-header font-bold transition-all border text-center ${
                        (intakeForm.symptom || 'Engine fails to spark/run') === sym 
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
                <label htmlFor="repair-notes" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Detailed Symptom Description *</label>
                <textarea 
                  id="repair-notes"
                  required
                  rows="4"
                  value={intakeForm.notes || intakeForm.issueDescription || ''}
                  onChange={(e) => dispatch(updateRepairDraft({ notes: e.target.value, issueDescription: e.target.value }))}
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
      <Footer />

    </div>
  );
};

export default RepairPage;
