import React from 'react';
import { AlertTriangle, LogOut, Info, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1C]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-[448px] bg-[#131B2E] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden"
        style={{
          boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Top Accent Line */}
        <div 
          className="h-1 w-full"
          style={{
            background: 'linear-gradient(90deg, #6366F1 0%, #A855F7 50%, #F43F5E 100%)',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-5">
          {/* Logo Header */}
          <div className="flex justify-center pb-2">
            <img 
              src="/images/eebm_logo.png" 
              alt="EEBM Logo" 
              className="h-10 w-auto object-contain brightness-110"
            />
          </div>

          {/* Warning Icon & Heading */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-500 shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-heading tracking-tight">
                Logout
              </h3>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                Are you sure you want to log out of your account?
              </p>
            </div>
          </div>

          {/* Subtext info notice */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>
              You will need to re-authenticate with your security credentials to return.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-[#071A3D] text-xs font-semibold rounded-xl border border-[#071A3D] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-red-600/20 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
