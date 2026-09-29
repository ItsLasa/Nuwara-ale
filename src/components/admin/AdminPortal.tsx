import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminBookingsView } from './AdminBookingsView';
import { AdminPackagesView } from './AdminPackagesView';
import { LogoutModal } from './LogoutModal';
import { VerificationModal } from './VerificationModal';
import { BookingRecord } from '../../data/adminData';
import { useBookings } from '../../context/BookingContext';

interface AdminPortalProps {
  onSwitchToPublic: () => void;
  onLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onSwitchToPublic,
  onLogout,
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const {
    bookings,
    updateBookingStatus,
    deleteBooking,
    addBooking,
    stats,
    pendingCount,
  } = useBookings();

  // Mobile Sidebar Drawer state (TC-12)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [verifyingBooking, setVerifyingBooking] = useState<BookingRecord | null>(null);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Global search: automatically switch to bookings tab to show filtered results immediately (TC-08)
    if (query.trim().length > 0 && currentTab !== 'bookings') {
      setCurrentTab('bookings');
    }
  };

  const handleUpdateStatus = (id: string, newStatus: BookingRecord['status'], adminNotes?: string) => {
    updateBookingStatus(id, newStatus, adminNotes);
  };

  return (
    <div className="flex min-h-screen bg-[#07132B] text-slate-100 font-sans">
      {/* Fixed/Sticky Sidebar on Desktop & Drawer on Mobile (TC-12) */}
      <AdminSidebar
        activeTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={() => setIsLogoutOpen(true)}
        onGoToPublic={onSwitchToPublic}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar (Figma #58:4154) */}
        <AdminTopNav
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          pendingCount={pendingCount}
          onNotificationClick={() => setCurrentTab('bookings')}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* View Switcher with responsive padding (TC-12) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <AdminDashboardView
              bookings={bookings}
              stats={stats}
              onViewAllBookings={() => setCurrentTab('bookings')}
              onOpenBookingDetails={(b) => setVerifyingBooking(b)}
            />
          )}

          {currentTab === 'bookings' && (
            <AdminBookingsView
              bookings={bookings}
              externalSearch={searchQuery}
              onOpenBookingDetails={(b) => setVerifyingBooking(b)}
              onOpenVerification={(b) => setVerifyingBooking(b)}
              onDeleteBooking={deleteBooking}
              onAddBooking={addBooking}
            />
          )}

          {currentTab === 'packages' && <AdminPackagesView />}
        </main>
      </div>

      {/* Logout Confirmation Modal (Figma #114:945) */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirmLogout={() => {
          setIsLogoutOpen(false);
          onLogout();
        }}
      />

      {/* Verification / Status Modal (Figma #82:10564) */}
      <VerificationModal
        isOpen={!!verifyingBooking}
        booking={verifyingBooking}
        onClose={() => setVerifyingBooking(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

