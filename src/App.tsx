import React, { useState, useEffect } from 'react';
import { Tab, UserStats } from './types';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeTab from './components/HomeTab';
import PlayTab from './components/PlayTab';
import DuelsTab from './components/DuelsTab';
import RanksTab from './components/RanksTab';
import ProfileTab from './components/ProfileTab';
import SettingsTab from './components/SettingsTab';
import ProFlow from './components/ProFlow';
import OnboardingTutorial from './components/OnboardingTutorial';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loginEmail, setLoginEmail] = useState('alex@genius.app');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // New onboarding tutorial visibility trigger
  const [showTutorial, setShowTutorial] = useState<boolean>(() => {
    const completed = localStorage.getItem('lyric_genius_tutorial_completed_v1');
    return completed !== 'true';
  });

  // Offline state monitoring
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // User Profile stats
  const [stats, setStats] = useState<UserStats>({
    diamonds: 1240,
    level: 15,
    xp: 12450,
    progressPercent: 85,
    isPro: false,
    topGenre: 'Pop',
    winRate: 78,
    globalRank: 450
  });

  // Action: Launch game with selected category or null (all)
  const startNewGame = (categoryName?: string) => {
    setSelectedCategory(categoryName || null);
    setCurrentTab('play');
  };

  // Action: Callback when trivia ends or triggers stats gains
  const handleUpdateStats = (xpGained: number, diamondsGained: number) => {
    setStats((prev) => {
      const nextXP = prev.xp + xpGained;
      const nextDiamonds = prev.diamonds + diamondsGained;

      // Handle custom Level progress increment formulas
      let nextProgress = prev.progressPercent + Math.floor(xpGained / 20);
      let nextLevel = prev.level;

      if (nextProgress >= 100) {
        nextLevel += 1;
        nextProgress = nextProgress % 100;
      }

      // Slightly increase win rate or adjust global rank for visual fidelity
      const nextWinRate = Math.min(98, prev.winRate + (xpGained > 1000 ? 1 : 0));
      const nextGlobalRank = Math.max(12, prev.globalRank - (xpGained > 1000 ? 5 : 0));

      return {
        ...prev,
        xp: nextXP,
        diamonds: nextDiamonds,
        progressPercent: nextProgress,
        level: nextLevel,
        winRate: nextWinRate,
        globalRank: nextGlobalRank
      };
    });
  };

  const handleUpgradeSuccess = () => {
    setStats((prev) => ({
      ...prev,
      isPro: true
    }));
  };

  const handleCompleteTutorial = (diamondsGained: number) => {
    localStorage.setItem('lyric_genius_tutorial_completed_v1', 'true');
    setShowTutorial(false);
    if (diamondsGained > 0) {
      handleUpdateStats(0, diamondsGained);
    }
  };

  const handleCloseTutorial = () => {
    localStorage.setItem('lyric_genius_tutorial_completed_v1', 'true');
    setShowTutorial(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentTab('home');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  // Render full screen login if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center p-4 select-none">
        <div className="bg-white border-4 border-[#1c1c18] p-6 md:p-8 rounded-[32px] max-w-sm w-full hard-shadow-lg text-center space-y-6 sticker-rotate-1">
          <div className="space-y-2">
            <div className="inline-block bg-[#fcd400] text-[#1c1c18] border-2 border-[#1c1c18] px-3.5 py-1 rounded-full font-sans font-black text-[10px] tracking-widest uppercase">
              PROVE YOUR METTLE
            </div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tighter italic leading-none">
              LYRIC GENIUS
            </h1>
            <p className="font-sans text-xs text-[#5b403e]">Beat questions, climb divisions, show your glory.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="font-sans font-black text-[10px] uppercase tracking-wide">Email Addr</label>
              <input 
                type="email" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                className="w-full h-11 px-3 border-2 border-[#1c1c18] rounded-lg font-sans font-semibold text-xs focus:ring-[#b71422] focus:border-[#b71422]" 
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-sans font-black text-[10px] uppercase tracking-wide">Pass phrase</label>
              <input 
                type="password" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                className="w-full h-11 px-3 border-2 border-[#1c1c18] rounded-lg font-sans font-semibold text-xs focus:ring-[#b71422]" 
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full h-12 bg-[#1c1c18] text-white hover:bg-[#b71422] font-display font-black text-xs uppercase tracking-widest rounded-full hard-shadow transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-[10px] font-sans text-stone-500 font-bold uppercase tracking-wider">
            Guest mode available • Live secure SSL connection
          </p>
        </div>
      </div>
    );
  }

  // Render Upgrade screen (PRO Stage) fullscreen
  if (currentTab === 'pro') {
    return (
      <ProFlow
        stats={stats}
        onUpgradeSuccess={handleUpgradeSuccess}
        onClose={() => setCurrentTab('settings')}
        setCurrentTab={setCurrentTab}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#1c1c18]">
      {/* Fixed top Header bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        stats={stats}
        isOffline={isOffline}
        showBack={currentTab === 'settings' || (currentTab === 'play' && selectedCategory !== null)}
        onBack={() => {
          if (currentTab === 'settings') {
            setCurrentTab('home');
          } else if (currentTab === 'play') {
            setSelectedCategory(null);
            setCurrentTab('home');
          }
        }}
      />

      {/* Primary Tab Viewport layout */}
      <div className="pt-20 pb-24 min-h-screen">
        {currentTab === 'home' && (
          <HomeTab
            setCurrentTab={setCurrentTab}
            startNewGame={startNewGame}
            stats={stats}
            updateStats={handleUpdateStats}
            isOffline={isOffline}
          />
        )}

        {currentTab === 'play' && (
          <PlayTab
            category={selectedCategory}
            setCategory={setSelectedCategory}
            stats={stats}
            updateStats={handleUpdateStats}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'duels' && (
          <DuelsTab
            stats={stats}
            setCurrentTab={setCurrentTab}
            startNewGame={startNewGame}
            updateStats={handleUpdateStats}
          />
        )}

        {currentTab === 'ranks' && (
          <RanksTab
            stats={stats}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileTab
            stats={stats}
            updateStats={handleUpdateStats}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsTab
            stats={stats}
            openProFlow={() => setCurrentTab('pro')}
            setCurrentTab={setCurrentTab}
            onLogout={handleLogout}
            onLaunchTutorial={() => setShowTutorial(true)}
          />
        )}
      </div>

      {/* Fixed bottom Navigation bar */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Onboarding Interactive Tutorial Overlay */}
      {showTutorial && (
        <OnboardingTutorial 
          onComplete={handleCompleteTutorial} 
          onClose={handleCloseTutorial} 
        />
      )}
    </div>
  );
}
