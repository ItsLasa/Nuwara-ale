import React from 'react';
import { EVENT_DATA } from '../data/eventData';
import { useCountdown } from '../hooks/useCountdown';

export const HeroCountdown: React.FC = () => {
  const timeLeft = useCountdown(EVENT_DATA.countdownTarget);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Figma Hero Rectangle: 1512x453 with hero banner image */}
      <div className="relative w-full h-[400px] md:h-[453px] flex items-center justify-center">
        <img
          src={EVENT_DATA.heroBannerImage}
          alt="Event Hero Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Subtle Darkening Overlay for text contrast */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Centered Countdown Box matching Figma EL-378b8db1 */}
        
      </div>

      <div className="relative z-10 text-center px-4 py-3">
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl md:text-[48px] md:leading-[48px] tracking-tight text-[#121258] mb-6 drop-shadow-sm">
            Countdown to Event
          </h2>

          {/* Digits Container matching Figma EL-8a10e53c */}
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            {/* Days */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-jakarta font-bold text-4xl sm:text-5xl md:text-[48px] text-[#191B23]">
                {timeLeft.days}
              </span>
              <span className="font-jakarta font-bold text-xl sm:text-2xl md:text-[30px] text-[#191B23]">
                d
              </span>
            </div>

            {/* Hours */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-jakarta font-bold text-4xl sm:text-5xl md:text-[48px] text-[#191B23]">
                {timeLeft.hours}
              </span>
              <span className="font-jakarta font-bold text-xl sm:text-2xl md:text-[30px] text-[#191B23]">
                h
              </span>
            </div>

            {/* Minutes */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-jakarta font-bold text-4xl sm:text-5xl md:text-[48px] text-[#191B23]">
                {timeLeft.minutes}
              </span>
              <span className="font-jakarta font-bold text-xl sm:text-2xl md:text-[30px] text-[#191B23]">
                m
              </span>
            </div>

            {/* Seconds */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-jakarta font-bold text-4xl sm:text-5xl md:text-[48px] text-[#191B23]">
                {timeLeft.seconds}
              </span>
              <span className="font-jakarta font-bold text-xl sm:text-2xl md:text-[30px] text-[#191B23]">
                s
              </span>
            </div>
          </div>
        </div>
    </div>
  );
};
