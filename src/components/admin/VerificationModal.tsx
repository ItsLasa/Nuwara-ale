import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, AlertCircle, Receipt, ExternalLink, Image as ImageIcon, Ban, ShieldCheck, Download, Loader2 } from 'lucide-react';
import { BookingRecord } from '../../data/adminData';
import { downloadTicketPdf } from '../../utils/ticketPdfGenerator';

interface VerificationModalProps {
  booking: BookingRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: BookingRecord['status'], adminNotes?: string) => void;
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
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isZoomingSlip, setIsZoomingSlip] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    if (booking) {
      setSelectedStatus(booking.status);
      setAdminNotes(booking.adminNotes || '');
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleDownloadTicketPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      await downloadTicketPdf({
        refNumber: booking.refNumber,
        customerName: booking.customerName,
        nic: booking.nic,
        contactNumber: booking.contactNumber,
        email: booking.email,
        date: booking.date,
        time: booking.time,
        status: selectedStatus || booking.status,
        ticketType: booking.ticketType,
        ticketBreakdown: booking.ticketBreakdown,
        ticketQty: booking.ticketQty,
        totalPrice: booking.totalPrice,
      });
    } catch (err) {
      console.error('Error generating PDF ticket:', err);
      alert('Failed to generate ticket PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleSave = () => {
    onUpdateStatus(booking.id, selectedStatus, adminNotes);
    onClose();
  };

  const handleQuickApprove = () => {
    onUpdateStatus(booking.id, 'Confirmed', adminNotes || 'Verified via bank transfer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1C]/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#071A3D] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1326]/60">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white font-heading">
                Verify Booking #{booking.refNumber}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review customer payment slip, verify transaction, and issue status
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Customer & Booking Details */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B1326]/70 border border-slate-800 text-sm">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Customer Details</span>
              <p className="font-bold text-white mt-1 text-base">{booking.customerName}</p>
              {booking.nic && (
                <p className="text-xs text-slate-300 font-mono mt-0.5">NIC: {booking.nic}</p>
              )}
              <p className="text-xs text-slate-400 mt-0.5">{booking.email || 'No email provided'}</p>
              <p className="text-xs text-slate-300 font-mono mt-0.5">Phone: {booking.contactNumber}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Package & Pricing</span>
              <p className="font-semibold text-white mt-1">{booking.ticketType}</p>
              <p className="text-xs text-slate-400">Total: {booking.ticketQty} Ticket(s)</p>
              {booking.ticketBreakdown && (
                <div className="text-[11px] text-slate-400 space-x-2 mt-0.5">
                  {booking.ticketBreakdown.vip > 0 && <span>VIP: {booking.ticketBreakdown.vip}</span>}
                  {booking.ticketBreakdown.general > 0 && <span>Gen: {booking.ticketBreakdown.general}</span>}
                  {booking.ticketBreakdown.earlybird > 0 && <span>EB: {booking.ticketBreakdown.earlybird}</span>}
                </div>
              )}
              <p className="text-base font-extrabold text-[#D4AF37] mt-1">Rs. {booking.totalPrice.toLocaleString()}</p>
              <span className="text-[11px] text-slate-400 block mt-1">Submitted: {booking.date} at {booking.time}</span>
            </div>
          </div>

          {/* Payment Proof Slip preview */}
          <div>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Payment Transfer Slip
            </span>

            {booking.slipUrl ? (
              <div className="border border-slate-700/80 rounded-xl p-4 bg-[#0B1326]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{booking.slipName || `Payment_Slip_${booking.refNumber}.jpg`}</p>
                      <p className="text-xs text-emerald-400">Payment receipt image attached by customer</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-lg flex items-center gap-1.5 transition-all bg-indigo-500/10"
                    onClick={() => setIsZoomingSlip(!isZoomingSlip)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isZoomingSlip ? 'Hide Preview' : 'Expand Slip'}</span>
                  </button>
                </div>

                {/* Slip image container */}
                <div className="mt-2 bg-black/40 rounded-xl p-2 border border-slate-800 flex justify-center">
                  <img
                    src={booking.slipUrl}
                    alt="Payment Slip Proof"
                    className={`rounded-lg object-contain transition-all ${
                      isZoomingSlip ? 'max-h-[380px] w-auto' : 'max-h-48 w-auto cursor-pointer hover:opacity-90'
                    }`}
                    onClick={() => setIsZoomingSlip(!isZoomingSlip)}
                  />
                </div>
              </div>
            ) : (
              <div className="border border-slate-800 rounded-xl p-4 bg-[#0B1326]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-700/40 flex items-center justify-center text-indigo-400">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {booking.slipName || `Pan_Asia_Bank_Transfer_${booking.refNumber}.pdf`}
                    </p>
                    <p className="text-xs text-slate-400">Bank Transfer Slip ({booking.date} at {booking.time})</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-lg flex items-center gap-1 transition-all"
                  onClick={() => alert(`Reviewing simulated bank transfer record for ${booking.refNumber}`)}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verify Record</span>
                </button>
              </div>
            )}
          </div>

          {/* Status Selection (Figma #82:10564) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              SELECT VERIFICATION STATUS
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Confirmed / Verified */}
              <label 
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedStatus === 'Confirmed'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm ring-1 ring-emerald-500'
                    : 'bg-[#0B1326]/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="statusOption"
                    checked={selectedStatus === 'Confirmed'}
                    onChange={() => setSelectedStatus('Confirmed')}
                    className="accent-emerald-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Confirmed
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  Approved
                </span>
              </label>

              {/* Pending verification */}
              <label 
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedStatus === 'Pending verification'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm ring-1 ring-amber-500'
                    : 'bg-[#0B1326]/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="statusOption"
                    checked={selectedStatus === 'Pending verification'}
                    onChange={() => setSelectedStatus('Pending verification')}
                    className="accent-amber-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Pending Verif.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                  Reviewing
                </span>
              </label>

              {/* Paid */}
              <label 
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedStatus === 'Paid'
                    ? 'bg-blue-500/15 border-blue-500 text-blue-300 shadow-sm ring-1 ring-blue-500'
                    : 'bg-[#0B1326]/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="statusOption"
                    checked={selectedStatus === 'Paid'}
                    onChange={() => setSelectedStatus('Paid')}
                    className="accent-blue-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Paid
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                  Received
                </span>
              </label>

              {/* Rejected */}
              <label 
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedStatus === 'Rejected'
                    ? 'bg-rose-500/15 border-rose-500 text-rose-300 shadow-sm ring-1 ring-rose-500'
                    : 'bg-[#0B1326]/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="statusOption"
                    checked={selectedStatus === 'Rejected'}
                    onChange={() => setSelectedStatus('Rejected')}
                    className="accent-rose-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <Ban className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Rejected
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
                  Declined
                </span>
              </label>
            </div>
          </div>

          {/* Admin Verification Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              ADMIN VERIFICATION NOTES (INTERNAL)
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Verified Pan Asia Bank reference #90214 against bank statement..."
              className="w-full px-3.5 py-2.5 bg-[#0B1326]/90 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#0B1326]/80 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickApprove}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Quick Approve</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTicketPdf}
              disabled={isDownloadingPdf}
              className="px-3.5 py-2 bg-[#071A3D] hover:bg-[#121258] text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 disabled:opacity-75"
              title="Download official PDF ticket for this booking"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              )}
              <span>{isDownloadingPdf ? 'Generating...' : 'Download PDF Ticket'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
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
              className="px-5 py-2 bg-white hover:bg-slate-100 text-[#071A3D] text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

