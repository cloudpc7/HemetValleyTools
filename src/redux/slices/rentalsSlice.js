import { createSlice } from '@reduxjs/toolkit';

const initialRentals = [
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

const rentalsSlice = createSlice({
  name: 'rentals',
  initialState: {
    catalog: initialRentals,
    searchTerm: '',
    selectedCategory: 'All',
    selectedBrand: 'All',
    sortBy: 'featured',
    selectedTool: null,
    showFilters: false,
    openFaq: null,
  },
  reducers: {
    setRentalsSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setRentalsSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setRentalsSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    setRentalsSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setRentalsSelectedTool: (state, action) => {
      state.selectedTool = action.payload;
    },
    setRentalsShowFilters: (state, action) => {
      state.showFilters = action.payload;
    },
    setRentalsOpenFaq: (state, action) => {
      state.openFaq = action.payload;
    },
    setRentals: (state, action) => {
      state.catalog = action.payload;
    },
    clearRentalsFilters: (state) => {
      state.searchTerm = '';
      state.selectedCategory = 'All';
      state.selectedBrand = 'All';
      state.sortBy = 'featured';
    }
  }
});

export const {
  setRentalsSearchTerm,
  setRentalsSelectedCategory,
  setRentalsSelectedBrand,
  setRentalsSortBy,
  setRentalsSelectedTool,
  setRentalsShowFilters,
  setRentalsOpenFaq,
  setRentals,
  clearRentalsFilters
} = rentalsSlice.actions;

export default rentalsSlice.reducer;
