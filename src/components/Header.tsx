import React from 'react';
import { Tab, UserStats } from '../types';

interface HeaderProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  stats: UserStats;
  onBack?: () => void;
  showBack?: boolean;
  isOffline?: boolean;
}

export default function Header({
  currentTab,
  setCurrentTab,
  stats,
  onBack,
  showBack = false,
  isOffline = false
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-[#fcf9f2] border-b-2 border-[#1c1c18]">
      <div className="flex items-center gap-2 md:gap-3">
        {showBack ? (
          <button 
            onClick={onBack}
            className="material-symbols-outlined text-[#b71422] p-2 hover:bg-[#e5e2db] rounded-full transition-colors active:scale-95"
            aria-label="Back"
          >
            arrow_back
          </button>
        ) : (
          <button 
            onClick={() => setCurrentTab('settings')}
            className={`material-symbols-outlined text-[#1c1c18] p-2 hover:bg-[#e5e2db] rounded-full transition-colors active:scale-95 ${currentTab === 'settings' ? 'bg-[#fcd400]' : ''}`}
            aria-label="Open settings"
          >
            menu
          </button>
        )}
        <div className="flex items-center gap-2">
          <h1 
            onClick={() => setCurrentTab('home')}
            className="font-display font-black text-xl md:text-2xl text-[#1c1c18] uppercase tracking-tighter italic cursor-pointer select-none"
          >
            Lyric Genius
          </h1>
          {isOffline && (
            <div className="bg-[#b71422] text-[#fcf9f2] border-2 border-[#1c1c18] px-2.5 py-0.5 rounded-lg text-[8px] font-sans font-black flex items-center gap-1 animate-pulse hard-shadow-xs select-none">
              <span className="material-symbols-outlined text-[10px] font-black">wifi_off</span>
              OFFLINE
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Diamond Counter */}
        <div 
          onClick={() => setCurrentTab('profile')}
          className="flex items-center bg-[#fcd400] px-3 py-1 border-2 border-[#1c1c18] rounded-full hard-shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[#1c1c18] text-sm md:text-lg mr-1 fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
            diamond
          </span>
          <span className="font-sans font-bold text-xs md:text-sm text-[#1c1c18]">
            {stats.diamonds.toLocaleString()}
          </span>
        </div>

        {/* User Avatar */}
        <div 
          onClick={() => setCurrentTab('profile')}
          className="w-10 h-10 rounded-full border-2 border-[#1c1c18] overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          <img 
            alt="User avatar" 
            className="w-full h-full object-cover" 
            src={stats.avatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=150&auto=format&fit=crop"} 
          />
        </div>
      </div>
    </header>
  );
}
