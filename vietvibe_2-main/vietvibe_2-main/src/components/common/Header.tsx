import React from 'react';
import { Search, Bell, LogIn } from 'lucide-react';
import { type AIStatus } from '../../types/vietvibe';

export const AIConnectionNotice: React.FC<{ status: AIStatus; onRefresh: () => void }> = ({ status, onRefresh }) => (
  <div className="vv-note flex flex-wrap items-center justify-end gap-2" role="status">
    <span>{status.checking ? 'Đang kiểm tra cấu hình AI…' : status.configured ? 'Đã cấu hình key Gemini.' : status.backendAvailable ? 'Dán GEMINI_API_KEY vào .env.local rồi lưu file.' : 'Dừng npm run dev cũ và chạy lại npm.cmd run dev để bật server AI.'}</span>
    <button type="button" className="underline" disabled={status.checking} onClick={onRefresh}>Kiểm tra lại</button>
  </div>
);

export const ScreenBrand: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button type="button" className="vv-wordmark" onClick={onClick} aria-label="Về trang chủ">
    <span className="vv-mark" aria-hidden="true" />
    <span>Việt Phục<small>AI Stylist</small></span>
  </button>
);

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isLoggedIn: boolean;
  userName: string;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  isLoggedIn,
  userName,
  onOpenAuth,
  onOpenAdmin,
  onOpenSearch
}) => {
  const navItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'explore', label: 'Khám phá' },
    { id: 'stylist_setup', label: 'AI Stylist' },
    { id: 'tryon', label: 'Thử đồ ảo (AI Try-on)' },
    { id: 'lookbook', label: 'Lookbook' },
  ];

  return (
<header className="sticky top-0 z-50 w-full bg-[#091321] border-b border-white/10 text-slate-100">
  <div
    className={`max-w-7xl mx-auto h-14 flex items-center justify-between gap-4 ${
      currentTab === 'home'
        ? 'px-4 sm:px-[5%]'
        : 'px-4 sm:px-6 lg:px-8'
    }`}
  >
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {/* Traditional Royal Lotus / Phoenix Crest */}
            <div className="shrink-0">
              <div
                aria-hidden="true"
                className="h-[38px] w-[34px] shrink-0 bg-no-repeat"
                style={{
                  backgroundImage: "url('/home-reference.png')",
                  backgroundSize: '3011.76% 1505.26%',
                  backgroundPosition: '4.95% 1.50%',
                }}
              />
            </div>
            <div className="leading-tight">
              <div className="font-serif-culture text-[20px] font-bold text-[#D8C18D]">
                 Việt Phục
              </div>
              <div className="text-[12px] font-normal text-[#D8C18D]">
                 AI Stylist
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex h-full items-stretch gap-4 lg:gap-6">
          {navItems.map((item) => {
            const isActive = currentTab === item.id || 
              (item.id === 'stylist_setup' && (currentTab === 'outfit_builder' || currentTab === 'cultural_check')) ||
              (item.id === 'tryon' && currentTab === 'tryon_result');
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center px-0.5 text-[13px] font-normal whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'text-[#D8C18D] border-[#D8C18D]'
                    : 'text-[#A9ABB3] border-transparent hover:text-[#E7D6AF]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Auth */}
        <div className="flex items-center gap-2.5">
          {/* Quick search button */}
          <button
            onClick={() => onNavigate('explore')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            title="Tìm kiếm Việt phục"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification icon */}
          <span
            role="img"
            aria-label="Thông báo"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center text-slate-400"
          >
            <Bell aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
            <span
              aria-hidden="true"
              className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#E45B50]"
            />
          </span>
                  
          {/* User Profile / Guest Sign In button */}
          {isLoggedIn ? (
            <button
              onClick={() => onNavigate('profile')}
              className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8C18D]"
              title={`Hồ sơ của ${userName}`}
              aria-label={`Mở hồ sơ của ${userName}`}
            >
              <div
                aria-hidden="true"
                className={`h-8 w-8 rounded-full bg-no-repeat transition-shadow ${
                  currentTab === 'profile'
                    ? 'ring-2 ring-[#E7D6AF]'
                    : 'ring-1 ring-[#D8C18D]/60 hover:ring-[#E7D6AF]'
                }`}
                style={{
                  backgroundImage: "url('/home-reference.png')",
                  backgroundSize: '3200% 1787.50%',
                  backgroundPosition: '95.06% 2.04%',
                }}
              />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                Khách (Guest)
              </span>
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-[0_2px_10px_rgba(217,119,6,0.25)] active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div className="md:hidden border-t border-slate-800/70 bg-[#080E17] px-4 py-2 flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id || 
            (item.id === 'stylist_setup' && (currentTab === 'outfit_builder' || currentTab === 'cultural_check')) ||
            (item.id === 'tryon' && currentTab === 'tryon_result');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-2.5 py-1 text-xs whitespace-nowrap font-medium transition-colors ${
                isActive ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
