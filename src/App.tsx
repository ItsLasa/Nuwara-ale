import { useState } from 'react';
import { HeroCountdown } from './components/HeroCountdown';
import { HomeMainContent } from './components/HomeMainContent';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { LoginModal } from './components/admin/LoginModal';
import { TicketPackage } from './data/eventData';
import { ShieldCheck, Eye } from 'lucide-react';
import { BookingProvider } from './context/BookingContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TicketPackage | null>(null);

  const handleOpenBooking = (pkg: TicketPackage) => {
    setSelectedPackage(pkg);
    setIsBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
  };

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      setCurrentView('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    setCurrentView('admin');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-[#071A3D] selection:text-white">
      {/* View Switcher Floating Bar for smooth reviewer/demo testing */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-[#071A3D]/90 backdrop-blur-md text-white p-1.5 rounded-full border border-white/20 shadow-xl">
        <button
          type="button"
          onClick={() => setCurrentView('public')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            currentView === 'public'
              ? 'bg-white text-[#071A3D] shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Public Event</span>
        </button>

        <button
          type="button"
          onClick={handleAdminAccess}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            currentView === 'admin'
              ? 'bg-amber-400 text-[#071A3D] shadow-sm font-bold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </button>
      </div>

      {currentView === 'public' ? (
        <>
          {/* 1. Hero Section (Figma Frame: 1512x453 with real banner image and countdown) */}
          <HeroCountdown />

          {/* 2. Main 1366px Content (Left: Title, Description, Artists | Right: Sticky Booking Card) */}
          <main className="flex-grow">
            <HomeMainContent onBookTicket={handleOpenBooking} />
          </main>

          {/* 3. Footer (Figma: #071A3D with copyright text & admin link) */}
          <Footer onAdminClick={handleAdminAccess} />

          {/* 4. Interactive Booking & Upload Payment Proof Flow (Figma Frames: #4:121 & #26:3515) */}
          <ErrorBoundary onReset={handleCloseBooking}>
            <BookingModal
              isOpen={isBookingModalOpen}
              onClose={handleCloseBooking}
              initialPackage={selectedPackage}
            />
          </ErrorBoundary>

          {/* 5. Login Modal (Figma Frame: #114:364 "Welcome To NuwaraAle") */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      ) : (
        /* Admin Management Portal (Figma Frames: #58:4193 Dashboard, #59:5649 Bookings, #62:8730 Packages) */
        <AdminPortal
          onSwitchToPublic={() => setCurrentView('public')}
          onLogout={() => {
            setIsAuthenticated(false);
            setCurrentView('public');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}
