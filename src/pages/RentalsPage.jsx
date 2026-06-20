import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../Providers/ThemeContext';
import { stageRental } from '../redux/slices/cartSlice';
import { 
  setRentalsSearchTerm,
  setRentalsSelectedCategory,
  setRentalsSelectedBrand,
  setRentalsSortBy,
  setRentalsSelectedTool,
  setRentalsShowFilters,
  setRentalsOpenFaq,
  setRentals,
  clearRentalsFilters
} from '../redux/slices/rentalsSlice';
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

import Navbar from '../ui/components/Navbar';
import Footer from '../ui/components/Footer';
import HemetValleyLogo from '../ui/components/HemetValleyLogo';
import { useFilteredCatalog } from '../utils/useFilteredCatalog';
import { getRentals } from '../utils/firebaseHelpers';
import SEO from '../ui/components/SEO';

const RentalsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- REDUX STATE FOR FILTERS AND SELECTION ---
  const { 
    catalog: tools, 
    searchTerm, 
    selectedCategory, 
    selectedBrand, 
    sortBy, 
    selectedTool,
    showFilters,
    openFaq
  } = useSelector((state) => state.rentals);

  // --- FETCH RENTALS FROM FIRESTORE ON MOUNT ---
  useEffect(() => {
    const fetchLiveRentals = async () => {
      try {
        const liveRentals = await getRentals();
        dispatch(setRentals(liveRentals));
      } catch (err) {
        console.error("Failed to load rentals from Firestore:", err);
      }
    };
    fetchLiveRentals();
  }, [dispatch]);

  const toggleFaq = (index) => {
    dispatch(setRentalsOpenFaq(openFaq === index ? null : index));
  };

  // --- DYNAMIC CATALOG DATA ---
  const categories = ['All', ...new Set(tools.map(t => t.category).filter(Boolean))];
  const brands = ['All', ...new Set(tools.map(t => t.brand).filter(Boolean))];


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
  const filteredTools = useFilteredCatalog(tools, { searchTerm, selectedCategory, selectedBrand, sortBy });

  const handleBookNow = (tool) => {
    dispatch(setRentalsSelectedTool(null));
    dispatch(stageRental({
      product: {
        id: tool.id,
        name: tool.name,
        price: tool.price,
        category: tool.category,
        brand: tool.brand,
        description: tool.description
      },
      rentalDays: 1,
      rentDate: new Date().toISOString().split('T')[0]
    }));
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

  const rentalsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Hemet Valley Tools Equipment Rentals",
    "description": "Professional-grade construction and landscaping equipment fleet rentals with flexible 4-hour, daily, and weekly options.",
    "url": "https://hemetvalleytools.com/rentals",
    "about": [
      {
        "@type": "HardwareStore",
        "name": "Hemet Valley Tools"
      }
    ]
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      <SEO 
        title="Equipment Rentals Catalog | Jackhammers, Washers & Cutters | Hemet Valley Tools"
        description="Rent professional-grade commercial equipment and landscaping machinery. Competitive daily, weekly, and 4-hour rates with secure local reservation in Hemet, CA."
        keywords="heavy equipment rental Hemet, tool rental, landscaping equipment, demolition hammer, pressure washer rental, brushcutter, concrete saw rental"
        schema={rentalsSchema}
      />
      
      {/* --- RENTALS PRESET GLASS NAVBAR --- */}
      <Navbar activePage="rentals" />

      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-[#0F0F0F] to-[#050505] py-20 lg:py-28">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>

        <div className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 pointer-events-none z-0 select-none">
          <HemetValleyLogo className="w-[18rem] h-[18rem] lg:w-[28rem] lg:h-[28rem]" watermark={true} />
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
                id="rentals-search"
                aria-label="Search tools, gear, and supplies"
                placeholder="Search tools, gear, and supplies..."
                value={searchTerm}
                onChange={(e) => dispatch(setRentalsSearchTerm(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
              />
              {searchTerm && (
                <button onClick={() => dispatch(setRentalsSearchTerm(''))} aria-label="Clear search query" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle & Quick Sorting */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => dispatch(setRentalsShowFilters(!showFilters))}
                className="md:hidden flex items-center gap-2 border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-header uppercase tracking-wider text-zinc-300"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-500" /> Filters
              </button>

              <select 
                id="rentals-sort"
                aria-label="Sort rentals"
                value={sortBy} 
                onChange={(e) => dispatch(setRentalsSortBy(e.target.value))}
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
              <span id="rentals-category-title" className="block text-xs font-mono tracking-widest text-zinc-500 uppercase mb-3">Filter by Category</span>
              <div role="tablist" aria-labelledby="rentals-category-title" className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={selectedCategory === cat}
                    onClick={() => dispatch(setRentalsSelectedCategory(cat))}
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
              <span id="rentals-brand-title" className="block text-xs font-mono tracking-widest text-zinc-500 uppercase mb-3">Filter by Manufacturer</span>
              <div role="tablist" aria-labelledby="rentals-brand-title" className="flex flex-wrap gap-2">
                {brands.map((b) => (
                  <button
                    key={b}
                    role="tab"
                    aria-selected={selectedBrand === b}
                    onClick={() => dispatch(setRentalsSelectedBrand(b))}
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
                onClick={() => dispatch(clearRentalsFilters())}
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
                        onClick={() => dispatch(setRentalsSelectedTool(tool))}
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

      <Footer />

      {/* --- SPEC DETAILS POPUP MODAL --- */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="rental-modal-title"
            className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl relative p-6 sm:p-8 rounded-none text-left shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={() => dispatch(setRentalsSelectedTool(null))}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1"
              aria-label="Close specs modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                {selectedTool.brand} / {selectedTool.category}
              </span>
              <h2 id="rental-modal-title" className="text-2xl sm:text-3xl font-bold font-header uppercase text-white mt-1">
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
                  onClick={() => dispatch(setRentalsSelectedTool(null))}
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
