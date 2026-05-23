import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tab, UserStats, Question } from '../types';
import { TRIVIA_QUESTIONS } from '../data/questions';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 10s per question
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reactionText, setReactionText] = useState<'correct' | 'incorrect' | null>(null);
  const [vibeChosen, setVibeChosen] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter and initialize game questions
  const initializeGame = (genre: string | null) => {
    let filtered = TRIVIA_QUESTIONS;
    if (genre && genre !== 'All') {
      filtered = TRIVIA_QUESTIONS.filter(q => q.category.toLowerCase() === genre.toLowerCase());
    }
    // Pick at most 5 random questions to make it quick and fun
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setTimeLeft(10);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setGameFinished(false);
    setIsPlaying(true);
  };

  // Start game when category updates via home page redirection
  useEffect(() => {
    if (category) {
      initializeGame(category);
    }
  }, [category]);

  // Audio simulation feedback helper
  const triggerHaptic = (type: 'success' | 'fail') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(type === 'success' ? 40 : [50, 50, 50]);
    }
  };

  // Live Timer Countdown
  useEffect(() => {
    if (isPlaying && !gameFinished && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time ran out!
            handleAnswerSelection(-1); // wrong answer
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, gameFinished, isAnswered, currentIndex]);

  const handleAnswerSelection = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);

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
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setReactionText(null);

    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(10);
    } else {
      // Game ended! Update global profile stats
      const correctAnswers = score + (selectedAnswer === currentQuestions[currentIndex].answerIndex ? 1 : 0);
      const isPerfect = score === currentQuestions.length;
      
      const xpGained = score * 500 + (isPerfect ? 500 : 0); // 500 XP per question + bonus for perfect game
      const diamondsGained = score * 25 + (isPerfect ? 50 : 0);
      
      updateStats(xpGained, diamondsGained);
      setGameFinished(true);
    }
  };

  const currentQuestion = currentQuestions[currentIndex];

  // Render Category Select Screen (if not currently playing)
  if (!isPlaying) {
    const defaultPlaylists = ['All', 'Pop', 'Rock', 'Hip Hop', '90s Hits'];
    return (
      <div className="w-full pb-24 pt-4 px-4 max-w-md mx-auto space-y-8 select-none">
        <div className="text-center my-6">
          <h2 className="font-display font-black text-3xl uppercase tracking-tighter italic">CHOOSE YOUR VIBE</h2>
          <p className="text-[#5b403e] font-sans text-xs mt-2">Pick a playlist to begin proving your lyric mastery.</p>
        </div>

        <div className="space-y-4">
          {defaultPlaylists.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setCategory(genre === 'All' ? null : genre);
                initializeGame(genre === 'All' ? null : genre);
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
                  {genre === 'All' ? 'ALL GENRES CATALOG' : `${genre.toUpperCase()} PILOT`}
                </div>
              </div>
              <span className="material-symbols-outlined font-bold text-[#b71422]">arrow_forward</span>
            </button>
          ))}
        </div>
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
            onClick={() => initializeGame(category)}
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
                    alert("Copied to clipboard!");
                    setShowShareModal(false);
                  }}
                  className="w-full bg-[#1c1c18] text-white py-3 rounded-full font-sans font-extrabold text-xs uppercase hover:bg-[#b71422] transition-colors"
                >
                  COPY MESSAGE LINK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Circular Timer calculations for radial stroke offset
  const maxTime = 10;
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

      {/* Bottom control panel */}
      {isAnswered && (
        <div className="w-full mt-6 animate-pulse select-none">
          <button
            onClick={handleNext}
            className="w-full bg-[#b71422] text-[#fcf9f2] py-4 rounded-full font-display font-black text-sm uppercase tracking-wider border-2 border-[#1c1c18] hard-shadow hover:bg-[#1c1c18] transition-all duration-150 active:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>{currentIndex + 1 === currentQuestions.length ? 'FINISH FLIGHT' : 'NEXT STAGE'}</span>
            <span className="material-symbols-outlined font-bold text-sm">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}
