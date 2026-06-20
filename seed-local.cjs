const admin = require('firebase-admin');
const fs = require('fs');

// Point to the local Firestore Emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8082';

admin.initializeApp({
  projectId: 'hemetvalleytools'
});

const db = admin.firestore();

const servicesList = [
  {
    id: "serv_concrete",
    name: "Concrete Pouring & Layout",
    category: "Commercial Services",
    description: "Full site concrete layout, rebar placement, and professional pouring services for commercial and high-end residential jobs."
  },
  {
    id: "serv_drilling",
    name: "Heavy Core Drilling & Boring",
    category: "Commercial Services",
    description: "Expert core drilling through reinforced masonry, brick, stone, and heavy structural concrete walls up to 12\" diameter."
  },
  {
    id: "serv_repair",
    name: "Small Engine & Tool Tuning",
    category: "Maintenance Services",
    description: "In-house diagnostic repair, carburetor cleaning, speed calibrations, and warranty servicing for Makita, Milwaukee, Honda, and Stihl."
  },
  {
    id: "serv_blade",
    name: "Custom Blade Sharpening & Supply",
    category: "Maintenance Services",
    description: "Diamond-rim saw blades calibration, laser sharpening, and high-performance segment adjustments for masonry saws."
  }
];

const customerFeedback = [
  {
    id: "feed_1",
    customerName: "Jose R.",
    company: "Sonora Framing Inc.",
    rating: 5,
    text: "Hemet Valley Tools has been our go-to for commercial fleet rentals. Their Milwaukee MX FUEL tools are always pristine, fully charged, and ready for work.",
    approved: true
  },
  {
    id: "feed_2",
    customerName: "Dave M.",
    company: "Valley Masonry & Concrete",
    rating: 5,
    text: "Excellent turnaround times on our Honda GX160 engine repair. Technicians are knowledgeable and their core drilling blades are high performance.",
    approved: true
  }
];

const activeRepairTickets = [
  {
    ticketId: "HVT-8802",
    name: "Dave L.",
    phone: "(951) 555-0190",
    modelName: "Honda GX390 Engine",
    brand: "Honda",
    status: "Repair In Progress (Calibrating Governor)",
    eta: "June 12, 2026",
    tech: "Dave L.",
    diagnostics: "Ultrasonic cleaning of carburetor completed. Commutator face polished. Now calibrating engine speed to factory 3600 RPM limit.",
    cost: "$125.00",
    progress: 75
  },
  {
    ticketId: "HVT-4901",
    name: "Marcus G.",
    phone: "(951) 555-0210",
    modelName: "Milwaukee SDS-Max Rotary Drill",
    brand: "Milwaukee",
    status: "Completed & Safety Certified",
    eta: "Ready for Counter Pickup",
    tech: "Marcus G.",
    diagnostics: "Replaced carbon brushes, fitted 12ft double-insulated commercial cord. Passed OSHA ground test. Return diagnostic credit applied.",
    cost: "$85.00",
    progress: 100
  }
];

const b2bApplications = [
  {
    companyName: "Sonora Framing Inc.",
    trade: "Concrete / Masonry",
    spendRange: "$5,000+",
    contactName: "Jose R.",
    phone: "(951) 555-0110",
    email: "jose@sonoraframing.com",
    notes: "Requesting Net-30 terms for upcoming mass commercial foundation work in San Jacinto.",
    status: "Approved",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    companyName: "Inland Steel & Rigging",
    trade: "General Contracting",
    spendRange: "$1,000 - $5,000",
    contactName: "Marcus G.",
    phone: "(951) 555-0210",
    email: "marcus@inlandsteel.com",
    notes: "Need quick dispatch options for Milwaukee demolition rentals.",
    status: "Pending Review",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    companyName: "Oasis Commercial Yards",
    trade: "Landscaping",
    spendRange: "$1,000 - $5,000",
    contactName: "Sarah D.",
    phone: "(951) 555-0199",
    email: "sarah@oasisyards.com",
    notes: "Fencing post-hole digger regular fleet bookings.",
    status: "Pending Review",
    submittedAt: new Date().toISOString()
  }
];

