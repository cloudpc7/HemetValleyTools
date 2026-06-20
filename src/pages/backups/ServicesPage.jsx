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
  Briefcase,
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

const ServicesPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // --- QUOTE FORM STATE ---
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    company: '',
    phone: '',
    trade: 'General Contractor', // Default
    serviceNeeded: 'Equipment Rental', // Default
    notes: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.phone || !quoteForm.notes) {
      alert('Please fill out all required fields.');
      return;
    }
    setFormSubmitted(true);
  };

  const handlePillarRedirect = (category, step = 1) => {
    // Redirects to homepage pre-selecting the category and step
    navigate('/', { 
      state: { 
        preselectedCategory: category 
      } 
    });
    setTimeout(() => {
      const el = document.getElementById('scheduler');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      
      {/* --- SERVICES GLASS NAVBAR --- */}
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
              <Link to="/services" className="text-amber-500 transition-colors">Services</Link>
              <Link to="/rentals" className="text-zinc-400 hover:text-white transition-colors">Rentals</Link>
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
            <Wrench className="w-4 h-4" /> Professional Solutions Suite
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-header uppercase leading-none tracking-tight text-white mb-4">
            Expert Support For<br />
            Every <span className="text-amber-500">Stage Of The Job</span>
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
            From renting the heavy hitters to fixing your favorite saw, Hemet Valley Tool &amp; Supply keeps your crew, your timeline, and your project running at absolute capacity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <a 
              href="#quote-form-section" 
              className="bg-amber-500 text-black hover:bg-white hover:text-black font-header uppercase tracking-wider font-bold py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300"
            >
              Ask A Specialist <ArrowRight className="w-5 h-5" />
            </a>
            <Link 
              to="/rentals" 
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-header uppercase tracking-wider font-bold py-4 px-8 flex items-center justify-center gap-2 transition-all duration-300"
            >
              Browse Rental Fleet
            </Link>
          </div>
        </div>
      </header>

      {/* --- SERVICES MAIN CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* --- THREE PILLARS CARD GRID --- */}
        <section className="mb-24">
          <div className="text-center md:text-left mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Hemet Core Pillars</span>
            <h2 className="text-3xl font-black font-header uppercase text-white mt-1">Our Three Core Divisions</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Rentals */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between group hover:border-zinc-700 transition-all duration-300 relative">
              <div>
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-500">
                  <Hammer className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-header uppercase tracking-wider text-white mb-4 group-hover:text-amber-500 transition-colors">Equipment Rentals</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  Daily, weekly, or monthly rentals of pro-grade machinery. We supply concrete saws, demolition hammers, pressure washers, and commercial landscaping gear. 
                </p>
                <div className="border-t border-zinc-850 pt-4 mb-8">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Serviced &amp; Inspected Daily
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Flexible 4-Hour Rates Available
                  </div>
                </div>
              </div>
              <Link 
                to="/rentals"
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-black hover:bg-amber-500 py-3 text-xs uppercase tracking-widest font-bold transition-all text-center block"
              >
                View Rental Catalog
              </Link>
            </div>

            {/* Card 2: Repairs */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between group hover:border-zinc-700 transition-all duration-300 relative">
              <div>
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-500">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-header uppercase tracking-wider text-white mb-4 group-hover:text-amber-500 transition-colors">Certified Repair Shop</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  In-house mechanical diagnostics and maintenance for commercial power tools and small engines. Authorized warranty repairs and general tuning to maximize fleet lifespan.
                </p>
                <div className="border-t border-zinc-850 pt-4 mb-8">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Over 41 Years of Experience
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> 48-Hour Rapid Diagnostic Promise
                  </div>
                </div>
              </div>
              <Link 
                to="/repair"
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-black hover:bg-amber-500 py-3 text-xs uppercase tracking-widest font-bold transition-all text-center block"
              >
                Book Workshop Repair
              </Link>
            </div>

            {/* Card 3: Supply */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between group hover:border-zinc-700 transition-all duration-300 relative">
              <div>
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-500">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-header uppercase tracking-wider text-white mb-4 group-hover:text-amber-500 transition-colors">Tool Sales &amp; Supply</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  Expert-led sales of heavy blades, diamond core bits, safety harnesses, and professional riggings. We don’t just sell boxes; we match the precise accessory to your job.
                </p>
                <div className="border-t border-zinc-850 pt-4 mb-8">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Bulk Contractor Supply Discounts
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> custom Substrate Sourcing
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handlePillarRedirect('Supply')}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-black hover:bg-amber-500 py-3 text-xs uppercase tracking-widest font-bold transition-all text-center"
              >
                Order Custom Supplies
              </button>
            </div>
          </div>
        </section>

        {/* --- SPECIALIZED / "HIDDEN" SERVICES GRID --- */}
        <section className="py-20 border-t border-zinc-850 mb-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left intro text */}
            <div className="lg:col-span-4 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold">
                <Flame className="w-4 h-4 animate-pulse" /> Extreme Substrate Expertise
              </div>
              <h2 className="text-3xl font-bold font-header uppercase tracking-tight text-white leading-none">
                Specialized Solutions<br />
                <span className="text-amber-500">For Heavy Operations</span>
              </h2>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Hemet Valley Tools provides high-level support operations that retail box shops can't replicate. Our specialized solutions are engineered to keep crew members secure and cut-times minimal.
              </p>
            </div>

            {/* Right side services grid */}
            <div className="lg:col-span-8 grid sm:grid-cols-3 gap-6 text-left">
              {/* Specialized 1: Blade Sharpening */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 relative group hover:border-zinc-750 transition-all">
                <div className="text-amber-500 font-black font-header text-3xl mb-4 tracking-tight">01</div>
                <h4 className="text-base font-header uppercase tracking-wider text-white mb-2">Blade Sharpening</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Fast-turnaround blade profiling. We sharpen diamond segments, carbide tips, and steel-tooth blades to restore factory-sharp masonry cuts.
                </p>
              </div>

              {/* Specialized 2: Tech Consultations */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 relative group hover:border-zinc-750 transition-all">
                <div className="text-amber-500 font-black font-header text-3xl mb-4 tracking-tight">02</div>
                <h4 className="text-base font-header uppercase tracking-wider text-white mb-2">Substrate Matching</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Boring through reinforced rebar or green concrete? We review target substrate PSI ratings and match exact core bit compositions.
                </p>
              </div>

              {/* Specialized 3: Safety Briefings */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 relative group hover:border-zinc-750 transition-all">
                <div className="text-amber-500 font-black font-header text-3xl mb-4 tracking-tight">03</div>
                <h4 className="text-base font-header uppercase tracking-wider text-white mb-2">Safety Briefings</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Mandatory operational walk-throughs. Our staff demos complex equipment setups and safety protocols to secure your site before transport.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- TRANSPARENT PROCESS / POLICY GRID --- */}
        <section className="bg-zinc-900 border border-zinc-800 p-8 sm:p-12 mb-24 relative overflow-hidden text-left rounded-none">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}></div>

          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Corporate Standards</span>
            <h3 className="text-2xl sm:text-3xl font-black font-header uppercase text-white mt-1">Our Transparent Operational Guarantee</h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-500">
                <DollarSign className="w-5 h-5 shrink-0" />
                <h4 className="text-base font-header uppercase tracking-wider font-bold">Rates Matrix</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                No hidden operational fees. We structure rentals in clear 4-hour, daily, and weekly brackets. Heavy equipment transport pricing is flat, scaled solely on distance.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-500">
                <Activity className="w-5 h-5 shrink-0" />
                <h4 className="text-base font-header uppercase tracking-wider font-bold">Workshop Diagnosis</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                We collect a flat $45 upfront diagnostic fee. Our repair techs provide detailed cost-estimates before carrying out any labor, which is credited toward repairs.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-500">
                <Briefcase className="w-5 h-5 shrink-0" />
                <h4 className="text-base font-header uppercase tracking-wider font-bold">Contractor Commercial Accounts</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                High-volume Inland Empire building crews can open specialized B2B trade accounts, unlocking tiered volume margins, flexible invoicing, and priority equipment sourcing.
              </p>
            </div>
          </div>
        </section>

        {/* --- TRADE ACCOUNT / ASK A SPECIALIST FORM --- */}
        <section id="quote-form-section" className="border border-zinc-850 p-6 sm:p-10 bg-zinc-950/20 max-w-4xl mx-auto rounded-none text-left">
          
          <div className="text-center sm:text-left mb-8 border-b border-zinc-900 pb-6">
            <h3 className="text-2xl sm:text-3xl font-bold font-header uppercase text-white">Ask A Tool Specialist</h3>
            <p className="text-sm text-zinc-500 font-light mt-1">
              Have technical questions or need custom segment sourcing? Submit details below and a specialist will follow up in 2 hours.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-zinc-900/50 border border-green-500/20 p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-header uppercase tracking-wider text-white mb-2">Request Transmitted Successfully</h4>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                Thank you, {quoteForm.name}. Your specifications are in. A Hemet Valley Tool specialist will call you shortly at {quoteForm.phone} to finalize details.
              </p>
              <button 
                onClick={() => { setFormSubmitted(false); setQuoteForm({ name:'', company:'', phone:'', trade:'General Contractor', serviceNeeded:'Equipment Rental', notes:'' }); }}
                className="mt-6 px-5 py-2 border border-zinc-855 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-mono uppercase"
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Name */}
                <div>
                  <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Your Name *</label>
                  <input 
                    type="text" 
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Company name */}
                <div>
                  <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Company / Organization</label>
                  <input 
                    type="text" 
                    value={quoteForm.company}
                    onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                    placeholder="Optional (e.g., Sonora Framing)"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    placeholder="e.g., (951) 555-0190"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Trade Select */}
                <div>
                  <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Trade / Specialty</label>
                  <select 
                    value={quoteForm.trade}
                    onChange={(e) => setQuoteForm({ ...quoteForm, trade: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500 font-sans rounded-none"
                  >
                    <option value="General Contractor">General Contractor</option>
                    <option value="Concrete / Masonry">Concrete &amp; Masonry</option>
                    <option value="Framing / Framing">Framing &amp; Carpentry</option>
                    <option value="Landscaping / Grading">Landscaping &amp; Grading</option>
                    <option value="Plumbing / HVAC">Plumbing &amp; HVAC</option>
                    <option value="DIY Specialist">DIY / Residential Owner</option>
                  </select>
                </div>

              </div>

              {/* Service Category */}
              <div>
                <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Service Segment Needed</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {['Equipment Rental', 'Tool / Small Engine Repair', 'Custom Blade & Core Sales'].map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => setQuoteForm({ ...quoteForm, serviceNeeded: service })}
                      className={`py-3 px-4 text-xs uppercase tracking-wider font-header font-bold transition-all border text-center ${
                        quoteForm.serviceNeeded === service 
                          ? 'bg-amber-500 text-black border-amber-500' 
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirements notes */}
              <div>
                <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Job Specifications &amp; Requirements *</label>
                <textarea 
                  required
                  rows="4"
                  value={quoteForm.notes}
                  onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                  placeholder="Detail what tool model or substrate challenges you are working with (e.g., need 4000 PSI pressure washer for driveway strip, or Milwaukee saw keeps losing power during substrate core)..."
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit"
                className="w-full bg-amber-500 text-black hover:bg-white font-header uppercase tracking-wider font-black py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300"
              >
                Transmit Technical Specifications <ArrowRight className="w-5 h-5" />
              </button>

            </form>
          )}

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
                <li><button onClick={() => handlePillarRedirect('Supply')} className="hover:text-amber-500 transition-colors">Custom sales &amp; supplies</button></li>
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

export default ServicesPage;
