import React, { useState } from 'react';
import { Search, RotateCcw, ChevronLeft, ChevronRight, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { BookingRecord } from '../../data/adminData';

interface AdminBookingsViewProps {
  bookings: BookingRecord[];
  onOpenBookingDetails: (b: BookingRecord) => void;
  onOpenVerification: (b: BookingRecord) => void;
}

export const AdminBookingsView: React.FC<AdminBookingsViewProps> = ({
  bookings,
  onOpenBookingDetails,
  onOpenVerification,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesPackage = packageFilter === 'all' || b.ticketType.toLowerCase().includes(packageFilter.toLowerCase());
    const matchesSearch =
      !searchTerm ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.refNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactNumber.includes(searchTerm);
    return matchesStatus && matchesPackage && matchesSearch;
  });

  const handleResetFilters = () => {
    setStatusFilter('all');
    setPackageFilter('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair font-bold text-3xl text-[#071A3D] mb-1">
            Booking
          </h1>
          <p className="font-hanken text-sm text-gray-500">
            Manage attendee registrations, verified payments, and ticket issuances.
          </p>
        </div>
      </div>

      {/* Filter Bar matching Figma #59:5649 (EL-9b9ef77b) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter Dropdown */}
          <div className="relative min-w-[160px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-jakarta font-semibold text-gray-800 focus:outline-none focus:border-[#071A3D]"
            >
              <option value="all">Select Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="verification">Pending verification</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>

          {/* Package Filter Dropdown */}
          <div className="relative min-w-[160px]">
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-jakarta font-semibold text-gray-800 focus:outline-none focus:border-[#071A3D]"
            >
              <option value="all">Select Package</option>
              <option value="all">All Packages</option>
              <option value="vip">VIP Tickets</option>
              <option value="general">General Tickets</option>
              <option value="earlybird">Earlybird Tickets</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ID or Customer..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-hanken text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#071A3D]"
            />
          </div>
        </div>

        {/* Reset Filters CTA matching Figma EL-64032cb2 */}
        <button
          onClick={handleResetFilters}
          className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-jakarta font-semibold transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Bookings Table matching Figma #59:5291 */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F7FA] border-b border-gray-200 text-[11px] font-jakarta font-bold uppercase tracking-wider text-gray-500">
                <th className="py-4 px-6">Booking ID</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Ticket Qty</th>
                <th className="py-4 px-6">Contact Number</th>
                <th className="py-4 px-6 text-right">Total Price</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-hanken text-sm text-gray-700">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6 font-jakarta font-bold text-xs text-[#071A3D]">
                    {b.refNumber}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900 block">{b.customerName}</span>
                    <span className="text-xs text-gray-400">{b.ticketType}</span>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-500">
                    {b.date}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {b.status === 'Confirmed' && <CheckCircle className="w-3 h-3" />}
                      {b.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {b.status === 'Pending verification' && <ShieldCheck className="w-3 h-3" />}
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
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onOpenBookingDetails(b)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onOpenVerification(b)}
                        className="px-2.5 py-1 rounded-lg bg-[#071A3D] hover:bg-[#121258] text-xs font-semibold text-white transition-colors"
                      >
                        Verify
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Figma EL-a8471550 */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-hanken text-gray-500">
          <div>
            Showing <strong className="text-gray-900">1</strong> to <strong className="text-gray-900">5</strong> of <strong className="text-gray-900">124</strong> results
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-lg font-jakarta font-bold text-xs flex items-center justify-center ${
                currentPage === 1 ? 'bg-[#071A3D] text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg font-jakarta font-bold text-xs flex items-center justify-center ${
                currentPage === 2 ? 'bg-[#071A3D] text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-lg font-jakarta font-bold text-xs flex items-center justify-center ${
                currentPage === 3 ? 'bg-[#071A3D] text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              3
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
