import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@nuwaraale.lk');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1C]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-[460px] bg-[#071A3D] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-8"
        style={{
          boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Top subtle gradient glow line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0) 0%, #6366F1 50%, #A855F7 100%)',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Logo */}
        <div className="flex flex-col items-center text-center mb-6 pt-2">
          <div className="h-14 flex items-center justify-center mb-3">
            <img 
              src="/images/eebm_logo.png" 
              alt="EEBM Logo" 
              className="h-12 w-auto object-contain brightness-110"
            />
          </div>
          <h2 className="text-2xl font-bold text-white font-heading tracking-tight">
            Welcome To NuwaraAle
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Admin Management & Event Operations Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Username Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              EMAIL OR USERNAME
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B1326]/90 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="example@gmail.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                PASSWORD
              </label>
              <button
                type="button"
                className="text-xs font-medium text-[#818CF8] hover:text-indigo-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 bg-[#0B1326]/90 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-white text-[#071A3D] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-slate-300">
                Remember me for 30 days
              </span>
            </label>
          </div>

          {/* Primary Login Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 mt-2 bg-white hover:bg-slate-100 text-[#071A3D] font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.99] transition-all"
          >
            <span>Login to Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Divider */}
          {/* <div className="relative flex items-center justify-center py-2">
            <div className="w-full border-t border-slate-700" />
            <span className="absolute px-3 bg-[#071A3D] text-[10px] font-medium tracking-wider text-slate-400 uppercase">
              OR CONTINUE WITH
            </span>
          </div> */}

          {/* Google Login Button */}
          {/* <button
            type="button"
            onClick={onLoginSuccess}
            className="w-full py-2.5 px-4 bg-[#0B1326]/90 hover:bg-[#0B1326] border border-slate-700/80 rounded-xl text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 hover:border-slate-600 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button> */}
        </form>
      </div>
    </div>
  );
};
