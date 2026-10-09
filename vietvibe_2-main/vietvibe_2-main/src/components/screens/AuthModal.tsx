import React, { useState } from 'react';
import { X, LogIn, UserPlus, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string) => void;
  onContinueAsGuest: () => void;
  pendingActionNote?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onContinueAsGuest,
  pendingActionNote
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToUse = activeTab === 'register' ? (fullName || 'Người Dùng Mới') : (email.split('@')[0] || 'Nguyễn Văn A');
    onLoginSuccess(nameToUse, email || 'nguyenvana@email.com');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0C1522] border border-amber-500/40 rounded-3xl max-w-md w-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header Bar matching VietVibe aesthetic */}
        <div className="p-6 bg-gradient-to-b from-[#13243B] to-[#0C1522] border-b border-slate-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Golden Royal Insignia */}
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M12 2L14.5 8.5L21 9.5L16 14.5L17.5 21L12 17.5L6.5 21L8 14.5L3 9.5L9.5 8.5L12 2Z" fill="url(#auth-emblem-grad)" />
              <defs>
                <linearGradient id="auth-emblem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h2 className="font-brand text-xl font-bold text-white tracking-wide">
            VietVibe
          </h2>
          <p className="text-xs text-amber-300 font-serif-culture">
            VietVibe · Di Sản Vượt Thời Gian
          </p>

          {pendingActionNote && (
            <div className="mt-3 p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs text-center font-medium">
              💡 {pendingActionNote}
            </div>
          )}
        </div>

        {/* 2 Tabs: Đăng nhập / Đăng ký */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950/60 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ĐĂNG NHẬP
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'register'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ĐĂNG KÝ
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-400">Giao diện tài khoản mẫu. Thông tin chỉ dùng trong phiên trải nghiệm này.</p>
          {activeTab === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Họ và tên:</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="VD: Lê Anh Tuấn"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email đăng nhập:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenban@email.com"
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">Mật khẩu:</label>
              {activeTab === 'login' && (
                <button
                  type="button"
                  disabled
                  title="Chờ kết nối hệ thống đăng nhập"
                  className="text-[11px] text-amber-400 disabled:opacity-50"
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-amber-400 rounded"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 transition-all shadow-[0_8px_20px_rgba(217,119,6,0.3)] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {activeTab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{activeTab === 'login' ? 'ĐĂNG NHẬP NGAY' : 'TẠO TÀI KHOẢN MỚI'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-[#0C1522] text-[11px] text-slate-500">
              hoặc
            </span>
          </div>

          {/* Continue as Guest Button matching Document 2 & 3 specs */}
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Trải nghiệm với tư cách Khách (Guest)</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </form>
      </div>
    </div>
  );
};
