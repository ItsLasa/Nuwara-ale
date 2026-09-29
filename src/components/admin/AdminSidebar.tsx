import React from 'react';
import { LayoutDashboard, CalendarCheck, Package, LogOut, Globe, X } from 'lucide-react';

export type AdminTab = 'dashboard' | 'bookings' | 'packages';

export interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onGoToPublic: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onGoToPublic,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const handleTabClick = (tab: AdminTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full min-h-screen bg-[#071A3D] text-white border-r border-white/10 select-none">
      <div>
        {/* Logo Container matching Figma EL-39719052 */}
        <div className="p-6 sm:p-8 pb-8 border-b border-white/10 flex items-center justify-between">
          <img
            src="/images/eebm_logo.png"
            alt="EEBM Logo"
            className="w-[200px] sm:w-[240px] h-auto object-contain brightness-110 drop-shadow-md"
          />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Tabs matching Figma EL-e9fa78ea */}
        <div className="p-4 sm:p-6 space-y-2">
          {/* Dashboard Tab */}
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-jakarta font-semibold text-base transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-white/15 text-white border border-white/20 shadow-md ring-1 ring-white/20'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
            <span>Dashboard</span>
          </button>

          {/* Bookings Tab */}
          <button
            onClick={() => handleTabClick('bookings')}
            className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-jakarta font-semibold text-base transition-all duration-200 ${
              activeTab === 'bookings'
                ? 'bg-white/15 text-white border border-white/20 shadow-md ring-1 ring-white/20'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <CalendarCheck className={`w-5 h-5 ${activeTab === 'bookings' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
            <span>Bookings</span>
          </button>

          {/* Packages Tab */}
          <button
            onClick={() => handleTabClick('packages')}
            className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-jakarta font-semibold text-base transition-all duration-200 ${
              activeTab === 'packages'
                ? 'bg-white/15 text-white border border-white/20 shadow-md ring-1 ring-white/20'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Package className={`w-5 h-5 ${activeTab === 'packages' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
            <span>Packages</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation Tabs matching Figma EL-0f7185a9 */}
      <div className="p-4 sm:p-6 border-t border-white/10 space-y-2">
        {/* Switch to Public Site */}
        <button
          onClick={() => {
            onGoToPublic();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-3.5 px-5 py-3 rounded-xl font-jakarta font-medium text-sm text-yellow-100/80 hover:bg-white/5 hover:text-yellow-200 transition-colors"
        >
          <Globe className="w-4 h-4 text-[#D4AF37]" />
          <span>View Public Event Page</span>
        </button>

        {/* Logout Tab */}
        <button
          onClick={() => {
            onLogout();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-3.5 px-5 py-3 rounded-xl font-jakarta font-medium text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on lg and up) */}
      <aside className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay and Sliding Panel */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
            onClick={onCloseMobile}
          />
          {/* Drawer */}
          <div className="relative w-[280px] max-w-[85vw] h-full shadow-2xl z-10 animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
