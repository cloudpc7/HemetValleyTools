import { db } from '../config/firebase';
import { collection, addDoc, doc, setDoc, getDocs, getDoc, query, where, serverTimestamp } from 'firebase/firestore';

/**
 * Submit a contractor B2B application to 'b2b_applications' collection
 */
export const submitB2BApplication = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, 'b2b_applications'), {
      ...formData,
      status: 'Pending Review',
      submittedAt: serverTimestamp()
    });
    console.log("B2B Application saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving B2B Application:", error);
    throw error;
  }
};

/**
 * Submit a service quote request to 'service_requests' collection
 */
export const submitServiceRequest = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, 'service_requests'), {
      ...formData,
      status: 'New Request',
      submittedAt: serverTimestamp()
    });
    console.log("Service Request saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving Service Request:", error);
    throw error;
  }
};

/**
 * Register a tool for repair intake to 'repair_tickets' collection
 */
export const submitRepairTicket = async (formData) => {
  try {
    const ticketNumber = `HVT-${Math.floor(1000 + Math.random() * 9000)}`;
    await setDoc(doc(db, 'repair_tickets', ticketNumber), {
      ticketId: ticketNumber,
      ...formData,
      status: 'Diagnostic Intake Check-in',
      eta: 'TBD (Teardown Pending)',
      tech: 'Triage Queue',
      diagnostics: 'Tool registered in shop database. Bench technician assigned for upcoming teardown and inspection phase.',
      cost: '$45.00 Deposit Paid',
      progress: 25,
      submittedAt: serverTimestamp()
    });
    console.log("Repair Ticket registered with ID:", ticketNumber);
    return ticketNumber;
  } catch (error) {
    console.error("Error saving Repair Ticket:", error);
    throw error;
  }
};

/**
 * Search/trace a repair ticket in Firestore by ID
 */
export const traceRepairTicket = async (ticketId) => {
  try {
    const docRef = doc(db, 'repair_tickets', ticketId.toUpperCase());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error searching repair ticket:", error);
    throw error;
  }
};

/**
 * Reserve an inventory booking slot in 'bookings' collection
 */
export const submitBooking = async (bookingData) => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      status: 'Reserved',
      createdAt: serverTimestamp()
    });
    console.log("Booking slot reserved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving Booking:", error);
    throw error;
  }
};

/**
 * Submit a retail purchase/rental transaction to 'transactions' collection
 */
export const submitTransaction = async (transactionData) => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      status: 'Authorized',
      processedAt: serverTimestamp()
    });
    console.log("Transaction processed with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving Transaction:", error);
    throw error;
  }
};

/**
 * Submit customer feedback / testimonial to 'customer_feedback' collection
 */
export const submitFeedback = async (feedbackData) => {
  try {
    const docRef = await addDoc(collection(db, 'customer_feedback'), {
      ...feedbackData,
      approved: true,
      submittedAt: serverTimestamp()
    });
    console.log("Feedback saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving Feedback:", error);
    throw error;
  }
};

/**
 * Helper to normalize products from Firestore database matching frontend schema
 */
export const normalizeProduct = (p) => {
  return {
    ...p,
    inStock: p.inStock !== undefined ? p.inStock : 8,
    featured: p.featured !== undefined ? p.featured : true,
    rentalStartingAt: p.rentalStartingAt !== undefined ? p.rentalStartingAt : 25,
    description: p.description || (p.features ? p.features.join(' ') : 'Professional-grade tool from Hemet Valley Tools.'),
    includes: p.includes || p.features || ['User manual', 'Warranty card'],
    specs: p.specs || {}
  };
};

/**
 * Helper to normalize rentals from Firestore database matching frontend schema
 */
export const normalizeRental = (r) => {
  return {
    ...r,
    inStock: r.inStock !== undefined ? r.inStock : 3,
    description: r.description || 'Professional rental gear from Hemet Valley Tools.',
    includes: r.includes || r.safetyEquipment || ['Safety equipment', 'Operator guide'],
    specs: r.specs || {},
    durationRates: {
      '4-hour': r.rentalRates?.fourHour || r.durationRates?.['4-hour'] || Math.round(r.price * 0.6),
      'Daily': r.rentalRates?.daily || r.price || r.durationRates?.['Daily'] || r.price,
      'Weekly': r.rentalRates?.weekly || r.durationRates?.['Weekly'] || Math.round(r.price * 4),
    }
  };
};

/**
 * Fetch all products dynamically from Firestore 'products' collection
 */
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productsList = [];
    querySnapshot.forEach((doc) => {
      productsList.push(normalizeProduct({ id: doc.id, ...doc.data() }));
    });
    return productsList;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Fetch all rentals dynamically from Firestore 'rentals' collection
 */
export const getRentals = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'rentals'));
    const rentalsList = [];
    querySnapshot.forEach((doc) => {
      rentalsList.push(normalizeRental({ id: doc.id, ...doc.data() }));
    });
    return rentalsList;
  } catch (error) {
    console.error("Error fetching rentals:", error);
    throw error;
  }
};
