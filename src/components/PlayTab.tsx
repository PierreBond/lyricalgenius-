import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tab, UserStats, Question } from '../types';
import { TRIVIA_QUESTIONS, ARTIST_QUESTIONS } from '../data/questions';

interface PlayTabProps {
  category: string | null;
  setCategory: (cat: string | null) => void;
  stats: UserStats;
  updateStats: (xpGained: number, diamondsGained: number) => void;
  setCurrentTab: (tab: Tab) => void;
}

export default function PlayTab({
  category,
  setCategory,
  stats,
  updateStats,
  setCurrentTab
}: PlayTabProps) {
  // Game states
  const [activeSegment, setActiveSegment] = useState<'genres' | 'artists'>('genres');
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompetitive, setIsCompetitive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 10s or 7s per question
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [reactionText, setReactionText] = useState<'correct' | 'incorrect' | null>(null);
  const [vibeChosen, setVibeChosen] = useState<string | null>(null);
  const [lastFailureReason, setLastFailureReason] = useState<'timeout' | 'cheat' | 'incorrect' | null>(null);

  // Live API Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevCategoryRef = useRef<string | null>(null);

  // Predefined lists of popular stars for genres to guarantee excellent live API search hits on LRCLIB
  const GENRE_ARTISTS_MAP: Record<string, string[]> = {
    'Pop': ['Adele', 'Taylor Swift', 'Dua Lipa', 'Olivia Rodrigo', 'Ed Sheeran', 'Ariana Grande', 'Billie Eilish', 'Bruno Mars', 'Harry Styles', 'Coldplay'],
    'Rock': ['Nirvana', 'Queen', 'Pink Floyd', 'Radiohead', 'Metallica', 'The Beatles', 'Green Day', 'Red Hot Chili Peppers', 'Foo Fighters'],
    'Hip Hop': ['Kendrick Lamar', 'Drake', 'Eminem', 'Kanye West', 'Travis Scott', 'Post Malone', 'Jay-Z', 'J. Cole'],
    '90s Hits': ['Britney Spears', 'NIRVANA', 'Michael Jackson', 'Madonna', 'Alanis Morissette', 'Backstreet Boys', 'No Doubt', 'Pearl Jam', 'Spice Girls']
  };

  // Start a dynamic match using live lyrics query search from LRCLIB
  const startLiveMatch = async (genreOrArtist: string) => {
    setIsSearching(true);
    setSearchError(null);
    setSelectedArtist(genreOrArtist);
    triggerHaptic('success');

    try {
      // Determine actual search parameters
      let targetQuery = genreOrArtist;
      const isGenre = ['all', 'pop', 'rock', 'hip hop', '90s hits'].includes(genreOrArtist.toLowerCase());
      
      if (isGenre) {
        const canonicalKey = genreOrArtist === 'All' ? 'Pop' : genreOrArtist;
        const list = GENRE_ARTISTS_MAP[canonicalKey] || GENRE_ARTISTS_MAP['Pop'];
        targetQuery = list[Math.floor(Math.random() * list.length)];
      }

      const response = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(targetQuery)}`);
      if (!response.ok) {
        throw new Error('Database search query failed. Give it another spin!');
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`No match found for "${targetQuery}" right now.`);
      }

      // Filter to tracks possessing plain lyrics with standard properties
      const eligibleSongs = data.filter((song: any) => 
        song.plainLyrics && 
        song.plainLyrics.trim().length > 80 &&
        !song.instrumental &&
        song.trackName &&
        song.artistName
      );

      if (eligibleSongs.length === 0) {
        throw new Error(`Tracks found matching "${targetQuery}" but none have cached plaintext lyrics. Try another candidate!`);
      }

      // Build exactly 5 dynamic question stages randomly from eligible songs list
      const questionsList: Question[] = [];
      const shuffledFiltered = [...eligibleSongs].sort(() => 0.5 - Math.random());
      const chosenSongs = shuffledFiltered.slice(0, Math.min(shuffledFiltered.length, 5));

      for (let i = 0; i < chosenSongs.length; i++) {
        const song = chosenSongs[i];

        // Format and clean paragraph lines to ignore useless metadata annotations
        const cleanedLines = song.plainLyrics
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => 
            line.length > 6 && 
            !line.startsWith('[') && 
            !line.endsWith(']') &&
            !line.toLowerCase().startsWith('lyrics by') &&
            !line.toLowerCase().startsWith('written by') &&
            !line.toLowerCase().startsWith('produced by')
          );

        if (cleanedLines.length < 3) continue;

        // Choose random block of 2 to 3 contiguous lines
        const maxStart = Math.max(0, cleanedLines.length - 3);
        const startIndex = Math.floor(Math.random() * maxStart);
        const chosenLines = cleanedLines.slice(startIndex, startIndex + 3);
        const snippetText = chosenLines.join('\n');

        // Extract decoys from other items in search cache or popular global records
        const matchingDecoys = eligibleSongs
          .filter((s: any) => s.trackName.toLowerCase() !== song.trackName.toLowerCase())
          .map((s: any) => s.trackName);

        const globalTrackfallbacks = ["Perfect", "Believer", "Shape of You", "Blinding Lights", "Bohemian Rhapsody", "Thriller", "Hello", "Stay", "Cruel Summer", "Bad Guy"];
        const distractors: string[] = [];
        const uniquePool = Array.from(new Set(matchingDecoys));

        for (const element of uniquePool) {
          if (distractors.length < 3) {
            distractors.push(element);
          }
        }

        while (distractors.length < 3) {
          const randFallback = globalTrackfallbacks[Math.floor(Math.random() * globalTrackfallbacks.length)];
          if (!distractors.includes(randFallback) && randFallback.toLowerCase() !== song.trackName.toLowerCase()) {
            distractors.push(randFallback);
          }
        }

        // Shuffle right answer
        const correctPos = Math.floor(Math.random() * 4);
        const choices = [...distractors];
        choices.splice(correctPos, 0, song.trackName);

        questionsList.push({
          id: `live_${song.id || Math.random()}`,
          lyrics: `"${snippetText}"`,
          choices: choices,
          answerIndex: correctPos,
          category: song.artistName,
          song: song.trackName,
          artist: song.artistName,
          image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=60"
        });
      }

      if (questionsList.length < 2) {
        throw new Error(`Insufficient lyric datasets to formulate trivia questions for "${targetQuery}". Try a simpler query!`);
      }

      // Update state triggers
      setCategory(genreOrArtist);
      setCurrentQuestions(questionsList);
      setCurrentIndex(0);
      setTimeLeft(isCompetitive ? 7 : 10);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setLastFailureReason(null);
      setGameFinished(false);
      setIsPlaying(true);
    } catch (err: any) {
      setSearchError(err.message || "Failed gathering lyric structures. Verify network connection and retry!");
    } finally {
      setIsSearching(false);
    }
  };

  // Start game when category updates via home page redirection
  useEffect(() => {
    if (category && category !== prevCategoryRef.current) {
      prevCategoryRef.current = category;
      startLiveMatch(category);
    } else if (!category) {
      prevCategoryRef.current = null;
      setIsPlaying(false);
      setGameFinished(false);
    }
  }, [category]);

  // Audio simulation feedback helper
  const triggerHaptic = (type: 'success' | 'fail') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(type === 'success' ? 40 : [50, 50, 50]);
    }
  };

  // anti-cheat visibility/focus loss detection Hook (only activated during active, unanswered competitive play)
  useEffect(() => {
    if (!isPlaying || !isCompetitive || gameFinished || isAnswered) return;

    const handleAntiCheatFail = () => {
      // Avoid firing if already answered/exited
      if (document.hidden || !document.hasFocus()) {
        setLastFailureReason('cheat');
        handleAnswerSelection(-2); // Special index -2 represents Anti-cheat Fail trigger
      }
    };

    window.addEventListener('blur', handleAntiCheatFail);
    document.addEventListener('visibilitychange', handleAntiCheatFail);

    return () => {
      window.removeEventListener('blur', handleAntiCheatFail);
      document.removeEventListener('visibilitychange', handleAntiCheatFail);
    };
  }, [isPlaying, isCompetitive, gameFinished, isAnswered, currentIndex]);

  // Live Timer Countdown
  useEffect(() => {
    if (isPlaying && !gameFinished && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time ran out!
            setLastFailureReason('timeout');
            handleAnswerSelection(-1); // timeout failure (-1)
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, gameFinished, isAnswered, currentIndex, isCompetitive]);

  const handleAnswerSelection = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);

    if (answerIndex === -2) {
      setStreak(0);
      setReactionText('incorrect');
      triggerHaptic('fail');
      return;
    }

    const correctIndex = currentQuestions[currentIndex].answerIndex;
    if (answerIndex === correctIndex) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      setReactionText('correct');
      triggerHaptic('success');
    } else {
      setStreak(0);
      setReactionText('incorrect');
      triggerHaptic('fail');
      if (answerIndex === -1) {
        setLastFailureReason('timeout');
      } else {
        setLastFailureReason('incorrect');
      }
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setReactionText(null);
    setLastFailureReason(null);

    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(isCompetitive ? 7 : 10);
    } else {
      // Game ended! Update global profile stats (competitive modes award premium bonuses)
      const correctAnswers = score + (selectedAnswer === currentQuestions[currentIndex].answerIndex ? 1 : 0);
      const isPerfect = score === currentQuestions.length;
      
      const compXpBonus = isCompetitive ? score * 250 : 0;
      const compDiamondBonus = isCompetitive ? score * 15 : 0;

      const xpGained = score * 500 + (isPerfect ? 500 : 0) + compXpBonus; // Standard + bonus + premium competitive split
      const diamondsGained = score * 25 + (isPerfect ? 50 : 0) + compDiamondBonus;
      
      updateStats(xpGained, diamondsGained);
      setGameFinished(true);
    }
  };


  const currentQuestion = currentQuestions[currentIndex];

  // Render Loading Stage Compiles
  if (isSearching) {
    return (
      <div className="w-full pb-24 pt-16 px-4 max-w-md mx-auto flex flex-col items-center justify-center text-center space-y-6 select-none animate-pulse">
        <div className="relative flex items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-[#ff5a1f] animate-spin">
            progress_activity
          </span>
          <span className="material-symbols-outlined text-3xl text-[#1c1c18] absolute animate-pulse">
            album
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="font-display font-black text-xl uppercase tracking-tighter italic">
            COMPILING LIVE STAGE
          </h3>
          <p className="font-sans text-xs text-[#5b403e] max-w-xs mx-auto leading-relaxed font-bold">
            Connecting directly to the public open-source LRCLIB registry. Downloading authentic lyric stanzas and compiling dynamic multiple-choice tracks...
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 py-1.5 px-3.5 bg-[#fff9e6] rounded-full border-2 border-[#1c1c18] text-[9px] uppercase font-sans font-bold tracking-widest text-[#1c1c18]">
          <span className="bg-[#10b981] w-2 h-2 rounded-full animate-ping"></span>
          LRCLIB NETWORK ACTIVE
        </div>
      </div>
    );
  }

  // Render Category Select Screen (if not currently playing)
  if (!isPlaying) {
    const defaultPlaylists = ['All', 'Pop', 'Rock', 'Hip Hop', '90s Hits'];
    return (
      <div className="w-full pb-24 pt-4 px-4 max-w-md mx-auto space-y-6 select-none animate-[fadeIn_0.2s_ease-out]">
        <div className="text-center my-6">
          <h2 className="font-display font-black text-3xl uppercase tracking-tighter italic">CHOOSE YOUR VIBE</h2>
          <p className="text-[#5b403e] font-sans text-xs mt-2">Pick your flight path: dynamic genres or custom artist showdown discographies powered by live API matching.</p>
        </div>

        {/* Segmented Control */}
        <div className="flex bg-[#e5e2db] p-1 rounded-2xl border-2 border-[#1c1c18] relative select-none gap-0.5">
          <button
            onClick={() => {
              setActiveSegment('genres');
              triggerHaptic('success');
            }}
            className={`flex-1 py-2.5 text-[10px] md:text-xs font-display font-black uppercase tracking-tight rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeSegment === 'genres'
                ? 'bg-[#1c1c18] text-[#fcf9f2] shadow-xs'
                : 'text-[#5b403e] hover:text-[#1c1c18]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">library_music</span>
            Genres
          </button>
          <button
            onClick={() => {
              setActiveSegment('artists');
              triggerHaptic('success');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 text-[10px] md:text-xs font-display font-black uppercase tracking-tight ${
              activeSegment === 'artists'
                ? 'bg-[#1c1c18] text-[#fcf9f2] shadow-xs'
                : 'text-[#5b403e] hover:text-[#1c1c18]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">star</span>
            Artists
          </button>
        </div>

        {/* Blitz Mode Toggle Card */}
        <div 
          onClick={() => {
            setIsCompetitive(!isCompetitive);
            triggerHaptic('success');
          }}
          className={`cursor-pointer p-4.5 rounded-2xl border-2 border-[#1c1c18] transition-all hard-shadow flex items-center justify-between gap-4 select-none ${
            isCompetitive 
              ? 'bg-[#ff5a1f] text-white' 
              : 'bg-white text-[#1c1c18] hover:bg-[#fff9e6]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border-2 border-[#1c1c18] flex items-center justify-center text-lg shadow-xs ${isCompetitive ? 'bg-[#fcd400] text-[#1c1c18]' : 'bg-[#e5e2db]'}`}>
              <span className={`material-symbols-outlined text-md font-bold ${isCompetitive ? 'fill-1 animate-pulse' : ''}`} style={isCompetitive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {isCompetitive ? 'bolt' : 'speed'}
              </span>
            </div>
            <div className="text-left flex-1">
              <h4 className="font-display font-black text-xs uppercase tracking-tight leading-none mb-1 flex items-center gap-1.5">
                Competitive Blitz
                {isCompetitive && (
                  <span className="bg-[#b71422] text-white border border-white text-[7.5px] px-1.5 py-[1px] rounded font-sans font-black uppercase">
                    ACTIVE
                  </span>
                )}
              </h4>
              <p className={`font-sans text-[10px] leading-tight font-semibold ${isCompetitive ? 'text-white/85' : 'text-[#5b403e]'}`}>
                Reduces time to 7s + window focus loss checks. Double XP/Diamonds! 🛡️⚡
              </p>
            </div>
          </div>
          <div className="relative flex items-center">
            {/* Toggle Switch */}
            <div className={`w-10 h-5.5 rounded-full border-2 border-[#1c1c18] p-0.5 transition-colors relative flex items-center cursor-pointer ${isCompetitive ? 'bg-[#1c1c18]' : 'bg-[#e5e2db]'}`}>
              <div 
                className={`w-3.5 h-3.5 rounded-full border border-[#1c1c18] bg-white transition-all duration-200 ${
                  isCompetitive ? 'translate-x-4 bg-white' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Genres segment - fully live fetched lyrics */}
        {activeSegment === 'genres' && (
          <div className="space-y-4">
            {defaultPlaylists.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  startLiveMatch(genre);
                }}
                className="w-full flex justify-between items-center p-5 bg-white border-2 border-[#1c1c18] rounded-xl hard-shadow hover:bg-[#fcd400] transition-all hover:scale-[1.01] active:translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f1fee7] border-2 border-[#1c1c18] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#b71422] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                      music_note
                    </span>
                  </div>
                  <div className="text-left font-display font-black tracking-tight text-[#1c1c18]">
                    {genre === 'All' ? 'ALL GENRES CATALOG' : `${genre.toUpperCase()} FLIGHT`}
                  </div>
                </div>
                <span className="material-symbols-outlined font-bold text-[#b71422]">arrow_forward</span>
              </button>
            ))}
          </div>
        )}

        {/* Artists segment with custom input bar & preset stars - fully live fetched lyrics */}
        {activeSegment === 'artists' && (
          <div className="space-y-4">
            {/* Integrated Custom Search Box */}
            <div className="p-4 bg-[#fff9e6] border-2 border-[#1c1c18] rounded-2xl hard-shadow space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff5a1f] text-sm animate-pulse">search</span>
                <span className="font-display font-black text-[10px] uppercase tracking-wider text-[#1c1c18]">
                  ENTER ANY SUPERSTAR ARTIST NAME
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      startLiveMatch(searchQuery.trim());
                    }
                  }}
                  placeholder="e.g. Adele, Queen, Coldplay..."
                  className="w-full bg-white border-2 border-[#1c1c18] rounded-xl py-2.5 pl-9 pr-8 font-sans text-xs font-semibold text-[#1c1c18] focus:outline-none focus:ring-2 focus:ring-[#ff5a1f] placeholder-[#a39485]"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  search
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#b71422] text-xs"
                  >
                    cancel
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    startLiveMatch(searchQuery.trim());
                  } else {
                    setSearchError("Please key in your favorite artist name first!");
                  }
                }}
                className="w-full py-2.5 bg-[#fcd400] hover:bg-[#ff5a1f] hover:text-white text-[#1c1c18] rounded-xl font-display font-black text-[10px] uppercase tracking-wider border-2 border-[#1c1c18] hard-shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[13px]">bolt</span>
                COMPILE LIVE RECTIFY STAGE
              </button>
            </div>

            {searchError && (
              <div className="p-3 bg-[#fef2f2] border-2 border-[#b71422] rounded-xl flex items-start gap-2">
                <span className="material-symbols-outlined text-xs text-[#b71422] font-bold">
                  warning
                </span>
                <p className="font-sans text-[9px] leading-snug text-[#b71422] font-semibold">
                  {searchError}
                </p>
              </div>
            )}

            <div className="text-center py-1">
              <span className="font-sans font-black text-[8px] tracking-widest text-[#5b403e] uppercase">OR PICK A PRESET CHAMPION</span>
            </div>

            {/* Popular preset artists roster */}
            {['Taylor Swift', 'Billie Eilish', 'Drake', 'The Weeknd'].map((artist) => {
              const info: Record<string, { desc: string; color: string; icon: string; tag: string }> = {
                "Taylor Swift": { desc: "Prove your knowledge of Swift's tracks", color: "bg-[#ffe4e6]", icon: "favorite", tag: "SWIFT REIGN" },
                "Billie Eilish": { desc: "Whispering vocals & melancholic beats", color: "bg-[#d9f99d]", icon: "headphones", tag: "ALT GLOOM" },
                "Drake": { desc: "Catchy rhythm, bars, and certified gold", color: "bg-[#bae6fd]", icon: "audiotrack", tag: "6GOD VIBES" },
                "The Weeknd": { desc: "Synthwave vocals and neon noir memories", color: "bg-[#fecaca]", icon: "dark_mode", tag: "SIN CITY" }
              };
              const artistMeta = info[artist] || { desc: "Guess the song from lyrics", color: "bg-white", icon: "person", tag: "SUPERSTAR" };

              return (
                <button
                  key={artist}
                  onClick={() => {
                    startLiveMatch(artist);
                  }}
                  className="w-full flex justify-between items-center p-4 bg-white border-2 border-[#1c1c18] rounded-xl hard-shadow hover:bg-[#fcd400] transition-all hover:scale-[1.01] active:translate-y-0.5 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${artistMeta.color} border-2 border-[#1c1c18] flex items-center justify-center shadow-xs transition-transform group-hover:rotate-6`}>
                      <span className="material-symbols-outlined text-[#1c1c18] text-sm font-bold">
                        {artistMeta.icon}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-black text-[#1c1c18] text-xs uppercase tracking-tight">
                          {artist}
                        </span>
                        <span className="bg-[#1c1c18] text-[#fcf9f2] text-[6.5px] font-sans font-black tracking-widest px-1 py-[1.5px] rounded leading-none uppercase">
                          {artistMeta.tag}
                        </span>
                      </div>
                      <p className="font-sans text-[9px] text-[#5b403e] font-semibold mt-0.5">
                        {artistMeta.desc}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined font-black text-[#b71422] text-lg transition-transform group-hover:translate-x-1">
                    play_circle
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Render Post-Game Victory Screen (Perfect Score or Stats review)
  if (gameFinished) {
    const totalXPReceived = score * 500 + (score === currentQuestions.length ? 500 : 0);
    const totalDiamondsAdded = score * 25 + (score === currentQuestions.length ? 50 : 0);
    const isPerfect = score === currentQuestions.length;

    return (
      <div className="w-full pb-28 pt-4 px-4 max-w-lg mx-auto celebration-bg flex flex-col items-center">
        {/* Confetti element if perfect */}
        {isPerfect && (
          <div className="text-center text-[#705d00] font-sans font-extrabold text-[#fcd400] text-xs uppercase animate-pulse mb-2 tracking-widest">
            🎉 UNBELIEVABLE BEAT DETECTED! 🎉
          </div>
        )}

        {/* Trophy Hero Section */}
        <div className="relative mb-10 w-full max-w-md">
          <div className="sticker-rotate-1 bg-[#fcd400] border-2 border-[#1c1c18] p-6 rounded-[32px] hard-shadow relative z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white border-2 border-[#1c1c18] p-5 rounded-full hard-shadow mb-1">
                <span className="material-symbols-outlined text-[52px] text-[#1c1c18] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                  trophy
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl text-[#1c1c18] uppercase tracking-tighter text-center italic">
                {isPerfect ? 'Perfect Score!' : 'Solid Progress!'}
              </h2>
              <p className="font-sans text-xs text-[#1c1c18] opacity-90 text-center max-w-[200px]">
                {isPerfect ? "You didn't miss a single beat. Legendary performance!" : `You nailed ${score} out of ${currentQuestions.length} tracks. Rock on!`}
              </p>
            </div>
          </div>

          {/* Decals and Badges */}
          <div className="absolute -top-3 -right-3 sticker-rotate-2 bg-[#b71422] text-[#fcf9f2] font-display font-black py-1 px-3 border-2 border-[#1c1c18] hard-shadow z-20 text-[10px] uppercase">
            #1 RANK
          </div>
          <div className="absolute -bottom-4 -left-3 sticker-rotate-1 bg-white p-2.5 rounded border-2 border-[#1c1c18] hard-shadow z-20">
            <span className="material-symbols-outlined text-[#b71422] text-xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </div>
        </div>

        {/* Stats Bento Grid */}
        <div className="w-full grid grid-cols-2 gap-4 mb-8">
          {/* XP Card */}
          <div className="col-span-2 sticker-rotate-3 bg-white border-2 border-[#1c1c18] p-4 rounded-xl hard-shadow flex items-center justify-between">
            <div>
              <p className="font-sans text-[10px] uppercase text-[#5b403e] font-extrabold mb-0.5">Total XP Earned</p>
              <h3 className="font-display font-black text-3xl md:text-4xl text-[#b71422]">+{totalXPReceived.toLocaleString()}</h3>
            </div>
            <div className="bg-[#ffdad7] p-3 rounded-xl border-2 border-[#1c1c18]">
              <span className="material-symbols-outlined text-[#b71422] text-3xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
            </div>
          </div>

          {/* Streak Card */}
          <div className="sticker-rotate-1 bg-white border-2 border-[#1c1c18] p-4 rounded-xl hard-shadow">
            <p className="font-sans text-[10px] uppercase text-[#5b403e] font-extrabold mb-1">Max Streak</p>
            <div className="flex items-end gap-1.5">
              <h4 className="font-display font-extrabold text-xl md:text-2xl text-[#1c1c18]">{score}</h4>
              <span className="font-sans text-[10px] text-[#5b403e] font-bold pb-0.5">Lyrics</span>
            </div>
            {/* Hard-drawn progress pills */}
            <div className="mt-3 flex gap-1">
              <div className={`h-1.5 flex-1 rounded-full border border-[#1c1c18] ${score >= 1 ? 'bg-[#fcd400]' : 'bg-[#e5e2db]'}`}></div>
              <div className={`h-1.5 flex-1 rounded-full border border-[#1c1c18] ${score >= 3 ? 'bg-[#fcd400]' : 'bg-[#e5e2db]'}`}></div>
              <div className={`h-1.5 flex-1 rounded-full border border-[#1c1c18] ${score >= 5 ? 'bg-[#fcd400]' : 'bg-[#e5e2db]'}`}></div>
            </div>
          </div>

          {/* Time Bonus */}
          <div className="sticker-rotate-2 bg-white border-2 border-[#1c1c18] p-4 rounded-xl hard-shadow">
            <p className="font-sans text-[10px] uppercase text-[#5b403e] font-extrabold mb-1">Time Bonus</p>
            <div className="flex items-end gap-1">
              <h4 className="font-display font-extrabold text-xl md:text-2xl text-[#1c1c18]">+{score * 90}</h4>
              <span className="material-symbols-outlined text-[#5b403e] mb-0.5 text-lg">timer</span>
            </div>
            <p className="mt-2 text-[9px] text-[#705d00] font-extrabold uppercase">Fastest Fingertips!</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="w-full bg-[#f1eee7] border-2 border-[#1c1c18] p-4 rounded-xl mb-8">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h5 className="font-sans font-extrabold text-[10px] uppercase tracking-wide">Level Up Progress</h5>
              <p className="font-sans text-xs text-[#5b403e]">Level {stats.level - 1} → {stats.level}</p>
            </div>
            <span className="font-display font-black text-lg text-[#b71422]">{stats.progressPercent}%</span>
          </div>
          <div className="w-full h-6 bg-white border-2 border-[#1c1c18] rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-[#b71422] rounded-full border-r-2 border-[#1c1c18] transition-all duration-1000" 
              style={{ width: `${stats.progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="w-full flex flex-col gap-3">
          <button 
            onClick={() => {
              if (category) startLiveMatch(category);
              else {
                setIsPlaying(false);
                setGameFinished(false);
              }
            }}
            className="w-full bg-[#1c1c18] text-[#fcf9f2] py-4 rounded-full font-display font-black text-sm border-2 border-[#1c1c18] hard-shadow hover:bg-[#b71422] active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-wider"
          >
            Play Again
          </button>
          <button 
            onClick={() => {
              setShowShareModal(true);
              triggerHaptic('success');
            }}
            className="w-full bg-white text-[#1c1c18] py-4 rounded-full font-display font-black text-sm border-2 border-[#1c1c18] hard-shadow hover:bg-[#ebe8e1] active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-md">share</span>
            Share Result
          </button>
          <button 
            onClick={() => {
              setCategory(null);
              setIsPlaying(false);
            }}
            className="w-full text-xs text-[#5c5c5c] font-bold uppercase transition-all tracking-widest text-center mt-2 underline"
          >
            Go back to playlists
          </button>
        </div>

        {/* Mock Share dialog */}
        {showShareModal && (
          <div className="fixed inset-0 bg-[#31312c]/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#fcf9f2] border-4 border-[#1c1c18] p-6 rounded-3xl max-w-sm w-full relative hard-shadow-lg sticker-rotate-1">
              <button 
                onClick={() => setShowShareModal(false)}
                className="absolute top-3 right-3 material-symbols-outlined text-xl text-[#b71422] hover:bg-[#e5e2db] p-1.5 rounded-full"
              >
                close
              </button>
              <div className="text-center space-y-4">
                <span className="material-symbols-outlined text-4xl text-[#fcd400]">celebration</span>
                <h3 className="font-display font-black text-xl uppercase tracking-tight">Share your Lyric Glory!</h3>
                <p className="font-sans text-xs text-[#5b403e]">Copy and share your awesome Lyric Genius stats with your friends right now!</p>
                <div className="bg-white border-2 border-[#1c1c18] p-3 rounded-xl font-mono text-[10px] break-all select-all text-left">
                  🌟 I scored {score}/5 on Lyric Genius trivia! Can you beat my high score and win ranks? 🎵 Play at lyric-genius.app
                </div>
                <button 
                  onClick={() => {
                    const textToCopy = `🌟 I scored ${score}/5 on Lyric Genius trivia! Can you beat my high score and win ranks? 🎵 Play at lyric-genius.app`;
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(textToCopy);
                    } else {
                      const textArea = document.createElement("textarea");
                      textArea.value = textToCopy;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand("copy");
                      document.body.removeChild(textArea);
                    }
                    setCopySuccess(true);
                    setTimeout(() => {
                      setCopySuccess(false);
                      setShowShareModal(false);
                    }, 1200);
                  }}
                  className={`w-full py-3 rounded-full font-sans font-extrabold text-[#fcf9f2] text-xs uppercase transition-colors ${
                    copySuccess ? 'bg-[#10b981]' : 'bg-[#1c1c18] hover:bg-[#b71422]'
                  }`}
                >
                  {copySuccess ? 'Copied to Clipboard! 📋' : 'COPY MESSAGE LINK'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Circular Timer calculations for radial stroke offset
  const maxTime = isCompetitive ? 7 : 10;
  // Arc length for radius of 34 = 2 * Math.PI * 34 = 213.6
  const strokeDasharray = 213.6;
  const strokeDashoffset = strokeDasharray - (timeLeft / maxTime) * strokeDasharray;

  return (
    <div className="w-full pb-24 pt-2 px-4 max-w-lg mx-auto flex flex-col items-center select-none">
      {/* Game Stats Row */}
      <div className="w-full flex justify-between items-center py-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-sans font-extrabold text-[#5b403e] tracking-wider uppercase text-[10px]">
            {category ? `${category.toUpperCase()}` : 'MIXED PLAYLIST'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-extrabold text-2xl text-[#b71422]">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="font-sans font-extrabold text-lg text-[#5c5c5c]">
              / {String(currentQuestions.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Circular Countdown Timer */}
        <div className="relative flex items-center justify-center w-16 h-16">
          <svg className="w-16 h-16 -rotate-90">
            <circle 
              className="text-[#e5e2db]" 
              cx="32" 
              cy="32" 
              fill="transparent" 
              r="24" 
              stroke="currentColor" 
              strokeWidth="5"
            ></circle>
            <circle 
              className={`transition-all duration-1000 ${timeLeft <= 3 ? 'text-[#b71422]' : 'text-[#fcd400]'}`} 
              cx="32" 
              cy="32" 
              fill="transparent" 
              r="24" 
              stroke="currentColor" 
              strokeWidth="5"
              strokeDasharray={150.8} // Arc length for radius of 24 is ~150.8
              strokeDashoffset={150.8 - (timeLeft / maxTime) * 150.8}
            ></circle>
          </svg>
          <span className={`absolute font-display font-black text-sm ${timeLeft <= 3 ? 'text-[#b71422] animate-pulse' : 'text-[#1c1c18]'}`}>
            {String(timeLeft).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-[#e5e2db] rounded-full border-2 border-[#1c1c18] mb-6 overflow-hidden">
        <div 
          className="h-full bg-[#fcd400] border-r-2 border-[#1c1c18] transition-all duration-500" 
          style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / currentQuestions.length) * 100}%` }}
        ></div>
      </div>

      {/* Animated Trivia Question Container */}
      <div className="w-full relative overflow-x-hidden min-h-[460px] flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full flex flex-col items-center"
          >
            {/* Lyrics Card */}
            <div className="w-full bg-white rounded-[24px] border-2 border-[#1c1c18] p-6 hard-shadow relative mb-6 transform -rotate-1 shadow-md">
              <span 
                className="material-symbols-outlined absolute -top-3 -left-3 bg-[#b71422] text-white p-2 rounded-full border-2 border-[#1c1c18] hard-shadow-sm fill-1"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                format_quote
              </span>
              
              <div className="flex flex-col gap-3 text-center pt-2">
                <p className="font-display font-extrabold text-[#1c1c18] leading-snug tracking-tight text-lg md:text-xl">
                  {currentQuestion?.lyrics}
                </p>
                <div className="mt-2 inline-flex items-center justify-center gap-1.5 py-1 px-3 bg-[#e5e2db] rounded-full w-max mx-auto border-2 border-[#1c1c18] border-dashed">
                  <span className="material-symbols-outlined text-sm font-bold">music_note</span>
                  <span className="font-sans font-extrabold text-[10px] uppercase tracking-wider">{currentQuestion?.category} Hits</span>
                </div>
              </div>

              {/* Grayscale low-opacity background decoration */}
              <div className="w-full h-32 overflow-hidden rounded-xl border-2 border-[#1c1c18] mt-4 opacity-15 grayscale select-none pointer-events-none">
                <img className="w-full h-full object-cover" src={currentQuestion?.image} alt="Stylized cover" />
              </div>
            </div>

            {/* Choice Chips Grid */}
            <div className="w-full grid grid-cols-1 gap-2.5">
              {currentQuestion?.choices.map((choice, idx) => {
                const letter = String.fromCharCode(65 + idx); // A, B, C, D
                const isSelected = selectedAnswer === idx;
                const isCorrectAnswer = currentQuestion.answerIndex === idx;

                let optionStyle = "bg-white border-2 border-[#1c1c18] hard-shadow-sm";
                let badgeStyle = "bg-[#e5e2db] text-[#1c1c18]";
                let showCheck = false;

                if (isAnswered) {
                  if (isCorrectAnswer) {
                    // Highlight correct answer green/yellow
                    optionStyle = "bg-[#fcd400] border-2 border-[#1c1c18] stroke-[2.5px] hard-shadow scale-[1.01]";
                    badgeStyle = "bg-[#1c1c18] text-white";
                    showCheck = true;
                  } else if (isSelected) {
                    // Mark chosen wrong answer as red alert
                    optionStyle = "bg-[#ffdad7] border-2 border-[#b71422] hard-shadow-sm opacity-90 scale-[0.99]";
                    badgeStyle = "bg-[#b71422] text-white";
                  } else {
                    // Fade non-selected wrong answers
                    optionStyle = "bg-white border border-[#e5e2db] opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswerSelection(idx)}
                    className={`w-full p-3.5 rounded-xl flex items-center justify-between transition-all duration-150 text-left ${
                      isAnswered ? '' : 'hover:bg-[#ebe8e1] active:translate-y-0.5 pointer-events-auto'
                    } ${optionStyle}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full border-2 border-[#1c1c18] flex items-center justify-center font-display font-extrabold text-xs transition-colors ${badgeStyle}`}>
                        {letter}
                      </span>
                      <span className="font-sans font-bold text-xs md:text-sm text-[#1c1c18]">
                        {choice}
                      </span>
                    </span>
                    
                    {isAnswered && (
                      <span className="material-symbols-outlined text-[#1c1c18] text-sm md:text-md">
                        {isCorrectAnswer ? 'check_circle' : isSelected ? 'cancel' : 'radio_button_unchecked'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {isAnswered && lastFailureReason && (
        <div className="w-full mt-3 select-none">
          {lastFailureReason === 'cheat' && (
            <div className="bg-[#fee2e2] text-[#b91c1c] border-2 border-[#b71422] p-4 rounded-xl font-sans font-black text-xs text-center sticker-rotate-1 flex items-center justify-center gap-2 shadow-xs">
              <span className="material-symbols-outlined text-lg font-black text-[#b71422] animate-bounce">gpp_maybe</span>
              <span>🚨 ANTI-CHEAT SHIELD: Left Lyric App window! Round auto-failed to prevent lyric query cheats.</span>
            </div>
          )}
          {lastFailureReason === 'timeout' && (
            <div className="bg-[#fff7ed] text-[#c2410c] border-2 border-[#ff5a1f] p-4 rounded-xl font-sans font-black text-xs text-center sticker-rotate-1 flex items-center justify-center gap-2 shadow-xs">
              <span className="material-symbols-outlined text-lg font-black text-[#ff5a1f]">alarm_off</span>
              <span>⏰ SPEED CLOCK OUT: Speak faster next round!</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom control panel */}
      {isAnswered && (
        <div className="w-full mt-5 select-none">
          <button
            onClick={handleNext}
            className="w-full bg-[#1c1c18] text-[#fcf9f2] py-4 rounded-full font-display font-black text-sm uppercase tracking-wider border-2 border-[#1c1c18] hard-shadow hover:bg-[#b71422] transition-all duration-150 active:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>{currentIndex + 1 === currentQuestions.length ? 'FINISH FLIGHT' : 'NEXT STAGE'}</span>
            <span className="material-symbols-outlined font-bold text-sm">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}
