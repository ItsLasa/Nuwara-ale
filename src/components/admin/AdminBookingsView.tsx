import React, { useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  ShieldCheck,
  Download,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  Ban,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { BookingRecord } from '../../data/adminData';

interface AdminBookingsViewProps {
  bookings: BookingRecord[];
  onOpenBookingDetails: (b: BookingRecord) => void;
  onOpenVerification: (b: BookingRecord) => void;
  onDeleteBooking?: (id: string) => void;
  onAddBooking?: (b: Omit<BookingRecord, 'id' | 'createdAt'>) => BookingRecord;
  externalSearch?: string;
}

export const AdminBookingsView: React.FC<AdminBookingsViewProps> = ({
  bookings,
  onOpenBookingDetails,
  onOpenVerification,
  onDeleteBooking,
  onAddBooking,
  externalSearch = '',
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>(externalSearch);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_desc' | 'price_asc' | 'name'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Manual Booking Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    nic: '',
    phone: '',
    email: '',
    packageId: 'vip',
    qty: 1,
    status: 'Confirmed' as BookingRecord['status'],
    notes: 'Direct Box Office Reservation',
  });

  // Sync externalSearch if provided
  useEffect(() => {
    if (externalSearch) {
      setSearchTerm(externalSearch);
    }
  }, [externalSearch]);

  // Filter & Sort Logic
  const filteredBookings = bookings
    .filter((b) => {
      const matchesStatus =
        statusFilter === 'all' ||
        b.status.toLowerCase().replace(/\s+/g, '') === statusFilter.toLowerCase().replace(/\s+/g, '');
      const matchesPackage =
        packageFilter === 'all' ||
        b.ticketType.toLowerCase().includes(packageFilter.toLowerCase());
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        b.customerName.toLowerCase().includes(query) ||
        b.refNumber.toLowerCase().includes(query) ||
        (b.nic && b.nic.toLowerCase().includes(query)) ||
        (b.email && b.email.toLowerCase().includes(query)) ||
        b.contactNumber.includes(query);
      return matchesStatus && matchesPackage && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price_desc') return b.totalPrice - a.totalPrice;
      if (sortBy === 'price_asc') return a.totalPrice - b.totalPrice;
      if (sortBy === 'name') return a.customerName.localeCompare(b.customerName);
      if (sortBy === 'oldest') return (a.id || '').localeCompare(b.id || '');
      // default newest: if createdAt exists, sort by createdAt desc, else order in list
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, packageFilter, searchTerm, sortBy, pageSize]);

  // Pagination calculation
  const totalResults = filteredBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + pageSize);

  const handleResetFilters = () => {
    setStatusFilter('all');
    setPackageFilter('all');
    setSearchTerm('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      'Reference Number',
      'Customer Name',
      'NIC',
      'Contact Number',
      'Email',
      'Date',
      'Time',
      'Ticket Package',
      'Ticket Qty',
      'Total Price (LKR)',
      'Status',
      'Payment Slip',
      'Admin Notes',
    ];

    const rows = filteredBookings.map((b) => [
      `"${b.refNumber}"`,
      `"${b.customerName}"`,
      `"${b.nic || ''}"`,
      `"${b.contactNumber}"`,
      `"${b.email || ''}"`,
      `"${b.date}"`,
      `"${b.time}"`,
      `"${b.ticketType}"`,
      b.ticketQty,
      b.totalPrice,
      `"${b.status}"`,
      `"${b.slipName || (b.slipUrl ? 'Attached Image' : 'None')}"`,
      `"${b.adminNotes || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `nuwara_ale_event_bookings_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddBooking) return;

    const priceMap: Record<string, number> = {
      vip: 5000,
      general: 3000,
      earlybird: 2000,
    };
    const titleMap: Record<string, string> = {
      vip: 'VIP Tickets',
      general: 'General Tickets',
      earlybird: 'Earlybird Tickets',
    };

    const unitPrice = priceMap[manualForm.packageId] || 5000;
    const totalAmount = unitPrice * manualForm.qty;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    onAddBooking({
      refNumber: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: manualForm.name.trim(),
      nic: manualForm.nic.trim(),
      contactNumber: manualForm.phone.trim(),
      email: manualForm.email.trim(),
      date: formattedDate,
      time: formattedTime,
      status: manualForm.status,
      ticketType: titleMap[manualForm.packageId] || 'VIP Tickets',
      ticketBreakdown: {
        vip: manualForm.packageId === 'vip' ? manualForm.qty : 0,
        general: manualForm.packageId === 'general' ? manualForm.qty : 0,
        earlybird: manualForm.packageId === 'earlybird' ? manualForm.qty : 0,
      },
      ticketQty: manualForm.qty,
      totalPrice: totalAmount,
      adminNotes: manualForm.notes,
    });

    setShowAddModal(false);
    setManualForm({
      name: '',
      nic: '',
      phone: '',
      email: '',
      packageId: 'vip',
      qty: 1,
      status: 'Confirmed',
      notes: 'Direct Box Office Reservation',
    });
  };

  const pendingVerificationCount = bookings.filter((b) => b.status === 'Pending verification').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;

  return (
    <div className="space-y-6">
      {/* Header with Title & Action CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-playfair font-bold text-3xl text-[#071A3D]">
              Bookings Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-jakarta font-bold bg-[#071A3D]/10 text-[#071A3D]">
              {bookings.length} Total Records
            </span>
          </div>
          <p className="font-hanken text-sm text-gray-500 mt-0.5">
            Manage attendee registrations, review uploaded payment slips, and verify gate admissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Export to CSV */}
          <button
            onClick={handleExportCSV}
            title="Download CSV report of current bookings"
            className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-jakarta font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span>Export CSV</span>
          </button>

          {/* Add Manual Booking */}
          {onAddBooking && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#071A3D] hover:bg-[#121258] text-white font-jakarta font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Manual Booking</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-jakarta font-semibold transition-all ${
            statusFilter === 'all'
              ? 'bg-[#071A3D] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          All Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setStatusFilter('verification')}
          className={`px-3 py-1.5 rounded-xl text-xs font-jakarta font-semibold transition-all flex items-center gap-1.5 ${
            statusFilter === 'verification' || statusFilter === 'Pending verification'
              ? 'bg-amber-500 text-white shadow-sm ring-1 ring-amber-500'
              : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100/80'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Verification ({pendingVerificationCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('confirmed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-jakarta font-semibold transition-all flex items-center gap-1.5 ${
            statusFilter === 'confirmed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100/80'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Confirmed ({confirmedCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('paid')}
          className={`px-3 py-1.5 rounded-xl text-xs font-jakarta font-semibold transition-all ${
            statusFilter === 'paid'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100/80'
          }`}
        >
          Paid
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Status Filter Dropdown */}
          <div className="relative min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-jakarta font-semibold text-gray-800 focus:outline-none focus:border-[#071A3D]"
            >
              <option value="all">All Statuses</option>
              <option value="verification">Pending verification</option>
              <option value="confirmed">Confirmed</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Package Filter Dropdown */}
          <div className="relative min-w-[150px]">
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-jakarta font-semibold text-gray-800 focus:outline-none focus:border-[#071A3D]"
            >
              <option value="all">All Packages</option>
              <option value="vip">VIP Tickets</option>
              <option value="general">General Tickets</option>
              <option value="earlybird">Earlybird Tickets</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Ref, Name, NIC, Phone..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-hanken text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#071A3D]"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative min-w-[140px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-jakarta font-semibold text-gray-800 focus:outline-none focus:border-[#071A3D]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="name">Customer Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Reset Filters CTA */}
        <button
          onClick={handleResetFilters}
          className="px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-jakarta font-semibold transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {paginatedBookings.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileSpreadsheet className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-playfair font-bold text-lg text-gray-700">
                No bookings match the selected filters
              </p>
              <p className="font-hanken text-xs text-gray-400">
                Try clearing your search query or changing the status filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F7FA] border-b border-gray-200 text-[11px] font-jakarta font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-4 px-6">Booking ID</th>
                  <th className="py-4 px-6">Customer Name & NIC</th>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Ticket Qty</th>
                  <th className="py-4 px-6">Contact Details</th>
                  <th className="py-4 px-6 text-right">Total Price</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-hanken text-sm text-gray-700">
                {paginatedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Booking ID & Slip Preview Icon */}
                    <td className="py-4 px-6 font-jakarta font-bold text-xs text-[#071A3D]">
                      <div className="flex items-center gap-1.5">
                        <span>{b.refNumber}</span>
                        {b.slipUrl ? (
                          <button
                            onClick={() => onOpenVerification(b)}
                            title="Bank transfer slip attached (click to inspect)"
                            className="p-1 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                          </button>
                        ) : null}
                        {b.createdAt && Date.now() - new Date(b.createdAt).getTime() < 300000 && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 font-extrabold text-[9px] uppercase tracking-wider">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer Name & NIC */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900 block">{b.customerName}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{b.ticketType}</span>
                        {b.nic && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-gray-500">NIC: {b.nic}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-6 text-xs text-gray-500">
                      <div>{b.date}</div>
                      <div className="text-[11px] text-gray-400">{b.time}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.status === 'Pending verification'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : b.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : b.status === 'Paid'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {b.status === 'Confirmed' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                        {b.status === 'Pending verification' && <Clock className="w-3 h-3 text-amber-600" />}
                        {b.status === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {b.status === 'Paid' && <AlertCircle className="w-3 h-3 text-blue-600" />}
                        {b.status === 'Rejected' && <Ban className="w-3 h-3 text-rose-600" />}
                        {b.status}
                      </span>
                    </td>

                    {/* Ticket Qty */}
                    <td className="py-4 px-6 text-center font-bold text-gray-800">
                      <div>{b.ticketQty}</div>
                      {b.ticketBreakdown && (
                        <div className="text-[10px] text-gray-400 font-normal">
                          {b.ticketBreakdown.vip > 0 ? `VIP:${b.ticketBreakdown.vip} ` : ''}
                          {b.ticketBreakdown.general > 0 ? `GEN:${b.ticketBreakdown.general} ` : ''}
                          {b.ticketBreakdown.earlybird > 0 ? `EB:${b.ticketBreakdown.earlybird}` : ''}
                        </div>
                      )}
                    </td>

                    {/* Contact Details */}
                    <td className="py-4 px-6 text-xs text-gray-600">
                      <div className="font-mono font-medium text-gray-800">{b.contactNumber}</div>
                      {b.email && <div className="text-gray-400 truncate max-w-[150px]">{b.email}</div>}
                    </td>

                    {/* Total Price */}
                    <td className="py-4 px-6 text-right font-jakarta font-bold text-[#071A3D]">
                      Rs. {b.totalPrice.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenBookingDetails(b)}
                          title="View Details"
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onOpenVerification(b)}
                          title="Verify Slip & Update Status"
                          className="px-2.5 py-1 rounded-lg bg-[#071A3D] hover:bg-[#121258] text-xs font-semibold text-white transition-colors flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3 h-3 text-amber-400" />
                          <span>Verify</span>
                        </button>
                        {onDeleteBooking && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete booking #${b.refNumber} for ${b.customerName}?`)) {
                                onDeleteBooking(b.id);
                              }
                            }}
                            title="Delete Booking Record"
                            className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Dynamic Pagination Controls */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-hanken text-gray-500">
          <div className="flex items-center gap-2">
            <span>
              Showing{' '}
              <strong className="text-gray-900">
                {totalResults > 0 ? startIndex + 1 : 0}
              </strong>{' '}
              to{' '}
              <strong className="text-gray-900">
                {Math.min(startIndex + pageSize, totalResults)}
              </strong>{' '}
              of <strong className="text-gray-900">{totalResults}</strong> records
            </span>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-700 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first, last, and current +/- 1
                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
              })
              .map((page, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && page - prev > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span className="px-1 text-gray-400">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[28px] h-7 px-2 rounded-lg font-jakarta font-bold text-xs flex items-center justify-center transition-colors ${
                        currentPage === page
                          ? 'bg-[#071A3D] text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalResults === 0}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Add Booking Modal for Admin Box Office */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-playfair font-bold text-xl text-[#071A3D]">
                  New Manual Booking
                </h3>
                <p className="text-xs text-gray-500">
                  Record walk-in ticket purchases or hotline telephone reservations
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ruwan Jayasuriya"
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#071A3D]"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    NIC / Passport *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 199320501234"
                    value={manualForm.nic}
                    onChange={(e) => setManualForm({ ...manualForm, nic: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#071A3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0771234567"
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#071A3D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="customer@email.com"
                    value={manualForm.email}
                    onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#071A3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Package Tier *
                  </label>
                  <select
                    value={manualForm.packageId}
                    onChange={(e) => setManualForm({ ...manualForm, packageId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#071A3D]"
                  >
                    <option value="vip">VIP Tickets (5,000 LKR)</option>
                    <option value="general">General Tickets (3,000 LKR)</option>
                    <option value="earlybird">Earlybird Tickets (2,000 LKR)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Ticket Quantity *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={manualForm.qty}
                    onChange={(e) => setManualForm({ ...manualForm, qty: Math.max(1, Number(e.target.value)) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#071A3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Initial Status
                  </label>
                  <select
                    value={manualForm.status}
                    onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#071A3D]"
                  >
                    <option value="Confirmed">Confirmed (Paid)</option>
                    <option value="Paid">Paid (Pending Ticket)</option>
                    <option value="Pending verification">Pending verification</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Admin / Staff Notes
                  </label>
                  <input
                    type="text"
                    value={manualForm.notes}
                    onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#071A3D]"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Estimated Total Price:</span>
                <span className="font-bold text-sm text-[#071A3D]">
                  Rs.{' '}
                  {(
                    (manualForm.packageId === 'vip' ? 5000 : manualForm.packageId === 'general' ? 3000 : 2000) *
                    manualForm.qty
                  ).toLocaleString()}{' '}
                  LKR
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#071A3D] text-white text-xs font-bold hover:bg-[#121258] shadow-md"
                >
                  Save Booking Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
