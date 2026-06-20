import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../Providers/ThemeContext';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ShoppingCart, 
  Calendar, 
  Wrench, 
  Check, 
  Info, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Trash2, 
  CheckCircle2, 
  Plus, 
  Minus, 
  DollarSign, 
  Award,
  Package,
  Layers,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  User,
  Building
} from 'lucide-react';

import Navbar from '../ui/components/Navbar';
import Footer from '../ui/components/Footer';
import HemetValleyLogo from '../ui/components/HemetValleyLogo';
import { useFilteredCatalog } from '../utils/useFilteredCatalog';
import SEO from '../ui/components/SEO';

import { 
  setSearchTerm, 
  setSelectedCategory, 
  setSelectedBrand, 
  setSortBy, 
  setSelectedProduct, 
  setShowFilters,
  setQuantity,
  setIsStagingCheckout,
  setCheckoutStaged,
  setProducts,
  clearFilters 
} from '../redux/slices/productsSlice';
import { stagePurchase } from '../redux/slices/cartSlice';
import { 
  updateBulkDraft, 
  clearBulkDraft,
  setIsBulkSubmitting,
  setBulkSubmitted
} from '../redux/slices/formDraftsSlice';
import { getProducts } from '../utils/firebaseHelpers';
import { submitTransactionThunk, submitServiceRequestThunk } from '../redux/slices/data.slice';

const ProductsPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- CATALOG FILTERS & SELECTION STATE (REDUX) ---
  const { 
    catalog: products,
    searchTerm, 
    selectedCategory, 
    selectedBrand, 
    sortBy, 
    selectedProduct,
    showFilters,
    quantity,
    isStagingCheckout,
    checkoutStaged
  } = useSelector((state) => state.products);
  
  const { 
    bulkForm,
    isBulkSubmitting,
    bulkSubmitted
  } = useSelector((state) => state.formDrafts);

  // --- FETCH PRODUCTS FROM FIRESTORE ON MOUNT ---
  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        const liveProducts = await getProducts();
        dispatch(setProducts(liveProducts));
      } catch (err) {
        console.error("Failed to fetch products from Firestore:", err);
      }
    };
    fetchLiveProducts();
  }, [dispatch]);

  // --- DYNAMIC CATALOG FILTERS ---
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const brands = ['All', ...new Set(products.map(p => p.brand).filter(Boolean))];

  // --- FILTER & SORT LOGIC ---
  const filteredProducts = useFilteredCatalog(products, { searchTerm, selectedCategory, selectedBrand, sortBy });

  const bestSellers = products.filter(p => p.featured).slice(0, 3);

  // --- TRANSITION REDIRECT HOOKS IN MODAL ---
  const handleRentRedirect = (product) => {
    dispatch(setSelectedProduct(null));
    // Determine target category filter to preselect on Rentals page
    let rentalCategory = 'All';
    if (product.category === 'Power Tools') rentalCategory = 'Power Tools';
    else if (product.category === 'Blades & Accessories') rentalCategory = 'Blades & Bits';
    else if (product.category === 'Generators') rentalCategory = 'Heavy Duty';

    // Transition smoothly to rentals
    navigate('/rentals');
    setTimeout(() => {
      // Find scroll targets on Rentals page if available
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleRepairRedirect = (product) => {
    dispatch(setSelectedProduct(null));
    // Transition smoothly to Repairs page
    navigate('/repair');
    setTimeout(() => {
      // Prefill repair fields
      const repairFormBrandEl = document.getElementById('repair-brand-field');
      if (repairFormBrandEl) {
        repairFormBrandEl.value = product.brand;
        repairFormBrandEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const el = document.getElementById('repair-request-form-sec');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // --- SIMULATED RETAIL CHECKOUT STAGING ---
  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    dispatch(setIsStagingCheckout(true));
    try {
      const transactionData = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        brand: selectedProduct.brand,
        price: selectedProduct.price,
        quantity,
        total: selectedProduct.price * quantity,
        type: 'Retail Purchase'
      };
      await dispatch(submitTransactionThunk(transactionData)).unwrap();
      dispatch(stagePurchase({ product: selectedProduct, quantity }));
      dispatch(setCheckoutStaged(true));
    } catch (err) {
      alert(`Checkout failed: ${err.message}`);
    } finally {
      dispatch(setIsStagingCheckout(false));
    }
  };

  // --- BULK CONSTRUCTOR BID FORM SUBMIT ---
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkForm.name || !bulkForm.phone || !bulkForm.details) {
      alert('Please fill out all required commercial request fields.');
      return;
    }
    dispatch(setIsBulkSubmitting(true));
    try {
      await dispatch(submitServiceRequestThunk({
        ...bulkForm,
        serviceNeeded: 'Bulk Supply Bid',
        serviceType: 'Bulk Supply Bid'
      })).unwrap();
      dispatch(setBulkSubmitted(true));
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      dispatch(setIsBulkSubmitting(false));
    }
  };

  // Reset Purchase State when modal closes
  const closeProductModal = () => {
    dispatch(setSelectedProduct(null));
    dispatch(setCheckoutStaged(false));
    dispatch(setQuantity(1));
  };

  const productsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Hemet Valley Tools Supplies & Products",
    "description": "Premium commercial contractor supplies, high-performance diamond saw blades, concrete drill bits, and accessories.",
    "url": "https://hemetvalleytools.com/products",
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
        title="Professional Industrial Supplies & Blades | Hemet Valley Tools"
        description="Shop premium saw blades, diamond core bits, and professional safety accessories. Bulk discounts available for local contractors and construction crews."
        keywords="industrial supply Hemet, saw blades, diamond core bits, core drill rig, contractor supplies, safety rig pack"
        schema={productsSchema}
      />
      
      {/* Header Shell Navigation */}
      <Navbar activePage="products" />

      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-[#0F0F0F] to-[#050505] py-16 lg:py-20">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>

        {/* Photoshop watermark logo in background */}
        <div className="absolute right-4 lg:right-16 top-1/2 -translate-y-1/2 pointer-events-none z-0 select-none">
          <HemetValleyLogo className="w-[18rem] h-[18rem] lg:w-[30rem] lg:h-[30rem]" watermark={true} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold mb-6">
            <Package className="w-4 h-4" /> Pro-Grade Tool &amp; Supply Fleet
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-bold font-header uppercase leading-none tracking-tight text-white mb-4">
            Industrial Tools<br />
            &amp; <span className="text-amber-500">Commercial Supplies</span>
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
            Hemet Valley Tool &amp; Supply provides elite machinery, heavy accessories, and replacement parts. Purchase professional gear, rent heavy units, or request certified tuning in our synchronized workshop.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              onClick={() => {
                const el = document.getElementById('products-catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-amber-500 text-black hover:bg-white hover:text-black font-header uppercase tracking-wider font-bold py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer"
            >
              Browse Catalog Fleet <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('bulk-order-form-sec');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-header uppercase tracking-wider font-bold py-4 px-8 flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            >
              Get Contractor Bulk Bid
            </button>
          </div>
        </div>
      </header>

      {/* --- BRANDS TRUST BAR --- */}
      <section className="bg-zinc-950 border-b border-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Authorized Pro Supplier For:</span>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 font-header uppercase text-lg sm:text-xl font-bold text-zinc-400 tracking-wider">
              {['Milwaukee', 'Makita', 'Honda', 'Bosch', 'Husqvarna', 'Stihl'].map((b) => (
                <span key={b} className="hover:text-amber-500 transition-colors cursor-default">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUCTS CORE SECTION --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* --- SHOWCASE: BEST SELLERS --- */}
        <section className="mb-24 text-left">
          <div className="text-left mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">In-Stock Demand Staples</span>
            <h2 className="text-3xl font-black font-header uppercase text-white mt-1">Featured Best Sellers</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {bestSellers.map((product) => (
              <div 
                key={product.id} 
                onClick={() => dispatch(setSelectedProduct(product))}
                className="bg-[#0F0F0F] border border-amber-500/20 hover:border-amber-500/40 p-8 flex flex-col justify-between group transition-all duration-300 relative cursor-pointer"
              >
                <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono text-[9px] font-bold px-2.5 py-0.5 uppercase tracking-widest flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500/20" /> Pro Favorite
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">{product.brand} / {product.category}</span>
                  <h3 className="text-xl font-header uppercase tracking-wider text-white mb-4 group-hover:text-amber-500 transition-colors leading-snug">{product.name}</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6 line-clamp-3">{product.description}</p>
                </div>

                <div className="border-t border-zinc-900 pt-6 mt-6 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 block">Retail Price</span>
                    <span className="text-2xl font-header text-white font-black">${product.price}</span>
                  </div>
                  <button className="bg-zinc-900 hover:bg-amber-500 hover:text-black text-white p-3 border border-zinc-800 hover:border-amber-500 transition-all rounded-none">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTIONS 2 & 3: PRODUCTS CATALOG DISPATCH --- */}
        <section id="products-catalog-section" className="py-16 border-t border-zinc-900 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Live Showroom Catalog</span>
              <h2 className="text-3xl sm:text-4xl font-black font-header uppercase text-white mt-1">Our Product Inventory</h2>
            </div>
            
            {/* Filter Toggle Mobile */}
            <button 
              onClick={() => dispatch(setShowFilters(!showFilters))}
              className="md:hidden flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white font-header uppercase text-xs tracking-wider font-bold py-3 px-6 rounded-none cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-500" /> {showFilters ? 'Hide Filters' : 'Toggle Filters'}
            </button>
          </div>

          {/* Filtering control grid */}
          <div className={`bg-zinc-900/40 border border-zinc-900 p-6 mb-10 rounded-none space-y-6 md:block text-left ${showFilters ? 'block' : 'hidden md:block'}`}>
            
            {/* Row 1: Search & Sort */}
            <div className="grid md:grid-cols-12 gap-6">
              
              {/* Search query box */}
              <div className="md:col-span-6 relative">
                <label htmlFor="catalog-search" className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Search Catalog</label>
                <div className="relative">
                  <input 
                    type="text"
                    id="catalog-search"
                    value={searchTerm}
                    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    placeholder="Search by keyword, brand, or accessory..."
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 pl-11 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                  <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
                </div>
              </div>

              {/* Brand select */}
              <div className="md:col-span-3">
                <label htmlFor="catalog-brand" className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Filter by Brand</label>
                <select 
                  id="catalog-brand"
                  value={selectedBrand}
                  onChange={(e) => dispatch(setSelectedBrand(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500 font-sans rounded-none"
                >
                  {brands.map(b => (
                    <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>
                  ))}
                </select>
              </div>

              {/* Sorting */}
              <div className="md:col-span-3">
                <label htmlFor="catalog-sort" className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Sort Results</label>
                <select 
                  id="catalog-sort"
                  value={sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500 font-sans rounded-none"
                >
                  <option value="featured">Featured / Best Seller</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Alphabetical (A - Z)</option>
                </select>
              </div>

            </div>

            {/* Row 2: Category Selector Tabs */}
            <div className="border-t border-zinc-900 pt-6">
              <span id="catalog-categories-title" className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-3">Browse Categories</span>
              <div role="tablist" aria-labelledby="catalog-categories-title" className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSel = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={isSel}
                      onClick={() => dispatch(setSelectedCategory(cat))}
                      className={`px-5 py-2.5 text-xs font-header font-bold uppercase tracking-wider transition-all border rounded-none cursor-pointer ${
                        isSel 
                          ? 'bg-amber-500 text-black border-amber-500' 
                          : 'bg-zinc-950 text-zinc-400 border-zinc-850 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Results Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#0F0F0F] border border-zinc-900 py-16 px-4 text-center">
              <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-header uppercase tracking-wider text-white">No Matching Products</h3>
              <p className="text-zinc-500 text-xs font-light max-w-sm mx-auto mt-1">
                Your parameters did not match any in-stock pro tooling. Try clearing searches or selected filters.
              </p>
              <button 
                onClick={() => dispatch(clearFilters())}
                className="mt-6 px-5 py-2 border border-zinc-850 text-xs font-mono uppercase text-zinc-400 hover:text-white"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => dispatch(setSelectedProduct(product))}
                  className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between group hover:border-zinc-700 transition-all duration-300 relative cursor-pointer"
                >
                  <div>
                    {/* Corner Bracket */}
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500/0 group-hover:border-amber-500/45 transition-all duration-300"></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">{product.brand}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 ${
                        product.inStock > 5 ? 'text-green-500 bg-green-500/5' : 'text-amber-500 bg-amber-500/5'
                      }`}>
                        {product.inStock} In Stock
                      </span>
                    </div>

                    <h3 className="text-base font-header uppercase tracking-wide text-white group-hover:text-amber-500 transition-colors line-clamp-2 leading-tight mb-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-3 mb-6">
                      {product.description}
                    </p>
                  </div>

                  <div className="border-t border-zinc-850 pt-4 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block">Retail Buy</span>
                      <span className="text-lg font-header font-black text-white">${product.price}</span>
                    </div>
                    <span className="text-[10px] font-header font-bold uppercase tracking-widest text-amber-500 group-hover:text-white transition-colors flex items-center gap-1">
                      Specs <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- SECTION 4: CONTRACTOR BULK BID REQUEST FORM --- */}
        <section id="bulk-order-form-sec" className="border border-zinc-850 p-6 sm:p-10 bg-zinc-950/20 max-w-4xl mx-auto rounded-none text-left mb-8">
          
          <div className="text-center sm:text-left mb-8 border-b border-zinc-900 pb-6">
            <h3 className="text-2xl sm:text-3xl font-bold font-header uppercase text-white">Contractor Bulk Bid Request</h3>
            <p className="text-sm text-zinc-500 font-light mt-1">
              Bidding on an extensive Inland Empire project? Submit your materials list, consumable counts, or fleet supply needs below for custom wholesale rate structures.
            </p>
          </div>

          {bulkSubmitted ? (
            <div className="bg-zinc-900/50 border border-green-500/20 p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-header uppercase tracking-wider text-white mb-2">Wholesale Application Transmitted</h4>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                Thank you, {bulkForm.name}. Your bulk inventory requirements are locked. Our commercial supply desk will compile a custom pricing sheet and contact you in under 4 hours.
              </p>
              <button 
                onClick={() => { dispatch(setBulkSubmitted(false)); dispatch(clearBulkDraft()); }}
                className="mt-6 px-5 py-2 border border-zinc-855 hover:border-zinc-750 text-zinc-400 hover:text-white text-xs font-mono uppercase"
              >
                Send Another Bulk Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleBulkSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Name */}
                <div>
                  <label htmlFor="bulk-name" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Purchasing Lead Name *</label>
                  <input 
                    type="text" 
                    id="bulk-name"
                    required
                    aria-required="true"
                    value={bulkForm.name}
                    onChange={(e) => dispatch(updateBulkDraft({ name: e.target.value }))}
                    placeholder="Enter full name"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="bulk-company" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Company / Agency</label>
                  <input 
                    type="text" 
                    id="bulk-company"
                    value={bulkForm.company}
                    onChange={(e) => dispatch(updateBulkDraft({ company: e.target.value }))}
                    placeholder="Optional (e.g., Valley HVAC Framing)"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="bulk-phone" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Direct Phone *</label>
                  <input 
                    type="tel" 
                    id="bulk-phone"
                    required
                    aria-required="true"
                    value={bulkForm.phone}
                    onChange={(e) => dispatch(updateBulkDraft({ phone: e.target.value }))}
                    placeholder="e.g., (951) 555-0105"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="bulk-email" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Corporate Email *</label>
                  <input 
                    type="email" 
                    id="bulk-email"
                    required
                    aria-required="true"
                    value={bulkForm.email}
                    onChange={(e) => dispatch(updateBulkDraft({ email: e.target.value }))}
                    placeholder="e.g., bobby@valleyframing.com"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

              </div>

              {/* Requirements details */}
              <div>
                <label htmlFor="bulk-details" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Required Products, Quantities, or Material Specifications *</label>
                <textarea 
                  id="bulk-details"
                  required
                  aria-required="true"
                  rows="4"
                  value={bulkForm.details}
                  onChange={(e) => dispatch(updateBulkDraft({ details: e.target.value }))}
                  placeholder="Detail the models and quantities needed (e.g., need price on 10x Husqvarna 14-inch blades, 5x Milwaukee impact wrenches, and wholesale abrasive grinding segment options)..."
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isBulkSubmitting}
                className={`w-full bg-amber-500 text-black hover:bg-white font-header uppercase tracking-wider font-black py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300 rounded-none cursor-pointer ${
                  isBulkSubmitting ? 'opacity-50 cursor-wait' : ''
                }`}
              >
                {isBulkSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.01 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Transmitting Bulk Request...
                  </>
                ) : (
                  <>
                    Request Wholesale Bid Proposal <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

            </form>
          )}

        </section>

      </main>

      {/* Shared site Footer */}
      <Footer />

      {/* --- THREE-WAY INTERACTIVE PRODUCT DETAIL MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm animate-fadeIn">
          
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-[#0F0F0F] border border-zinc-800 max-w-4xl w-full relative p-6 sm:p-8 md:p-10 text-left rounded-none shadow-2xl shadow-amber-500/5 max-h-[90vh] overflow-y-auto"
          >
            
            {/* Corner Bracket */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-500"></div>

            {/* Close Modal Button */}
            <button 
              onClick={closeProductModal}
              className="absolute top-4 left-4 p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all rounded-none cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-12 gap-8 pt-8 items-start">
              
              {/* Left Column: Product Info & Specifications */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold block mb-1">
                    {selectedProduct.brand} / {selectedProduct.category}
                  </span>
                  <h3 id="modal-title" className="text-2xl sm:text-3xl font-header font-black uppercase text-white leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xl font-header font-bold text-white">${selectedProduct.price} Retail Buy</span>
                    <span className="text-zinc-600 font-mono">/</span>
                    <span className="text-xs text-green-500 font-mono font-bold bg-green-500/5 px-2.5 py-0.5 border border-green-500/10 uppercase">
                      {selectedProduct.inStock} Available In-Store
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">Product Description</h4>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">{selectedProduct.description}</p>
                </div>

                {/* Key Technical Specs Table */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">Technical Specifications</h4>
                  <div className="border border-zinc-850 divide-y divide-zinc-850">
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="grid grid-cols-12 px-4 py-2 text-xs font-mono">
                        <span className="col-span-5 text-zinc-500 uppercase">{key}</span>
                        <span className="col-span-7 text-zinc-300 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's included */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">What's in the Box</h4>
                  <ul className="grid sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
                    {selectedProduct.includes.map((inc, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-amber-500">▪</span> {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Three-Way Interactive Action Hub */}
              <div className="md:col-span-5 space-y-6">
                <div className="bg-zinc-950 p-6 border border-zinc-850 text-left relative overflow-hidden">
                  
                  {/* Option 1: Purchase Retail */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                      <ShoppingCart className="w-4 h-4" /> Option 1: Purchase Retail
                    </h4>

                    {checkoutStaged ? (
                      <div className="bg-green-500/5 border border-green-500/20 p-4 text-center space-y-3 animate-fadeIn">
                        <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                        <h5 className="text-xs font-mono uppercase font-bold text-white">Staged For Counter Pickup</h5>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                          {quantity}x {selectedProduct.name} successfully staged! We have reserved this item under your name. Pay at the register or arrange direct job-site dispatch upon arrival at our Hemet location.
                        </p>
                        <button 
                          onClick={() => dispatch(setCheckoutStaged(false))}
                          className="text-[9px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest"
                        >
                          Modify Quantity
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <span id="qty-modal-label" className="text-xs font-mono text-zinc-400 uppercase">Quantity:</span>
                          
                          {/* Counter toggles */}
                          <div className="flex items-center border border-zinc-800 bg-zinc-900">
                            <button 
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => quantity > 1 && dispatch(setQuantity(quantity - 1))}
                              className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span aria-live="polite" aria-labelledby="qty-modal-label" className="px-4 text-xs font-mono font-bold text-white">{quantity}</span>
                            <button 
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => quantity < selectedProduct.inStock && dispatch(setQuantity(quantity + 1))}
                              className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs font-mono border-t border-zinc-900 pt-3">
                          <span className="text-zinc-500 uppercase">Staged Total:</span>
                          <span className="text-base text-white font-bold">${selectedProduct.price * quantity}</span>
                        </div>

                        <button 
                          type="submit"
                          disabled={isStagingCheckout}
                          className={`w-full bg-amber-500 text-black hover:bg-white font-header uppercase tracking-wider text-xs font-bold py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 rounded-none cursor-pointer ${
                            isStagingCheckout ? 'opacity-50 cursor-wait' : ''
                          }`}
                        >
                          {isStagingCheckout ? (
                            <>
                              <svg className="animate-spin h-4.5 w-4.5 text-black" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.01 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Staging...
                            </>
                          ) : (
                            <>
                              Stage Purchase Reservation <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>
                    )}

                  </div>

                </div>

                {/* Option 2: Rent This Gear */}
                <div className="bg-zinc-950 p-6 border border-zinc-850 text-left">
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                      <Calendar className="w-4 h-4" /> Option 2: Rent This Tool
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                      Need this item for a single project or concrete job? Rent this model starting at only <strong className="text-white">${selectedProduct.rentalStartingAt}/day</strong>.
                    </p>
                    <button 
                      onClick={() => handleRentRedirect(selectedProduct)}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-header uppercase tracking-wider font-bold py-2.5 px-4 transition-all duration-300 cursor-pointer"
                    >
                      Reserve Tool Rental <ArrowRight className="w-3.5 h-3.5 inline ml-1.5" />
                    </button>
                  </div>
                </div>

                {/* Option 3: Service Existing Unit */}
                <div className="bg-zinc-950 p-6 border border-zinc-850 text-left">
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                      <Wrench className="w-4 h-4" /> Option 3: Repair &amp; Service
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                      Already own this exact {selectedProduct.brand} model? Let our factory-certified mechanical workshop calibrate, clean, or repair your existing unit.
                    </p>
                    <button 
                      onClick={() => handleRepairRedirect(selectedProduct)}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-header uppercase tracking-wider font-bold py-2.5 px-4 transition-all duration-300 cursor-pointer"
                    >
                      Book Fleet Diagnostics <ArrowRight className="w-3.5 h-3.5 inline ml-1.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ProductsPage;
