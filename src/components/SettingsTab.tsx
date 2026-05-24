import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tab, UserStats } from '../types';

interface SettingsTabProps {
  stats: UserStats;
  openProFlow: () => void;
  setCurrentTab: (tab: Tab) => void;
  updateProfile?: (username: string, avatar?: string) => void;
  onLogout: () => void;
  onLaunchTutorial: () => void;
}

export default function SettingsTab({
  stats,
  openProFlow,
  setCurrentTab,
  updateProfile,
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

  // Stateful Custom Modals
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState(stats.username || '');
  const [tempAvatar, setTempAvatar] = useState(stats.avatar || '');

  const [emailOpen, setEmailOpen] = useState(false);
  const [tempEmail, setTempEmail] = useState('alex@genius.app');
  const [emailSuccess, setEmailSuccess] = useState(false);

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [infoModalOpen, setInfoModalOpen] = useState<{isOpen: boolean; title: string; content: string}>({isOpen: false, title: '', content: ''});

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
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full pb-32 pt-4 px-4 max-w-md mx-auto space-y-8 select-none"
    >
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
            onClick={() => {
              setTempUsername(stats.username);
              setTempAvatar(stats.avatar);
              setEditProfileOpen(true);
            }}
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
              setEmailSuccess(false);
              setEmailOpen(true);
            }}
            className="w-full flex items-center justify-between p-3.5 bg-white border-2 border-[#1c1c18] hard-shadow rounded-xl active:translate-y-0.5 active:shadow-none transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined opacity-70 text-sm">mail</span>
              <div className="text-left">
                <span className="block font-sans font-bold text-xs md:text-sm">Email Address</span>
                <span className="text-[10px] font-mono text-[#5b403e]">{tempEmail}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </button>

          <button 
            onClick={() => {
              setPasswordSuccess(false);
              setPasswordOpen(true);
            }}
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
            onClick={() => setInfoModalOpen({
              isOpen: true,
              title: "Help Center",
              content: "Knowledge base is currently being updated for LyricGenius v2. Check back soon for detailed FAQs on scoring mechanics, matchmaking rules, and Pro features!"
            })} 
            className="w-full text-left flex items-center justify-between p-3.5 hover:bg-[#ebe8e1] bg-white transition-colors cursor-pointer text-xs font-bold font-sans border-0"
          >
            <span>Help Center</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
          <button 
            type="button"
            onClick={() => setInfoModalOpen({
              isOpen: true,
              title: "Privacy Policy",
              content: "We take your privacy seriously. Your profile data and match history are stored securely and never sold to third-party ad networks. We use your song choices to improve AI-generated setlists."
            })} 
            className="w-full text-left flex items-center justify-between p-3.5 hover:bg-[#ebe8e1] bg-white transition-colors cursor-pointer text-xs font-bold font-sans border-0"
          >
            <span>Privacy Policy</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
          <button 
            type="button"
            onClick={() => setInfoModalOpen({
              isOpen: true,
              title: "Terms of Service",
              content: "By playing Lyric Genius, you agree to respect your opponents. Cheating or using scraping bots to instantly guess lyrics will result in account suspension and wiping of lifetime XP tracking."
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
        {editProfileOpen && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 select-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              className="bg-[#fcf9f2] border-4 border-[#1c1c18] p-6 rounded-3xl max-w-sm w-full relative hard-shadow-lg text-center space-y-4"
            >
              <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#1c1c18]">
                Edit Profile
              </h3>
              <div className="space-y-4 text-left">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-4 border-[#1c1c18] overflow-hidden hard-shadow mb-3">
                    <img 
                      src={tempAvatar || 'https://images.unsplash.com/photo-1534308143481-c55f00be8fdb?q=80&w=250&auto=format&fit=crop'} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534308143481-c55f00be8fdb?q=80&w=250&auto=format&fit=crop';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="font-sans font-black text-[10px] uppercase tracking-wide">Avatar URL</label>
                  <input 
                    type="text"
                    value={tempAvatar}
                    onChange={(e) => setTempAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full h-11 px-3 mt-1 border-2 border-[#1c1c18] rounded-xl font-sans font-semibold text-xs placeholder-[#c6c6c6] bg-white focus:ring-[#b71422] focus:border-[#b71422]"
                  />
                </div>
                <div>
                  <label className="font-sans font-black text-[10px] uppercase tracking-wide">Username</label>
                  <input 
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    placeholder="Your artist name..."
                    className="w-full h-11 px-3 mt-1 border-2 border-[#1c1c18] rounded-xl font-sans font-semibold text-xs placeholder-[#c6c6c6] bg-white focus:ring-[#b71422] focus:border-[#b71422]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => setEditProfileOpen(false)}
                  className="flex-1 bg-stone-200 hover:bg-stone-300 text-[#1c1c18] py-2.5 border-2 border-[#1c1c18] rounded-full font-sans font-extrabold text-[11px] uppercase transition-all shadow-xs active:translate-y-0.5"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (updateProfile) {
                      updateProfile(tempUsername, tempAvatar);
                    }
                    setEditProfileOpen(false);
                  }}
                  className="flex-1 bg-[#1c1c18] hover:bg-[#b71422] text-white py-2.5 rounded-full font-sans font-extrabold text-[11px] uppercase transition-colors hard-shadow-xs active:translate-y-0.5"
                >
                  Save Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {emailOpen && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 select-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              className="bg-[#fcf9f2] border-4 border-[#1c1c18] p-6 rounded-3xl max-w-sm w-full relative hard-shadow-lg text-center space-y-4"
            >
              <span className="material-symbols-outlined text-4xl text-[#b71422] fill-1 block mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#1c1c18]">
                {emailSuccess ? 'Email Updated' : 'Update Email'}
              </h3>
              
              {!emailSuccess ? (
                <>
                  <p className="font-sans text-xs text-[#5b403e] leading-relaxed mb-4">
                    Enter your new email address to link with your account.
                  </p>
                  <input 
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full text-center h-12 border-2 border-[#1c1c18] rounded-xl font-sans font-semibold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#b71422] px-3 transition-shadow"
                    placeholder="student@example.com"
                  />
                  <div className="flex gap-2 pt-4">
                    <button 
                      onClick={() => setEmailOpen(false)}
                      className="flex-1 bg-stone-200 hover:bg-stone-300 text-[#1c1c18] py-3 border-2 border-[#1c1c18] rounded-full font-sans font-extrabold text-[11px] uppercase transition-all shadow-xs active:translate-y-0.5"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setEmailSuccess(true)}
                      className="flex-1 bg-[#1c1c18] hover:bg-[#b71422] text-white py-3 rounded-full font-sans font-extrabold text-[11px] uppercase transition-colors hard-shadow-xs active:translate-y-0.5"
                    >
                      Update
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-sans text-xs text-[#5c5c5c] leading-relaxed">
                    Successfully linked account to <strong className="text-[#1c1c18]">{tempEmail}</strong>! A verification link has been sent to confirm ownership.
                  </p>
                  <button 
                    onClick={() => setEmailOpen(false)}
                    className="w-full bg-[#1c1c18] hover:bg-[#b71422] text-white py-3 mt-4 rounded-full font-sans font-extrabold text-[11px] uppercase transition-colors hard-shadow-xs active:translate-y-0.5"
                  >
                    Got It
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}

        {passwordOpen && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 select-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              className="bg-[#fcf9f2] border-4 border-[#1c1c18] p-6 rounded-3xl max-w-sm w-full relative hard-shadow-lg text-center space-y-4"
            >
              <span className="material-symbols-outlined text-4xl text-[#1c1c18] fill-1 block mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
              <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#1c1c18]">
                {passwordSuccess ? 'Link Sent' : 'Reset Password'}
              </h3>
              
              {!passwordSuccess ? (
                <>
                  <p className="font-sans text-xs text-[#5b403e] leading-relaxed">
                    Would you like us to send a password reset link to your registered email address?
                  </p>
                  <div className="flex gap-2 pt-4">
                    <button 
                      onClick={() => setPasswordOpen(false)}
                      className="flex-1 bg-stone-200 hover:bg-stone-300 text-[#1c1c18] py-3 border-2 border-[#1c1c18] rounded-full font-sans font-extrabold text-[11px] uppercase transition-all shadow-xs active:translate-y-0.5"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setPasswordSuccess(true)}
                      className="flex-1 bg-[#1c1c18] hover:bg-[#b71422] text-white py-3 rounded-full font-sans font-extrabold text-[11px] uppercase transition-colors hard-shadow-xs active:translate-y-0.5"
                    >
                      Send Link
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-sans text-xs text-[#5c5c5c] leading-relaxed">
                    A secure password reset link has been dispatched to your inbox. It will expire in 15 minutes!
                  </p>
                  <button 
                    onClick={() => setPasswordOpen(false)}
                    className="w-full bg-[#1c1c18] hover:bg-[#b71422] text-white py-3 mt-4 rounded-full font-sans font-extrabold text-[11px] uppercase transition-colors hard-shadow-xs active:translate-y-0.5"
                  >
                    Close
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}

        {infoModalOpen.isOpen && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 select-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              className="bg-[#fcf9f2] border-4 border-[#1c1c18] p-6 rounded-[24px] max-w-sm w-full relative hard-shadow-lg text-center"
            >
              <h3 className="font-display font-black text-xl uppercase tracking-tight text-[#1c1c18] mb-3">
                {infoModalOpen.title}
              </h3>
              <p className="font-sans text-[13px] font-medium text-[#5b403e] leading-relaxed mb-6">
                {infoModalOpen.content}
              </p>
              <button 
                onClick={() => setInfoModalOpen({isOpen: false, title: '', content: ''})}
                className="w-full bg-[#1c1c18] hover:bg-[#b71422] text-white py-3 rounded-xl font-sans font-extrabold text-[11px] uppercase transition-colors hard-shadow-xs active:translate-y-0.5"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
