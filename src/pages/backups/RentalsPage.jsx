import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  ChevronUp,
  MapPin, 
  Map, 
  Info,
  Layers,
  Flame,
  Award,
  Sun,
  Moon,
  Search,
  SlidersHorizontal,
  X,
  FileText,
  AlertTriangle
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

const RentalsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // --- STATE FOR FILTERS AND SELECTION ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('featured'); // featured, price-low, price-high
  const [selectedTool, setSelectedTool] = useState(null); // For detail modal
  const [showFilters, setShowFilters] = useState(false);

  // --- FAQS ACCORDION STATE ---
  const [openFaq, setOpenFAQ] = useState(null);

  const toggleFaq = (index) => {
    setOpenFAQ(openFaq === index ? null : index);
  };

  // --- STATIC CATALOG DATA ---
  const categories = ['All', 'Heavy Duty', 'Power Tools', 'Landscaping', 'Blades & Bits'];
  const brands = ['All', 'Milwaukee', 'Makita', 'Honda', 'Stihl', 'Husqvarna', 'Bosch'];

  const tools = [
    {
      id: 't1',
      name: 'Milwaukee MX FUEL Demolition Jackhammer',
      category: 'Heavy Duty',
      brand: 'Milwaukee',
      price: 85,
      durationRates: { '4-hour': 55, 'Daily': 85, 'Weekly': 340 },
      specs: {
        'Power Source': 'MX FUEL Lithium Battery',
        'Impact Energy': '50 Ft-lbs Blow Energy',
        'Weight': '63.9 lbs',
        'Vibration Level': 'Low-Vibration Tech'
      },
      inStock: 3,
      description: 'The industry’s premier cordless heavy-duty demolition hammer. Full concrete breaking power, zero local emissions, and significantly reduced vibration for safer operation.',
      includes: ['MX FUEL Smart Charger', '2x REDLITHIUM XC406 Batteries', '1x 1-1/8" Hex Point Chisel', '1x Flat Spade Chisel', 'Heavy-Duty Rolling Case']
    },
    {
      id: 't2',
      name: 'Makita Rotary Hammer Drill (SDS-Max)',
      category: 'Power Tools',
      brand: 'Makita',
      price: 45,
      durationRates: { '4-hour': 30, 'Daily': 45, 'Weekly': 180 },
      specs: {
        'Power Source': '15-Amp Corded',
        'Max Hole Diameter': '2" Concrete Core',
        'Impact Energy': '14 Ft-lbs Blow Energy',
        'Weight': '26.2 lbs'
      },
      inStock: 5,
      description: 'Heavy-duty concrete drilling and chiseling rig. Ideal for through-hole framing, anchoring, and medium demolition work on solid concrete foundations.',
      includes: ['Auxiliary D-Handle', 'Depth Gauge', 'SDS-Max Point Chisel', 'Rugged Carrying Case']
    },
    {
      id: 't3',
      name: 'Honda Commercial Power Washer (4000 PSI)',
      category: 'Heavy Duty',
      brand: 'Honda',
      price: 75,
      durationRates: { '4-hour': 50, 'Daily': 75, 'Weekly': 300 },
      specs: {
        'Engine': 'Honda GX390 OHV Commercial',
        'Output Pressure': '4000 PSI at 4.0 GPM',
        'Hose Length': '50 Ft Steel-Braided',
        'Fuel': 'Unleaded Gasoline'
      },
      inStock: 4,
      description: 'Pro-grade high pressure washer engineered to tackle concrete washdowns, surface preparation, paint stripping, and heavy equipment degreasing.',
      includes: ['Pro Trigger Gun & Wand', '5x Quick-Connect Spray Nozzles', 'Chemical Injector Tube']
    },
    {
      id: 't4',
      name: 'Stihl Landscaping Brushcutter & Weed Trimmer',
      category: 'Landscaping',
      brand: 'Stihl',
      price: 60,
      durationRates: { '4-hour': 40, 'Daily': 60, 'Weekly': 240 },
      specs: {
        'Engine': '2-Stroke Professional Gas',
        'Cutting Path': '16.5" Diameter',
        'Weight': '15.2 lbs',
        'Harness': 'Double Shoulder Comfort'
      },
      inStock: 6,
      description: 'The ultimate brushclearing power tool. Tackles thick tall grass, dense weeds, wild overgrowth, and woody saplings with a robust steel blade conversion.',
      includes: ['AutoCut String Head', 'Heavy Brush Three-Tooth Steel Blade', 'Safety Goggles', 'Fuel Mixing Bottle']
    },
    {
      id: 't5',
      name: 'Husqvarna Walk-Behind Concrete Saw (14")',
      category: 'Heavy Duty',
      brand: 'Husqvarna',
      price: 120,
      durationRates: { '4-hour': 80, 'Daily': 120, 'Weekly': 480 },
      specs: {
        'Engine': 'Honda GX270 9.0 HP Gas',
        'Blade Capacity': '14" Blade Diameter',
        'Max Cutting Depth': '4.6 Inches',
        'Weight': '119 lbs'
      },
      inStock: 2,
      description: 'Sturdy, highly efficient compact walk-behind flat saw. Perfect for asphalt/concrete expansion joints, pavement repairs, and channel cuts for electrical/conduit lines.',
      includes: ['Dual-Sided Wet Cutting Water Hookup', 'Integrated Guide Arm', 'Wrench Set']
    },
    {
      id: 't6',
      name: 'Bosch Self-Leveling Rotary Laser System',
      category: 'Power Tools',
      brand: 'Bosch',
      price: 55,
      durationRates: { '4-hour': 35, 'Daily': 55, 'Weekly': 220 },
      specs: {
        'Accuracy': '±3/32" at 100 Ft',
        'Range': '2000 Ft with Receiver',
        'Self-Leveling': 'Automatic ±5° Horizontal/Vertical',
        'IP Rating': 'IP65 Weatherproof'
      },
      inStock: 3,
      description: 'Comprehensive exterior/interior grade setting kit. Delivers instant, precise horizontal level reference for foundations, grading, structural layouts, and framing.',
      includes: ['Laser Receiver & Grade Rod Clamp', '8-Ft Aluminum Grade Rod', 'Heavy-Duty Tripod', 'Locking Carrying Case']
    },
    {
      id: 't7',
      name: 'Premium 14" Diamond Core Drill Rig',
      category: 'Blades & Bits',
      brand: 'Bosch',
      price: 95,
      durationRates: { '4-hour': 65, 'Daily': 95, 'Weekly': 380 },
      specs: {
        'Motor': '15-Amp 3-Speed Heavy Motor',
        'Core Capacity': 'Up to 14" Concrete Holes',
        'Column': 'Angled Level Column Rig',
        'Base': 'Vacuum / Bolted Base System'
      },
      inStock: 2,
      description: 'Professional grade core drill rig for boring clean, cylindrical penetrations through reinforced concrete wall structures, floor slabs, and masonry blocks.',
      includes: ['Rig Stand with Wheels', 'Water Flow Control valve', 'Anchor Bolt Bolt Kit', 'Vacuum Pump Attachment']
    },
    {
      id: 't8',
      name: 'Premium 14" Diamond Asphalt Saw Blade',
      category: 'Blades & Bits',
      brand: 'Husqvarna',
      price: 35,
      durationRates: { '4-hour': 20, 'Daily': 35, 'Weekly': 140 },
      specs: {
        'Core Style': 'Laser-Welded Segmented',
        'Max RPM': '5,400 RPM',
        'Abrasive': 'High-Concentration Diamond Matrix',
        'Arbor Size': '1" with Drive Pin'
      },
      inStock: 8,
      description: 'Heavy duty replacement blade specifically designed to slice through highly abrasive green concrete, cured concrete, asphalt, and stone paving block.',
      includes: ['Adapting Bushing Ring 20mm']
    }
  ];

  // --- FAQs CONTENT ---
  const faqs = [
    {
      q: "What credentials do I need to rent equipment?",
      a: "To rent professional-grade tools, you must provide a valid government-issued photo ID (driver’s license), a credit card in your name for a security hold deposit, and sign our standard rental agreement. For certain heavy trailers or gas-powered walk-behind machinery, some knowledge of heavy operations is requested."
    },
    {
      q: "How does the rental security deposit work?",
      a: "A temporary authorization hold (typically ranging from $100 to $250 depending on the replacement value of the tool) will be placed on your credit card. Upon returning the tool on time, in clean condition, and refueled, the hold is fully released. We do not accept cash/debit cards for deposits."
    },
    {
      q: "Are the tools refueled before rental?",
      a: "Yes! All gas-powered rental tools (including Honda pressure washers and Husqvarna flat saws) are fully fueled when they leave our Hemet shop. They must be returned with a full tank of unleaded/mixed fuel, otherwise, a localized refueling surcharge will apply."
    },
    {
      q: "What if a rental tool breaks or malfunctions mid-job?",
      a: "We perform a thorough multi-point safety and operational inspection before handing over any item. If you experience an mechanical issue on-site, immediately turn off the equipment, stop operations, and call us at (951) 555-0190. If we cannot resolve it over the phone, bring it back and we will immediately swap it with a fresh unit."
    },
    {
      q: "Do you offer job-site delivery for heavy gear?",
      a: "Absolutely. For heavy walk-behind machines or large orders, we offer dedicated priority job-site delivery across Hemet, San Jacinto, Winchester, and surrounding valley areas. Rates are highly competitive and scale based on transport distance."
    }
  ];

  // --- LIVE FILTERED LOGIC ---
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All' || tool.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0; // featured/default
  });

  const handleBookNow = (tool) => {
    setSelectedTool(null);
    // Link directly back to HomePage's scheduler section, pre-selecting the tool category and name!
    navigate('/', { 
      state: { 
        preselectedCategory: tool.category === 'Blades & Bits' ? 'Supply' : 'Rentals', 
        preselectedToolId: tool.id 
      } 
    });
    // Scroll to the scheduler section smoothly after transition
    setTimeout(() => {
      const el = document.getElementById('scheduler');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      
      {/* --- RENTALS PRESET GLASS NAVBAR --- */}
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
              <Link to="/rentals" className="text-amber-500 transition-colors">Rentals</Link>
              <Link to="/repair" className="text-zinc-400 hover:text-white transition-colors">Repairs</Link>
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
      <header className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-[#0F0F0F] to-[#050505] py-20 lg:py-28">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>

        <div className="absolute right-[-10%] bottom-0 pointer-events-none z-0 select-none opacity-10">
          <img src={hemetValleyLogoImg} alt="" className="w-[32rem] h-[32rem] lg:w-[48rem] lg:h-[48rem] rounded-full object-cover" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold mb-6">
            <Sliders className="w-4 h-4" /> Heavy-Duty Fleet Catalog
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-header uppercase leading-none tracking-tight text-white mb-4">
            Pro Power, Pro Tools<br />
            <span className="text-amber-500">Ready To Rent</span>
          </h1>
          
          <p className="text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
            Choose from Hemet's finest collection of certified, heavy-duty contractors gear and landscaping equipment. Flexible daily, weekly, or 4-hour commercial terms to match your workflow.
          </p>
        </div>
      </header>

      {/* --- MAIN CATALOG LAYER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* FILTER CONTROL HUB */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 mb-12 relative overflow-hidden rounded-none">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search tools, gear, and supplies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle & Quick Sorting */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-header uppercase tracking-wider text-zinc-300"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-500" /> Filters
              </button>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500 font-header uppercase tracking-wider rounded-none cursor-pointer"
              >
                <option value="featured">Featured Gear</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* DESKTOP FILTERS (And Mobile Expanded) */}
          <div className={`mt-6 pt-6 border-t border-zinc-800 grid md:grid-cols-2 gap-6 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Category selection */}
            <div>
              <label className="block text-xs font-mono tracking-widest text-zinc-500 uppercase mb-3">Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider font-header font-bold transition-all border ${
                      selectedCategory === cat 
                        ? 'bg-amber-500 text-black border-amber-500' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand selection */}
            <div>
              <label className="block text-xs font-mono tracking-widest text-zinc-500 uppercase mb-3">Filter by Manufacturer</label>
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider font-header font-bold transition-all border ${
                      selectedBrand === b 
                        ? 'bg-amber-500 text-black border-amber-500' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TOOL GRID */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              Showing {filteredTools.length} results
            </span>
            {(selectedCategory !== 'All' || selectedBrand !== 'All' || searchTerm) && (
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedBrand('All');
                  setSearchTerm('');
                }}
                className="text-xs text-amber-500 hover:underline flex items-center gap-1 uppercase font-mono tracking-wider"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {filteredTools.length === 0 ? (
            <div className="border border-zinc-850 bg-zinc-900/50 p-16 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-header uppercase tracking-wider text-white mb-2">No Matching Equipment Found</h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                We couldn't find any rentals matching your criteria. Try adjusting your category/brand filters or clearing your search term.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <div 
                  key={tool.id} 
                  className="bg-zinc-900 border border-zinc-800 group hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Card Header Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                        {tool.brand} / {tool.category}
                      </span>
                      {tool.inStock > 0 ? (
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-mono uppercase font-bold border border-green-500/20">
                          {tool.inStock} In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[9px] font-mono uppercase font-bold border border-red-500/20">
                          Reserved
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-header font-bold uppercase text-white group-hover:text-amber-500 transition-colors mb-3 line-clamp-2">
                      {tool.name}
                    </h3>

                    <p className="text-sm text-zinc-400 font-light mb-6 line-clamp-3">
                      {tool.description}
                    </p>

                    {/* Specs Teaser */}
                    <div className="space-y-2 border-t border-zinc-850 pt-4">
                      {Object.entries(tool.specs).slice(0, 2).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-zinc-500 uppercase">{key}</span>
                          <span className="text-zinc-300 font-medium truncate max-w-[150px]">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Footer Actions */}
                  <div className="border-t border-zinc-850 p-6 bg-zinc-950/40">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-xs font-mono uppercase text-zinc-500">Day Rate:</span>
                      <div className="text-right">
                        <span className="text-2xl font-black font-header text-amber-500">${tool.price}</span>
                        <span className="text-xs text-zinc-500">/day</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setSelectedTool(tool)}
                        className="py-2 px-3 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-header text-xs uppercase tracking-wider font-semibold transition-all"
                      >
                        Quick Specs
                      </button>
                      <button 
                        onClick={() => handleBookNow(tool)}
                        className="py-2 px-3 bg-amber-500 text-black hover:bg-white font-header text-xs uppercase tracking-widest font-bold transition-all"
                      >
                        Rent Gear
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- HOW IT WORKS & FAQs --- */}
        <section className="grid lg:grid-cols-12 gap-12 border-t border-zinc-850 pt-20">
          
          {/* Left instructions block */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold">
              <Clock className="w-4 h-4 animate-pulse" /> Hemet Yard Protocol
            </div>
            
            <h2 className="text-3xl font-bold font-header uppercase tracking-tight text-white leading-none">
              How Our Rental<br />
              <span className="text-amber-500">Process Works</span>
            </h2>
            
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              We focus on keeping contractors moving. No dry corporate bureaucracy, just pro gear ready to build the Inland Empire.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-none border border-amber-500/40 text-amber-500 font-header font-black flex items-center justify-center text-sm shrink-0 bg-amber-500/5">1</div>
                <div>
                  <h4 className="text-sm font-header uppercase tracking-wider text-white">Reserve Online or Call</h4>
                  <p className="text-xs text-zinc-500 mt-1">Select your machine and target schedule. Instant validation online or call us directly.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-none border border-amber-500/40 text-amber-500 font-header font-black flex items-center justify-center text-sm shrink-0 bg-amber-500/5">2</div>
                <div>
                  <h4 className="text-sm font-header uppercase tracking-wider text-white">Pick Up &amp; Demo</h4>
                  <p className="text-xs text-zinc-500 mt-1">Visit our storefront. Our counter specialists walk through a safety check &amp; start demo.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-none border border-amber-500/40 text-amber-500 font-header font-black flex items-center justify-center text-sm shrink-0 bg-amber-500/5">3</div>
                <div>
                  <h4 className="text-sm font-header uppercase tracking-wider text-white">Get Back to Work</h4>
                  <p className="text-xs text-zinc-500 mt-1">Execute your project. Return fueled and clean. Security hold immediately released.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side Accordion FAQs */}
          <div className="lg:col-span-8 text-left space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 block">Rental Policies FAQ</h3>
            
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-zinc-900 border border-zinc-800 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none cursor-pointer"
                >
                  <span className="font-header uppercase tracking-wider text-sm sm:text-base font-bold text-white hover:text-amber-500 transition-colors pr-4">
                    {faq.q}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-amber-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0" />
                  )}
                </button>
                
                <div 
                  className={`px-6 pb-6 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed border-t border-zinc-850 pt-4 transition-all duration-300 ${
                    openFaq === idx ? 'block' : 'hidden'
                  }`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>

        </section>

      </main>

      {/* --- CTA SECTION --- */}
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
              <h4 className="text-white font-header uppercase tracking-widest text-xs font-bold mb-4">Catalog Categories</h4>
              <ul className="space-y-2 text-xs font-mono uppercase">
                <li><button onClick={() => { setSelectedCategory('Heavy Duty'); window.scrollTo({top: 400, behavior:'smooth'}); }} className="hover:text-amber-500 transition-colors">Heavy Machinery</button></li>
                <li><button onClick={() => { setSelectedCategory('Power Tools'); window.scrollTo({top: 400, behavior:'smooth'}); }} className="hover:text-amber-500 transition-colors">Power Tools</button></li>
                <li><button onClick={() => { setSelectedCategory('Landscaping'); window.scrollTo({top: 400, behavior:'smooth'}); }} className="hover:text-amber-500 transition-colors">Landscaping Equipment</button></li>
                <li><button onClick={() => { setSelectedCategory('Blades & Bits'); window.scrollTo({top: 400, behavior:'smooth'}); }} className="hover:text-amber-500 transition-colors">Consumables &amp; Core Bits</button></li>
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
              <a href="#" className="hover:text-zinc-400 transition-colors">TERMS OF RENTAL</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">PRIVACY POLICY</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">OSHA SAFETY</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- SPEC DETAILS POPUP MODAL --- */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl relative p-6 sm:p-8 rounded-none text-left shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedTool(null)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                {selectedTool.brand} / {selectedTool.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-header uppercase text-white mt-1">
                {selectedTool.name}
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              {selectedTool.description}
            </p>

            {/* Two column spec and scope list */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {/* Technical Specifications */}
              <div className="bg-zinc-950 border border-zinc-850 p-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-3 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> Technical Specs
                </h4>
                <div className="space-y-2 text-xs">
                  {Object.entries(selectedTool.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-zinc-900 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-zinc-500 uppercase">{key}</span>
                      <span className="text-zinc-300 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-zinc-950 border border-zinc-850 p-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Package Includes
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  {selectedTool.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rates & Actions */}
            <div className="border-t border-zinc-850 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex gap-6">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">4-Hour rate</div>
                  <div className="text-lg font-bold font-header text-zinc-200">${selectedTool.durationRates['4-hour'] || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Daily rate</div>
                  <div className="text-xl font-black font-header text-amber-500">${selectedTool.price}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Weekly rate</div>
                  <div className="text-lg font-bold font-header text-zinc-200">${selectedTool.durationRates['Weekly'] || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedTool(null)}
                  className="py-3 px-5 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-header text-xs uppercase tracking-wider font-bold"
                >
                  Close specs
                </button>
                <button 
                  onClick={() => handleBookNow(selectedTool)}
                  className="py-3 px-6 bg-amber-500 text-black hover:bg-white font-header text-xs uppercase tracking-widest font-black transition-all flex items-center gap-2"
                >
                  Reserve Equipment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RentalsPage;
