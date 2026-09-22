import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, AlertCircle, Receipt, ExternalLink } from 'lucide-react';
import { BookingRecord } from '../../data/adminData';

interface VerificationModalProps {
  booking: BookingRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: BookingRecord['status']) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  booking,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<BookingRecord['status']>(
    booking ? booking.status : 'Pending verification'
  );

  useEffect(() => {
    if (booking) {
      setSelectedStatus(booking.status);
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSave = () => {
    onUpdateStatus(booking.id, selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1C]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#071A3D] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1326]/50">
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              Verify Booking #{booking.refNumber}
            </h3>
            <p className="text-xs text-slate-400">
              Review payment proof and update verification status
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Customer & Booking Details */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B1326]/60 border border-slate-800 text-sm">
            <div>
              <span className="text-xs text-slate-400">Customer Name</span>
              <p className="font-semibold text-white mt-0.5">{booking.customerName}</p>
              <p className="text-xs text-slate-400">{booking.email}</p>
              <p className="text-xs text-slate-400">{booking.contactNumber}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Package & Tickets</span>
              <p className="font-semibold text-white mt-0.5">{booking.ticketType}</p>
              <p className="text-xs text-slate-400">{booking.ticketQty} Ticket(s)</p>
              <p className="text-sm font-bold text-amber-400 mt-1">Rs. {booking.totalPrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Payment Proof Slip preview */}
          <div>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Payment Transfer Slip
            </span>
            <div className="border border-slate-800 rounded-xl p-4 bg-[#0B1326]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-700/40 flex items-center justify-center text-indigo-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Commercial_Bank_Transfer_{booking.refNumber}.pdf</p>
                  <p className="text-xs text-slate-400">Bank Transfer Slip ({booking.date} at {booking.time})</p>
                </div>
              </div>
              <button 
                type="button"
                className="px-3 py-1.5 text-xs text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-lg flex items-center gap-1 transition-all"
                onClick={() => alert(`Opening payment slip for ${booking.refNumber}`)}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Slip</span>
              </button>
            </div>
          </div>

          {/* Status Selection (Figma #82:10564) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              SELECT VERIFICATION STATUS
            </label>
            <div className="space-y-2">
              {/* Confirmed / Verified */}
              <label 
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedStatus === 'Confirmed'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : 'bg-[#0B1326]/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="statusOption"
                    checked={selectedStatus === 'Confirmed'}
                    onChange={() => setSelectedStatus('Confirmed')}
                    className="accent-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Confirmed verification
                    </span>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  Approved
                </span>
              </label>

              {/* Pending verification */}
              <label 
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedStatus === 'Pending verification'
                    ? 'bg-[#964C1B]/20 border-[#964C1B]/50 text-amber-300'
                    : 'bg-[#0B1326]/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="statusOption"
                    checked={selectedStatus === 'Pending verification'}
                    onChange={() => setSelectedStatus('Pending verification')}
                    className="accent-amber-500"
                  />
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Pending verification
                    </span>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                  Reviewing
                </span>
              </label>

              {/* Paid */}
              <label 
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedStatus === 'Paid'
                    ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                    : 'bg-[#0B1326]/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="statusOption"
                    checked={selectedStatus === 'Paid'}
                    onChange={() => setSelectedStatus('Paid')}
                    className="accent-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Paid
                    </span>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                  Payment Received
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#0B1326]/60 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-white hover:bg-slate-100 text-[#071A3D] text-xs font-bold rounded-xl shadow-md transition-all"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};
