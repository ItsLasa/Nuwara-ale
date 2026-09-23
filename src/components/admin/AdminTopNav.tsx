import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface AdminTopNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pendingCount?: number;
  onNotificationClick?: () => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  searchQuery,
  onSearchChange,
  pendingCount = 0,
  onNotificationClick,
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input matching Figma EL-4e0e2bd2 */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search bookings by name, REF, NIC, phone..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-hanken text-zinc-800 placeholder-gray-500 focus:outline-none focus:border-[#071A3D] focus:bg-white transition-colors"
        />
      </div>

      {/* Actions matching Figma EL-2ee873d7 */}
      <div className="flex items-center gap-4">
        {/* Notification Bell with Badge */}
        <button
          onClick={onNotificationClick}
          title={`${pendingCount} bookings pending verification`}
          className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] text-[10px] font-bold text-white bg-amber-500 rounded-full flex items-center justify-center shadow-sm animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-gray-200" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#071A3D] text-white flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="font-jakarta font-bold text-xs text-gray-800 block leading-tight">
              Manoj Illangasinghe
            </span>
            <span className="font-hanken text-[10px] text-gray-400 block">
              Event Administrator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
