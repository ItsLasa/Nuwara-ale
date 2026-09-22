import React from 'react';
import { LayoutDashboard, CalendarCheck, Package, LogOut, Globe } from 'lucide-react';

export type AdminTab = 'dashboard' | 'bookings' | 'packages';

export interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onGoToPublic: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onGoToPublic,
}) => {
  return (
    <aside className="w-[348px] bg-[#071A3D] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-white/10 select-none">
      <div>
        {/* Logo Container matching Figma EL-39719052 (324x76) */}
        <div className="p-8 pb-10 border-b border-white/10 flex items-center justify-center">
          <img
            src="/images/eebm_logo.png"
            alt="EEBM Logo"
            className="w-[260px] h-auto object-contain brightness-110 drop-shadow-md"
          />
        </div>

        {/* Navigation Tabs matching Figma EL-e9fa78ea */}
        <div className="p-6 space-y-2">
          {/* Dashboard Tab */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`w-full flex items-center gap-3.5 px-6 py-4 rounded-2xl font-jakarta font-semibold text-base transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-white/10 text-white border border-white/20 shadow-md ring-1 ring-white/20'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
            <span>Dashboard</span>
          </button>

          {/* Bookings Tab */}
          <button
            onClick={() => onSelectTab('bookings')}
            className={`w-full flex items-center gap-3.5 px-6 py-4 rounded-2xl font-jakarta font-semibold text-base transition-all duration-200 ${
              activeTab === 'bookings'
                ? 'bg-white/10 text-white border border-white/20 shadow-md ring-1 ring-white/20'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <CalendarCheck className={`w-5 h-5 ${activeTab === 'bookings' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
            <span>Bookings</span>
          </button>

          {/* Packages Tab */}
          <button
            onClick={() => onSelectTab('packages')}
            className={`w-full flex items-center gap-3.5 px-6 py-4 rounded-2xl font-jakarta font-semibold text-base transition-all duration-200 ${
              activeTab === 'packages'
                ? 'bg-white/10 text-white border border-white/20 shadow-md ring-1 ring-white/20'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Package className={`w-5 h-5 ${activeTab === 'packages' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
            <span>Packages</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation Tabs matching Figma EL-0f7185a9 */}
      <div className="p-6 border-t border-white/10 space-y-2">
        {/* Switch to Public Site */}
        <button
          onClick={onGoToPublic}
          className="w-full flex items-center gap-3.5 px-6 py-3.5 rounded-xl font-jakarta font-medium text-sm text-yellow-100/80 hover:bg-white/5 hover:text-yellow-200 transition-colors"
        >
          <Globe className="w-4 h-4 text-[#D4AF37]" />
          <span>View Public Event Page</span>
        </button>

        {/* Logout Tab */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-6 py-3.5 rounded-xl font-jakarta font-medium text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
