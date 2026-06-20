import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import HemetValleyLogo from './HemetValleyLogo.jsx';

const Footer = () => {
  return (
    <footer className="border-t border-zinc-900 bg-gradient-to-r from-[#0F0F0F] via-zinc-950 to-[#0F0F0F] py-16 text-zinc-500 font-light text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-12">
          
          {/* Column 1: Core details */}
          <div className="space-y-4 md:col-span-2 text-left">
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
              <li><Link to="/products" className="hover:text-amber-500 transition-colors">Power Tools &amp; Supply</Link></li>
              <li><Link to="/repair" className="hover:text-amber-500 transition-colors">Certified Repairs</Link></li>
              <li><Link to="/services" className="hover:text-amber-500 transition-colors">Custom Sales &amp; Sourcing</Link></li>
              <li><Link to="/b2b" className="hover:text-amber-500 transition-colors">Commercial Accounts</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div>
            <h4 className="text-white font-header uppercase tracking-widest text-xs font-bold mb-4">Hemet Headquarters</h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500" /> (951) 925-1106
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
  );
};

export default Footer;