import React, { useState, useEffect, useRef } from 'react';
import { Tab, UserStats, MatchHistoryItem, Achievement } from '../types';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip 
} from 'recharts';

interface ProfileTabProps {
  stats: UserStats;
  updateStats: (xpGained: number, diamondsGained: number) => void;
  updateProfile?: (username: string, avatar?: string) => void;
  setCurrentTab: (tab: Tab) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#fcf9f2] border-2 border-[#1c1c18] px-3 py-1.5 rounded-xl font-sans font-black text-[11px] text-[#1c1c18] hard-shadow-sm select-none">
        <span className="uppercase">{payload[0].payload.name}: </span>
        <span className="text-[#b71422]">{payload[0].value}%</span>
      </div>
    );
  }
  return null;
};

interface AnimatedRPGCounterProps {
  value: number;
  className?: string;
}

const AnimatedRPGCounter = ({ value, className = '' }: AnimatedRPGCounterProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isCounting, setIsCounting] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value === prevValueRef.current) return;
    setIsCounting(true);
    
    const startValue = prevValueRef.current;
    const endValue = value;
    const duration = 1000; // ms transition duration
    const startTime = performance.now();
    let animFrame: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth arcade feel
      const easeOutQuad = progress * (2 - progress);
      const current = Math.floor(startValue + (endValue - startValue) * easeOutQuad);
      
      setDisplayValue(current);

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsCounting(false);
        prevValueRef.current = endValue;
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [value]);

  return (
    <motion.span
      animate={isCounting ? {
        scale: [1, 1.3, 0.95, 1.15, 1],
        y: [0, -4, 1, -1, 0],
        textShadow: [
          "0px 0px 0px rgba(183, 20, 34, 0)",
          "0px 2px 5px rgba(183, 20, 34, 0.5)",
          "0px 1px 2px rgba(183, 20, 34, 0.3)",
          "0px 0px 0px rgba(183, 20, 34, 0)"
        ],
      } : {}}
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
      className={`inline-block font-sans font-black ${className} ${isCounting ? 'text-[#b71422] transition-colors duration-100' : ''}`}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
};

