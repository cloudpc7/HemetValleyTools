// Hemet Valley Tools - Live Production Firebase Cloud Functions (v2)
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin with all required services
admin.initializeApp({
  databaseURL: "https://hemetvalleytools-default-rtdb.firebaseio.com"
});

const db = getFirestore("hemetvalleytools");
const rtdb = admin.database();

/**
 * Helper to get custom timestamp values
 */
const getTimestamp = () => admin.firestore.FieldValue.serverTimestamp();

/**
 * 1. submitB2BApplication
 * Callable function to register a new commercial contractor account application
 */
exports.submitB2BApplication = onCall({ region: "us-central1" }, async (request) => {
  const { data } = request;
  
  if (!data || !data.companyName || !data.contactName || !data.email || !data.phone) {
    throw new HttpsError("invalid-argument", "Missing required contact, company, or phone fields.");
  }

  try {
    const docData = {
      companyName: data.companyName,
      trade: data.trade || "Unspecified",
      spendRange: data.spendRange || "Unspecified",
      contactName: data.contactName,
      phone: data.phone,
      email: data.email,
      notes: data.notes || "",
      status: "Pending Review",
      submittedAt: getTimestamp()
    };

    // Store in firestore 'b2b_applications' collection
    const docRef = await db.collection("b2b_applications").add(docData);
    logger.info(`B2B Application successfully created with ID: ${docRef.id}`);

    // If spending range is high-end ($5,000+), log alert
    if (data.spendRange === "$5,000+") {
      logger.info(`High-Value contractor onboarding flagged! Application: ${docRef.id}`);
    }

    return {
      success: true,
      id: docRef.id,
      message: "B2B Contractor Account Application received successfully."
    };
  } catch (error) {
    logger.error("Error creating B2B application:", error);
    throw new HttpsError("internal", `Failed to register application: ${error.message}`);
  }
});

/**
 * 2. submitServiceRequest
 * Callable function to submit a custom/commercial services quote request
 */
exports.submitServiceRequest = onCall({ region: "us-central1" }, async (request) => {
  const { data } = request;

  if (!data || !data.name || !data.email || !data.phone || !data.serviceType) {
    throw new HttpsError("invalid-argument", "Missing serviceType or contact details.");
  }

  try {
    const docData = {
      name: data.name,
      company: data.company || "",
      email: data.email,
      phone: data.phone,
      serviceType: data.serviceType,
      details: data.details || "",
      status: "New Request",
      submittedAt: getTimestamp()
    };

    const docRef = await db.collection("service_requests").add(docData);
    logger.info(`Service Request saved with ID: ${docRef.id}`);

    return {
      success: true,
      id: docRef.id,
      message: "Service Request submitted successfully."
    };
  } catch (error) {
    logger.error("Error saving service request:", error);
    throw new HttpsError("internal", `Failed to register service request: ${error.message}`);
  }
});

/**
 * 3. submitRepairTicket
 * Callable function to register a tool for intake diagnostics
 * In addition to Firestore, it populates a Realtime Database path under `/live_repair_logs/{ticketId}`
 */
exports.submitRepairTicket = onCall({ region: "us-central1" }, async (request) => {
  const { data } = request;

  if (!data || !data.name || !data.phone || !data.email || !data.toolModel) {
    throw new HttpsError("invalid-argument", "Missing repair client or tool model details.");
  }

  try {
    // Generate high-integrity unique repair ticket code (e.g. HVT-XXXX)
    let ticketId = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const pin = Math.floor(1000 + Math.random() * 9000);
      ticketId = `HVT-${pin}`;
      const existingDoc = await db.collection("repair_tickets").doc(ticketId).get();
      if (!existingDoc.exists) {
        isUnique = true;
      }
      attempts++;
    }

    const docData = {
      ticketId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      brand: data.toolBrand || "Milwaukee",
      modelName: data.toolModel,
      status: "Diagnostic Intake Check-in",
      progress: 25,
      tech: "Triage Queue",
      diagnostics: "Tool registered in shop database. Bench technician assigned for upcoming teardown and inspection phase.",
      cost: "$45.00 Deposit Paid",
      eta: "TBD (Teardown Pending)",
      submittedAt: getTimestamp()
    };

    // Save ticket in Firestore
    await db.collection("repair_tickets").doc(ticketId).set(docData);
    logger.info(`Firestore Repair Ticket created: ${ticketId}`);

    // Push Realtime Database Logs for immediate updates without polling
    await rtdb.ref(`live_repair_logs/${ticketId}`).set({
      currentStatus: "Diagnostic Intake Check-in",
      progress: 25,
      lastUpdated: Date.now(),
      logs: [
        "Customer check-in complete. Initial triage slot confirmed.",
        "Diagnostic deposit processed successfully."
      ]
    });
    logger.info(`Realtime Database repair node established for: ${ticketId}`);

    return {
      success: true,
      ticketId,
      message: "Repair ticket logged and initialized successfully."
    };
  } catch (error) {
    logger.error("Error creating repair ticket:", error);
    throw new HttpsError("internal", `Failed to register repair ticket: ${error.message}`);
  }
});

