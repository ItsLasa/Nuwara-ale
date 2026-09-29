import React from 'react';
import { EVENT_DATA } from '../data/eventData';
import { useCountdown } from '../hooks/useCountdown';

export const HeroCountdown: React.FC = () => {
  const timeLeft = useCountdown(EVENT_DATA.countdownTarget);

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Responsive Event Banner Container (TC-05) */}
      <div className="relative w-full flex items-center justify-center bg-[#071A3D]">
        <img
          src={EVENT_DATA.heroBannerImage}
          alt="EEBM Nuwara Aale Event Concert Poster Banner"
          className="w-full h-auto max-h-[550px] sm:max-h-[600px] object-contain block mx-auto"
          loading="eager"
        />
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
