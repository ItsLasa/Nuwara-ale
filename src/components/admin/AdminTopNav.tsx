import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface AdminTopNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  searchQuery,
  onSearchChange,
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
          placeholder="Search bookings, customers..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-400 rounded-xl text-sm font-hanken text-zinc-800 placeholder-gray-600 focus:outline-none focus:border-[#071A3D] focus:bg-white transition-colors"
        />
      </div>

      {/* Actions matching Figma EL-2ee873d7 */}
      <div className="flex items-center gap-4">
        {/* Notification Bell with Badge */}
        <button
          title="Notifications"
          className="relative p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
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