const interactiveBookings = [
  {
    selectedCategory: "Rentals",
    selectedToolId: "t1",
    selectedToolName: "Milwaukee Demolition Jackhammer",
    selectedDuration: "Daily",
    selectedDate: "2026-06-15",
    selectedTimeSlot: "10:00 AM",
    customerInfo: {
      name: "Marcus G.",
      phone: "(951) 555-0210",
      email: "marcus@inlandsteel.com",
      projectNote: "Foundation break-up in Hemet storefront area."
    },
    price: 85,
    status: "Reserved",
    createdAt: new Date().toISOString()
  },
  {
    selectedCategory: "Rentals",
    selectedToolId: "t3",
    selectedToolName: "Honda Commercial Power Washer",
    selectedDuration: "4-hour",
    selectedDate: "2026-06-12",
    selectedTimeSlot: "08:00 AM",
    customerInfo: {
      name: "Jose R.",
      phone: "(951) 555-0110",
      email: "jose@sonoraframing.com",
      projectNote: "Cleaning formwork before concrete pour."
    },
    price: 50,
    status: "Fulfilled",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

const serviceRequests = [
  {
    name: "Dave M.",
    company: "Valley Masonry & Concrete",
    email: "dave@valleymasonry.com",
    phone: "(951) 555-0190",
    serviceType: "Heavy Core Drilling & Boring",
    details: "Requires core drilling through 10-inch block wall for commercial conduits. 4 holes of 6-inch diameter.",
    status: "New Request",
    submittedAt: new Date().toISOString()
  }
];

const transactionsList = [
  {
    receiptId: "HVT-TX-99042",
    customerName: "Dave M.",
    phone: "(951) 555-0190",
    email: "dave@valleymasonry.com",
    company: "Valley Masonry & Concrete",
    b2bId: "HVT-PRO-10",
    dispatchType: "pickup",
    deliveryAddress: null,
    notes: "Urgent pickup of custom blades",
    purchases: [
      {
        id: "s1",
        name: "Premium 14\" Diamond Asphalt Saw Blade",
        category: "Blades & Accessories",
        price: 35,
        quantity: 2
      }
    ],
    rentals: [],
    pricing: {
      subtotal: 70,
      discount: 7,
      deliveryFee: 0,
      tax: 5,
      total: 68
    },
    status: "Authorized",
    processedAt: new Date().toISOString()
  }
];

async function seed() {
  const catalogData = JSON.parse(fs.readFileSync('./content/hemet_valley_tools_catalog.json', 'utf8'));
  
  console.log('Seeding local Firestore emulator with all collections...');
  
  // 1. Seed Products
  if (catalogData.products) {
    for (const item of catalogData.products) {
      await db.collection('products').doc(item.id).set(item);
      console.log(`Seeded product: ${item.id}`);
    }
  }
  
  // 2. Seed Rentals
  if (catalogData.rentals) {
    for (const item of catalogData.rentals) {
      await db.collection('rentals').doc(item.id).set(item);
      console.log(`Seeded rental: ${item.id}`);
    }
  }

  // 3. Seed Services
  for (const item of servicesList) {
    await db.collection('services').doc(item.id).set(item);
    console.log(`Seeded service: ${item.id}`);
  }

  // 4. Seed Feedback
  for (const item of customerFeedback) {
    await db.collection('customer_feedback').doc(item.id).set(item);
    console.log(`Seeded feedback: ${item.id}`);
  }

  // 5. Seed active sample Repair Tickets
  for (const item of activeRepairTickets) {
    await db.collection('repair_tickets').doc(item.ticketId).set(item);
    console.log(`Seeded repair ticket: ${item.ticketId}`);
  }

  // 6. Seed B2B Applications
  for (const item of b2bApplications) {
    // Generate a consistent ID based on contact name
    const docId = `b2b_${item.contactName.replace(/\s+/g, '_').toLowerCase()}`;
    await db.collection('b2b_applications').doc(docId).set(item);
    console.log(`Seeded B2B Application: ${docId}`);
  }

  // 7. Seed Bookings
  for (let i = 0; i < interactiveBookings.length; i++) {
    const docId = `booking_${i + 1}`;
    await db.collection('bookings').doc(docId).set(interactiveBookings[i]);
    console.log(`Seeded Booking: ${docId}`);
  }

  // 8. Seed Service Requests
  for (let i = 0; i < serviceRequests.length; i++) {
    const docId = `service_req_${i + 1}`;
    await db.collection('service_requests').doc(docId).set(serviceRequests[i]);
    console.log(`Seeded Service Request: ${docId}`);
  }

  // 9. Seed Transactions
  for (const item of transactionsList) {
    await db.collection('transactions').doc(item.receiptId).set(item);
    console.log(`Seeded Transaction: ${item.receiptId}`);
  }
  
  console.log('Database seeding successfully completed!');
}

seed().catch(err => {
  console.error('Error seeding data:', err);
});
