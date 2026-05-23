import React, { useState } from 'react';
import { Tab, UserStats } from '../types';

interface SettingsTabProps {
  stats: UserStats;
  openProFlow: () => void;
  setCurrentTab: (tab: Tab) => void;
  onLogout: () => void;
  onLaunchTutorial: () => void;
}

export default function SettingsTab({
  stats,
  openProFlow,
  setCurrentTab,
  onLogout,
  onLaunchTutorial
}: SettingsTabProps) {
  // Toggle states
  const [soundEffects, setSoundEffects] = useState(true);
  const [bgMusic, setBgMusic] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [explicitFilter, setExplicitFilter] = useState(true);

  // Difficulty choice
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');

  // Genre interests
  const [preferredGenres, setPreferredGenres] = useState<string[]>(['HIP-HOP', 'POP', 'R&B']);

  const toggleGenre = (genre: string) => {
    if (preferredGenres.includes(genre)) {
      setPreferredGenres(prev => prev.filter(g => g !== genre));
    } else {
      setPreferredGenres(prev => [...prev, genre]);
    }
  };

  const handleResetGenres = () => {
    setPreferredGenres(['HIP-HOP', 'POP', 'R&B']);
  };

  return (
    <div className="w-full pb-32 pt-4 px-4 max-w-md mx-auto space-y-8 select-none">
      {/* Header Title Section */}
      <section className="mt-2">
        <h2 className="font-display font-black text-2xl md:text-3xl uppercase leading-none text-[#1c1c18]">Settings</h2>
        <p className="font-sans text-xs text-[#5b403e] mt-1.5">Personalize your lyric-slaying experience.</p>
      </section>

      {/* Account Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b71422] text-xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-wider text-[#1c1c18]">Account</h3>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => alert("Profile edits popup simulated! You can edit your name on the Profile view directly.")}
            className="w-full flex items-center justify-between p-3.5 bg-white border-2 border-[#1c1c18] hard-shadow rounded-xl active:translate-y-0.5 active:shadow-none transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined opacity-70 text-sm">edit</span>
              <span className="font-sans font-bold text-xs md:text-sm">Edit Profile</span>
            </div>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </button>

          <button 
            onClick={() => {
              const newEmail = prompt("Enter your new email address:", "alex@genius.app");
              if (newEmail) alert(`Email updated to ${newEmail}!`);
            }}
            className="w-full flex items-center justify-between p-3.5 bg-white border-2 border-[#1c1c18] hard-shadow rounded-xl active:translate-y-0.5 active:shadow-none transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined opacity-70 text-sm">mail</span>
              <div className="text-left">
                <span className="block font-sans font-bold text-xs md:text-sm">Email Address</span>
                <span className="text-[10px] font-mono text-[#5b403e]">alex@genius.app</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </button>

          <button 
            onClick={() => alert("Simulation: A change password email instruction link has been triggered to your mail inbox.")}
            className="w-full flex items-center justify-between p-3.5 bg-white border-2 border-[#1c1c18] hard-shadow rounded-xl active:translate-y-0.5 active:shadow-none transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined opacity-70 text-sm">lock</span>
              <span className="font-sans font-bold text-xs md:text-sm">Change Password</span>
            </div>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </button>

          {/* Subscription Promo banner card */}
          <div className="p-3.5 bg-[#fcd400] border-2 border-[#1c1c18] hard-shadow rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-[#1c1c18] text-[#fcd400] p-2 rounded-lg">
                <span className="material-symbols-outlined text-xs fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <div className="text-left">
                <span className="block font-sans font-extrabold text-xs md:text-sm text-[#1c1c18]">Premium Status</span>
                <span className="text-[9px] font-sans font-black text-[#1c1c18]/80 uppercase tracking-tight">
                  {stats.isPro ? 'Active • Pro Member' : 'INACTIVE • GET PRO'}
                </span>
              </div>
            </div>
            <button 
              onClick={openProFlow}
              className="bg-[#1c1c18] text-[#fcf9f2] hover:bg-[#b71422] text-[10px] font-sans font-black px-3.5 py-1.5 rounded-full hover:scale-105 active:scale-95 transition-transform uppercase"
            >
              {stats.isPro ? 'MANAGE' : 'GO PRO'}
            </button>
          </div>
        </div>
      </div>

      {/* Game Preferences */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b71422] text-xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>sports_esports</span>
          <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-wider text-[#1c1c18]">Game Preferences</h3>
        </div>

        <div className="bg-white border-2 border-[#1c1c18] hard-shadow rounded-xl overflow-hidden divide-y-2 divide-[#1c1c18]">
          {/* Sound toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined opacity-70 text-lg">volume_up</span>
              <span className="font-sans font-bold text-xs md:text-sm">Sound Effects</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={soundEffects} 
                onChange={() => setSoundEffects(!soundEffects)}
                className="sr-only peer" 
              />
              <div className="w-12 h-6 bg-[#e5e2db] rounded-full border-2 border-[#1c1c18] peer-checked:bg-[#b71422] transition-colors relative">
                <div className={`w-4 h-4 rounded-full bg-[#1c1c18] border border-[#1c1c18] absolute top-0.5 transition-transform duration-200 ${
                  soundEffects ? 'translate-x-6 bg-[#fcf9f2]' : 'translate-x-0.5'
                }`}></div>
              </div>
            </label>
          </div>

          {/* BG Music toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined opacity-70 text-lg">music_note</span>
              <span className="font-sans font-bold text-xs md:text-sm">Background Music</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={bgMusic} 
                onChange={() => setBgMusic(!bgMusic)}
                className="sr-only peer" 
              />
              <div className="w-12 h-6 bg-[#e5e2db] rounded-full border-2 border-[#1c1c18] peer-checked:bg-[#b71422] transition-colors relative">
                <div className={`w-4 h-4 rounded-full bg-[#1c1c18] border border-[#1c1c18] absolute top-0.5 transition-transform duration-200 ${
                  bgMusic ? 'translate-x-6 bg-[#fcf9f2]' : 'translate-x-0.5'
                }`}></div>
              </div>
            </label>
          </div>

          {/* Notifications toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined opacity-70 text-lg">notifications</span>
              <span className="font-sans font-bold text-xs md:text-sm">Push Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={notifications} 
                onChange={() => setNotifications(!notifications)}
                className="sr-only peer" 
              />
              <div className="w-12 h-6 bg-[#e5e2db] rounded-full border-2 border-[#1c1c18] peer-checked:bg-[#b71422] transition-colors relative">
                <div className={`w-4 h-4 rounded-full bg-[#1c1c18] border border-[#1c1c18] absolute top-0.5 transition-transform duration-200 ${
                  notifications ? 'translate-x-6 bg-[#fcf9f2]' : 'translate-x-0.5'
                }`}></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Difficulty select */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b71422] text-xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
          <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-wider text-[#1c1c18]">Difficulty Level</h3>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-white border-2 border-[#1c1c18] hard-shadow rounded-xl">
            <div className="flex gap-2">
              {(['EASY', 'MEDIUM', 'HARD'] as const).map((lvl) => {
                const isSelected = difficulty === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`flex-1 py-2.5 font-sans font-extrabold text-xs rounded-lg transition-all border-2 border-[#1c1c18] ${
                      isSelected 
                        ? 'bg-[#fcd400] hard-shadow-sm translate-y-[-2px]' 
                        : 'bg-white text-[#5c5c5c]'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rulebook Info Card */}
          <div className="p-4 bg-[#f1eee7] border-2 border-[#1c1c18] rounded-xl hard-shadow-sm select-none">
            <h4 className="font-sans font-extrabold text-[9px] uppercase tracking-widest text-[#5b403e] mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">info</span>
              Rulebook Panel
            </h4>
            <ul className="space-y-2.5 text-xs text-[#1c1c18]">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#b71422] mt-1.5 flex-shrink-0"></div>
                <p className="leading-tight"><span className="font-bold">EASY:</span> 15s timer, 3 choices, popular worldwide tracks.</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#fcd400] mt-1.5 flex-shrink-0"></div>
                <p className="leading-tight"><span className="font-bold">MEDIUM:</span> 10s timer, 4 choices, mixed catalog favorites.</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-black mt-1.5 flex-shrink-0"></div>
                <p className="leading-tight"><span className="font-bold">HARD:</span> 5s timer, 6 choices, obscure tracks & B-sides.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Content settings preferred genres */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b71422] text-xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>tune</span>
          <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-wider text-[#1c1c18]">Content Settings</h3>
        </div>

        <div className="space-y-3">
          {/* Explicit toggle */}
          <div className="p-4 bg-white border-2 border-[#1c1c18] hard-shadow rounded-xl flex items-center justify-between gap-3">
            <div className="flex flex-col text-left">
              <span className="font-sans font-bold text-xs md:text-sm">Explicit Content Filter</span>
              <span className="text-[10px] text-[#5b403e] mt-0.5">Hide lyrics with sensitive statements.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input 
                type="checkbox" 
                checked={explicitFilter} 
                onChange={() => setExplicitFilter(!explicitFilter)}
                className="sr-only peer" 
              />
              <div className="w-12 h-6 bg-[#e5e2db] rounded-full border-2 border-[#1c1c18] peer-checked:bg-[#b71422] transition-colors relative">
                <div className={`w-4 h-4 rounded-full bg-[#1c1c18] border border-[#1c1c18] absolute top-0.5 transition-transform duration-200 ${
                  explicitFilter ? 'translate-x-6 bg-[#fcf9f2]' : 'translate-x-0.5'
                }`}></div>
              </div>
            </label>
          </div>

          {/* Genre Preferences Filter */}
          <div className="p-4 bg-white border-2 border-[#1c1c18] hard-shadow rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-sans font-extrabold text-xs">Preferred Genres</span>
              <button onClick={handleResetGenres} className="text-[10px] text-[#b71422] font-semibold underline uppercase">RESET</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['HIP-HOP', 'POP', 'ROCK', 'R&B', 'INDIE'].map((g) => {
                const active = preferredGenres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 border-2 border-[#1c1c18] font-sans font-extrabold text-[10px] rounded-lg transition-transform ${
                      active 
                        ? 'bg-[#fcd400] hard-shadow-sm translate-y-[-1px]' 
                        : 'bg-[#f1eee7]'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b71422] text-xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-wider text-[#1c1c18]">Support & FAQ</h3>
        </div>

        <div className="bg-white border-2 border-[#1c1c18] hard-shadow rounded-xl overflow-hidden divide-y-2 divide-[#1c1c18]">
          <button 
            type="button"
            onClick={onLaunchTutorial} 
            className="w-full text-left flex items-center justify-between p-3.5 hover:bg-[#ebe8e1] bg-white transition-colors cursor-pointer text-xs font-bold font-sans"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">school</span>
              Replay Academy Tutorial
            </span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
          <a onClick={() => alert("Simulation: Redirecting to official support knowledge base center")} className="flex items-center justify-between p-3.5 hover:bg-[#ebe8e1] transition-colors cursor-pointer text-xs font-bold font-sans">
            <span>Help Center</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
          <a onClick={() => alert("Simulation: Redirecting to lyric-genius rules and Privacy Policies statement")} className="flex items-center justify-between p-3.5 hover:bg-[#ebe8e1] transition-colors cursor-pointer text-xs font-bold font-sans">
            <span>Privacy Policy</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
          <a onClick={() => alert("Simulation: Redirecting to lyric-genius Terms of Service statement")} className="flex items-center justify-between p-3.5 hover:bg-[#ebe8e1] transition-colors cursor-pointer text-xs font-bold font-sans">
            <span>Terms of Service</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Logout button */}
      <button 
        onClick={onLogout}
        className="w-full bg-[#b71422] text-[#fcf9f2] font-display font-black text-sm py-4 rounded-xl border-4 border-[#1c1c18] hard-shadow hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-3 uppercase cursor-pointer"
      >
        <span className="material-symbols-outlined text-md">logout</span>
        LOGOUT
      </button>

      {/* Footer credits string */}
      <div className="text-center pt-2">
        <p className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#5b403e]">
          Lyric Genius v4.2.0 • Made with Beat
        </p>
      </div>
    </div>
  );
}
