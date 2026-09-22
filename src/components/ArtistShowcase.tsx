import React from 'react';
import { Music2 } from 'lucide-react';
import { EVENT_DATA } from '../data/eventData';

export const ArtistShowcase: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#0b0c10] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-3">
            <Music2 className="w-3.5 h-3.5" />
            Artist Lineup
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-playfair text-white mb-4">
            Featuring Sri Lanka’s Top Artists
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Get ready for extraordinary live musical performances that will ignite Sahas Uyana on August 30th.
          </p>
        </div>

        {/* Circular Artist Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center">
          {EVENT_DATA.artists.map((artist) => (
            <div
              key={artist.id}
              className="flex flex-col items-center group cursor-pointer text-center"
            >
              {/* Circular Avatar Container with Golden Ring Glow */}
              <div className="relative mb-4">
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-gold/40 p-1 group-hover:border-gold group-hover:shadow-glow-gold transition-all duration-300 transform group-hover:scale-105">
                  <div className="w-full h-full rounded-full overflow-hidden bg-brand-card">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Subtle Floating Star Badge */}
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center text-xs font-bold shadow-md">
                  ★
                </div>
              </div>

              {/* Artist Name & Role */}
              <h3 className="text-base sm:text-lg font-bold font-jakarta text-white group-hover:text-gold transition-colors">
                {artist.name}
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                {artist.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
