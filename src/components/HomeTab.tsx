import React, { useState } from 'react';
import { Tab, UserStats, ActivityItem } from '../types';
import { motion } from 'motion/react';

interface HomeTabProps {
  setCurrentTab: (tab: Tab) => void;
  startNewGame: (category?: string) => void;
  stats: UserStats;
  updateStats?: (xpGained: number, diamondsGained: number) => void;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  claimed: boolean;
  icon: string;
}

export default function HomeTab({ setCurrentTab, startNewGame, stats, updateStats }: HomeTabProps) {
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Daily engagement login streak tracking
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('login_streak_count');
    if (saved) return parseInt(saved, 10);
    return 3; // start with a solid 3-day series
  });
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(() => {
    const lastCheck = localStorage.getItem('last_streak_check_in');
    const todayStr = new Date().toDateString();
    return lastCheck === todayStr;
  });

  // Daily Quests State Loaded with LocalStorage Persistence
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('lyric_genius_daily_quests_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Sync streak checked-in status dynamically
        const lastCheck = localStorage.getItem('last_streak_check_in');
        const checkedInToday = lastCheck === new Date().toDateString();
        return parsed.map((q: Quest) => {
          if (q.id === 'quest-streak') {
            return { ...q, current: checkedInToday ? 1 : q.current };
          }
          return q;
        });
      } catch (e) {
        // Fallback
      }
    }
    
    const lastCheck = localStorage.getItem('last_streak_check_in');
    const checkedInToday = lastCheck === new Date().toDateString();

    return [
      {
        id: 'quest-pop',
        title: 'Pop Prodigy',
        description: 'Solve 3 Pop trivia games',
        target: 3,
        current: 0,
        reward: 35,
        claimed: false,
        icon: 'music_note'
      },
      {
        id: 'quest-duel',
        title: 'Gladiator Clash',
        description: 'Start 1 match in the Duels Arena',
        target: 1,
        current: 0,
        reward: 25,
        claimed: false,
        icon: 'swords'
      },
      {
        id: 'quest-streak',
        title: 'Streak Master',
        description: 'Check in for your streak today',
        target: 1,
        current: checkedInToday ? 1 : 0,
        reward: 20,
        claimed: false,
        icon: 'local_fire_department'
      }
    ];
  });

  // Confetti details state type
  interface ConfettiItem {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotate: number;
    scale: number;
  }

  const [confetti, setConfetti] = useState<ConfettiItem[]>([]);

  const triggerConfetti = () => {
    const colors = ['#fcd400', '#ff5a1f', '#b71422', '#3b82f6', '#10b981', '#a855f7'];
    const newConfetti = Array.from({ length: 45 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 140;
      return {
        id: Date.now() + i + Math.random(),
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 40, // slightly lift center of explosion
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 8,
        rotate: Math.random() * 720 - 360,
        scale: 0.5 + Math.random() * 1.0,
      };
    });
    setConfetti(newConfetti);
    setTimeout(() => {
      setConfetti([]);
    }, 2500);
  };

  const handleCheckIn = () => {
    if (hasCheckedInToday) {
      setShowNotification("Streak already locked in today! Stay tuned for tomorrow! 🔥");
      return;
    }

    const todayStr = new Date().toDateString();
    const newStreak = streak + 1;
    setStreak(newStreak);
    setHasCheckedInToday(true);
    localStorage.setItem('login_streak_count', newStreak.toString());
    localStorage.setItem('last_streak_check_in', todayStr);

    if (updateStats) {
      updateStats(0, 25); // Free 25 diamonds for daily activity
    }

    // Set streak quest to complete immediately
    setQuests(prev => {
      const updated = prev.map(q => q.id === 'quest-streak' ? { ...q, current: 1 } : q);
      localStorage.setItem('lyric_genius_daily_quests_v1', JSON.stringify(updated));
      return updated;
    });

    triggerConfetti();
    setShowNotification(`Daily Streak Extended! ${newStreak} consecutive days logged in! (+25 Diamonds) 💎🔥`);
  };

  const handleStartGame = (categoryName?: string, isDuel = false) => {
    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.id === 'quest-pop' && categoryName === 'Pop') {
          return { ...q, current: Math.min(q.target, q.current + 1) };
        }
        if (q.id === 'quest-duel' && isDuel) {
          return { ...q, current: Math.min(q.target, q.current + 1) };
        }
        return q;
      });
      localStorage.setItem('lyric_genius_daily_quests_v1', JSON.stringify(updated));
      return updated;
    });

    startNewGame(categoryName);
  };

  const advanceQuest = (questId: string) => {
    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.id === questId) {
          return { ...q, current: Math.min(q.target, q.current + 1) };
        }
        return q;
      });
      localStorage.setItem('lyric_genius_daily_quests_v1', JSON.stringify(updated));
      return updated;
    });
    
    // Notify
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      const nextProgress = Math.min(quest.target, quest.current + 1);
      if (nextProgress === quest.target) {
        setShowNotification(`Quest "${quest.title}" Completed! Claim your reward! 💎✨`);
      } else {
        setShowNotification(`Increased progress for "${quest.title}"! (${nextProgress}/${quest.target})`);
      }
    }
  };

  const claimQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;
    if (quest.current < quest.target) {
      setShowNotification(`Quest "${quest.title}" is not complete yet!`);
      return;
    }
    if (quest.claimed) {
      setShowNotification("Quest already claimed!");
      return;
    }

    if (updateStats) {
      updateStats(0, quest.reward); // Award diamonds
    }
    
    setQuests(prev => {
      const updated = prev.map(q => q.id === questId ? { ...q, claimed: true } : q);
      localStorage.setItem('lyric_genius_daily_quests_v1', JSON.stringify(updated));
      return updated;
    });

    triggerConfetti();
    setShowNotification(`Claimed ${quest.title}! Received +${quest.reward} Diamonds! 💎🎉`);
  };

  const categories = [
    {
      id: 'pop',
      name: 'Pop',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIu8IyE0c4rQ6FLXcl80R8dJIeyJdE3ZY3Qiefj92E7gL41x4qkfKfeKQvkfe380tsviHrQM7xS5Jb3XKAG31s-3OaZCdmjAe6WPKjf3EmQWepKkUg44xBF7cGFhARaZaQ3MYB43U3WBMltjHbqwzPgJL-xaoaCbSaldUqobW327pc5POUYKbojY7Dv9IQx8_Uj5D6OaY76Fl1pSgAfERF9jiPOy_dKXM4q0MSOZM57OnSoaHpNk5fm82ViavAyHT_X7PMUyQFL54'
    },
    {
      id: 'rock',
      name: 'Rock',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXWMYrMC5K9tuoRF3x2WvO8i_Nybi2LptQ9qnCG8QoYjs6VKAptda_ZSxmQjp1zhau2U6iAppk0aRMKL9glK7os7jqQmt8fWvyaW6mdQ5Sh9GX6VtYSPvoeRtCWl2AOY6A17PmQxDyxOq5UcE1y7-LnvYY5mflKVEW4xJTTh5Y80v2EcVqeWkcXSheRiQ2TvlD1jbpk80BokbAFxlC8PkQd_bNAnodnKQyXwyxAJY_6aAgNw6mNU1CfMP55pjFBd8ioFuzhz6HHyk'
    },
    {
      id: 'hip-hop',
      name: 'Hip Hop',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP6Aie0-pfqWdPMBQUnzoDfisHAgRAmzi3z4keCxhq8IMsk_9VW7eMIBhyKX9YzbWF2BeP83grqq-oPaChnczJuPQcH6a5z4JbAO6a9DQwkLtTM4244KlPRwJwda7VNbT2lqNSxZRxCK6ekE_3dd0rBwla9MQXqZnG8bgyyMhejR-p49_A2iJZYM-9v6jK35swmQx_hmQjIlhko0OXfZr5iJYZJ8cOl6XsGKsTMcwqCHACgveTLc1nLS1YpDZtJ7XDBQrwM7TLTuA'
    },
    {
      id: '90s',
      name: '90s Hits',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUEhPz2QpCyC3-Mxw2tW-eXqx2KkuSCRvVKE5uhRabU_JKBd1bRC1loiPtz9h58MuR1a7ch55dFiRZuaxFjWS4gx7m8_4EbESz22uHqmVwJYAn7M2qw2YyNiZuC0h3R8mzFsKbhWciIkwMRqcUhInKXWhamUMCjsqxMNxwA16HiPngJoiRV9iiAYYqbK6Ps6g2RCVfO4xsAR2OSKpzSfOr2yvYoy0ijYQp8hCBU0MVkdDct_yCNVQmVu8svei4rPwQeXbxqkbATiM'
    }
  ];

  const feedItems: ActivityItem[] = [
    {
      id: 'feed-1',
      user: 'Sarah Miller',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbZnkj-iEWF49FDN8sD-0mZRVR-QoXSo2TLvvh5vaLBSTRsy8ATpTIg2jrNgzgKCAJi8HYRlDXa7HNRzr5tLrf2wJPTQqcYwYKjTxo0QRkZdhakV7yzNfDWFc0ntsIQisR5Jyi1COLCQX-EZDGjHoWl3e3EqAbBeubIN_lcMNH6g0-nic1Z96gPVyEALp8R1M7fSh1le7K-QapTi5lRVmLSREmihoC7qrLs0TN9CgW4tGYE1oeAZAi9n8QdgACjvQ3GWkRTgHliFQ',
      actionHTML: `just crushed <span class="font-bold text-[#b71422]">"90s Grunge"</span>`,
      timeAgo: '2 mins ago',
      points: 2450
    },
    {
      id: 'feed-achievement-1',
      user: 'LyricLord_42 (You)',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfya1JIZVF9_ZuIdT78cnlpRnt0ceyR9zulAfjbX1ubG2ia369xjbQLtREb75UTHJ28eEuOHx_0r-NVlCRIyWNCAof7qOH8hDmofRgjV7VNzBvb0hpIjcH26PgWEGddM48w-NsJvKSjyqsLxVg6g6oojqEB5BnD5ssVJ3Sf7Dv5iBbBZO95twEbjqEJ74Nn7LcUFbsv2gI8faXaNdf_jfo5zTwFEgMuoKf89u-LgmUPYj0gI_BdlAVGJUzBzf6BogBHZwFYFgdht4',
      actionHTML: `unlocked the supreme achievement <span class="font-bold text-[#b71422]">🏆 "Superstar Lyricist"</span>!`,
      timeAgo: '5 mins ago',
      isAchievement: true,
      shareText: `Boom! I just unlocked the superstar achievement 🏆 'Superstar Lyricist' in Lyric Genius ! Can you beat my high score and identify lyric clips as fast? 🎵⚡`
    },
    {
      id: 'feed-2',
      user: 'Mike Chen',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsHJc28JIddsaf4GmqGtDtVyQo1hgjP4XJ2mykQnSfzBcX8r54LJJ7Ii4JbwVJ7gWbl9EIoil9d1cTLdYaeActCPXtMIsgmdnAaxBdmgJRl1eB8dh9o9thbhUtcj1T6yCfcC8Wm92qcc73wJnYxUxvrdpJ3cVGRcMJfQkkeMZ4XZNLXh8iTX23TmmPAgKmqAWJ4ajgeHR2EfP-Cw-veaCEcj81JSOBuI_3VBepXiSUkyCRyy4x8yR1CvaTphnz0Cb9l2s0LrfUfcM',
      actionHTML: `challenged you to <span class="font-bold text-[#b71422]">"Pop Classics"</span>`,
      timeAgo: '15 mins ago',
      hasAcceptButton: true,
      challengeGenre: 'Pop'
    },
    {
      id: 'feed-achievement-2',
      user: 'LyricLord_42 (You)',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfya1JIZVF9_ZuIdT78cnlpRnt0ceyR9zulAfjbX1ubG2ia369xjbQLtREb75UTHJ28eEuOHx_0r-NVlCRIyWNCAof7qOH8hDmofRgjV7VNzBvb0hpIjcH26PgWEGddM48w-NsJvKSjyqsLxVg6g6oojqEB5BnD5ssVJ3Sf7Dv5iBbBZO95twEbjqEJ74Nn7LcUFbsv2gI8faXaNdf_jfo5zTwFEgMuoKf89u-LgmUPYj0gI_BdlAVGJUzBzf6BogBHZwFYFgdht4',
      actionHTML: `attained absolute mastery rating <span class="font-bold text-[#b71422]">⭐ "Perfect Century"</span>!`,
      timeAgo: '3 hours ago',
      isAchievement: true,
      shareText: `Perfect 100% Score! ⭐ I unlocked the 'Perfect Century' mastery badge in Lyric Genius. Come try the ultimate lyric trivia! 👑🎵`
    },
    {
      id: 'feed-3',
      user: 'Emma Wilson',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKv-L2oYHx0vnmzQdAyIZ5nRzKlOOwh67P0X8krORJ2VaDEqTBcFwN3dFfOGlKvVpCybwFfYXj0-qOAxCmbX_-Drn2ThBTpEXUDqDbAoaFohN7_BtBMdBGoILh8As_gROt41aTw9fyvJRu-7We-TJB4oBgFCRjESo-VM5WfkQZPnuDaz45NGZ2zjdyHStzuJ0mOcCRJEk964h6_mt5mNSd7ZTm0014KwClv6G7LgNM7YTm2emq_sQFsIOW4RIbaM-Y79qrsKMOIyg',
      actionHTML: `set a new personal record in <span class="font-bold text-[#b71422]">"Disney Classics"</span>`,
      timeAgo: '1 hour ago',
      points: 3100
    }
  ];

  const triggerAddNotification = () => {
    setShowNotification("Choose a friend to challenge! Mike, Sarah, and Emma are online.");
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  const handleShareAchievement = (text: string | undefined) => {
    if (!text) return;

    const copySuccess = () => {
      setShowNotification("Achievement shared! Pre-filled text copied to clipboard! 📋🎉");
      setTimeout(() => {
        setShowNotification(p => p?.includes("copied to clipboard") ? null : p);
      }, 3500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(copySuccess)
        .catch(() => {
          setShowNotification("Failed to copy! Please select and copy manually.");
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        copySuccess();
      } catch (err) {
        setShowNotification("Clipboard access not supported in this browser!");
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="w-full pb-28 pt-4 px-4 max-w-lg md:max-w-2xl mx-auto space-y-8 select-none">
      {/* Toast Alert */}
      {showNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#fcd400] text-[#1c1c18] border-2 border-[#1c1c18] px-4 py-3 rounded-xl font-sans font-bold text-sm hard-shadow flex items-center justify-between gap-2 max-w-sm">
          <span>{showNotification}</span>
          <button onClick={() => setShowNotification(null)} className="material-symbols-outlined text-sm font-bold">close</button>
        </div>
      )}

      {/* HomeTab Header Panel with Daily Login Streak */}
      <div className="bg-[#fefce8] border-2 border-[#1c1c18] rounded-[24px] p-4 md:p-5 hard-shadow flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="relative w-12 h-12 bg-[#fcd400] border-2 border-[#1c1c18] rounded-full flex items-center justify-center text-xl shadow-sm select-none">
            ⚡
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#b71422] border-2 border-[#1c1c18] rounded-full flex items-center justify-center text-[9px] text-white font-black">
              {stats.level}
            </div>
          </div>
          <div>
            <h2 className="font-display font-black text-sm md:text-md uppercase leading-tight tracking-tight">
              Welcome Back, Lyricist!
            </h2>
            <p className="font-sans text-[10px] text-[#5b403e] font-semibold">
              {hasCheckedInToday 
                ? "Daily streak locked! Come back tomorrow!" 
                : "Extend your daily login streak today!"
              }
            </p>
          </div>
        </div>

        {/* Streak action badge */}
        <div className="flex items-center relative">
          {/* Confetti Explosion System */}
          {confetti.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: p.x,
                y: [0, p.y - 40, p.y + 120], // subtle vertical arc gravity effect
                scale: [0, p.scale, p.scale * 0.4],
                opacity: [1, 1, 0],
                rotate: p.rotate
              }}
              transition={{
                duration: 1.6 + Math.random() * 0.8,
                ease: "easeOut"
              }}
              className="absolute pointer-events-none rounded-xs select-none"
              style={{
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                zIndex: 40,
                left: '50%',
                top: '50%',
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
              }}
            />
          ))}

          <motion.button
            onClick={handleCheckIn}
            className={`flex items-center gap-1.5 px-4 py-2 border-2 border-[#1c1c18] rounded-full font-display font-black text-xs uppercase tracking-wider transition-all shadow-sm ${
              hasCheckedInToday
                ? 'bg-[#1c1c18] text-white cursor-default'
                : 'bg-[#ff5a1f] text-[#fcf9f2] hover:bg-[#ff7b47] hover:scale-105 active:translate-y-0.5 cursor-pointer'
            }`}
            animate={!hasCheckedInToday ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={!hasCheckedInToday ? {
              duration: 2.0,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
            whileHover={!hasCheckedInToday ? { scale: 1.08 } : {}}
            whileTap={!hasCheckedInToday ? { scale: 0.95 } : {}}
          >
            <span className="material-symbols-outlined text-sm md:text-md fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <span className="font-sans font-black">
              {streak} Days Active
            </span>
            {!hasCheckedInToday && (
              <span className="inline-flex items-center justify-center bg-[#fcd400] text-[#1c1c18] border border-[#1c1c18] text-[8px] px-1.5 py-0.5 rounded-full font-sans font-black ml-1 uppercase animate-pulse">
                Claim
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Hero Segment: Daily Challenge */}
      <section className="relative group mt-2">
        <div className="bg-[#db3237] rounded-[24px] border-2 border-[#1c1c18] hard-shadow p-5 md:p-8 overflow-hidden flex flex-col md:flex-row items-center gap-6 sticker-rotate-3">
          <div className="flex-1 space-y-3 text-center md:text-left z-10">
            <div className="inline-block bg-[#fcd400] text-[#1c1c18] px-3 py-1 border-2 border-[#1c1c18] rounded-full font-sans font-bold uppercase text-[10px] tracking-widest mb-1">
              Today's Hot Hit
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-white leading-tight uppercase">
              Guess The <br /> Bridge: <span className="underline decoration-white">Cruel Summer</span>
            </h2>
            <p className="font-sans text-white text-xs md:text-sm leading-relaxed opacity-95 max-w-md">
              Taylor fans are failing this. Can you nail the bridge and win 50 bonus diamonds?
            </p>
            <div className="pt-2">
              <button 
                onClick={() => handleStartGame('Pop')}
                className="bg-[#1c1c18] text-[#fcf9f2] hover:bg-[#b71422] hover:text-white px-6 py-3 rounded-full font-sans font-extrabold text-xs md:text-sm hard-shadow-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                PLAY NOW
              </button>
            </div>
          </div>
          <div className="relative w-full md:w-5/12 h-44 md:h-52 sticker-rotate-2 flex-shrink-0">
            <img 
              alt="Live concert"
              className="w-full h-full object-cover rounded-xl border-2 border-[#1c1c18]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCabi4mH5zV8_EAOKwVg_SicXQx45E_g2BaJr9SSza5ywpomRoncUcybKQB9aqJyH7wmtyHUgGffKzYaOcJGDM6irLjqLfu_LROVpD5vi1TCMhnJIU8J0zwxv-Ts1fYJNVHA0MMfQ_qXQVmGMvAupWINUsO79fZYBzQB7srPwoO56JwFRiTklZbBDcdU-O0wAZkchGdhrAn0O761HUoXiTgox3iQEethdtrrLFrR2NZLgLJgCZLrD7P7Ad9jdK43OkTDko3j_5nO6Y" 
            />
            <div className="absolute -top-3 -right-3 bg-[#fcd400] p-2 border-2 border-[#1c1c18] rounded-xl hard-shadow-sm rotate-12">
              <span className="material-symbols-outlined text-[#1c1c18] text-xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Quests Component Section */}
      <section className="bg-white border-2 border-[#1c1c18] rounded-[24px] p-4.5 md:p-5 hard-shadow space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5a1f] text-2xl fill-1 animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            <div>
              <h3 className="font-display font-black text-sm uppercase text-[#1c1c18] tracking-tight">
                Daily Quests
              </h3>
              <p className="font-sans text-[10px] text-[#5b403e] font-black">
                Achieve micro-goals to fetch free bonus diamonds!
              </p>
            </div>
          </div>
          <div className="bg-[#f1eee7] border border-[#1c1c18] px-2.5 py-1 rounded-lg text-[9px] font-sans font-black text-[#1c1c18] uppercase tracking-wider inline-flex self-start sm:self-auto items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
            Completed: {quests.filter(q => q.claimed).length} / {quests.length}
          </div>
        </div>

        <div className="space-y-3">
          {quests.map((q) => {
            const isCompleted = q.current >= q.target;
            const progressPct = Math.min(100, (q.current / q.target) * 100);

            return (
              <div 
                key={q.id}
                className={`border-2 border-[#1c1c18] rounded-2xl p-3 md:p-4 transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
                  q.claimed 
                    ? 'bg-[#f1eee7] opacity-65' 
                    : isCompleted 
                      ? 'bg-[#f9f5e8] border-[#fcd400]' 
                      : 'bg-[#fcf9f2] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl border-2 border-[#1c1c18] flex items-center justify-center text-lg shadow-xs flex-shrink-0 ${
                    q.claimed 
                      ? 'bg-gray-300 text-gray-600' 
                      : isCompleted 
                        ? 'bg-[#10b981] text-white' 
                        : 'bg-[#ff5a1f] text-[#fcf9f2]'
                  }`}>
                    {q.id === 'quest-pop' ? (
                      <span className="material-symbols-outlined text-md font-black">music_note</span>
                    ) : q.id === 'quest-duel' ? (
                      <span className="material-symbols-outlined text-md font-black">sports_martial_arts</span>
                    ) : (
                      <span className="material-symbols-outlined text-md font-black">local_fire_department</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans font-black text-xs text-[#1c1c18] leading-none truncate">
                        {q.title}
                      </h4>
                      {q.claimed && (
                        <span className="bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25 rounded px-1.5 py-0.5 text-[7px] font-sans font-black uppercase tracking-wider">
                          Claimed
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-[10px] text-[#5b403e] font-bold leading-tight">
                      {q.description}
                    </p>

                    {!q.claimed && (
                      <div className="flex items-center gap-2.5 pt-1">
                        <div className="flex-1 bg-white h-2 rounded-full border border-[#1c1c18] overflow-hidden">
                          <div 
                            className="bg-[#fcd400] h-full border-r border-[#1c1c18] transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="font-sans text-[9px] text-[#1c1c18] font-black flex-shrink-0">
                          {q.current} / {q.target}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-[#1c1c18]/10 pt-2.5 sm:pt-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[9px] text-[#5b403e] font-extrabold uppercase tracking-wide">
                      Reward:
                    </span>
                    <span className="font-sans font-black text-[10px] text-[#1c1c18] bg-[#fcd400] border border-[#1c1c18] px-1.5 py-0.5 rounded shadow-xs">
                      +{q.reward} 💎
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Tiny increment helper allowing user to simulate/skip tasks quickly and see completion */}
                    {!isCompleted && !q.claimed && (
                      <button
                        onClick={() => advanceQuest(q.id)}
                        className="bg-white hover:bg-black text-[#1c1c18] hover:text-white border border-[#1c1c18] w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                        title="Simulate task progress step"
                      >
                        <span className="material-symbols-outlined text-xs font-black">add</span>
                      </button>
                    )}

                    {q.claimed ? (
                      <button
                        disabled
                        className="bg-gray-100 text-gray-400 border border-gray-300 px-3 py-1 rounded-xl font-sans font-extrabold text-[9px] uppercase cursor-not-allowed"
                      >
                        Claimed
                      </button>
                    ) : isCompleted ? (
                      <button
                        onClick={() => claimQuest(q.id)}
                        className="bg-[#10b981] hover:bg-black text-white hover:text-[#10b981] border border-[#1c1c18] px-3 py-1 rounded-xl font-sans font-black text-[9px] uppercase shadow-xs cursor-pointer animate-pulse"
                      >
                        CLAIM
                      </button>
                    ) : q.id === 'quest-pop' ? (
                      <button
                        onClick={() => handleStartGame('Pop')}
                        className="bg-[#1c1c18] hover:bg-[#b71422] text-[#fcf9f2] hover:text-white px-3 py-1 border border-[#1c1c18] rounded-xl font-sans font-black text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                      >
                        PLAY
                      </button>
                    ) : q.id === 'quest-duel' ? (
                      <button
                        onClick={() => setCurrentTab('duels')}
                        className="bg-[#1c1c18] hover:bg-[#ff5a1f] text-white px-3 py-1 border border-[#1c1c18] rounded-xl font-sans font-black text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                      >
                        DUEL
                      </button>
                    ) : (
                      <button
                        onClick={handleCheckIn}
                        disabled={hasCheckedInToday}
                        className={`px-3 py-1 border border-[#1c1c18] rounded-xl font-sans font-black text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                          hasCheckedInToday 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                            : 'bg-[#ff5a1f] text-white hover:bg-[#b71422]'
                        }`}
                      >
                        CHECK IN
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-display font-extrabold text-lg uppercase italic tracking-tight">Popular Beats</h3>
          <span className="font-sans font-bold text-xs text-[#b71422] underline underline-offset-4 cursor-pointer" onClick={() => handleStartGame()}>
            Play All ({TRIVIA_QUESTIONS_COUNT()})
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat, idx) => (
            <div 
              key={cat.id}
              onClick={() => handleStartGame(cat.name)}
              className="bg-[#fcf9f2] border-2 border-[#1c1c18] rounded-[20px] p-3 flex flex-col gap-3 group hover:bg-[#fcd400] transition-colors cursor-pointer hard-shadow-sm active:translate-y-0.5"
            >
              <div className={`aspect-square rounded-xl border-2 border-[#1c1c18] overflow-hidden transition-transform ${
                idx % 2 === 0 ? 'sticker-rotate-1 group-hover:rotate-0' : 'sticker-rotate-2 group-hover:rotate-0'
              }`}>
                <img className="w-full h-full object-cover" src={cat.image} alt={cat.name} />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="font-sans font-bold text-sm text-[#1c1c18]">{cat.name}</span>
                <span className="material-symbols-outlined text-xs text-[#1c1c18] font-bold">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <section className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b71422] text-xl">groups</span>
            <h3 className="font-display font-extrabold text-lg uppercase italic">The Feed</h3>
          </div>
          <div className="space-y-3">
            {feedItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white border-2 border-[#1c1c18] rounded-2xl p-3 flex items-center gap-3 hard-shadow-sm transition-transform hover:scale-[1.01]"
              >
                <div className="w-12 h-12 rounded-full border-2 border-[#1c1c18] overflow-hidden flex-shrink-0">
                  <img alt={item.user} className="w-full h-full object-cover" src={item.userAvatar} />
                </div>
                <div className="flex-grow min-w-0 pr-1">
                  <p className="font-sans text-xs md:text-sm text-[#1c1c18] leading-snug">
                    <span className="font-sans font-bold mr-1">{item.user}</span>
                    <span dangerouslySetInnerHTML={{ __html: item.actionHTML }} />
                  </p>
                  <p className="font-sans text-[10px] text-[#5b403e] mt-0.5">{item.timeAgo}</p>
                </div>
                {item.points && (
                  <div className="text-right flex-shrink-0">
                    <div className="font-display font-extrabold text-sm md:text-lg text-[#705d00]">+{item.points}</div>
                    <div className="font-sans text-[9px] text-[#5b403e] font-extrabold">PTS</div>
                  </div>
                )}
                {item.hasAcceptButton && (
                  <button 
                    onClick={() => handleStartGame(item.challengeGenre, true)}
                    className="flex-shrink-0 bg-[#1c1c18] text-white hover:bg-[#b71422] px-3 py-1.5 rounded-lg font-sans font-bold text-[10px] uppercase hard-shadow-sm active:translate-y-0.5"
                  >
                    ACCEPT
                  </button>
                )}
                {item.isAchievement && item.shareText && (
                  <button 
                    onClick={() => handleShareAchievement(item.shareText)}
                    className="flex-shrink-0 bg-[#ff5a1f] text-white hover:bg-[#b71422] hover:text-[#fcf9f2] border-2 border-[#1c1c18] px-3 py-1.5 rounded-lg font-sans font-black text-[10px] uppercase flex items-center gap-1 hard-shadow-sm transition-all active:translate-y-0.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[12px] font-black">share</span>
                    SHARE
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Mini Leaderboard List */}
        <aside className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#705d00] text-xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <h3 className="font-display font-extrabold text-lg uppercase italic">Top Geniuses</h3>
          </div>
          <div className="bg-[#f1eee7] border-2 border-[#1c1c18] rounded-2xl p-4 hard-shadow space-y-3">
            <div className="flex items-center gap-3 bg-white border-2 border-[#1c1c18] p-2 rounded-xl relative">
              <div className="absolute -left-2 -top-2 w-6 h-6 bg-[#fcd400] border-2 border-[#1c1c18] rounded-full flex items-center justify-center font-display font-bold text-xs">1</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#1c1c18] overflow-hidden">
                <img alt="Emma logo" className="w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK7mK8vkxf8KtQ0FwhNovOdBSFBSr37Ubiy2ovRFo_n94v41sc4Lc_2AsLeRQ8a4ERzdZh4mbzMKVcDZ5jenbyQsopWoL1GBxspEsFvtUwxaB7r0g8o1iy4P-e-c1n_CPCDgy7kDd86-_aPiyabbULUWvOEUslualR-dPT7FPk83KlJTcW2Ol3FJv5dBEy86YtL7p6RZO0elkWPu-2GWzIww2cCYWXe3Jocpwx-VPhMoopX61zV7EJfEuAXRGbB6x4krb5C72Wy7s" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-sans font-extrabold text-xs truncate">Emma Ema</div>
                <div className="font-sans text-[10px] text-[#5b403e]">1,120 Diamonds</div>
              </div>
              <span className="material-symbols-outlined text-[#705d00] text-sm md:text-lg">workspace_premium</span>
            </div>

            <div className="flex items-center gap-3 p-1 rounded-xl">
              <div className="w-6 flex items-center justify-center font-sans font-bold text-xs">2</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#1c1c18] overflow-hidden">
                <img alt="Sophia" className="w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfya1JIZVF9_ZuIdT78cnlpRnt0ceyR9zulAfjbX1ubG2ia369xjbQLtREb75UTHJ28eEuOHx_0r-NVlCRIyWNCAof7qOH8hDmofRgjV7VNzBvb0hpIjcH26PgWEGddM48w-NsJvKSjyqsLxVg6g6oojqEB5BnD5ssVJ3Sf7Dv5iBbBZO95twEbjqEJ74Nn7LcUFbsv2gI8faXaNdf_jfo5zTwFEgMuoKf89u-LgmUPYj0gI_BdlAVGJUzBzf6BogBHZwFYFgdht4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-sans font-bold text-xs truncate">Sophia Cba</div>
                <div className="font-sans text-[10px] text-[#5b403e]">950 Diamonds</div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentTab('ranks')}
              className="w-full py-2 border-2 border-[#1c1c18] rounded-xl font-sans font-bold text-xs uppercase hover:bg-[#1c1c18] hover:text-white transition-all active:translate-y-0.5"
            >
              Full Leaderboard
            </button>
          </div>
        </aside>
      </div>

    </div>
  );
}

function TRIVIA_QUESTIONS_COUNT() {
  return 8; // length of TRIVIA_QUESTIONS
}