export default function ProfileTab({ stats, updateStats, updateProfile, setCurrentTab }: ProfileTabProps) {
  const [localUsername, setLocalUsername] = useState(stats.username);
  
  // Sync if stats.username changes externally
  useEffect(() => {
    setLocalUsername(stats.username);
  }, [stats.username]);

  const [isEditing, setIsEditing] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const achievements: Achievement[] = [
    { id: '1', title: '5 Day Streak', icon: 'local_fire_department', colorClass: 'bg-[#fcd400]', unlocked: true },
    { id: '2', title: 'Lyric Legend', icon: 'verified', colorClass: 'bg-[#ffdad7]', unlocked: true },
    { id: '3', title: 'Perfect Game', icon: 'stars', colorClass: 'bg-[#ebe8e1]', unlocked: true },
    { id: '4', title: 'Early Bird', icon: 'lock', colorClass: 'bg-[#e5e2db]', unlocked: false }
  ];

  const initialMatches: MatchHistoryItem[] = [
    { id: 'm-1', song: 'Cruel Summer', artist: 'Taylor Swift', xp: 250, bgType: 'primary' },
    { id: 'm-2', song: 'Blinding Lights', artist: 'The Weeknd', xp: 180, bgType: 'secondary' },
    { id: 'm-3', song: 'Flowers', artist: 'Miley Cyrus', xp: 320, bgType: 'tertiary' }
  ];

  const [historyMatches, setHistoryMatches] = useState<MatchHistoryItem[]>(initialMatches);

  const radarData = [
    { name: 'Pop', value: Math.min(99, Math.floor(stats.winRate + 14)) },
    { name: 'Rock', value: Math.min(95, Math.floor(stats.winRate - 2)) },
    { name: 'Hip Hop', value: Math.min(92, Math.floor(stats.winRate - 12)) },
    { name: '90s Hits', value: Math.min(98, Math.floor(stats.winRate + 7)) }
  ];

  return (
    <div className="w-full pb-24 pt-4 px-4 max-w-lg md:max-w-2xl mx-auto space-y-8 select-none">
      {/* Profile Header Block */}
      <section className="flex flex-col items-center mt-2 text-center">
        <div className="relative">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#1c1c18] overflow-hidden hard-shadow sticker-rotate-1">
            <img 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
              src={stats.avatar || "https://images.unsplash.com/photo-1534308143481-c55f00be8fdb?q=80&w=250&auto=format&fit=crop"} 
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#fcd400] text-[#1c1c18] border-2 border-[#1c1c18] px-3 py-1 rounded-lg hard-shadow-sm font-sans font-black text-xs rotate-12 flex items-center gap-0.5">
            LVL <AnimatedRPGCounter value={stats.level} />
          </div>
        </div>

        {/* Username with inline edit */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {isEditing ? (
            <input 
              type="text"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
              onBlur={() => {
                setIsEditing(false);
                if (updateProfile) updateProfile(localUsername, stats.avatar);
              }}
              onKeyDown={(e) => { 
                if (e.key === 'Enter') {
                  setIsEditing(false);
                  if (updateProfile) updateProfile(localUsername, stats.avatar);
                } 
              }}
              autoFocus
              className="font-display font-black text-2xl uppercase text-center border-b-2 border-[#b71422] focus:outline-none bg-transparent max-w-[220px]"
            />
          ) : (
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-[#1c1c18]">
              {stats.username}
            </h2>
          )}
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="material-symbols-outlined text-sm text-[#b71422] p-1 hover:bg-[#e5e2db] rounded-full"
            aria-label="Edit Nickname"
          >
            edit
          </button>
        </div>

        <p className="mt-2 text-xs font-sans font-extrabold text-[#b71422] bg-[#ffdad7] px-4 py-1.5 rounded-full border-2 border-[#b71422] uppercase tracking-wide">
          {stats.isPro ? 'PRO MEMBER🌟' : 'FREE PLAYER'}
        </p>
      </section>

      {/* Stats Grid Dashboard */}
      <section className="grid grid-cols-2 gap-4">
        {/* Total XP */}
        <div className="bg-white border-2 border-[#1c1c18] p-4 rounded-xl hard-shadow flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-[#705d00] mb-1 text-2xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          <p className="font-sans text-[10px] uppercase font-extrabold text-[#5b403e]">Total XP</p>
          <p className="font-display font-black text-lg md:text-xl text-[#1c1c18] mt-1">
            <AnimatedRPGCounter value={stats.xp} />
          </p>
        </div>

        {/* Win Rate */}
        <div className="bg-white border-2 border-[#1c1c18] p-4 rounded-xl hard-shadow flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-[#b71422] mb-1 text-2xl">insights</span>
          <p className="font-sans text-[10px] uppercase font-extrabold text-[#5b403e]">Win Rate</p>
          <p className="font-display font-black text-lg md:text-xl text-[#1c1c18] mt-1">{stats.winRate}%</p>
        </div>

        {/* Top Genre */}
        <div className="bg-white border-2 border-[#1c1c18] p-4 rounded-xl hard-shadow flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-[#705d00] mb-1 text-2xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
          <p className="font-sans text-[10px] uppercase font-extrabold text-[#5b403e]">Top Genre</p>
          <p className="font-display font-black text-lg md:text-xl text-[#1c1c18] mt-1 uppercase">{stats.topGenre}</p>
        </div>

        {/* Global Rank */}
        <div className="bg-white border-2 border-[#1c1c18] p-4 rounded-xl hard-shadow flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-[#5c5c5c] mb-1 text-2xl">public</span>
          <p className="font-sans text-[10px] uppercase font-extrabold text-[#5b403e]">Global Rank</p>
          <p className="font-display font-black text-lg md:text-xl text-[#1c1c18] mt-1">#{stats.globalRank}</p>
        </div>
      </section>

      {/* Genre Proficiency Section with Radar Chart */}
      <section className="space-y-3">
        <h3 className="font-display font-extrabold text-lg uppercase flex items-center gap-2 italic tracking-tight text-[#1c1c18]">
          <span className="material-symbols-outlined text-[#b71422]">radar</span>
          Genre Proficiency
        </h3>
        <div className="bg-white border-2 border-[#1c1c18] p-5 rounded-[24px] hard-shadow flex flex-col items-center">
          <p className="font-sans text-[10px] font-extrabold text-[#5b403e] uppercase mb-4 tracking-wider text-center">
            Accuracy and response speed by musical core
          </p>
          <div className="w-full h-[220px]">
            {isMounted ? (
              <ResponsiveContainer width="99%" height={220}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#1c1c18" strokeOpacity={0.15} strokeWidth={1} />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ fill: '#1c1c18', fontSize: 10, fontWeight: 800, fontFamily: 'sans-serif' }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tickCount={4} 
                    tick={false} 
                    axisLine={false} 
                  />
                  <Radar
                    name="Proficiency"
                    dataKey="value"
                    stroke="#b71422"
                    strokeWidth={2}
                    fill="#ff5a1f"
                    fillOpacity={0.25}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center font-sans text-xs text-gray-400 font-bold">
                Loading Radar metrics...
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 w-full mt-4 pt-4 border-t-2 border-[#1c1c18]/10 text-center">
            {radarData.map((genre) => (
              <div key={genre.name}>
                <p className="font-sans text-[9px] uppercase font-black text-[#5b403e] truncate">{genre.name}</p>
                <p className="font-display font-black text-sm text-[#b71422] mt-0.5">{genre.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Horizontal Grid */}
      <section className="space-y-3">
        <h3 className="font-display font-extrabold text-lg uppercase flex items-center gap-2 italic tracking-tight text-[#1c1c18]">
          <span className="material-symbols-outlined text-[#705d00] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
          Achievements
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              className={`snap-center flex flex-col items-center min-w-[100px] transition-transform duration-100 hover:scale-105 ${
                ach.unlocked ? '' : 'opacity-40'
              }`}
            >
              <div className={`${ach.colorClass} w-20 h-20 border-2 border-[#1c1c18] rounded-full flex items-center justify-center hard-shadow-sm mb-2 relative`}>
                <span 
                  className="material-symbols-outlined text-[32px] text-[#1c1c18] fill-1"
                  style={{ fontVariationSettings: ach.unlocked ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {ach.icon}
                </span>
              </div>
              <span className="font-sans font-bold text-xs text-center leading-tight tracking-tight text-[#1c1c18]">
                {ach.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Match History */}
      <section className="space-y-4">
        <h3 className="font-display font-extrabold text-lg uppercase flex items-center gap-2 italic tracking-tight text-[#1c1c18]">
          <span className="material-symbols-outlined text-[#b71422]">history</span>
          Recent Matches
        </h3>
        <div className="space-y-3">
          {historyMatches.map((m) => (
            <div 
              key={m.id}
              className="bg-white border-2 border-[#1c1c18] p-4 rounded-xl flex items-center gap-4 hard-shadow-sm transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <div className={`w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center ${
                m.bgType === 'primary' ? 'bg-[#b71422]' : m.bgType === 'secondary' ? 'bg-[#fcd400]' : 'bg-[#747474]'
              }`}>
                <span className="material-symbols-outlined text-white text-xl">play_circle</span>
              </div>
              <div className="flex-grow min-w-0 pr-1">
                <p className="font-sans font-extrabold text-sm text-[#1c1c18] truncate">{m.song}</p>
                <p className="font-sans text-xs text-[#5b403e] truncate">{m.artist}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display font-black text-sm text-[#b71422]">+{m.xp} XP</p>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setShowHistoryModal(true)}
          className="w-full mt-2 py-4 bg-[#1c1c18] text-white font-display font-black text-sm uppercase rounded-full hard-shadow hover:bg-[#b71422] hover:text-white transition-colors active:translate-y-1 active:shadow-none"
        >
          View All Games
        </button>
      </section>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-[#31312c]/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#fcf9f2] border-4 border-[#1c1c18] p-6 rounded-3xl max-w-sm w-full relative hard-shadow-lg sticker-rotate-1">
            <button 
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-3 right-3 material-symbols-outlined text-xl text-[#b71422] hover:bg-[#e5e2db] p-1.5 rounded-full"
            >
              close
            </button>
            <div className="text-center space-y-4">
              <span className="material-symbols-outlined text-4xl text-[#b71422]">stars</span>
              <h3 className="font-display font-black text-xl uppercase tracking-tight">Full Match History</h3>
              <p className="font-sans text-xs text-[#5b403e]">Here are all of your match listings played historically on Lyric Genius:</p>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 border-t-2 border-b-2 border-[#1c1c18] py-3 text-left">
                {[
                  { title: "Cruel Summer", xp: "250 XP", date: "May 23, 11:34 AM" },
                  { title: "Blinding Lights", xp: "180 XP", date: "May 23, 10:15 AM" },
                  { title: "Flowers", xp: "320 XP", date: "May 22, 11:00 PM" },
                  { title: "Smells Like Teen Spirit", xp: "500 XP", date: "May 22, 09:40 PM" },
                  { title: "Never Gonna Give You Up", xp: "410 XP", date: "May 21, 04:30 PM" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-white border border-[#1c1c18] rounded-lg">
                    <div>
                      <div className="font-sans font-bold text-xs">{item.title}</div>
                      <div className="text-[10px] text-[#5b403e]">{item.date}</div>
                    </div>
                    <div className="font-display font-black text-xs text-[#b71422]">+{item.xp}</div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="w-full bg-[#1c1c18] text-white py-2.5 rounded-full font-sans font-extrabold text-xs uppercase hover:bg-[#b71422]"
              >
                CLOSE HISTORIC DEFI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