/**
 * 4. traceRepairTicket
 * Securely fetch repair logs and current diagnostic details by Ticket ID
 */
exports.traceRepairTicket = onCall({ region: "us-central1" }, async (request) => {
  const { ticketId } = request.data || {};

  if (!ticketId) {
    throw new HttpsError("invalid-argument", "Ticket ID is required for search tracing.");
  }

  try {
    const docRef = db.collection("repair_tickets").doc(ticketId.toUpperCase().trim());
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return {
        success: false,
        message: "No registered ticket matches the provided ID."
      };
    }

    const ticketData = docSnap.data();
    // Convert Firestore Timestamp to ISO String for JSON safety
    if (ticketData.submittedAt && typeof ticketData.submittedAt.toDate === "function") {
      ticketData.submittedAt = ticketData.submittedAt.toDate().toISOString();
    }

    return {
      success: true,
      data: ticketData
    };
  } catch (error) {
    logger.error(`Error searching repair ticket ${ticketId}:`, error);
    throw new HttpsError("internal", `Failed to fetch ticket info: ${error.message}`);
  }
});

/**
 * 5. submitBooking
 * Handles secure tool/machinery reservations
 * Validates inventory in real-time, decrements product count in Firestore rentals, and saves reservation
 */
exports.submitBooking = onCall({ region: "us-central1" }, async (request) => {
  const { data } = request;

  if (!data || !data.selectedToolId || !data.selectedToolName || !data.customerInfo) {
    throw new HttpsError("invalid-argument", "Missing reservation tool ID or user details.");
  }

  const toolRef = db.collection("rentals").doc(data.selectedToolId);

  try {
    // Run Firestore Transaction to safely check and decrement stock
    const bookingResult = await db.runTransaction(async (transaction) => {
      const toolDoc = await transaction.get(toolRef);

      if (!toolDoc.exists) {
        throw new HttpsError("not-found", "The selected rental tool was not found in the catalog.");
      }

      const toolData = toolDoc.data();
      const currentStock = toolData.inStock !== undefined ? toolData.inStock : 3;

      if (currentStock <= 0) {
        throw new HttpsError(
          "failed-precondition",
          `Out of Stock: '${data.selectedToolName}' is fully booked for these dates.`
        );
      }

      // Decrement inventory stock safely on server side
      const updatedStock = currentStock - 1;
      transaction.update(toolRef, { inStock: updatedStock });

      // Save Booking slot reservation
      const bookingData = {
        selectedCategory: data.selectedCategory || "Rentals",
        selectedToolId: data.selectedToolId,
        selectedToolName: data.selectedToolName,
        selectedDuration: data.selectedDuration || "Daily",
        selectedDate: data.selectedDate || "",
        selectedTimeSlot: data.selectedTimeSlot || "",
        customerInfo: {
          name: data.customerInfo.name,
          phone: data.customerInfo.phone,
          email: data.customerInfo.email || "No email",
          projectNote: data.customerInfo.projectNote || ""
        },
        price: data.price || 0,
        status: "Reserved",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const newBookingRef = db.collection("bookings").doc();
      transaction.set(newBookingRef, bookingData);

      return {
        bookingId: newBookingRef.id,
        updatedStock
      };
    });

    logger.info(`Rental transaction completed. Booking: ${bookingResult.bookingId}, Remaining Stock: ${bookingResult.updatedStock}`);

    return {
      success: true,
      id: bookingResult.bookingId,
      message: "Tool reservation secured and inventory levels locked."
    };
  } catch (error) {
    logger.error("Transaction reservation failure:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", `Failed to complete booking: ${error.message}`);
  }
});

/**
 * 6. submitTransaction
 * Completes final purchase or rental checkout
 * Performs atomic stock adjustments on purchased items across collection documents in Firestore
 */
exports.submitTransaction = onCall({ region: "us-central1" }, async (request) => {
  const { data } = request;

  if (!data || !data.customerName || !data.phone || !data.pricing) {
    throw new HttpsError("invalid-argument", "Incomplete transaction pricing or checkout details.");
  }

  try {
    const receiptId = `HVT-TX-${Math.floor(10000 + Math.random() * 90000)}`;
    const txRef = db.collection("transactions").doc(receiptId);

    // Atomic transaction for batch inventory decrementing
    await db.runTransaction(async (transaction) => {
      // 1. Validate and adjust Product purchase stocks
      if (Array.isArray(data.purchases)) {
        for (const item of data.purchases) {
          const itemRef = db.collection("products").doc(item.id);
          const itemDoc = await transaction.get(itemRef);

          if (itemDoc.exists) {
            const currentStock = itemDoc.data().inStock !== undefined ? itemDoc.data().inStock : 8;
            const purchaseQty = item.quantity || 1;

            if (currentStock < purchaseQty) {
              throw new HttpsError(
                "failed-precondition",
                `Insufficient Stock: Only ${currentStock} units of '${item.name}' are available.`
              );
            }

            transaction.update(itemRef, { inStock: currentStock - purchaseQty });
          }
        }
      }

      // 2. Validate and adjust Rental checkouts
      if (Array.isArray(data.rentals)) {
        for (const item of data.rentals) {
          const itemRef = db.collection("rentals").doc(item.id);
          const itemDoc = await transaction.get(itemRef);

          if (itemDoc.exists) {
            const currentStock = itemDoc.data().inStock !== undefined ? itemDoc.data().inStock : 3;

            if (currentStock <= 0) {
              throw new HttpsError(
                "failed-precondition",
                `Out of Stock: Rental equipment '${item.name}' is temporarily unavailable.`
              );
            }

            transaction.update(itemRef, { inStock: currentStock - 1 });
          }
        }
      }

      // 3. Write checkout ledger entry
      const txData = {
        receiptId,
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || "No email",
        company: data.company || "",
        b2bId: data.b2bId || null,
        dispatchType: data.dispatchType || "pickup",
        deliveryAddress: data.deliveryAddress || null,
        notes: data.notes || "",
        purchases: data.purchases || [],
        rentals: data.rentals || [],
        pricing: {
          subtotal: data.pricing.subtotal || 0,
          discount: data.pricing.discount || 0,
          deliveryFee: data.pricing.deliveryFee || 0,
          tax: data.pricing.tax || 0,
          total: data.pricing.total || 0
        },
        status: "Completed",
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      transaction.set(txRef, txData);
    });

    logger.info(`Checkout successfully processed under Receipt: ${receiptId}`);

    return {
      success: true,
      receiptId,
      message: "Order transaction ledger finalized and inventory updated."
    };
  } catch (error) {
    logger.error("Checkout process failed:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", `Failed to complete transaction checkout: ${error.message}`);
  }
});

/**
 * 7. submitFeedback
 * Registers customer feedback
 */
exports.submitFeedback = onCall({ region: "us-central1" }, async (request) => {
  const { data } = request;

  if (!data || !data.customerName || !data.rating || !data.text) {
    throw new HttpsError("invalid-argument", "Missing text, rating, or customer feedback parameters.");
  }

  try {
    const docData = {
      customerName: data.customerName,
      company: data.company || "Local Builder",
      rating: parseInt(data.rating),
      text: data.text,
      approved: false, // Moderation queue by default in production
      submittedAt: getTimestamp()
    };

    const docRef = await db.collection("customer_feedback").add(docData);
    logger.info(`Feedback review pending approval: ${docRef.id}`);

    return {
      success: true,
      id: docRef.id,
      message: "Thank you! Your testimonial is submitted for moderation."
    };
  } catch (error) {
    logger.error("Error submitting feedback:", error);
    throw new HttpsError("internal", `Failed to save review feedback: ${error.message}`);
  }
});

// ---------------------------------------------------------------------------
// Pro Portal — staff-only admin operations (require custom claim role: admin)
// ---------------------------------------------------------------------------

const requireAdmin = (request) => {
  if (!request.auth || request.auth.token.role !== "admin") {
    throw new HttpsError("permission-denied", "Admin access required.");
  }
  return request.auth;
};

const writeAuditLog = async (action, collectionName, docId, staffEmail, details = {}) => {
  await db.collection("audit_logs").add({
    action,
    collection: collectionName,
    docId,
    staffEmail,
    details,
    createdAt: getTimestamp()
  });
};

const recalcPricing = (pricing = {}, purchases = [], rentals = []) => {
  const purchaseTotal = (purchases || []).reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const rentalTotal = (rentals || []).reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.rentalDays) || 1),
    0
  );
  const subtotal = purchaseTotal + rentalTotal;
  const discount = Number(pricing.discount) || 0;
  const deliveryFee = Number(pricing.deliveryFee) || 0;
  const tax = Number(pricing.tax) || 0;
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);

  return {
    ...pricing,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total
  };
};

