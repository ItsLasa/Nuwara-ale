import { useState, useEffect } from 'react';
import { HeroCountdown } from './components/HeroCountdown';
import { HomeMainContent } from './components/HomeMainContent';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { LoginModal } from './components/admin/LoginModal';
import { TicketPackage } from './data/eventData';
import { BookingProvider } from './context/BookingContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase();
  const host = window.location.hostname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);

  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#/admin' ||
    hash === '#admin' ||
    hash.startsWith('#/admin/') ||
    searchParams.get('view') === 'admin' ||
    searchParams.has('admin') ||
    host.startsWith('admin.')
  );
}

function navigateTo(path: string) {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path);
  }
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('nuwara_admin_auth') === 'true';
  });

  const [currentView, setCurrentView] = useState<'public' | 'admin'>(() => {
    return isAdminRoute() ? 'admin' : 'public';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(() => {
    return isAdminRoute() && !(sessionStorage.getItem('nuwara_admin_auth') === 'true');
  });

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TicketPackage | null>(null);

  // Synchronize route changes (popstate / hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const isAdm = isAdminRoute();
      if (isAdm) {
        setCurrentView('admin');
        const auth = sessionStorage.getItem('nuwara_admin_auth') === 'true';
        setIsAuthenticated(auth);
        setIsLoginModalOpen(!auth);
      } else {
        setCurrentView('public');
        setIsLoginModalOpen(false);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleOpenBooking = (pkg: TicketPackage) => {
    setSelectedPackage(pkg);
    setIsBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
  };

  const handleLoginSuccess = () => {
    sessionStorage.setItem('nuwara_admin_auth', 'true');
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    setCurrentView('admin');
    if (!isAdminRoute()) {
      navigateTo('/admin');
    }
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
    if (!isAuthenticated) {
      setCurrentView('public');
      navigateTo('/');
    }
  };

  const handleSwitchToPublic = () => {
    setCurrentView('public');
    navigateTo('/');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nuwara_admin_auth');
    setIsAuthenticated(false);
    setCurrentView('public');
    navigateTo('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-[#071A3D] selection:text-white">
      {currentView === 'public' ? (
        <>
          {/* 1. Hero Section (Figma Frame: 1512x453 with real banner image and countdown) */}
          <HeroCountdown />

          {/* 2. Main 1366px Content (Left: Title, Description, Artists | Right: Sticky Booking Card) */}
          <main className="flex-grow">
            <HomeMainContent onBookTicket={handleOpenBooking} />
          </main>

          {/* 3. Footer (Figma: #071A3D with copyright text) */}
          <Footer />

          {/* 4. Interactive Booking & Upload Payment Proof Flow (Figma Frames: #4:121 & #26:3515) */}
          <ErrorBoundary onReset={handleCloseBooking}>
            <BookingModal
              isOpen={isBookingModalOpen}
              onClose={handleCloseBooking}
              initialPackage={selectedPackage}
            />
          </ErrorBoundary>

          {/* 5. Login Modal */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={handleCloseLogin}
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      ) : (
        /* Admin Management Portal (Figma Frames: #58:4193 Dashboard, #59:5649 Bookings, #62:8730 Packages) */
        <>
          {isAuthenticated ? (
            <AdminPortal
              onSwitchToPublic={handleSwitchToPublic}
              onLogout={handleLogout}
            />
          ) : (
            <div className="min-h-screen bg-[#07132B] flex flex-col items-center justify-center p-4">
              <LoginModal
                isOpen={true}
                onClose={handleCloseLogin}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          )}
        </>
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
