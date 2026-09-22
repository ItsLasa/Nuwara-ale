import React from 'react';
import { Check, Sparkles, Ticket } from 'lucide-react';
import { EVENT_DATA, TicketPackage } from '../data/eventData';

interface TicketPackagesProps {
  onSelectPackage: (pkg: TicketPackage) => void;
}

export const TicketPackages: React.FC<TicketPackagesProps> = ({ onSelectPackage }) => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#0b0c10] via-brand-dark to-[#0b0c10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-3">
            <Ticket className="w-3.5 h-3.5" />
            Pricing & Packages
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-playfair text-white mb-4">
            Choose Your Experience
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Secure your spot early. Select from VIP luxury lounge access to energetic standing areas.
          </p>
        </div>

        {/* 3 Ticket Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {EVENT_DATA.packages.map((pkg) => {
            const isVip = pkg.id === 'vip';
            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 ${
                  isVip
                    ? 'bg-gradient-to-b from-[#1c1d2e] to-[#0d101d] border-2 border-gold shadow-glow-gold'
                    : 'bg-brand-card/90 border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular / Available Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md inline-flex items-center gap-1 ${
                        isVip
                          ? 'bg-gradient-to-r from-gold to-yellow-400 text-black'
                          : 'bg-accent-green text-white'
                      }`}
                    >
                      {isVip && <Sparkles className="w-3 h-3" />}
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold font-jakarta text-white mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-gray-400 min-h-[36px]">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8 pb-6 border-b border-white/10 flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-gold uppercase">
                      {pkg.currency}
                    </span>
                    <span className="text-4xl sm:text-5xl font-extrabold text-white font-jakarta">
                      {pkg.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">/ person</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                      Included Services:
                    </span>
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                        <div className="w-4 h-4 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => onSelectPackage(pkg)}
                  className={`w-full py-3.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    isVip
                      ? 'bg-gradient-to-r from-gold via-yellow-400 to-gold text-black hover:shadow-glow-gold'
                      : 'bg-white/10 text-white hover:bg-gold hover:text-black'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  Book {pkg.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