const restoreBookingStock = async (bookingData) => {
  if (!bookingData?.selectedToolId) return;
  const toolRef = db.collection("rentals").doc(bookingData.selectedToolId);
  await db.runTransaction(async (transaction) => {
    const toolDoc = await transaction.get(toolRef);
    if (!toolDoc.exists) return;
    const currentStock = toolDoc.data().inStock !== undefined ? toolDoc.data().inStock : 3;
    transaction.update(toolRef, { inStock: currentStock + 1 });
  });
};

const reserveBookingStock = async (toolId) => {
  const toolRef = db.collection("rentals").doc(toolId);
  await db.runTransaction(async (transaction) => {
    const toolDoc = await transaction.get(toolRef);
    if (!toolDoc.exists) {
      throw new HttpsError("not-found", "Rental tool not found.");
    }
    const currentStock = toolDoc.data().inStock !== undefined ? toolDoc.data().inStock : 3;
    if (currentStock <= 0) {
      throw new HttpsError("failed-precondition", "No rental stock available for this tool.");
    }
    transaction.update(toolRef, { inStock: currentStock - 1 });
  });
};

exports.adminUpdateLeadStatus = onCall({ region: "us-central1" }, async (request) => {
  const auth = requireAdmin(request);
  const { collectionName, docId, status } = request.data || {};

  const allowedCollections = ["b2b_applications", "bookings", "service_requests", "repair_tickets"];
  if (!allowedCollections.includes(collectionName) || !docId || !status) {
    throw new HttpsError("invalid-argument", "collectionName, docId, and status are required.");
  }

  const docRef = db.collection(collectionName).doc(docId);
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "Record not found.");
  }

  await docRef.update({ status, updatedAt: getTimestamp(), updatedBy: auth.token.email || auth.uid });
  await writeAuditLog("update_status", collectionName, docId, auth.token.email, { status });

  return { success: true, message: "Status updated." };
});

