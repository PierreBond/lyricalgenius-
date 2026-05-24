import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tab } from '../types';

interface NavigationProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

export default function Navigation({ currentTab, setCurrentTab }: NavigationProps) {
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | null>(null);
  const [hadBeenOffline, setHadBeenOffline] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      if (hadBeenOffline) {
        setSyncStatus('syncing');
        const syncTimer = setTimeout(() => {
          setSyncStatus('synced');
          const successTimer = setTimeout(() => {
            setSyncStatus(null);
            setHadBeenOffline(false);
          }, 3000);
          return () => clearTimeout(successTimer);
        }, 3000);
        return () => clearTimeout(syncTimer);
      }
    };

    const handleOffline = () => {
      setHadBeenOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check: if started offline, tag so we sync on recovery
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setHadBeenOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hadBeenOffline]);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'play', label: 'Play', icon: 'music_note' },
    { id: 'duels', label: 'Duels', icon: 'swords' },
    { id: 'ranks', label: 'Ranks', icon: 'leaderboard' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center bg-[#fcf9f2] border-t-2 border-[#1c1c18] h-20 px-2 pb-safe">
      <AnimatePresence>
        {syncStatus && (
          <motion.div
            initial={{ opacity: 0, y: 15, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: 10, x: '-50%' }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`absolute bottom-22 left-1/2 z-50 flex items-center gap-2 border-2 border-[#1c1c18] px-4 py-2 rounded-2xl font-sans font-black text-[10px] uppercase tracking-wider hard-shadow-sm pointer-events-none whitespace-nowrap ${
              syncStatus === 'syncing'
                ? 'bg-[#fcd400] text-[#1c1c18]'
                : 'bg-[#10b981] text-white'
            }`}
          >
            {syncStatus === 'syncing' ? (
              <>
                <span className="material-symbols-outlined text-[15px] animate-spin font-black select-none">sync</span>
                <span>Connecting & Syncing Local Stats...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[15px] font-black select-none">cloud_done</span>
                <span>Stats uploaded to server! ✓</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-150 ${
              isActive
                ? 'bg-[#fcd400] text-[#1c1c18] rounded-xl border-2 border-[#1c1c18] px-5 py-1.5 hard-shadow -translate-y-1.5 scale-105'
                : 'text-[#5c5c5c] py-1 hover:bg-[#ebe8e1] rounded-xl w-16'
            }`}
          >
            <span 
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            <span className={`text-[11px] mt-0.5 tracking-tight font-sans font-bold`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
