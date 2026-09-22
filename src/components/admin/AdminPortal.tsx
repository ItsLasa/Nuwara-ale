import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminBookingsView } from './AdminBookingsView';
import { AdminPackagesView } from './AdminPackagesView';
import { LogoutModal } from './LogoutModal';
import { VerificationModal } from './VerificationModal';
import { INITIAL_BOOKINGS, BookingRecord } from '../../data/adminData';

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
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);

  // Modals state
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [verifyingBooking, setVerifyingBooking] = useState<BookingRecord | null>(null);

  const handleUpdateStatus = (id: string, newStatus: BookingRecord['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  return (
    <div className="flex min-h-screen bg-[#06122B] text-slate-100 font-sans">
      {/* Fixed/Sticky Sidebar (Figma #58:4400) */}
      <AdminSidebar
        activeTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={() => setIsLogoutOpen(true)}
        onGoToPublic={onSwitchToPublic}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar (Figma #58:4154) */}
        <AdminTopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* View Switcher */}
        <main className="flex-1 p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <AdminDashboardView
              bookings={bookings}
              onViewAllBookings={() => setCurrentTab('bookings')}
              onOpenBookingDetails={(b) => setVerifyingBooking(b)}
            />
          )}

          {currentTab === 'bookings' && (
            <AdminBookingsView
              bookings={bookings}
              onOpenBookingDetails={(b) => setVerifyingBooking(b)}
              onOpenVerification={(b) => setVerifyingBooking(b)}
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