exports.adminDeleteRecord = onCall({ region: "us-central1" }, async (request) => {
  const auth = requireAdmin(request);
  const { collectionName, docId } = request.data || {};

  const allowedCollections = ["b2b_applications", "bookings", "service_requests", "repair_tickets", "transactions"];
  if (!allowedCollections.includes(collectionName) || !docId) {
    throw new HttpsError("invalid-argument", "collectionName and docId are required.");
  }

  await db.collection(collectionName).doc(docId).delete();
  await writeAuditLog("delete_record", collectionName, docId, auth.token.email);

  return { success: true, message: "Record deleted." };
});

exports.adminUpdateBooking = onCall({ region: "us-central1" }, async (request) => {
  const auth = requireAdmin(request);
  const { docId, updates } = request.data || {};

  if (!docId || !updates) {
    throw new HttpsError("invalid-argument", "docId and updates are required.");
  }

  const docRef = db.collection("bookings").doc(docId);
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "Booking not found.");
  }

  const before = snap.data();
  const nextStatus = updates.status || before.status;
  const wasActive = before.status !== "Cancelled" && before.status !== "Completed Rental";
  const willCancel = nextStatus === "Cancelled";
  const willReserve = nextStatus === "Reserved" && before.status === "Cancelled";

  if (wasActive && willCancel) {
    await restoreBookingStock(before);
  }
  if (willReserve) {
    await reserveBookingStock(before.selectedToolId);
  }

  const patch = {
    updatedAt: getTimestamp(),
    updatedBy: auth.token.email || auth.uid
  };

  if (updates.selectedDate !== undefined) patch.selectedDate = updates.selectedDate;
  if (updates.selectedTimeSlot !== undefined) patch.selectedTimeSlot = updates.selectedTimeSlot;
  if (updates.price !== undefined) patch.price = Number(updates.price);
  if (updates.status !== undefined) patch.status = updates.status;
  if (updates.customerInfo !== undefined) patch.customerInfo = { ...before.customerInfo, ...updates.customerInfo };
  if (updates.adminNotes !== undefined) patch.adminNotes = updates.adminNotes;

  await docRef.update(patch);
  await writeAuditLog("update_booking", "bookings", docId, auth.token.email, { before, patch });

  return { success: true, message: "Booking updated." };
});

