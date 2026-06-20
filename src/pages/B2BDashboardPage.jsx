import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Providers/ThemeContext';
import { db } from '../config/firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  adminUpdateLeadStatusThunk,
  adminDeleteRecordThunk,
  adminUpdateBookingThunk,
  adminCancelBookingThunk,
  adminUpdateTransactionThunk,
  adminCancelTransactionThunk,
} from '../redux/slices/data.slice';
import { signOut } from '../redux/slices/auth.slice';
import { 
  Building, 
  Calendar, 
  Wrench, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Search, 
  Trash2, 
  X, 
  ArrowUpRight, 
  ShieldCheck, 
  Sliders, 
  Download, 
  RefreshCw,
  ExternalLink,
  DollarSign,
  Package,
  Layers,
  Award,
  LogOut,
  Receipt
} from 'lucide-react';
import Navbar from '../ui/components/Navbar';
import Footer from '../ui/components/Footer';
import HemetValleyLogo from '../ui/components/HemetValleyLogo';
import ProPortalRecordDrawer from '../ui/components/ProPortalRecordDrawer';

const B2BDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const staffUser = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('transactions');
  const [saving, setSaving] = useState(false);

  const [b2bApps, setB2bApps] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [services, setServices] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Detail Drawer state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRecordType, setSelectedRecordType] = useState(null);

  // Fetch all collections in real-time
  useEffect(() => {
    setLoading(true);

    // 1. Subscribe to B2B Applications
    const b2bQuery = query(collection(db, 'b2b_applications'), orderBy('submittedAt', 'desc'));
    const unsubscribeB2b = onSnapshot(b2bQuery, (snapshot) => {
      const apps = [];
      snapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() });
      });
      setB2bApps(apps);
      setLoading(false);
    }, (err) => {
      console.error("Firestore B2B sub error:", err);
    });

    const transactionsQuery = query(collection(db, 'transactions'), orderBy('processedAt', 'desc'));
    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const txs = [];
      snapshot.forEach((docSnap) => {
        txs.push({ id: docSnap.id, ...docSnap.data() });
      });
      setTransactions(txs);
    }, (err) => {
      console.error('Firestore Transactions sub error:', err);
    });

    const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const bks = [];
      snapshot.forEach((doc) => {
        bks.push({ id: doc.id, ...doc.data() });
      });
      setBookings(bks);
    }, (err) => {
      console.error("Firestore Bookings sub error:", err);
    });

    // 3. Subscribe to Service Requests
    const servicesQuery = query(collection(db, 'service_requests'), orderBy('submittedAt', 'desc'));
    const unsubscribeServices = onSnapshot(servicesQuery, (snapshot) => {
      const svs = [];
      snapshot.forEach((doc) => {
        svs.push({ id: doc.id, ...doc.data() });
      });
      setServices(svs);
    }, (err) => {
      console.error("Firestore Services sub error:", err);
    });

    // 4. Subscribe to Repair Tickets
    const repairsQuery = query(collection(db, 'repair_tickets'), orderBy('submittedAt', 'desc'));
    const unsubscribeRepairs = onSnapshot(repairsQuery, (snapshot) => {
      const rps = [];
      snapshot.forEach((doc) => {
        rps.push({ id: doc.id, ...doc.data() });
      });
      setRepairs(rps);
    }, (err) => {
      console.error("Firestore Repairs sub error:", err);
    });

    return () => {
      unsubscribeB2b();
      unsubscribeTransactions();
      unsubscribeBookings();
      unsubscribeServices();
      unsubscribeRepairs();
    };
  }, []);

  // --- CRM GENERATION ENGINE (Deduplicated Contacts across all submissions) ---
  const generateCrmList = () => {
    const contactsMap = {};

    // Helper to add or merge customer contacts
    const addOrMerge = (email, phone, name, company, trade, sourceBadge, date, notes = '') => {
      if (!email && !phone && !name) return;
      
      // Use email or phone as the unique key
      const key = (email || phone || name).toLowerCase().trim();

      if (contactsMap[key]) {
        // Merge existing
        const existing = contactsMap[key];
        if (name && !existing.name) existing.name = name;
        if (company && !existing.company) existing.company = company;
        if (trade && !existing.trade) existing.trade = trade;
        if (!existing.sources.includes(sourceBadge)) {
          existing.sources.push(sourceBadge);
        }
        if (notes && !existing.notes.includes(notes)) {
          existing.notes.push(notes);
        }
        if (new Date(date) > new Date(existing.lastActivity)) {
          existing.lastActivity = date;
        }
      } else {
        // Create new contact card
        contactsMap[key] = {
          name: name || 'Valued Contractor',
          email: email || 'No email',
          phone: phone || 'No phone',
          company: company || 'N/A',
          trade: trade || 'General Construction',
          sources: [sourceBadge],
          lastActivity: date || new Date().toISOString(),
          notes: notes ? [notes] : []
        };
      }
    };

    // 1. Process B2B Applications
    b2bApps.forEach(app => {
      const dateStr = app.submittedAt?.seconds 
        ? new Date(app.submittedAt.seconds * 1000).toISOString() 
        : new Date().toISOString();
      addOrMerge(
        app.email, 
        app.phone, 
        app.contactName, 
        app.companyName, 
        app.trade, 
        'Pro B2B App', 
        dateStr,
        app.notes
      );
    });

    transactions.forEach(tx => {
      const dateStr = tx.processedAt?.seconds
        ? new Date(tx.processedAt.seconds * 1000).toISOString()
        : new Date().toISOString();
      addOrMerge(
        tx.email,
        tx.phone,
        tx.customerName,
        tx.company,
        'Retail Transaction',
        'Checkout',
        dateStr,
        `Receipt ${tx.receiptId || tx.id} — $${tx.pricing?.total ?? 0}`
      );
    });

    bookings.forEach(bk => {
      if (!bk.customerInfo) return;
      const dateStr = bk.createdAt?.seconds 
        ? new Date(bk.createdAt.seconds * 1000).toISOString() 
        : new Date().toISOString();
      addOrMerge(
        bk.customerInfo.email,
        bk.customerInfo.phone,
        bk.customerInfo.name,
        bk.customerInfo.company,
        bk.selectedCategory === 'Rentals' ? 'Equipment Rental' : 'Supply Pickup',
        'Fleet Booking',
        dateStr,
        bk.customerInfo.projectNote
      );
    });

    // 3. Process Service Requests
    services.forEach(sv => {
      const dateStr = sv.submittedAt?.seconds 
        ? new Date(sv.submittedAt.seconds * 1000).toISOString() 
        : new Date().toISOString();
      addOrMerge(
        sv.email,
        sv.phone,
        sv.name,
        sv.company,
        sv.serviceType,
        'Specialty Quote',
        dateStr,
        sv.details
      );
    });

    // 4. Process Repair Intakes
    repairs.forEach(rp => {
      const dateStr = rp.submittedAt?.seconds 
        ? new Date(rp.submittedAt.seconds * 1000).toISOString() 
        : new Date().toISOString();
      addOrMerge(
        rp.email,
        rp.phone,
        rp.name,
        rp.company,
        `${rp.brand} ${rp.modelName || 'Repair'}`,
        'Workshop Drop',
        dateStr,
        rp.diagnostics
      );
    });

    return Object.values(contactsMap).sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
  };

  const crmList = generateCrmList();

  const handleUpdateStatus = async (collectionName, docId, newStatus) => {
    setSaving(true);
    try {
      await dispatch(adminUpdateLeadStatusThunk({ collectionName, docId, status: newStatus })).unwrap();
      if (selectedRecord?.id === docId) {
        setSelectedRecord((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(`Status update failed: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (collectionName, docId) => {
    if (!window.confirm('Permanently delete this record? This cannot be undone.')) return;
    setSaving(true);
    try {
      await dispatch(adminDeleteRecordThunk({ collectionName, docId })).unwrap();
      setSelectedRecord(null);
    } catch (err) {
      alert(`Deletion failed: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBooking = async (docId, updates) => {
    setSaving(true);
    try {
      await dispatch(adminUpdateBookingThunk({ docId, updates })).unwrap();
    } catch (err) {
      alert(`Booking update failed: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelBooking = async (docId) => {
    const reason = window.prompt('Cancellation reason (optional):') || 'Cancelled by staff';
    setSaving(true);
    try {
      await dispatch(adminCancelBookingThunk({ docId, reason })).unwrap();
      setSelectedRecord(null);
    } catch (err) {
      alert(`Cancel failed: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTransaction = async (docId, updates, reason) => {
    setSaving(true);
    try {
      await dispatch(adminUpdateTransactionThunk({ docId, updates, reason })).unwrap();
    } catch (err) {
      alert(`Transaction update failed: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelTransaction = async (docId, status, restoreInventory) => {
    const reason = window.prompt(`${status} reason (optional):`) || `${status} by staff`;
    setSaving(true);
    try {
      await dispatch(adminCancelTransactionThunk({ docId, status, reason, restoreInventory })).unwrap();
      setSelectedRecord(null);
    } catch (err) {
      alert(`Transaction update failed: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleStaffSignOut = async () => {
    await dispatch(signOut());
    navigate('/pro-login');
  };

  // --- FILTERS & SEARCH PROCESSOR ---
  const getFilteredData = () => {
    let currentSet = [];

    if (activeTab === 'transactions') {
      currentSet = transactions;
    } else if (activeTab === 'b2b') {
      currentSet = b2bApps;
    } else if (activeTab === 'bookings') {
      currentSet = bookings;
    } else if (activeTab === 'services') {
      currentSet = services;
    } else if (activeTab === 'repairs') {
      currentSet = repairs;
    } else if (activeTab === 'crm') {
      // CRM has custom search filtering
      return crmList.filter(item => {
        const query = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.phone.includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.company.toLowerCase().includes(query) ||
          item.trade.toLowerCase().includes(query)
        );
      });
    }

    return currentSet.filter(item => {
      const query = searchTerm.toLowerCase();
      
      // Text Match
      const matchesSearch = activeTab === 'transactions'
        ? (item.receiptId?.toLowerCase().includes(query) || item.customerName?.toLowerCase().includes(query) || item.phone?.includes(query) || item.email?.toLowerCase().includes(query))
        : activeTab === 'b2b'
        ? (item.companyName?.toLowerCase().includes(query) || item.contactName?.toLowerCase().includes(query) || item.email?.toLowerCase().includes(query) || item.phone?.includes(query))
        : activeTab === 'bookings'
        ? (item.customerInfo?.name?.toLowerCase().includes(query) || item.selectedToolName?.toLowerCase().includes(query) || item.customerInfo?.phone?.includes(query))
        : activeTab === 'services'
        ? (item.name?.toLowerCase().includes(query) || item.company?.toLowerCase().includes(query) || item.serviceType?.toLowerCase().includes(query))
        : (item.name?.toLowerCase().includes(query) || item.modelName?.toLowerCase().includes(query) || item.ticketId?.toLowerCase().includes(query));

      // Status Match
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const visibleLeads = getFilteredData();

  // Metrics counts
  const totalLeadsCount = transactions.length + b2bApps.length + bookings.length + services.length;
  const pendingB2bCount = b2bApps.filter(a => a.status === 'Pending Review').length;
  const confirmedRentalsCount = bookings.filter(b => b.status === 'Reserved').length;
  const cancelledBookingsCount = bookings.filter(b => b.status === 'Cancelled').length;
  const transactionRevenue = transactions
    .filter(t => t.status !== 'Cancelled' && t.status !== 'Refunded')
    .reduce((sum, t) => sum + (t.pricing?.total || 0), 0);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      <Navbar activePage="pro-portal" />

      <header className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-[#0F0F0F] to-[#050505] py-12">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>
        <div className="absolute right-8 bottom-4 pointer-events-none opacity-5">
          <HemetValleyLogo className="w-80 h-80" watermark={true} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold">
              <Sliders className="w-4 h-4" /> HVT STAFF PRO PORTAL
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
              <span>{staffUser?.email}</span>
              <button onClick={handleStaffSignOut} className="flex items-center gap-1.5 border border-zinc-700 px-3 py-1.5 text-zinc-400 hover:text-white hover:border-amber-500/50 transition-all">
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-header uppercase tracking-tight text-white mb-2">
            Team Operations <span className="text-amber-500">Command Center</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl font-light">
            Manage customer transactions, fleet bookings, cancellations, and pricing adjustments. Contractor B2B applications are tracked here as inbound leads — separate from this staff login.
          </p>

          {/* --- METRICS INTERACTIVE GRID --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {/* Stat 1 */}
            <div className="bg-[#111111] border border-zinc-800 p-5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Transaction Revenue</span>
              <div className="text-3xl font-header font-black text-white mt-1">${transactionRevenue.toLocaleString()}</div>
              <span className="text-[9px] text-zinc-400 block mt-2 font-mono">{transactions.length} checkout records</span>
            </div>

            {/* Stat 2 */}
            <div className="bg-[#111111] border border-zinc-800 p-5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Pending Underwrites</span>
              <div className="text-3xl font-header font-black text-amber-500 mt-1">{pendingB2bCount}</div>
              <span className="text-[9px] text-zinc-400 block mt-2 font-mono">Requires credit check</span>
            </div>

            {/* Stat 3 */}
            <div className="bg-[#111111] border border-zinc-800 p-5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Active Bookings</span>
              <div className="text-3xl font-header font-black text-white mt-1">{confirmedRentalsCount}</div>
              <span className="text-[9px] text-zinc-400 block mt-2 font-mono">{cancelledBookingsCount} cancelled</span>
            </div>

            {/* Stat 4 */}
            <div className="bg-[#111111] border border-zinc-800 p-5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Unified CRM</span>
              <div className="text-3xl font-header font-black text-white mt-1">{crmList.length}</div>
              <span className="text-[9px] text-zinc-400 block mt-2 font-mono">Unique customer profiles</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- DASHBOARD CONTROLS WORKSPACE --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Main workspace grid */}
          <div className="lg:col-span-12 space-y-6">
            
            {/* TABS SELECTOR DESK */}
            <div className="flex border-b border-zinc-850 overflow-x-auto gap-2 no-scrollbar">
              <button
                onClick={() => { setActiveTab('transactions'); setSearchTerm(''); setStatusFilter('All'); }}
                className={`py-3.5 px-5 font-header uppercase tracking-wider text-xs font-bold shrink-0 transition-all border-b-2 ${activeTab === 'transactions' ? 'border-amber-500 text-amber-500 bg-zinc-900/40' : 'border-transparent text-zinc-400 hover:text-white'}`}
              >
                Transactions ({transactions.length})
              </button>
              <button 
                onClick={() => { setActiveTab('b2b'); setSearchTerm(''); setStatusFilter('All'); }}
                className={`py-3.5 px-5 font-header uppercase tracking-wider text-xs font-bold shrink-0 transition-all border-b-2 ${activeTab === 'b2b' ? 'border-amber-500 text-amber-500 bg-zinc-900/40' : 'border-transparent text-zinc-400 hover:text-white'}`}
              >
                Contractor Applications ({b2bApps.length})
              </button>
              <button 
                onClick={() => { setActiveTab('bookings'); setSearchTerm(''); setStatusFilter('All'); }}
                className={`py-3.5 px-5 font-header uppercase tracking-wider text-xs font-bold shrink-0 transition-all border-b-2 ${activeTab === 'bookings' ? 'border-amber-500 text-amber-500 bg-zinc-900/40' : 'border-transparent text-zinc-400 hover:text-white'}`}
              >
                Fleet Bookings ({bookings.length})
              </button>
              <button 
                onClick={() => { setActiveTab('services'); setSearchTerm(''); setStatusFilter('All'); }}
                className={`py-3.5 px-5 font-header uppercase tracking-wider text-xs font-bold shrink-0 transition-all border-b-2 ${activeTab === 'services' ? 'border-amber-500 text-amber-500 bg-zinc-900/40' : 'border-transparent text-zinc-400 hover:text-white'}`}
              >
                Specialty Quotes ({services.length})
              </button>
              <button 
                onClick={() => { setActiveTab('repairs'); setSearchTerm(''); setStatusFilter('All'); }}
                className={`py-3.5 px-5 font-header uppercase tracking-wider text-xs font-bold shrink-0 transition-all border-b-2 ${activeTab === 'repairs' ? 'border-amber-500 text-amber-500 bg-zinc-900/40' : 'border-transparent text-zinc-400 hover:text-white'}`}
              >
                Workshop Intakes ({repairs.length})
              </button>
              <button 
                onClick={() => { setActiveTab('crm'); setSearchTerm(''); setStatusFilter('All'); }}
                className={`py-3.5 px-5 font-header uppercase tracking-wider text-xs font-bold shrink-0 transition-all border-b-2 ${activeTab === 'crm' ? 'border-amber-500 text-amber-500 bg-zinc-900/40' : 'border-transparent text-zinc-400 hover:text-white'}`}
              >
                Unified CRM Contacts ({crmList.length})
              </button>
            </div>

            {/* SEARCH AND FILTERS TOOLBAR */}
            <div className="bg-[#111111] border border-zinc-850 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center text-left">
              
              {/* Search input bar */}
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={activeTab === 'crm' ? "Search contacts, email, phone, trade, company..." : "Filter results by keyword, phone, or model..."}
                  className="w-full bg-zinc-950 border border-zinc-800 py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Status specific drop filter */}
              {activeTab !== 'crm' && (
                <div className="flex gap-2 items-center w-full sm:w-auto shrink-0 justify-end">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-zinc-300 py-1.5 px-3 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">Show All</option>
                    {activeTab === 'transactions' && (
                      <>
                        <option value="Completed">Completed</option>
                        <option value="Adjusted">Adjusted</option>
                        <option value="Refunded">Refunded</option>
                        <option value="Cancelled">Cancelled</option>
                      </>
                    )}
                    {activeTab === 'b2b' && (
                      <>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Approved Credit &amp; Net-30">Approved Credit</option>
                        <option value="Underwritten &amp; Reviewing">Underwriting</option>
                        <option value="Declined">Declined</option>
                      </>
                    )}
                    {activeTab === 'bookings' && (
                      <>
                        <option value="Reserved">Reserved</option>
                        <option value="Dispatched / Picked Up">Dispatched</option>
                        <option value="Completed Rental">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </>
                    )}
                    {activeTab === 'services' && (
                      <>
                        <option value="New Request">New Request</option>
                        <option value="Consultation Booked">Consultation</option>
                        <option value="Quote Sent">Quote Sent</option>
                        <option value="Completed Action">Completed</option>
                      </>
                    )}
                    {activeTab === 'repairs' && (
                      <>
                        <option value="Diagnostic Intake Check-in">Intake Check-in</option>
                        <option value="Repair In Progress (Calibrating Governor)">In Progress</option>
                        <option value="Completed &amp; Safety Certified">Completed</option>
                      </>
                    )}
                  </select>
                </div>
              )}

            </div>

            {/* TAB CONTENT SPACE */}
            <div className="bg-[#111111] border border-zinc-850 overflow-hidden">
              
              {loading ? (
                <div className="py-24 text-center text-zinc-400">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-4 text-amber-500" />
                  <p className="text-xs font-mono uppercase tracking-widest">Streaming live Firestore database...</p>
                </div>
              ) : visibleLeads.length === 0 ? (
                <div className="py-20 text-center text-zinc-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
                  <p className="text-sm font-mono uppercase tracking-widest">No matching lead records</p>
                  <p className="text-xs text-zinc-600 mt-1">Try resetting the search query or input a new test submission on the site!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  
                  {activeTab === 'transactions' && (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-850 bg-zinc-950/40 text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
                          <th className="p-4">Receipt</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Dispatch</th>
                          <th className="p-4">Subtotal</th>
                          <th className="p-4">Total</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Processed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleLeads.map((tx) => (
                          <tr
                            key={tx.id}
                            onClick={() => { setSelectedRecord(tx); setSelectedRecordType('transaction'); }}
                            className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-all cursor-pointer group"
                          >
                            <td className="p-4 font-mono font-black text-amber-500">{tx.receiptId || tx.id}</td>
                            <td className="p-4 font-bold text-white group-hover:text-amber-500">{tx.customerName}</td>
                            <td className="p-4 text-zinc-400 font-mono">{tx.phone}</td>
                            <td className="p-4 text-zinc-400 capitalize">{tx.dispatchType || 'pickup'}</td>
                            <td className="p-4 font-mono text-zinc-300">${tx.pricing?.subtotal ?? 0}</td>
                            <td className="p-4 font-mono font-bold text-amber-500">${tx.pricing?.total ?? 0}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase border ${
                                tx.status === 'Cancelled' || tx.status === 'Refunded'
                                  ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                  : tx.status === 'Adjusted'
                                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                  : 'bg-green-500/10 border-green-500/20 text-green-500'
                              }`}>
                                {tx.status || 'Completed'}
                              </span>
                            </td>
                            <td className="p-4 text-zinc-400 font-mono">
                              {tx.processedAt?.seconds
                                ? new Date(tx.processedAt.seconds * 1000).toLocaleDateString()
                                : 'Recent'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'b2b' && (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-850 bg-zinc-950/40 text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
                          <th className="p-4">Company Name</th>
                          <th className="p-4">Contact Person</th>
                          <th className="p-4">Trade Specialty</th>
                          <th className="p-4">Monthly Spend</th>
                          <th className="p-4 text-center">Blueprint</th>
                          <th className="p-4">Status Badge</th>
                          <th className="p-4">Submitted At</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleLeads.map((app) => (
                          <tr 
                            key={app.id} 
                            onClick={() => { setSelectedRecord(app); setSelectedRecordType('b2b'); }}
                            className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-all cursor-pointer group"
                          >
                            <td className="p-4 font-bold text-white group-hover:text-amber-500 transition-colors">{app.companyName}</td>
                            <td className="p-4 text-zinc-300">{app.contactName}</td>
                            <td className="p-4 text-zinc-400">{app.trade}</td>
                            <td className="p-4 font-mono text-zinc-300">{app.spendRange}</td>
                            <td className="p-4 text-center">
                              {app.uploadedFiles && app.uploadedFiles.length > 0 ? (
                                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-500 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase">
                                  {app.uploadedFiles.length} file(s)
                                </span>
                              ) : (
                                <span className="text-zinc-600 font-mono">—</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border ${
                                app.status === 'Pending Review' 
                                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' 
                                  : app.status?.includes('Approved') 
                                  ? 'bg-green-500/10 border-green-500/20 text-green-500 animate-pulse'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                              }`}>
                                {app.status || 'Pending'}
                              </span>
                            </td>
                            <td className="p-4 text-zinc-400 font-mono">
                              {app.submittedAt?.seconds 
                                ? new Date(app.submittedAt.seconds * 1000).toLocaleDateString()
                                : 'Recent'}
                            </td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-1 justify-center">
                                <button 
                                  onClick={() => handleUpdateStatus('b2b_applications', app.id, 'Approved Credit & Net-30')}
                                  className="px-2 py-1 bg-green-900/20 hover:bg-green-500 hover:text-black border border-green-500/30 text-green-500 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                                  title="Quick Approve Net-30 Commercial Credit"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleDeleteRecord('b2b_applications', app.id)}
                                  className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all cursor-pointer"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* --- TAB: FLEET BOOKINGS --- */}
                  {activeTab === 'bookings' && (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-850 bg-zinc-950/40 text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
                          <th className="p-4">Customer</th>
                          <th className="p-4">Reserved Asset</th>
                          <th className="p-4">Pillar</th>
                          <th className="p-4">Date Locked</th>
                          <th className="p-4">Timeslot</th>
                          <th className="p-4">Rate</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleLeads.map((bk) => (
                          <tr 
                            key={bk.id} 
                            onClick={() => { setSelectedRecord(bk); setSelectedRecordType('booking'); }}
                            className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-all cursor-pointer group"
                          >
                            <td className="p-4 font-bold text-white group-hover:text-amber-500 transition-colors">
                              <div>{bk.customerInfo?.name}</div>
                              <div className="text-[10px] text-zinc-500 font-mono font-light mt-0.5">{bk.customerInfo?.phone}</div>
                            </td>
                            <td className="p-4 text-zinc-300 font-header uppercase tracking-wide font-medium">{bk.selectedToolName || 'Standard Tool Fleet'}</td>
                            <td className="p-4 text-zinc-400 font-mono text-[11px]">{bk.selectedCategory}</td>
                            <td className="p-4 font-bold text-zinc-300">{bk.selectedDate}</td>
                            <td className="p-4 font-mono text-zinc-400">{bk.selectedTimeSlot}</td>
                            <td className="p-4 font-mono font-bold text-amber-500">${bk.price}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase border ${
                                bk.status === 'Reserved' 
                                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                                  : bk.status?.includes('Dispatched')
                                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                  : 'bg-green-500/10 border-green-500/20 text-green-500'
                              }`}>
                                {bk.status}
                              </span>
                            </td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-1 justify-center">
                                <button 
                                  onClick={() => handleUpdateStatus('bookings', bk.id, 'Dispatched / Picked Up')}
                                  className="px-2 py-1 bg-blue-900/20 hover:bg-blue-500 hover:text-black border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                                >
                                  Dispatch
                                </button>
                                {bk.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => handleCancelBooking(bk.id)}
                                    className="px-2 py-1 bg-red-900/20 hover:bg-red-500 hover:text-black border border-red-500/30 text-red-400 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteRecord('bookings', bk.id)}
                                  className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* --- TAB: SPECIALTY SERVICES --- */}
                  {activeTab === 'services' && (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-850 bg-zinc-950/40 text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
                          <th className="p-4">Representative</th>
                          <th className="p-4">Firm Name</th>
                          <th className="p-4">Target Specialty</th>
                          <th className="p-4">Contact Coord</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date Recv</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleLeads.map((sv) => (
                          <tr 
                            key={sv.id} 
                            onClick={() => { setSelectedRecord(sv); setSelectedRecordType('service'); }}
                            className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-all cursor-pointer group"
                          >
                            <td className="p-4 font-bold text-white group-hover:text-amber-500 transition-colors">{sv.name}</td>
                            <td className="p-4 text-zinc-300 font-semibold">{sv.company || 'Private Landowner'}</td>
                            <td className="p-4 text-zinc-400">{sv.serviceType}</td>
                            <td className="p-4 text-zinc-400 font-mono">
                              <div>{sv.email}</div>
                              <div className="mt-0.5 text-zinc-500 font-light">{sv.phone}</div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase border ${
                                sv.status === 'New Request' 
                                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' 
                                  : 'bg-green-500/10 border-green-500/20 text-green-500'
                              }`}>
                                {sv.status || 'New'}
                              </span>
                            </td>
                            <td className="p-4 text-zinc-400 font-mono">
                              {sv.submittedAt?.seconds 
                                ? new Date(sv.submittedAt.seconds * 1000).toLocaleDateString()
                                : 'Recent'}
                            </td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-1 justify-center">
                                <button 
                                  onClick={() => handleUpdateStatus('service_requests', sv.id, 'Quote Sent & Bidded')}
                                  className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/30 text-amber-500 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                                >
                                  Send Bid
                                </button>
                                <button 
                                  onClick={() => handleDeleteRecord('service_requests', sv.id)}
                                  className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* --- TAB: WORKSHOP REPAIRS --- */}
                  {activeTab === 'repairs' && (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-850 bg-zinc-950/40 text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
                          <th className="p-4">Ticket ID</th>
                          <th className="p-4">Owner</th>
                          <th className="p-4">Tool Model</th>
                          <th className="p-4">Brand</th>
                          <th className="p-4">Bench Tech</th>
                          <th className="p-4">Cost/Deposit</th>
                          <th className="p-4">Diagnostics / Bench Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleLeads.map((rp) => (
                          <tr 
                            key={rp.id} 
                            onClick={() => { setSelectedRecord(rp); setSelectedRecordType('repair'); }}
                            className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-all cursor-pointer group"
                          >
                            <td className="p-4 font-mono font-black text-amber-500 group-hover:underline">{rp.ticketId || rp.id}</td>
                            <td className="p-4 font-bold text-white">{rp.name}</td>
                            <td className="p-4 text-zinc-300 font-header uppercase">{rp.modelName || rp.tool}</td>
                            <td className="p-4 text-zinc-400 font-mono font-semibold">{rp.brand}</td>
                            <td className="p-4 text-zinc-400">{rp.tech || 'Shop Queue'}</td>
                            <td className="p-4 text-green-500 font-mono">{rp.cost || '$45.00 Deposit'}</td>
                            <td className="p-4 text-zinc-400 max-w-xs truncate">{rp.diagnostics || rp.status}</td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-1 justify-center">
                                <button 
                                  onClick={() => handleUpdateStatus('repair_tickets', rp.id, 'Completed & Safety Certified')}
                                  className="px-2 py-1 bg-green-900/20 hover:bg-green-500 hover:text-black border border-green-500/30 text-green-500 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                                >
                                  Complete
                                </button>
                                <button 
                                  onClick={() => handleDeleteRecord('repair_tickets', rp.id)}
                                  className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* --- TAB: UNIFIED CRM CONTACTS LIST --- */}
                  {activeTab === 'crm' && (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-850 bg-zinc-950/40 text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
                          <th className="p-4">Customer Name</th>
                          <th className="p-4">Firm Affiliation</th>
                          <th className="p-4">Contact Coord</th>
                          <th className="p-4">Category/Trade</th>
                          <th className="p-4">Active Touchpoints</th>
                          <th className="p-4">Last Active</th>
                          <th className="p-4">Interactive CRM Records</th>
                        </tr>
                      </thead>
                      <tbody>
                        {crmList.map((crm, idx) => (
                          <tr 
                            key={idx} 
                            className="border-b border-zinc-900 hover:bg-zinc-900/20 transition-all"
                          >
                            <td className="p-4 font-black text-white">{crm.name}</td>
                            <td className="p-4 text-zinc-300 font-semibold">{crm.company}</td>
                            <td className="p-4 font-mono text-zinc-400">
                              <div>{crm.email}</div>
                              <div className="mt-0.5 text-zinc-500">{crm.phone}</div>
                            </td>
                            <td className="p-4 text-zinc-400 font-mono">{crm.trade}</td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {crm.sources.map((src, i) => (
                                  <span key={i} className={`px-2 py-0.5 font-mono text-[8px] font-bold uppercase border ${
                                    src === 'Pro B2B App' 
                                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                                      : src === 'Fleet Booking' 
                                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                                      : src === 'Specialty Quote' 
                                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                      : 'bg-green-500/10 border-green-500/20 text-green-400'
                                  }`}>
                                    {src}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-zinc-500 font-mono">{new Date(crm.lastActivity).toLocaleDateString()}</td>
                            <td className="p-4">
                              <div className="max-w-xs text-[10px] font-sans font-light text-zinc-500 leading-normal line-clamp-2">
                                {crm.notes && crm.notes.length > 0 ? crm.notes.join(' | ') : 'No notes registered.'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <ProPortalRecordDrawer
        record={selectedRecord}
        recordType={selectedRecordType}
        onClose={() => setSelectedRecord(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteRecord}
        onSaveBooking={handleSaveBooking}
        onCancelBooking={handleCancelBooking}
        onSaveTransaction={handleSaveTransaction}
        onCancelTransaction={handleCancelTransaction}
        saving={saving}
      />

      <Footer />
    </div>
  );
};

export default B2BDashboardPage;
