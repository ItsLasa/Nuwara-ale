import React from 'react';
import { Ticket, Phone, Calendar } from 'lucide-react';
import { EVENT_DATA } from '../data/eventData';

interface NavbarProps {
  onBookNow: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookNow }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-brand-dark/80 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold to-yellow-200 flex items-center justify-center shadow-glow-gold">
            <span className="text-brand-dark font-playfair font-bold text-xl">න</span>
          </div>
          <div>
            <span className="font-playfair font-bold text-xl tracking-wide text-white block leading-tight">
              {EVENT_DATA.titleSinhala}
            </span>
            <span className="text-xs uppercase tracking-widest text-gold block font-jakarta">
              {EVENT_DATA.chapter}
            </span>
          </div>
        </div>

        {/* Desktop Quick Info & Action */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4 text-gold" />
            <span>{EVENT_DATA.dateString}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Phone className="w-4 h-4 text-gold" />
            <span>Hotline: {EVENT_DATA.hotlines[0].displayPhone}</span>
          </div>

          <button
            onClick={onBookNow}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold text-sm hover:from-yellow-400 hover:to-gold transition-all duration-300 shadow-glow-gold flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Ticket className="w-4 h-4" />
            Book Tickets
          </button>
        </div>

        {/* Mobile Action */}
        <div className="md:hidden">
          <button
            onClick={onBookNow}
            className="px-4 py-2 rounded-full bg-gold text-black font-semibold text-xs flex items-center gap-1.5 shadow-glow-gold"
          >
            <Ticket className="w-3.5 h-3.5" />
            Book
          </button>
        </div>
      </div>
    </nav>
  );
};