exports.adminCancelBooking = onCall({ region: "us-central1" }, async (request) => {
  const auth = requireAdmin(request);
  const { docId, reason } = request.data || {};

  if (!docId) {
    throw new HttpsError("invalid-argument", "docId is required.");
  }

  const docRef = db.collection("bookings").doc(docId);
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "Booking not found.");
  }

  const before = snap.data();
  if (before.status !== "Cancelled") {
    await restoreBookingStock(before);
  }

  await docRef.update({
    status: "Cancelled",
    cancelReason: reason || "Cancelled by staff",
    cancelledAt: getTimestamp(),
    cancelledBy: auth.token.email || auth.uid,
    updatedAt: getTimestamp(),
    updatedBy: auth.token.email || auth.uid
  });

  await writeAuditLog("cancel_booking", "bookings", docId, auth.token.email, { reason });

  return { success: true, message: "Booking cancelled and inventory restored." };
});

exports.adminUpdateTransaction = onCall({ region: "us-central1" }, async (request) => {
  const auth = requireAdmin(request);
  const { docId, updates, reason } = request.data || {};

  if (!docId || !updates) {
    throw new HttpsError("invalid-argument", "docId and updates are required.");
  }

  const docRef = db.collection("transactions").doc(docId);
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "Transaction not found.");
  }

  const before = snap.data();
  const purchases = updates.purchases !== undefined ? updates.purchases : before.purchases || [];
  const rentals = updates.rentals !== undefined ? updates.rentals : before.rentals || [];
  const pricing = recalcPricing(
    { ...(before.pricing || {}), ...(updates.pricing || {}) },
    purchases,
    rentals
  );

  const adjustment = {
    at: new Date().toISOString(),
    by: auth.token.email || auth.uid,
    reason: reason || "Staff adjustment",
    before: {
      pricing: before.pricing || {},
      purchases: before.purchases || [],
      rentals: before.rentals || []
    },
    after: { pricing, purchases, rentals }
  };

  const adjustments = Array.isArray(before.adjustments) ? [...before.adjustments, adjustment] : [adjustment];

  const patch = {
    purchases,
    rentals,
    pricing,
    adjustments,
    status: updates.status || (reason ? "Adjusted" : (before.status || "Completed")),
    adminNotes: updates.adminNotes !== undefined ? updates.adminNotes : (before.adminNotes || ""),
    updatedAt: getTimestamp(),
    updatedBy: auth.token.email || auth.uid
  };

  if (updates.dispatchType !== undefined) patch.dispatchType = updates.dispatchType;
  if (updates.deliveryAddress !== undefined) patch.deliveryAddress = updates.deliveryAddress;
  if (updates.notes !== undefined) patch.notes = updates.notes;

  await docRef.update(patch);
  await writeAuditLog("update_transaction", "transactions", docId, auth.token.email, { reason });

  return { success: true, message: "Transaction updated.", pricing };
});

exports.adminCancelTransaction = onCall({ region: "us-central1" }, async (request) => {
  const auth = requireAdmin(request);
  const { docId, status, reason, restoreInventory } = request.data || {};

  if (!docId) {
    throw new HttpsError("invalid-argument", "docId is required.");
  }

  const nextStatus = status === "Refunded" ? "Refunded" : "Cancelled";
  const docRef = db.collection("transactions").doc(docId);
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "Transaction not found.");
  }

  const before = snap.data();

  if (restoreInventory) {
    if (Array.isArray(before.purchases)) {
      for (const item of before.purchases) {
        const itemRef = db.collection("products").doc(item.id);
        await db.runTransaction(async (transaction) => {
          const itemDoc = await transaction.get(itemRef);
          if (!itemDoc.exists) return;
          const currentStock = itemDoc.data().inStock !== undefined ? itemDoc.data().inStock : 8;
          transaction.update(itemRef, { inStock: currentStock + (item.quantity || 1) });
        });
      }
    }
    if (Array.isArray(before.rentals)) {
      for (const item of before.rentals) {
        const itemRef = db.collection("rentals").doc(item.id);
        await db.runTransaction(async (transaction) => {
          const itemDoc = await transaction.get(itemRef);
          if (!itemDoc.exists) return;
          const currentStock = itemDoc.data().inStock !== undefined ? itemDoc.data().inStock : 3;
          transaction.update(itemRef, { inStock: currentStock + 1 });
        });
      }
    }
  }

  await docRef.update({
    status: nextStatus,
    cancelReason: reason || `${nextStatus} by staff`,
    cancelledAt: getTimestamp(),
    cancelledBy: auth.token.email || auth.uid,
    updatedAt: getTimestamp(),
    updatedBy: auth.token.email || auth.uid
  });

  await writeAuditLog("cancel_transaction", "transactions", docId, auth.token.email, { status: nextStatus, reason });

  return { success: true, message: `Transaction marked as ${nextStatus}.` };
});