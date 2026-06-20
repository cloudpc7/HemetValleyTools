import React, { useEffect, useState } from 'react';
import {
  Building, Calendar, Wrench, FileText, DollarSign, X, Trash2, Save, Ban
} from 'lucide-react';

const ProPortalRecordDrawer = ({
  record,
  recordType,
  onClose,
  onUpdateStatus,
  onDelete,
  onSaveBooking,
  onCancelBooking,
  onSaveTransaction,
  onCancelTransaction,
  saving,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState({});
  const [adjustReason, setAdjustReason] = useState('');

  useEffect(() => {
    setEditMode(false);
    setAdjustReason('');
    if (!record) {
      setDraft({});
      return;
    }
    if (recordType === 'booking') {
      setDraft({
        selectedDate: record.selectedDate || '',
        selectedTimeSlot: record.selectedTimeSlot || '',
        price: record.price ?? 0,
        status: record.status || 'Reserved',
        adminNotes: record.adminNotes || '',
        customerName: record.customerInfo?.name || '',
        customerPhone: record.customerInfo?.phone || '',
        customerEmail: record.customerInfo?.email || '',
        projectNote: record.customerInfo?.projectNote || '',
      });
    } else if (recordType === 'transaction') {
      setDraft({
        discount: record.pricing?.discount ?? 0,
        deliveryFee: record.pricing?.deliveryFee ?? 0,
        tax: record.pricing?.tax ?? 0,
        adminNotes: record.adminNotes || '',
        notes: record.notes || '',
        dispatchType: record.dispatchType || 'pickup',
        deliveryAddress: record.deliveryAddress || '',
        purchases: JSON.stringify(record.purchases || [], null, 2),
        rentals: JSON.stringify(record.rentals || [], null, 2),
      });
    }
  }, [record, recordType]);

  if (!record) return null;

  const title =
    recordType === 'b2b' ? record.companyName
    : recordType === 'booking' ? record.customerInfo?.name
    : recordType === 'transaction' ? (record.receiptId || record.customerName)
    : recordType === 'service' ? (record.company || 'Specialist Bid')
    : record.name;

  const handleSaveBooking = () => {
    onSaveBooking(record.id, {
      selectedDate: draft.selectedDate,
      selectedTimeSlot: draft.selectedTimeSlot,
      price: Number(draft.price),
      status: draft.status,
      adminNotes: draft.adminNotes,
      customerInfo: {
        name: draft.customerName,
        phone: draft.customerPhone,
        email: draft.customerEmail,
        projectNote: draft.projectNote,
      },
    });
    setEditMode(false);
  };

  const handleSaveTransaction = () => {
    let purchases = record.purchases || [];
    let rentals = record.rentals || [];
    try {
      if (draft.purchases) purchases = JSON.parse(draft.purchases);
      if (draft.rentals) rentals = JSON.parse(draft.rentals);
    } catch {
      alert('Invalid JSON in line items. Fix purchases/rentals JSON before saving.');
      return;
    }
    onSaveTransaction(record.id, {
      purchases,
      rentals,
      pricing: {
        discount: Number(draft.discount) || 0,
        deliveryFee: Number(draft.deliveryFee) || 0,
        tax: Number(draft.tax) || 0,
      },
      adminNotes: draft.adminNotes,
      notes: draft.notes,
      dispatchType: draft.dispatchType,
      deliveryAddress: draft.deliveryAddress,
    }, adjustReason || 'Staff pricing adjustment');
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end animate-fadeIn" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-[#0F0F0F] border-l border-zinc-800 h-full p-8 flex flex-col justify-between overflow-y-auto text-left shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[10px] font-mono font-bold uppercase text-amber-500">
              {recordType === 'b2b' && <Building className="w-3.5 h-3.5" />}
              {recordType === 'booking' && <Calendar className="w-3.5 h-3.5" />}
              {recordType === 'transaction' && <DollarSign className="w-3.5 h-3.5" />}
              {recordType === 'service' && <FileText className="w-3.5 h-3.5" />}
              {recordType === 'repair' && <Wrench className="w-3.5 h-3.5" />}
              {recordType === 'b2b' && 'B2B Contractor Application'}
              {recordType === 'booking' && 'Fleet Booking'}
              {recordType === 'transaction' && 'Customer Transaction'}
              {recordType === 'service' && 'Specialty Quote'}
              {recordType === 'repair' && 'Workshop Repair'}
            </span>
            <h3 className="text-2xl font-black font-header uppercase text-white tracking-wide mt-2">{title}</h3>
            {recordType === 'transaction' && (
              <p className="text-xs font-mono text-zinc-500">Receipt: {record.receiptId || record.id}</p>
            )}
          </div>

          {(recordType === 'booking' || recordType === 'transaction') && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-[10px] font-mono uppercase tracking-widest text-amber-500 border border-amber-500/30 px-3 py-1.5 hover:bg-amber-500 hover:text-black transition-all"
            >
              {editMode ? 'Cancel Edit' : 'Edit Pricing / Schedule'}
            </button>
          )}

          {recordType === 'transaction' && !editMode && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-zinc-500 font-mono uppercase text-[10px] block">Customer</span><span className="text-white">{record.customerName}</span></div>
              <div><span className="text-zinc-500 font-mono uppercase text-[10px] block">Phone</span><span className="text-white font-mono">{record.phone}</span></div>
              <div><span className="text-zinc-500 font-mono uppercase text-[10px] block">Subtotal</span><span className="text-amber-500 font-mono">${record.pricing?.subtotal ?? 0}</span></div>
              <div><span className="text-zinc-500 font-mono uppercase text-[10px] block">Total</span><span className="text-amber-500 font-mono font-bold">${record.pricing?.total ?? 0}</span></div>
              <div><span className="text-zinc-500 font-mono uppercase text-[10px] block">Status</span><span className="text-white">{record.status}</span></div>
              <div><span className="text-zinc-500 font-mono uppercase text-[10px] block">Dispatch</span><span className="text-white capitalize">{record.dispatchType}</span></div>
            </div>
          )}

          {recordType === 'booking' && editMode && (
            <div className="space-y-3 border border-zinc-800 p-4 bg-zinc-950/50">
              <input value={draft.selectedDate} onChange={(e) => setDraft({ ...draft, selectedDate: e.target.value })} placeholder="Date" className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white" />
              <input value={draft.selectedTimeSlot} onChange={(e) => setDraft({ ...draft, selectedTimeSlot: e.target.value })} placeholder="Time slot" className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white" />
              <input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="Price" className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white" />
              <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white">
                <option value="Reserved">Reserved</option>
                <option value="Dispatched / Picked Up">Dispatched / Picked Up</option>
                <option value="Completed Rental">Completed Rental</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <input value={draft.customerName} onChange={(e) => setDraft({ ...draft, customerName: e.target.value })} placeholder="Customer name" className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white" />
              <input value={draft.customerPhone} onChange={(e) => setDraft({ ...draft, customerPhone: e.target.value })} placeholder="Phone" className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white" />
              <textarea value={draft.adminNotes} onChange={(e) => setDraft({ ...draft, adminNotes: e.target.value })} placeholder="Staff notes" rows={2} className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white" />
              <button disabled={saving} onClick={handleSaveBooking} className="w-full bg-amber-500 text-black font-mono text-xs font-bold uppercase py-2 flex items-center justify-center gap-2">
                <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Booking'}
              </button>
            </div>
          )}

          {recordType === 'transaction' && editMode && (
            <div className="space-y-3 border border-zinc-800 p-4 bg-zinc-950/50">
              <input type="number" value={draft.discount} onChange={(e) => setDraft({ ...draft, discount: e.target.value })} placeholder="Discount" className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white" />
              <input type="number" value={draft.deliveryFee} onChange={(e) => setDraft({ ...draft, deliveryFee: e.target.value })} placeholder="Delivery fee" className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white" />
              <input type="number" value={draft.tax} onChange={(e) => setDraft({ ...draft, tax: e.target.value })} placeholder="Tax" className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white" />
              <textarea value={draft.purchases} onChange={(e) => setDraft({ ...draft, purchases: e.target.value })} rows={4} className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-[10px] font-mono text-white" />
              <textarea value={draft.rentals} onChange={(e) => setDraft({ ...draft, rentals: e.target.value })} rows={3} className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-[10px] font-mono text-white" />
              <input value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} placeholder="Adjustment reason" className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white" />
              <textarea value={draft.adminNotes} onChange={(e) => setDraft({ ...draft, adminNotes: e.target.value })} placeholder="Staff notes" rows={2} className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white" />
              <button disabled={saving} onClick={handleSaveTransaction} className="w-full bg-amber-500 text-black font-mono text-xs font-bold uppercase py-2 flex items-center justify-center gap-2">
                <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Transaction'}
              </button>
            </div>
          )}

          {recordType === 'transaction' && Array.isArray(record.adjustments) && record.adjustments.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-2">Adjustment History</span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {record.adjustments.map((adj, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-900 p-2 text-[10px] text-zinc-400">
                    <span className="text-amber-500 font-mono">{adj.by}</span> — {adj.reason}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!editMode && recordType !== 'transaction' && (
            <div className="bg-zinc-950 border border-zinc-850 p-4 text-xs text-zinc-300 whitespace-pre-wrap">
              {recordType === 'booking'
                ? `${record.selectedToolName} on ${record.selectedDate} (${record.selectedTimeSlot}) — $${record.price}`
                : record.notes || record.details || record.diagnostics || 'No notes.'}
            </div>
          )}
        </div>

        <div className="border-t border-zinc-900 pt-6 mt-6 space-y-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Actions</span>
          <div className="flex flex-wrap gap-2">
            {recordType === 'b2b' && (
              <>
                <button onClick={() => onUpdateStatus('b2b_applications', record.id, 'Approved Credit & Net-30')} className="px-3 py-2 text-xs font-mono border border-green-500/30 text-green-500">Approve</button>
                <button onClick={() => onUpdateStatus('b2b_applications', record.id, 'Declined')} className="px-3 py-2 text-xs font-mono border border-red-500/30 text-red-500">Decline</button>
              </>
            )}
            {recordType === 'booking' && !editMode && (
              <>
                <button onClick={() => onUpdateStatus('bookings', record.id, 'Reserved')} className="px-3 py-2 text-xs font-mono border border-amber-500/30 text-amber-500">Reserve</button>
                <button onClick={() => onUpdateStatus('bookings', record.id, 'Dispatched / Picked Up')} className="px-3 py-2 text-xs font-mono border border-blue-500/30 text-blue-400">Dispatch</button>
                <button onClick={() => onCancelBooking(record.id)} className="px-3 py-2 text-xs font-mono border border-red-500/30 text-red-500 flex items-center gap-1"><Ban className="w-3 h-3" /> Cancel</button>
              </>
            )}
            {recordType === 'transaction' && !editMode && (
              <>
                <button onClick={() => onCancelTransaction(record.id, 'Refunded', true)} className="px-3 py-2 text-xs font-mono border border-yellow-500/30 text-yellow-500">Refund</button>
                <button onClick={() => onCancelTransaction(record.id, 'Cancelled', true)} className="px-3 py-2 text-xs font-mono border border-red-500/30 text-red-500 flex items-center gap-1"><Ban className="w-3 h-3" /> Cancel</button>
              </>
            )}
            {recordType === 'service' && (
              <button onClick={() => onUpdateStatus('service_requests', record.id, 'Quote Sent & Bidded')} className="px-3 py-2 text-xs font-mono border border-amber-500/30 text-amber-500">Send Bid</button>
            )}
            {recordType === 'repair' && (
              <button onClick={() => onUpdateStatus('repair_tickets', record.id, 'Completed & Safety Certified')} className="px-3 py-2 text-xs font-mono border border-green-500/30 text-green-500">Complete</button>
            )}
          </div>
          <button
            onClick={() => {
              const map = { b2b: 'b2b_applications', booking: 'bookings', transaction: 'transactions', service: 'service_requests', repair: 'repair_tickets' };
              onDelete(map[recordType], record.id);
            }}
            className="px-4 py-2 border border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white text-xs font-mono font-bold uppercase flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProPortalRecordDrawer;