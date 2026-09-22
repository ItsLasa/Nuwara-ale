import React, { useState } from 'react';
import { Calendar, MapPin, Building2, Phone, Flame, Utensils, Music } from 'lucide-react';
import { EVENT_DATA, TicketPackage } from '../data/eventData';

interface HomeMainContentProps {
  onBookTicket: (pkg: TicketPackage) => void;
}

export const HomeMainContent: React.FC<HomeMainContentProps> = ({ onBookTicket }) => {
  const [selectedPkgId, setSelectedPkgId] = useState<'vip' | 'general' | 'earlybird'>('vip');

  const selectedPackage = EVENT_DATA.packages.find((p) => p.id === selectedPkgId)!;

  return (
    <div className="w-full bg-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8">
      {/* 1366px Container matching Figma EL-10:1387 */}
      <div className="max-w-[1366px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: 8 Columns (Figma #10:1388, width ~902px)     */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CARD 1: Title Section (Figma #16:3031) */}
          <section className="bg-white border border-[#071A3D] rounded-[24px] p-8 md:p-10 shadow-[0px_10px_30px_0px_rgba(7,26,61,0.05)]">
            <h1 className="font-playfair font-bold text-4xl sm:text-5xl md:text-[48px] md:leading-[56px] text-[#071A3D] mb-2 tracking-tight">
              {EVENT_DATA.titleSinhala}
            </h1>
            <p className="font-playfair font-semibold text-xl sm:text-2xl text-[#45464E]">
              {EVENT_DATA.titleEnglish}
            </p>
          </section>

          {/* CARD 2: About the Event (Figma #10:1399) */}
          <section className="bg-white border border-[#071A3D] rounded-[24px] p-8 md:p-10 shadow-[0px_10px_30px_0px_rgba(7,26,61,0.05)] space-y-8">
            <div>
              <h2 className="font-playfair font-semibold text-2xl sm:text-3xl text-[#071A3D] mb-4">
                About the Event
              </h2>
              <p className="font-hanken font-normal text-base text-[#45464E] leading-relaxed">
                {EVENT_DATA.aboutText}
              </p>
            </div>

            {/* Info Grid: Details (Left) & Hotlines (Right) matching Figma #2:33 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 border-t border-gray-100">
              {/* Event Metadata (7 cols) */}
              <div className="md:col-span-7 space-y-3.5">
                <div className="inline-block px-3 py-1 bg-amber-50 border border-[#D4AF37]/30 rounded-full">
                  <span className="font-jakarta font-bold text-sm text-[#071A3D]">
                    {EVENT_DATA.chapter}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm font-hanken text-[#071A3D]">
                  <Calendar className="w-4 h-4 text-[#071A3D] shrink-0" />
                  <span>{EVENT_DATA.dateString} | {EVENT_DATA.timeString}</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-hanken text-[#071A3D]">
                  <MapPin className="w-4 h-4 text-[#071A3D] shrink-0" />
                  <span>{EVENT_DATA.venueFull}</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-hanken text-[#071A3D]">
                  <Building2 className="w-4 h-4 text-[#071A3D] shrink-0" />
                  <span>Organized by <strong>{EVENT_DATA.organizer}</strong></span>
                </div>
              </div>

              {/* Hotlines Container matching Figma #2:49 (5 cols) */}
              <div className="md:col-span-5 md:border-l md:border-gray-200 md:pl-6 space-y-2.5">
                <h4 className="font-jakarta font-bold text-sm text-[#071A3D]">
                  For Tickets, Contact Now:
                </h4>
                <div className="space-y-2">
                  {EVENT_DATA.hotlines.map((h) => (
                    <a
                      key={h.phone}
                      href={`tel:${h.phone}`}
                      className="flex items-center gap-2 text-sm font-jakarta text-[#434651] hover:text-[#071A3D] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#071A3D] shrink-0" />
                      <span>{h.name} – <strong className="text-[#071A3D]">{h.displayPhone}</strong></span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Highlights matching Figma #10:1407 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Flame className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-hanken font-semibold text-lg text-[#071A3D] leading-snug">
                    Live Band Performance
                  </h4>
                  <p className="font-hanken text-xs text-[#45464E]">
                    Backed by a full orchestra
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Utensils className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-hanken font-semibold text-lg text-[#071A3D] leading-snug">
                    Premium F&B
                  </h4>
                  <p className="font-hanken text-xs text-[#45464E]">
                    Exclusive catering options
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CARD 3: Featured Artists Grid (Figma #10:1424) */}
          <section className="bg-white border border-[#071A3D] rounded-[24px] p-8 md:p-10 shadow-[0px_10px_30px_0px_rgba(7,26,61,0.05)]">
            <div className="flex items-center gap-2.5 mb-8">
              <Music className="w-6 h-6 text-[#071A3D]" />
              <h2 className="font-playfair font-semibold text-2xl sm:text-3xl text-[#071A3D]">
                Featured Artists
              </h2>
            </div>

            {/* 3 Columns x 2 Rows Grid matching Figma #26:3847 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
              {EVENT_DATA.artists.map((artist) => (
                <div
                  key={artist.id}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  {/* Circular Avatar: 128x128 matching Figma EL-fa79ed63 */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-gray-200 shadow-md p-1 mb-3 group-hover:border-[#071A3D] group-hover:shadow-lg transition-all duration-300">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <h3 className="font-jakarta font-bold text-lg text-[#071A3D] group-hover:text-[#121258] transition-colors">
                    {artist.name}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 4 Columns (Figma #10:1460, width ~471px)    */}
        {/* Sticky Booking Card                                       */}
        {/* ========================================================= */}
        <aside className="lg:col-span-4 sticky top-6">
          <div className="bg-white border border-[#DBD9DD]/50 rounded-[24px] shadow-[0px_10px_30px_0px_rgba(7,26,61,0.05)] overflow-hidden">
            
            {/* Top Event Meta Bar (Figma #10:1462, bg #F5F3F6) */}
            <div className="bg-[#F5F3F6] p-6 border-b border-[#DBD9DD]/50 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#071A3D] shrink-0 mt-0.5" />
                <div>
                  <div className="font-hanken font-semibold text-lg text-[#071A3D]">
                    {EVENT_DATA.dateShort}
                  </div>
                  <div className="font-hanken text-xs text-[#45464E]">
                    {EVENT_DATA.timeDetail}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#071A3D] shrink-0 mt-0.5" />
                <div>
                  <div className="font-hanken font-semibold text-lg text-[#071A3D]">
                    {EVENT_DATA.venue}
                  </div>
                  <div className="font-hanken text-xs text-[#45464E]">
                    {EVENT_DATA.venueLocation}
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets Body (Figma #10:1479) */}
            <div className="p-6 space-y-5">
              <h3 className="font-playfair font-semibold text-xl text-[#071A3D]">
                Select Tickets
              </h3>

              {/* 3 Ticket Tiers matching Figma Instances */}
              <div className="space-y-3">
                {EVENT_DATA.packages.map((pkg) => {
                  const isSelected = pkg.id === selectedPkgId;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-[#071A3D] bg-blue-50/20 ring-1 ring-[#071A3D]'
                          : 'border-[#071A3D]/30 hover:border-[#071A3D]/60 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-jakarta font-bold text-base text-[#071A3D]">
                              {pkg.name}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800">
                              {pkg.badge}
                            </span>
                          </div>
                          <p className="font-hanken text-xs text-[#45464E] mt-0.5">
                            {pkg.description}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-jakarta font-bold text-lg text-[#071A3D] block">
                            {pkg.currency} {pkg.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Radio Selection Indicator */}
                      <div className="flex justify-end pt-1">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#071A3D] bg-[#071A3D]'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Primary Book Button matching Figma #4:118 */}
              <button
                onClick={() => onBookTicket(selectedPackage)}
                className="w-full h-[52px] rounded-xl bg-[#071A3D] hover:bg-[#121258] text-white font-jakarta font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Book Now
              </button>

              <p className="font-hanken text-xs text-[#45464E] text-center">
                Secure checkout. E-tickets provided instantly.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
