import React from 'react';
import { Tab } from '../types';

interface NavigationProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

export default function Navigation({ currentTab, setCurrentTab }: NavigationProps) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'play', label: 'Play', icon: 'music_note' },
    { id: 'duels', label: 'Duels', icon: 'swords' },
    { id: 'ranks', label: 'Ranks', icon: 'leaderboard' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center bg-[#fcf9f2] border-t-2 border-[#1c1c18] h-20 px-2 pb-safe">
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
