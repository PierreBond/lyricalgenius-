import React, { useState } from 'react';
import { Tab, UserStats } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DuelsTabProps {
  stats: UserStats;
  setCurrentTab: (tab: Tab) => void;
  startNewGame: (category?: string) => void;
  updateStats: (xpGained: number, diamondsGained: number) => void;
}

interface DuelFriend {
  id: string;
  name: string;
  level: number;
  avatar: string;
  status: 'online' | 'offline' | 'in-game';
  favoriteGenre: string;
}

export default function DuelsTab({ stats, setCurrentTab, startNewGame, updateStats }: DuelsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<DuelFriend | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('Pop');
  const [wagerValue, setWagerValue] = useState<number>(50);
  const [isLobbySearching, setIsLobbySearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const initialFriends: DuelFriend[] = [
    {
      id: 'f-1',
      name: 'Mike Chen',
      level: 12,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsHJc28JIddsaf4GmqGtDtVyQo1hgjP4XJ2mykQnSfzBcX8r54LJJ7Ii4JbwVJ7gWbl9EIoil9d1cTLdYaeActCPXtMIsgmdnAaxBdmgJRl1eB8dh9o9thbhUtcj1T6yCfcC8Wm92qcc73wJnYxUxvrdpJ3cVGRcMJfQkkeMZ4XZNLXh8iTX23TmmPAgKmqAWJ4ajgeHR2EfP-Cw-veaCEcj81JSOBuI_3VBepXiSUkyCRyy4x8yR1CvaTphnz0Cb9l2s0LrfUfcM',
      status: 'online',
      favoriteGenre: 'Pop'
    },
    {
      id: 'f-2',
      name: 'Sophia Cba',
      level: 10,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfya1JIZVF9_ZuIdT78cnlpRnt0ceyR9zulAfjbX1ubG2ia369xjbQLtREb75UTHJ28eEuOHx_0r-NVlCRIyWNCAof7qOH8hDmofRgjV7VNzBvb0hpIjcH26PgWEGddM48w-NsJvKSjyqsLxVg6g6oojqEB5BnD5ssVJ3Sf7Dv5iBbBZO95twEbjqEJ74Nn7LcUFbsv2gI8faXaNdf_jfo5zTwFEgMuoKf89u-LgmUPYj0gI_BdlAVGJUzBzf6BogBHZwFYFgdht4',
      status: 'online',
      favoriteGenre: '90s Hits'
    },
    {
      id: 'f-3',
      name: 'Emma Wilson',
      level: 15,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKv-L2oYHx0vnmzQdAyIZ5nRzKlOOwh67P0X8krORJ2VaDEqTBcFwN3dFfOGlKvVpCybwFfYXj0-qOAxCmbX_-Drn2ThBTpEXUDqDbAoaFohN7_BtBMdBGoILh8As_gROt41aTw9fyvJRu-7We-TJB4oBgFCRjESo-VM5WfkQZPnuDaz45NGZ2zjdyHStzuJ0mOcCRJEk964h6_mt5mNSd7ZTm0014KwClv6G7LgNM7YTm2emq_sQFsIOW4RIbaM-Y79qrsKMOIyg',
      status: 'in-game',
      favoriteGenre: 'Rock'
    },
    {
      id: 'f-4',
      name: 'Sarah Jenkins',
      level: 8,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGK6c76p8X4506tC6_D6i1nNbeAnAmdL5f0-XvscTia40Xf47oYQh71Z-dI2K9eD4G855mQfB3m8vW_mD18xI_bdfF--f8eL3jMf5zbeK9a_bdf8be9_S7Nbe-md5LBeA_zbdFmBDf_p3mBfL5B-T9o9pbeL97K_g5G_8_N-bI5-P_LpBe97o9BeGdfX--bfeFmBFe-',
      status: 'offline',
      favoriteGenre: 'Hip Hop'
    }
  ];

  const incomingChallenges = [
    {
      id: 'ic-1',
      challenger: 'Mike Chen',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsHJc28JIddsaf4GmqGtDtVyQo1hgjP4XJ2mykQnSfzBcX8r54LJJ7Ii4JbwVJ7gWbl9EIoil9d1cTLdYaeActCPXtMIsgmdnAaxBdmgJRl1eB8dh9o9thbhUtcj1T6yCfcC8Wm92qcc73wJnYxUxvrdpJ3cVGRcMJfQkkeMZ4XZNLXh8iTX23TmmPAgKmqAWJ4ajgeHR2EfP-Cw-veaCEcj81JSOBuI_3VBepXiSUkyCRyy4x8yR1CvaTphnz0Cb9l2s0LrfUfcM',
      genre: '90s Hits',
      wager: 30
    }
  ];

  const handleDeclineChallenge = (sender: string) => {
    setShowNotification(`Declined duel request from ${sender}.`);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleAcceptChallenge = (genre: string, wager: number) => {
    if (stats.diamonds < wager) {
      setShowNotification("Error: Not enough diamonds to wager on this duel! 💎");
      setTimeout(() => setShowNotification(null), 3000);
      return;
    }
    // Wager diamonds deduction
    updateStats(0, -wager);
    startNewGame(genre);
  };

  const startMatchmakerSearch = () => {
    setIsLobbySearching(true);
    setSearchProgress(0);

    const interval = setInterval(() => {
      setSearchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLobbySearching(false);
            if (stats.diamonds < wagerValue) {
              setShowNotification("Duel matchmaking error: Insufficient wager diamonds! 💎");
              setTimeout(() => setShowNotification(null), 3500);
            } else {
              updateStats(0, -wagerValue);
              startNewGame(selectedGenre);
            }
          }, 600);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const filteredFriends = initialFriends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full pb-28 pt-4 px-4 max-w-lg md:max-w-2xl mx-auto space-y-8 select-none">
      {/* Dynamic notifications toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#b71422] text-white border-2 border-[#1c1c18] px-4 py-3 rounded-xl font-sans font-black text-xs hard-shadow flex items-center gap-2 max-w-xs text-center justify-center shadow-lg"
          >
            <span>{showNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duel Arena Header Banner */}
      <div className="bg-[#b71422] rounded-[24px] border-2 border-[#1c1c18] hard-shadow p-6 text-[#fcf9f2] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="bg-[#fcd400] text-[#1c1c18] border border-[#1c1c18] rounded-full text-[9px] px-2 py-0.5 font-sans font-black uppercase tracking-wider">
            Lobby & Matchmaker
          </span>
          <h2 className="font-display font-black text-2xl uppercase tracking-wider leading-none">
            DUELS ARENA
          </h2>
          <p className="font-sans text-[11px] text-[#ffdad7] font-semibold max-w-md leading-relaxed">
            Wager diamonds and clash with friends in fast-paced real-time lyric battles! Solve accurately to claim the pot!
          </p>
        </div>
        <div className="relative w-16 h-16 bg-[#ff5a1f] border-2 border-[#1c1c18] rounded-full flex items-center justify-center text-3xl shadow-sm rotate-6">
          ⚔️
        </div>
      </div>

      {/* Matchmaking Lobby Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left pane: Friends Listing */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white border-2 border-[#1c1c18] rounded-[24px] p-5 hard-shadow">
            <h3 className="font-display font-black text-sm uppercase text-[#1c1c18] tracking-tight mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm font-black text-[#b71422]">groups</span>
              Active Players ({initialFriends.length})
            </h3>

            {/* Friend search bar */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search lyricists..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#fcf9f2] border-2 border-[#1c1c18] rounded-xl px-3 py-2 text-xs font-sans font-semibold placeholder-[#1c1c18]/40 outline-none focus:border-[#b71422] transition-colors"
              />
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#1c1c18]/60 text-sm select-none">
                search
              </span>
            </div>

            {/* Friend Cards List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {filteredFriends.map((f) => (
                <div 
                  key={f.id}
                  className="bg-[#fcf9f2] border-2 border-[#1c1c18] rounded-xl p-3 flex justify-between items-center transition-transform hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full border-2 border-[#1c1c18] overflow-hidden bg-white">
                      <img className="w-full h-full object-cover" src={f.avatar} alt={f.name} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border border-[#1c1c18] ${
                        f.status === 'online' ? 'bg-[#10b981]' : f.status === 'in-game' ? 'bg-[#3b82f6]' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-xs text-[#1c1c18] flex items-center gap-1.5 leading-none">
                        {f.name}
                        <span className="inline-flex items-center justify-center bg-[#fcd400]/80 text-[#1c1c18] text-[8px] px-1 py-0.5 rounded-md font-sans font-black scale-90 translate-y-0.5">
                          Lvl {f.level}
                        </span>
                      </h4>
                      <p className="font-sans text-[10px] text-[#5b403e] font-semibold mt-1">
                        Fav Genre: <span className="text-[#b71422]">{f.favoriteGenre}</span>
                      </p>
                    </div>
                  </div>

                  {f.status === 'online' ? (
                    <button
                      onClick={() => setSelectedFriend(f)}
                      className="bg-[#1c1c18] text-white hover:bg-[#b71422] px-3 py-1.5 border-2 border-[#1c1c18] rounded-xl font-sans font-bold text-[10px] uppercase hard-shadow-sm transition-all active:translate-y-0.5 cursor-pointer"
                    >
                      CHALLENGE
                    </button>
                  ) : f.status === 'in-game' ? (
                    <span className="text-[10px] font-sans font-black bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/20 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      In Match
                    </span>
                  ) : (
                    <span className="text-[10px] font-sans font-bold text-gray-400 select-none">
                      Offline
                    </span>
                  )}
                </div>
              ))}
              {filteredFriends.length === 0 && (
                <div className="text-center py-6">
                  <p className="font-sans text-xs text-[#5b403e] font-bold">No active players found!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right pane: Quick Matchmaker Setup / Pending Invites */}
        <div className="space-y-6">
          {/* Quick matchmaking system */}
          <div className="bg-[#fcd400] border-2 border-[#1c1c18] p-5 rounded-[24px] hard-shadow flex flex-col gap-4">
            <div>
              <h3 className="font-display font-black text-sm uppercase text-[#1c1c18]">
                Insta-Matchmaker
              </h3>
              <p className="font-sans text-[10px] text-[#5b403e] font-bold leading-tight mt-1">
                Let the arena pair you with a random opponent right now!
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-sans font-black uppercase text-[#1c1c18] block mb-1">
                  1. Select Wager 💎
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[20, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setWagerValue(amt)}
                      className={`py-1.5 rounded-lg border-2 border-[#1c1c18] font-sans font-black text-[11px] uppercase transition-all ${
                        wagerValue === amt 
                          ? 'bg-[#1c1c18] text-white' 
                          : 'bg-[#fcf9f2] text-[#1c1c18] hover:bg-[#ebe8e1]'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-sans font-black uppercase text-[#1c1c18] block mb-1">
                  2. Focus Genre 🎵
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-[#fcf9f2] border-2 border-[#1c1c18] rounded-lg p-1.5 text-xs font-sans font-bold"
                >
                  <option value="Pop">Pop Tracks</option>
                  <option value="Rock">Rock Beats</option>
                  <option value="Hip Hop">Hip Hop / Rap</option>
                  <option value="90s Hits">90s Hits</option>
                </select>
              </div>

              <button
                onClick={startMatchmakerSearch}
                disabled={isLobbySearching}
                className="w-full mt-2 py-3 bg-[#b71422] text-[#fcf9f2] hover:bg-black border-2 border-[#1c1c18] rounded-xl font-display font-black text-xs uppercase tracking-wider hard-shadow-sm transition-all active:translate-y-0.5"
              >
                {isLobbySearching ? 'SEARCHING LOBBY...' : 'FIND DUEL MATCH'}
              </button>
            </div>
          </div>

          {/* Pending Incoming Duelinvites list */}
          <div className="bg-white border-2 border-[#1c1c18] p-5 rounded-[24px] hard-shadow space-y-3">
            <h4 className="font-display font-black text-xs uppercase flex items-center gap-1.5 text-[#1c1c18]">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ff5a1f] animate-ping" />
              Incoming Invites ({incomingChallenges.length})
            </h4>

            {incomingChallenges.map((ic) => (
              <div 
                key={ic.id}
                className="bg-[#fcf9f2] border-2 border-[#1c1c18] p-3 rounded-xl flex flex-col gap-2.5"
              >
                <div className="flex items-center gap-2">
                  <img src={ic.avatar} alt={ic.challenger} className="w-8 h-8 rounded-full border-2 border-[#1c1c18]" />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[11px] font-bold text-[#1c1c18] truncate">
                      {ic.challenger}
                    </p>
                    <p className="font-sans text-[9px] text-[#5b403e] font-semibold">
                      Genre: <span className="text-[#b71422] font-extrabold">{ic.genre}</span> ({ic.wager}💎)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => handleDeclineChallenge(ic.challenger)}
                    className="py-1 border border-[#1c1c18] bg-white rounded-lg font-sans font-bold text-[9px] text-[#1c1c18] uppercase hover:bg-gray-100 transition-colors"
                  >
                    DECLINE
                  </button>
                  <button
                    onClick={() => handleAcceptChallenge(ic.genre, ic.wager)}
                    className="py-1 bg-[#10b981] text-white rounded-lg font-sans font-black text-[9px] uppercase hover:bg-[#0e9f6e] transition-colors"
                  >
                    ACCEPT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Matchmaking Lobby Searching Anim Modal Overlay */}
      <AnimatePresence>
        {isLobbySearching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#31312c]/80 flex items-center justify-center z-50 p-4 select-none"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#fcf9f2] border-4 border-[#1c1c18] rounded-[32px] p-6 max-w-sm w-full text-center hard-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-2 bg-[#ff5a1f] transition-all duration-300" style={{ width: `${searchProgress}%` }} />
              
              <div className="w-16 h-16 bg-[#fcd400] border-2 border-[#1c1c18] rounded-full mx-auto flex items-center justify-center text-3xl mb-4 animate-bounce">
                📡
              </div>

              <h3 className="font-display font-black text-lg uppercase text-[#1c1c18] tracking-tight">
                Seeking Duels...
              </h3>
              <p className="font-sans text-xs text-[#5b403e] font-bold mt-1">
                Contacting available contestants in <span className="text-[#b71422] font-black">{selectedGenre}</span> lobby
              </p>

              <div className="flex justify-center items-center gap-1.5 my-5">
                <span className="w-2.5 h-2.5 bg-[#b71422] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2.5 h-2.5 bg-[#b71422] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2.5 h-2.5 bg-[#b71422] rounded-full animate-bounce" />
              </div>

              <p className="font-mono text-[10px] text-gray-500 bg-[#f4ebd0] py-1 px-3 border border-[#1c1c18]/20 rounded-md inline-block font-bold">
                WAGER POT: {wagerValue * 2} 💎
              </p>

              <button
                onClick={() => setIsLobbySearching(false)}
                className="w-full mt-4 py-2 border-2 border-[#1c1c18] rounded-xl font-sans font-bold text-xs uppercase hover:bg-gray-100 transition-colors"
              >
                CANCEL MATCHMAKER
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Friend Custom Challenge Setup Overlay */}
      <AnimatePresence>
        {selectedFriend && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#31312c]/80 flex items-center justify-center z-50 p-4 select-none"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-4 border-[#1c1c18] rounded-[32px] p-6 max-w-sm w-full text-center hard-shadow space-y-4"
            >
              <h3 className="font-display font-black text-lg uppercase text-[#1c1c18]">
                CHALLENGE FRIEND
              </h3>

              <div className="flex items-center gap-3 bg-[#fcf9f2] border-2 border-[#1c1c18] rounded-xl p-3">
                <img src={selectedFriend.avatar} alt={selectedFriend.name} className="w-12 h-12 rounded-full border-2 border-[#1c1c18]" />
                <div className="text-left">
                  <p className="font-sans font-black text-sm text-[#1c1c18] leading-tight">
                    {selectedFriend.name}
                  </p>
                  <p className="font-sans text-[10px] text-[#5b403e] font-semibold mt-0.5">
                    Favorite Genre: <span className="font-extrabold text-[#b71422]">{selectedFriend.favoriteGenre}</span>
                  </p>
                </div>
              </div>

              {/* Custom wager selection */}
              <div className="text-left space-y-1">
                <label className="text-[10px] font-sans font-black uppercase text-[#1c1c18]">
                  Duel Wager 💎
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[20, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setWagerValue(amt)}
                      className={`py-1.5 rounded-lg border-2 border-[#1c1c18] font-sans font-black text-[11px] uppercase transition-all ${
                        wagerValue === amt 
                          ? 'bg-[#1c1c18] text-white' 
                          : 'bg-[#fcf9f2] text-[#1c1c18] hover:bg-[#ebe8e1]'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre selection */}
              <div className="text-left space-y-1">
                <label className="text-[10px] font-sans font-black uppercase text-[#1c1c18]">
                  Duel Category 🎵
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-[#fcf9f2] border-2 border-[#1c1c18] rounded-lg p-2 text-xs font-sans font-bold"
                >
                  <option value="Pop">Pop</option>
                  <option value="Rock">Rock</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="90s Hits">90s Hits</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setSelectedFriend(null)}
                  className="w-full py-2.5 border-2 border-[#1c1c18] rounded-xl font-sans font-bold text-xs uppercase hover:bg-gray-50 text-[#1c1c18]"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    const friendName = selectedFriend.name;
                    setSelectedFriend(null);
                    setIsLobbySearching(true);
                    setSearchProgress(0);

                    const interval = setInterval(() => {
                      setSearchProgress((p) => {
                        if (p >= 100) {
                          clearInterval(interval);
                          setTimeout(() => {
                            setIsLobbySearching(false);
                            if (stats.diamonds < wagerValue) {
                              setShowNotification("Error: Insufficient wager diamonds!");
                              setTimeout(() => setShowNotification(null), 3000);
                            } else {
                              updateStats(0, -wagerValue);
                              startNewGame(selectedGenre);
                            }
                          }, 600);
                          return 100;
                        }
                        return p + 25;
                      });
                    }, 300);
                  }}
                  className="w-full py-2.5 bg-[#b71422] text-[#fcf9f2] border-2 border-[#1c1c18] rounded-xl font-display font-black text-xs uppercase hover:bg-black transition-colors"
                >
                  DUEL NOW
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
