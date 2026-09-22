import React from 'react';


interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ }) => {
  return (
    <footer className="w-full bg-[#071A3D] border-t border-white/10 py-4 px-6 text-white">
      <div className="max-w-[1366px] mx-auto flex flex-col  sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
        <p className="font-hanken font-normal  text-xs sm:text-sm text-gray-200 tracking-wide">
          © 2026 EVER EFFICIENT BUSINESS MANAGEMENT(Pvt) Ltd. All Rights Reserved.
        </p>
        
        {/* {onAdminClick && (
          <button
            type="button"
            onClick={onAdminClick}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-300/80 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        )} */}
      </div>
    </footer>
  );
};
