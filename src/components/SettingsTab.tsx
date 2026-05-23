import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  // Custom alert dialog state
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isPrompt?: boolean;
    onConfirm?: (val: string) => void;
  } | null>(null);
  const [dialogInput, setDialogInput] = useState('');

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
            onClick={() => setDialogConfig({
              isOpen: true,
              title: "Edit Profile Info",
              message: "Profile edits are simulated! You can customize your name and display details on the Profile tab easily."
            })}
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
              setDialogInput("alex@genius.app");
              setDialogConfig({
                isOpen: true,
                title: "Update Email Address",
                message: "Enter your new email address below to update your account link:",
                isPrompt: true,
                onConfirm: (val) => {
                  setDialogConfig({
                    isOpen: true,
                    title: "Email Updated",
                    message: `Successfully linked account email to ${val || 'alex@genius.app'}!`
                  });
                }
              });
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
            onClick={() => setDialogConfig({
              isOpen: true,
              title: "Reset Password Link",
              message: "Simulation Completed: A change password email instruction link has been triggered to your mail inbox."
            })}
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
          <button 
            type="button"
            onClick={() => setDialogConfig({
              isOpen: true,
              title: "Help Center",
              message: "Simulation: Redirecting to official support knowledge base center..."
            })} 
            className="w-full text-left flex items-center justify-between p-3.5 hover:bg-[#ebe8e1] bg-white transition-colors cursor-pointer text-xs font-bold font-sans border-0"
          >
            <span>Help Center</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
          <button 
            type="button"
            onClick={() => setDialogConfig({
              isOpen: true,
              title: "Privacy Policy",
              message: "Simulation: Redirecting to lyric-genius rules and Privacy Policies statement..."
            })} 
            className="w-full text-left flex items-center justify-between p-3.5 hover:bg-[#ebe8e1] bg-white transition-colors cursor-pointer text-xs font-bold font-sans border-0"
          >
            <span>Privacy Policy</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
          <button 
            type="button"
            onClick={() => setDialogConfig({
              isOpen: true,
              title: "Terms of Service",
              message: "Simulation: Redirecting to lyric-genius Terms of Service statement..."
            })} 
            className="w-full text-left flex items-center justify-between p-3.5 hover:bg-[#ebe8e1] bg-white transition-colors cursor-pointer text-xs font-bold font-sans border-0"
          >
            <span>Terms of Service</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
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

      {/* Stateful Custom Popups Modal */}
      <AnimatePresence>
        {dialogConfig && dialogConfig.isOpen && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 select-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              className="bg-[#fcf9f2] border-4 border-[#1c1c18] p-6 rounded-3xl max-w-sm w-full relative hard-shadow-lg sticker-rotate-1 text-center space-y-4"
            >
              <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#1c1c18]">
                {dialogConfig.title}
              </h3>
              <p className="font-sans text-xs text-[#5b403e] leading-relaxed">
                {dialogConfig.message}
              </p>

              {dialogConfig.isPrompt && (
                <input 
                  type="text"
                  value={dialogInput}
                  onChange={(e) => setDialogInput(e.target.value)}
                  className="w-full text-center h-11 border-2 border-[#1c1c18] rounded-xl font-sans font-semibold text-xs placeholder-[#c6c6c6] bg-white focus:ring-[#b71422] p-2 mt-2"
                />
              )}

              <div className="flex gap-2 pt-2">
                {dialogConfig.isPrompt && (
                  <button 
                    onClick={() => setDialogConfig(null)}
                    className="flex-1 bg-stone-200 hover:bg-stone-300 text-[#1c1c18] py-2.5 border-2 border-[#1c1c18] rounded-full font-sans font-extrabold text-[11px] uppercase transition-all shadow-xs active:translate-y-0.5"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={() => {
                    const finalVal = dialogInput;
                    setDialogConfig(null);
                    setDialogInput('');
                    if (dialogConfig.onConfirm) {
                      dialogConfig.onConfirm(finalVal);
                    }
                  }}
                  className="flex-1 bg-[#1c1c18] hover:bg-[#b71422] text-white py-2.5 rounded-full font-sans font-extrabold text-[11px] uppercase transition-colors hard-shadow-xs active:translate-y-0.5"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
