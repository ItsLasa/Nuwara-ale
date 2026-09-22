import React from 'react';
import { DollarSign, Ticket, Users, CheckCircle2, Clock, Eye } from 'lucide-react';
import { ADMIN_STATS, BookingRecord } from '../../data/adminData';

interface AdminDashboardViewProps {
  bookings: BookingRecord[];
  onViewAllBookings: () => void;
  onOpenBookingDetails: (b: BookingRecord) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  bookings,
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
        <div className="sm:col-span-2 bg-[#071A3D] text-white p-7 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-jakarta font-bold text-xs uppercase tracking-wider text-amber-200/80">
              TOTAL REVENUE from event
            </span>
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-playfair font-bold text-4xl sm:text-5xl text-white tracking-tight">
              Rs. {ADMIN_STATS.totalRevenue.toLocaleString()}
            </span>
            <span className="font-hanken text-xs text-gray-300 block mt-2">
              Verified collections across VIP, General, and Earlybird packages
            </span>
          </div>
        </div>

        {/* Total Tickets matching Figma #58:4194 */}
        <div className="bg-[#071A3D] text-white p-7 rounded-2xl shadow-md flex flex-col justify-between">
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
              {ADMIN_STATS.totalTickets.toLocaleString()}
            </span>
            <span className="font-hanken text-xs text-gray-400 block mt-1">
              Confirmed tickets issued
            </span>
          </div>
        </div>

        {/* Total Customers matching Figma #58:4207 */}
        <div className="bg-[#071A3D] text-white p-7 rounded-2xl shadow-md flex flex-col justify-between">
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
              {ADMIN_STATS.totalCustomers.toLocaleString()}
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
              {ADMIN_STATS.confirmedBookings}
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
              {ADMIN_STATS.pendingBookings}
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
          <h3 className="font-playfair font-bold text-xl text-[#071A3D]">
            Recent Bookings
          </h3>
          <button
            onClick={onViewAllBookings}
            className="font-jakarta font-semibold text-sm text-[#071A3D] hover:text-[#121258] hover:underline"
          >
            View All Bookings →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-jakarta font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 px-6">Reference num</th>
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-center">Ticket Qty</th>
                <th className="py-3.5 px-6">Contact Number</th>
                <th className="py-3.5 px-6 text-right">Total Price</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-hanken text-sm text-gray-700">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6 font-jakarta font-bold text-xs text-[#071A3D]">
                    {b.refNumber}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {b.customerName}
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-500">
                    {b.date}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-gray-800">
                    {b.ticketQty}
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-600 font-mono">
                    {b.contactNumber}
                  </td>
                  <td className="py-4 px-6 text-right font-jakarta font-bold text-[#071A3D]">
                    Rs. {b.totalPrice.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => onOpenBookingDetails(b)}
                      title="View Details"
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-[#071A3D] transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
