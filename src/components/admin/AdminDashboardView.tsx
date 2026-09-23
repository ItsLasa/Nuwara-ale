import React from 'react';
import { DollarSign, Ticket, Users, CheckCircle2, Clock, Eye, ShieldCheck, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { BookingRecord } from '../../data/adminData';

interface AdminDashboardViewProps {
  bookings: BookingRecord[];
  stats: {
    totalRevenue: number;
    totalTickets: number;
    totalCustomers: number;
    confirmedBookings: number;
    pendingBookings: number;
    paidBookings: number;
  };
  onViewAllBookings: () => void;
  onOpenBookingDetails: (b: BookingRecord) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  bookings,
  stats,
  onViewAllBookings,
  onOpenBookingDetails,
}) => {
  return (
    <div className="space-y-8">
      {/* Page Header matching Figma EL-ef498331 */}
      <div>
        <h1 className="font-playfair font-bold text-3xl text-[#f3f3f3] mb-1">
          Overview
        </h1>
        <p className="font-hanken text-sm text-[#46C7C20D] text-gray-400">
          Welcome back. Here is the operational summary for today.
        </p>
      </div>

      {/* Stats Bento Grid matching Figma #58:4193 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue (Spans 2 cols on lg) matching Figma #58:4246 */}
        <div className="sm:col-span-2 bg-[#071A3D] text-white p-7 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="font-jakarta font-bold text-xs uppercase tracking-wider text-amber-300/90">
              TOTAL REVENUE (VERIFIED & CONFIRMED)
            </span>
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-playfair font-bold text-4xl sm:text-5xl text-white tracking-tight">
              Rs. {stats.totalRevenue.toLocaleString()}
            </span>
            <span className="font-hanken text-xs text-gray-300 block mt-2">
              Verified collections across VIP, General, and Earlybird packages
            </span>
          </div>
        </div>

        {/* Total Tickets matching Figma #58:4194 */}
        <div className="bg-[#071A3D] text-white p-7 rounded-2xl shadow-md flex flex-col justify-between border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-jakarta font-semibold text-xs text-gray-300">
              Total Tickets
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-200">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-jakarta font-bold text-3xl sm:text-4xl text-white">
              {stats.totalTickets.toLocaleString()}
            </span>
            <span className="font-hanken text-xs text-gray-400 block mt-1">
              Confirmed tickets issued
            </span>
          </div>
        </div>

        {/* Total Customers matching Figma #58:4207 */}
        <div className="bg-[#071A3D] text-white p-7 rounded-2xl shadow-md flex flex-col justify-between border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-jakarta font-semibold text-xs text-gray-300">
              Total Customers
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-purple-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-jakarta font-bold text-3xl sm:text-4xl text-white">
              {stats.totalCustomers.toLocaleString()}
            </span>
            <span className="font-hanken text-xs text-gray-400 block mt-1">
              Registered ticket buyers
            </span>
          </div>
        </div>
      </div>

      {/* Sub Stats Row matching Figma #58:4219 & #58:4228 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="font-hanken text-xs text-gray-500 uppercase block mb-1">
              Confirmed Bookings
            </span>
            <span className="font-jakarta font-bold text-2xl text-[#071A3D]">
              {stats.confirmedBookings}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="font-hanken text-xs text-gray-500 uppercase block mb-1">
              Pending Verification
            </span>
            <span className="font-jakarta font-bold text-2xl text-amber-600">
              {stats.pendingBookings}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Bookings Table matching Figma #59:5284 */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-playfair font-bold text-xl text-[#071A3D]">
              Recent Bookings
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Live incoming registrations submitted via public booking form
            </p>
          </div>
          <button
            onClick={onViewAllBookings}
            className="font-jakarta font-semibold text-sm text-[#071A3D] hover:text-[#121258] hover:underline"
          >
            View All Bookings →
          </button>
        </div>

        <div className="overflow-x-auto">
          {bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-400 font-hanken text-sm">
              No bookings recorded yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-jakarta font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-6">Reference num</th>
                  <th className="py-3.5 px-6">Customer Name</th>
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-center">Ticket Qty</th>
                  <th className="py-3.5 px-6">Contact Number</th>
                  <th className="py-3.5 px-6 text-right">Total Price</th>
                  <th className="py-3.5 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-hanken text-sm text-gray-700">
                {bookings.slice(0, 6).map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 font-jakarta font-bold text-xs text-[#071A3D]">
                      <div className="flex items-center gap-1.5">
                        <span>{b.refNumber}</span>
                        {b.slipUrl && (
                          <span title="Bank Slip Attached" className="p-0.5 text-emerald-600 bg-emerald-50 rounded">
                            <ImageIcon className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {b.createdAt && Date.now() - new Date(b.createdAt).getTime() < 300000 && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400 text-amber-950 font-extrabold text-[9px] uppercase tracking-wider animate-bounce">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900 block">{b.customerName}</span>
                      <span className="text-xs text-gray-400">{b.ticketType}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500">
                      <div>{b.date}</div>
                      <div className="text-[11px] text-gray-400">{b.time}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : b.status === 'Pending verification'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : b.status === 'Paid'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {b.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {b.status === 'Pending verification' && <Clock className="w-3 h-3 text-amber-600" />}
                        {b.status === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {b.status === 'Paid' && <AlertCircle className="w-3 h-3 text-blue-600" />}
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-gray-800">
                      {b.ticketQty}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-600 font-mono">
                      {b.contactNumber}
                    </td>
                    <td className="py-4 px-6 text-right font-jakarta font-bold text-[#071A3D]">
                      Rs. {b.totalPrice.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenBookingDetails(b)}
                          title="View Details"
                          className="px-2 py-1 rounded-lg hover:bg-gray-100 text-[#071A3D] text-xs font-semibold border border-gray-200 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => onOpenBookingDetails(b)}
                          title="Verify Status"
                          className="px-2 py-1 rounded-lg bg-[#071A3D] hover:bg-[#121258] text-white text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Verify</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
