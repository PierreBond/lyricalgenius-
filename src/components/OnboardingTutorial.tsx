import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingTutorialProps {
  onComplete: (diamondsGained: number) => void;
  onClose: () => void;
}

export default function OnboardingTutorial({ onComplete, onClose }: OnboardingTutorialProps) {
  const [step, setStep] = useState(1);
  const [mockAnswered, setMockAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mockScore, setMockScore] = useState(0);
  const [claimedBonus, setClaimedBonus] = useState(false);

  const totalSteps = 4;

  const mockQuestions = {
    lyric: "🗣️ \"I'm off the deep end, watch as I dive in, I'll never meet the ground...\"",
    options: [
      { id: 1, text: "Lady Gaga & Bradley Cooper (Shallow)", isCorrect: true },
      { id: 2, text: "Taylor Swift (Cardigan)", isCorrect: false },
      { id: 3, text: "Adele (Rolling in the Deep)", isCorrect: false },
      { id: 4, text: "Billie Eilish (Ocean Eyes)", isCorrect: false }
    ]
  };

  const handleSelectOption = (index: number, isCorrect: boolean) => {
    if (mockAnswered) return;
    setSelectedOption(index);
    setMockAnswered(true);
    if (isCorrect) {
      setMockScore(20);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    const totalPrize = 50 + mockScore; // 50 flat helper starter bonus + 20 mock trivia points
    onComplete(totalPrize);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1c1c18]/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="bg-white border-4 border-[#1c1c18] rounded-[32px] max-w-lg w-full overflow-hidden hard-shadow-lg flex flex-col relative max-h-[90vh]"
      >
        {/* Decorative Top Banner */}
        <div className="bg-[#fcd400] border-b-4 border-[#1c1c18] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b71422] font-black text-2xl animate-spin" style={{ animationDuration: '3s' }}>
              album
            </span>
            <span className="font-display font-black text-sm uppercase italic tracking-tight text-[#1c1c18]">
              Lyric Genius Academy
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-[#1c1c18] bg-[#fcf9f2] text-[#1c1c18] hover:bg-[#b71422] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-black">close</span>
          </button>
        </div>

        {/* Dynamic Onboarding Content Scroller */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Step Progress indicators */}
          <div className="flex items-center justify-between gap-1.5 px-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex flex-col gap-1">
                <div 
                  className={`h-2 border border-[#1c1c18] rounded-full transition-all duration-300 ${
                    s < step 
                      ? 'bg-[#10b981]' 
                      : s === step 
                        ? 'bg-[#ff5a1f]' 
                        : 'bg-[#f1eee7]'
                  }`} 
                />
                <span className={`text-[8px] font-sans font-black text-center uppercase tracking-wider ${
                  s === step ? 'text-[#ff5a1f]' : 'text-stone-400'
                }`}>
                  {s === 1 ? 'Intro' : s === 2 ? 'Play' : s === 3 ? 'Quests' : 'Reward'}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-center"
              >
                <div className="inline-block bg-[#fcd400] text-black border-2 border-[#1c1c18] px-3.5 py-1 rounded-full font-sans font-black text-[10px] tracking-widest uppercase sticker-rotate-2">
                  STREAKS • TRIVIA • DUELS
                </div>
                <h2 className="font-display font-black text-2xl uppercase tracking-tighter italic text-[#1c1c18]">
                  ARE YOU A REAL <span className="text-[#b71422]">LYRIC GENIUS?</span>
                </h2>
                <p className="font-sans text-xs text-[#5b403e] leading-relaxed max-w-sm mx-auto">
                  Welcome to the ultimate music arena! Play quizzes to test your ear, earn shiny <strong>Diamonds</strong> 💎, and climb divisions to secure top standing on the global leaderboard!
                </p>

                <div className="bg-[#fcf9f2] border-2 border-[#1c1c18] p-4 rounded-2xl flex items-center justify-around gap-4 hard-shadow-sm mt-4">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[#ff5a1f] text-3xl animate-pulse">music_note</span>
                    <p className="font-sans font-black text-[9px] uppercase tracking-wide mt-1">Pop & Hip-Hop</p>
                  </div>
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[#fcd400] text-3xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    <p className="font-sans font-black text-[9px] uppercase tracking-wide mt-1">Level-Up XP</p>
                  </div>
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[#b71422] text-3xl animate-bounce">local_fire_department</span>
                    <p className="font-sans font-black text-[9px] uppercase tracking-wide mt-1">Daily Multipliers</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h3 className="font-display font-black text-xl uppercase tracking-tighter text-[#1c1c18]">
                    1. How Lyric Trivia Works
                  </h3>
                  <p className="font-sans text-[11px] text-[#5b403e] max-w-sm mx-auto">
                    You're presented with a lyric block and 4 potential songs. Solve it prior to the deadline! Tap an answer option below to try it now and unlock extra Diamonds!
                  </p>
                </div>

                {/* Simulated Interactive Trivia Question Card */}
                <div className="bg-white border-2 border-[#1c1c18] rounded-2xl p-4.5 hard-shadow-sm text-center space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[10px] font-black text-[#b71422] uppercase tracking-widest bg-[#b71422]/10 border border-[#b71422]/20 px-2 py-0.5 rounded-md">
                      Interactive Simulation
                    </span>
                    <span className="font-sans font-black text-[10px] text-[#1c1c18] flex items-center gap-1">
                      Time: <span className="text-[#ff5a1f] animate-pulse">12s</span>
                    </span>
                  </div>

                  <p className="font-sans font-extrabold text-[#1c1c18] text-xs leading-relaxed bg-[#fcf9f2] border border-[#1c1c18]/25 p-3 rounded-xl italic">
                    {mockQuestions.lyric}
                  </p>

                  <div className="grid grid-cols-1 gap-2">
                    {mockQuestions.options.map((opt, index) => {
                      const isSelected = selectedOption === index;
                      const showCorrectStyles = mockAnswered && opt.isCorrect;
                      const showIncorrectStyles = mockAnswered && isSelected && !opt.isCorrect;

                      return (
                        <button
                          key={opt.id}
                          disabled={mockAnswered}
                          onClick={() => handleSelectOption(index, opt.isCorrect)}
                          className={`w-full text-left py-2.5 px-3 rounded-xl border-2 font-sans font-black text-xs transition-colors flex items-center justify-between cursor-pointer ${
                            showCorrectStyles 
                              ? 'bg-[#10b981] text-white border-[#1c1c18]' 
                              : showIncorrectStyles 
                                ? 'bg-[#ef4444] text-white border-[#1c1c18]' 
                                : isSelected 
                                  ? 'bg-[#1c1c18] text-white border-[#1c1c18]' 
                                  : 'bg-[#fcf9f2] hover:bg-[#fcd400] text-[#1c1c18] border-[#1c1c18]'
                          }`}
                        >
                          <span>{index + 1}. {opt.text}</span>
                          {showCorrectStyles && (
                            <span className="material-symbols-outlined text-sm font-black text-white">check_circle</span>
                          )}
                          {showIncorrectStyles && (
                            <span className="material-symbols-outlined text-sm font-black text-white">cancel</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {mockAnswered && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-center py-2.5 px-3 rounded-xl border-2 border-[#1c1c18] font-sans font-black text-[10.5px] uppercase tracking-wide ${
                        mockScore > 0 ? 'bg-[#f9f5e8]' : 'bg-[#fcf9f2]'
                      }`}
                    >
                      {mockScore > 0 ? (
                        <span className="text-[#10b981] flex items-center justify-center gap-1.5 leading-none">
                          🎉 Magnificent! You solved it! (+20 Bonus Diamonds) 💎
                        </span>
                      ) : (
                        <span className="text-[#ef4444] flex items-center justify-center gap-1.5 leading-none">
                          Ouch! Not quite, correct is Lady Gaga! (+0 Bonus) 💎
                        </span>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h3 className="font-display font-black text-xl uppercase tracking-tighter text-[#1c1c18]">
                    2. Diamond Economy, Streak & Quests
                  </h3>
                  <p className="font-sans text-[11px] text-[#5b403e] max-w-sm mx-auto">
                    Manage and grow your reserves of diamonds key-by-key! Here's how to maintain an unstoppable flow:
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Streak Card mockup */}
                  <div className="bg-[#fcf9f2] border-2 border-[#1c1c18] p-3 rounded-2xl flex items-center gap-3.5 hard-shadow-sm">
                    <div className="w-9 h-9 border border-[#1c1c18] rounded-xl bg-[#ff5a1f] flex items-center justify-center text-white flex-shrink-0 animate-pulse">
                      <span className="material-symbols-outlined text-md font-black">local_fire_department</span>
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-xs text-[#1c1c18]">Log in Daily for Streaks</h4>
                      <p className="font-sans text-[10px] text-[#5b403e] font-bold">
                        Keep logs and extend consecutive days to harvest free diamonds (+25 💎) daily!
                      </p>
                    </div>
                  </div>

                  {/* Quests mockup */}
                  <div className="bg-[#fcf9f2] border-2 border-[#1c1c18] p-3 rounded-2xl flex items-center gap-3.5 hard-shadow-sm">
                    <div className="w-9 h-9 border border-[#1c1c18] rounded-xl bg-[#10b981] flex items-center justify-center text-white flex-shrink-0">
                      <span className="material-symbols-outlined text-md font-black">emoji_events</span>
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-xs text-[#1c1c18]">Complete 3 Daily Quests</h4>
                      <p className="font-sans text-[10px] text-[#5b403e] font-bold">
                        Solve Pop trivia, start duels or checks in to trigger quest completions on your Dashboard!
                      </p>
                    </div>
                  </div>

                  {/* Duels mock */}
                  <div className="bg-[#fcf9f2] border-2 border-[#1c1c18] p-3 rounded-2xl flex items-center gap-3.5 hard-shadow-sm">
                    <div className="w-9 h-9 border border-[#1c1c18] rounded-xl bg-[#b71422] flex items-center justify-center text-light flex-shrink-0">
                      <span className="material-symbols-outlined text-md font-black">sports_martial_arts</span>
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-xs text-[#1c1c18] text-black">High Stakes Arena (Duels)</h4>
                      <p className="font-sans text-[10px] text-[#5b403e] font-bold">
                        Wager diamonds against legendary players. Win to double your stake and surge up the leaderboard!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-2">
                  <div className="inline-block bg-[#10b981] text-white border-2 border-[#1c1c18] px-3.5 py-1 rounded-full font-sans font-black text-[10px] tracking-widest uppercase sticker-rotate-2 animate-bounce">
                    CHAMPION EMBODIED
                  </div>
                  <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic text-[#1c1c18]">
                    YOU'RE GOOD TO GO!
                  </h3>
                  <p className="font-sans text-xs text-[#5b403e] max-w-sm mx-auto leading-relaxed">
                    You've acquired the core training of the Lyric Academy. Now it's time to test your pop limits, outsmart rivals, and seize your glory!
                  </p>
                </div>

                <div className="bg-[#f9f5e8] border-2 border-[#1c1c18] rounded-2xl p-4.5 hard-shadow-sm space-y-3 max-w-sm mx-auto">
                  <h4 className="font-sans font-black text-[10px] uppercase text-[#ff5a1f] tracking-widest">
                    Claim Starter Onboarding Reward
                  </h4>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-display font-black text-4xl text-[#1c1c18]">
                      +{50 + mockScore}
                    </span>
                    <span className="text-3xl animate-bounce">💎</span>
                  </div>
                  <p className="font-sans text-[9px] font-black text-[#5b403e] uppercase leading-none">
                    (Includes a 50💎 flat bonus + your trivia winnings of {mockScore}💎!)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Controls Footer */}
        <div className="bg-[#fcf9f2] border-t-4 border-[#1c1c18] p-4.5 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className={`px-4 py-2.5 rounded-xl border-2 border-[#1c1c18] font-sans font-black text-xs uppercase hard-shadow-sm transition-all flex items-center gap-1.5 ${
              step === 1 
                ? 'opacity-30 cursor-not-allowed bg-transparent' 
                : 'bg-white hover:bg-stone-100 cursor-pointer active:translate-y-0.5'
            }`}
          >
            <span className="material-symbols-outlined text-sm font-black">arrow_back</span>
            Back
          </button>

          <span className="font-sans text-[11px] font-black text-[#5b403e] tracking-wider uppercase">
            Step {step} / {totalSteps}
          </span>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-[#b71422] hover:bg-black text-white hover:text-white border-2 border-[#1c1c18] rounded-xl font-sans font-black text-xs uppercase tracking-wider hard-shadow-sm transition-all active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
          >
            {step === totalSteps ? (
              <>
                Let's Play!
                <span className="material-symbols-outlined text-sm font-black">music_note</span>
              </>
            ) : (
              <>
                Next
                <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
