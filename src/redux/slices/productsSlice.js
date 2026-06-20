import { createSlice } from '@reduxjs/toolkit';

const initialProducts = [
  {
    id: 'p1',
    name: 'Milwaukee M18 FUEL 1/2" High Torque Impact Wrench',
    category: 'Power Tools',
    brand: 'Milwaukee',
    price: 299,
    inStock: 8,
    featured: true,
    rentalStartingAt: 25,
    specs: {
      'Drive Size': '1/2" Square with Friction Ring',
      'Max Torque': '1,400 ft-lbs Nut-Busting',
      'No Load Speed': '0 - 1,750 RPM',
      'Tool Weight': '5.9 lbs',
      'Motor Type': 'POWERSTATE Brushless'
    },
    description: 'The industry’s most powerful cordless high torque wrench. Delivers unmatched power-to-weight, exceptional speed, and features a frictionless ring setup to secure sockets safely.',
    includes: ['M18 FUEL Wrench (Tool-Only)', 'Friction Ring Anvil', 'Integrated Belt Clip', 'User Guide']
  },
  {
    id: 'p2',
    name: 'Makita 12" Dual-Bevel Sliding Compound Miter Saw',
    category: 'Power Tools',
    brand: 'Makita',
    price: 649,
    inStock: 3,
    featured: true,
    rentalStartingAt: 55,
    specs: {
      'Blade Diameter': '12 Inches',
      'Max Speed': '4,400 RPM',
      'Bevel Angle': '48° Left / 48° Right',
      'Tool Weight': '65.0 lbs',
      'Power Source': '15-Amp Direct-Drive Motor'
    },
    description: 'Engineered for smooth, high-precision framing cuts. Features Makita’s exclusive sliding rail system, transparent blade guard, and custom double bevel cuts for complex joist/miter trims.',
    includes: ['12" 60T Carbide-Tipped Blade', 'Dust Bag Storage System', 'Triangular Rule Adjuster', 'Vertical Vise Clamp']
  },
  {
    id: 'p3',
    name: 'Husqvarna 14" Segmented Diamond Saw Blade',
    category: 'Blades & Accessories',
    brand: 'Husqvarna',
    price: 185,
    inStock: 14,
    featured: true,
    rentalStartingAt: 15,
    specs: {
      'Diameter': '14 Inches',
      'Arbor Size': '1" with Drive Pin Adapter',
      'Segment Height': '0.45" Diamond Bonds',
      'Application': 'Reinforced Concrete / Hard Brick',
      'Cut Type': 'Dual Wet / Dry Operation'
    },
    description: 'Premium laser-weldedsegmented diamond blade designed for heavy concrete saws. Exceptional segment composition and deep slots reduce thermal expansion, offering rapid cut times.',
    includes: ['14" Premium Diamond Blade', 'Brass Arbor Bushing Sleeve (20mm - 1")']
  },
  {
    id: 'p4',
    name: 'Bosch SDS-Max Demolition Rotary Hammer Drill',
    category: 'Power Tools',
    brand: 'Bosch',
    price: 549,
    inStock: 5,
    featured: false,
    rentalStartingAt: 45,
    specs: {
      'Impact Force': '13.3 ft-lbs Blow Energy',
      'Blows Per Min': '2,900 BPM Maximum',
      'Chuckle Type': 'SDS-Max Quick Change',
      'Tool Weight': '18.1 lbs',
      'Vibration Control': 'Dual-Stage Counterbalance'
    },
    description: 'Pro-grade SDS-Max rotary hammer optimized for vertical and horizontal chiseling. Built with heavy-duty gearing, concrete boring speeds, and vibration safeguards to protect field operators.',
    includes: ['Auxiliary D-Handle Grip', 'Chisel Depth Gauge Rod', 'SDS-Max Point Chisel', 'Heavy Carrying Case']
  },
  {
    id: 'p5',
    name: 'Honda EU2200i Super Quiet Inverter Generator',
    category: 'Generators',
    brand: 'Honda',
    price: 1099,
    inStock: 4,
    featured: true,
    rentalStartingAt: 50,
    specs: {
      'Max Output': '2200 Watts @ 120V',
      'Engine Type': 'Honda GXR120 Commercial',
      'Runtime': 'Up to 8.1 hrs (0.95 Gal Tank)',
      'Sound Level': '48 to 57 dBA (Whisper Quiet)',
      'Fuel': 'Unleaded Gasoline'
    },
    description: 'Super-clean, pure-sine inverter power for computerized rigs and delicate electrical tooling. Runs incredibly quiet, compact to transport, and features Honda’s commercial durability.',
    includes: ['EU2200i Inverter unit', 'Precision Oil Funnel', 'DC Battery Charging Jumper Cord', 'Spark Plug Wrench']
  },
  {
    id: 'p6',
    name: 'Milwaukee M18 REDLITHIUM HIGH OUTPUT 12.0 Battery',
    category: 'Blades & Accessories',
    brand: 'Milwaukee',
    price: 249,
    inStock: 12,
    featured: false,
    rentalStartingAt: 10,
    specs: {
      'Voltage': '18 Volts',
      'Capacity': '12.0 Amp-Hours (Ah)',
      'Cell Technology': 'HIGH OUTPUT Lithium-Ion',
      'System Type': 'M18 Cordless Fleet Compatibility',
      'Weight': '3.4 lbs'
    },
    description: 'Provides 50% more power and runs 50% cooler than standard battery packs. Substantially increases cordless tool runtimes in heavy demolition and sustained high-load concrete cutting.',
    includes: ['REDLITHIUM HIGH OUTPUT HD12.0 Battery Pack', 'Terminal Protective Cap']
  },
  {
    id: 'p7',
    name: 'Makita 7-1/4" Max-Carbide Framing Blade (3-Pack)',
    category: 'Blades & Accessories',
    brand: 'Makita',
    price: 45,
    inStock: 25,
    featured: false,
    rentalStartingAt: 5,
    specs: {
      'Diameter': '7-1/4 Inches',
      'Teeth Count': '24 Framing Teeth',
      'Arbor Size': '5/8" Diamond Knockout',
      'Blade Kerf': '0.059" Ultra-Thin',
      'Tooth Grind': 'ATB with Tracking Point'
    },
    description: 'Premium circular framing blade pack built for massive speed and straight cuts. Thin-kerf design lowers motor strain while carbide teeth handle tough embedded-nail wood frames easily.',
    includes: ['3x 7-1/4" 24T Framing Blades', 'Protective Multi-Blade Storage Jacket']
  },
  {
    id: 'p8',
    name: 'Makita 18V LXT Brushless Cordless 5" Angle Grinder',
    category: 'Power Tools',
    brand: 'Makita',
    price: 179,
    inStock: 9,
    featured: false,
    rentalStartingAt: 20,
    specs: {
      'Wheel Size': '5 Inches',
      'Speed': '8,500 RPM',
      'Power Source': '18V LXT Lithium-Ion Battery',
      'Safety Tech': 'Electric Brake & Active Feedback',
      'Tool Weight': '5.7 lbs'
    },
    description: 'Cordless high-capacity angle grinder featuring brushless motor efficiencies, paddle safety switch, and active feedback sensors that immediately stop rotation if wheel binding occurs.',
    includes: ['18V LXT Brushless 5" Grinder', 'Tool-less Safety Guard', 'Inner Flange & Locking Nut', 'Auxiliary Handle']
  }
];

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    catalog: initialProducts,
    searchTerm: '',
    selectedCategory: 'All',
    selectedBrand: 'All',
    sortBy: 'featured',
    selectedProduct: null,
    showFilters: false,
    quantity: 1,
    isStagingCheckout: false,
    checkoutStaged: false,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setShowFilters: (state, action) => {
      state.showFilters = action.payload;
    },
    setQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    setIsStagingCheckout: (state, action) => {
      state.isStagingCheckout = action.payload;
    },
    setCheckoutStaged: (state, action) => {
      state.checkoutStaged = action.payload;
    },
    setProducts: (state, action) => {
      state.catalog = action.payload;
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.selectedCategory = 'All';
      state.selectedBrand = 'All';
      state.sortBy = 'featured';
    },
  },
});

export const {
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
  clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
