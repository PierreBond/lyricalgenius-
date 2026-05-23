import React, { useState, useEffect } from 'react';
import { Tab, UserStats, ProPhase } from '../types';

interface ProFlowProps {
  stats: UserStats;
  onUpgradeSuccess: () => void;
  onClose: () => void;
  setCurrentTab: (tab: Tab) => void;
}

export default function ProFlow({
  stats,
  onUpgradeSuccess,
  onClose,
  setCurrentTab
}: ProFlowProps) {
  const [phase, setPhase] = useState<ProPhase>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card');
  const [countdown, setCountdown] = useState(10);

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Confetti particles state for success screen
  const [confetti, setConfetti] = useState<{ id: number; left: number; top: number; size: number; rotate: number; color: string }[]>([]);

  // SUCCESS STAGE Redirect countdown trigger
  useEffect(() => {
    if (phase === 'success') {
      // Trigger update back to app
      onUpgradeSuccess();

      // Spawn falling confetti
      const colors = ['#b71422', '#fcd400', '#1c1c18', '#705d00', '#db3237'];
      const particles = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * -60 - 20,
        size: Math.random() * 12 + 6,
        rotate: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      setConfetti(particles);

      // Countdown effect
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onClose(); // close flow and return
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [phase]);

  const handlePlansSubmit = () => {
    setPhase('verdict');
  };

  const handleVerdictSubmit = () => {
    setPhase('checkout');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiry || !cvv) {
        setFormError("Please key in your card numbers to confirm subscription secure payment!");
        return;
      }
    }
    setPhase('success');
  };

  return (
    <div className="w-full min-h-screen bg-[#fcf9f2] text-[#1c1c18] font-sans overflow-x-hidden selection:bg-[#fcd400] relative">
      {/* Top Navigation sticky bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-[#fcf9f2] border-b-2 border-[#1c1c18]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (phase === 'verdict') setPhase('plans');
              else if (phase === 'checkout') setPhase('verdict');
              else onClose();
            }}
            className="hover:bg-[#ebe8e1] transition-transform p-1.5 rounded-full active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[#b71422] font-bold">arrow_back</span>
          </button>
          <h1 className="font-display font-black text-xl italic tracking-tighter text-[#1c1c18] uppercase">
            LYRIC GENIUS
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b71422]">account_circle</span>
        </div>
      </header>

      {/* Main Flow Content Body */}
      <main className="pt-24 pb-32 px-4 max-w-2xl mx-auto w-full select-none">
        
        {/* ================= STAGE 1: PLANS SELECTION ================= */}
        {phase === 'plans' && (
          <div className="space-y-10">
            {/* Hero Section */}
            <section className="text-center relative py-2">
              <div className="absolute -top-3 -left-2 bg-[#fcd400] px-4 py-1.5 border-2 border-[#1c1c18] hard-shadow-sm sticker-rotate-1 z-10 font-sans font-black text-[10px] tracking-widest uppercase">
                LEVEL UP YOUR GAME
              </div>
              <h2 className="font-display font-black text-4xl uppercase tracking-tighter leading-none mb-3">
                GO <span className="text-[#b71422] italic">PRO</span>
              </h2>
              <p className="font-sans text-sm max-w-md mx-auto text-[#5b403e]">
                Unlock the ultimate trivia experience. No limits. No ads. Just pure rhythm.
              </p>
            </section>

            {/* Bento Grid Features */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Feature 1 */}
              <div className="bg-white border-2 border-[#1c1c18] p-5 rounded-xl hard-shadow flex flex-col gap-3">
                <div className="w-10 h-10 bg-[#fcd400] border-2 border-[#1c1c18] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#1c1c18] font-bold">block</span>
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase mb-1">Ad-Free Gameplay</h3>
                  <p className="font-sans text-xs text-[#5b403e]">Stay in the flow without any interruptions between matches.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white border-2 border-[#1c1c18] p-5 rounded-xl hard-shadow flex flex-col gap-3 sticker-rotate-2">
                <div className="w-10 h-10 bg-[#db3237] border-2 border-[#1c1c18] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white font-bold">fast_forward</span>
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase mb-1">Unlimited Skips</h3>
                  <p className="font-sans text-xs text-[#5b403e]">Not feeling the track? Skip as much as you want and find your vibe.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white border-2 border-[#1c1c18] p-5 rounded-xl hard-shadow flex flex-col gap-3">
                <div className="w-10 h-10 bg-[#1c1c18] rounded-full border-2 border-[#1c1c18] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white font-bold">library_music</span>
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase mb-1">Exclusive Tracks</h3>
                  <p className="font-sans text-xs text-[#5b403e]">Access early releases and underground hits before anyone else.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#705d00] border-2 border-[#1c1c18] p-5 rounded-xl hard-shadow flex flex-col gap-3 text-white">
                <div className="w-10 h-10 bg-[#fcd400] border-2 border-[#1c1c18] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#1c1c18] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase mb-1 text-white">Double XP</h3>
                  <p className="font-sans text-xs text-[#ebe8e1]">Climb the leaderboards twice as fast with permanent XP boosts.</p>
                </div>
              </div>
            </section>

            {/* Plans Selection Radio */}
            <section className="space-y-4">
              <div className="text-center">
                <h3 className="font-display font-extrabold text-lg uppercase italic tracking-tight">CHOOSE YOUR VIBE</h3>
              </div>
              <div className="flex flex-col gap-3 max-w-md mx-auto">
                <label className="relative cursor-pointer group">
                  <input 
                    type="radio" 
                    name="plan" 
                    checked={selectedPlan === 'yearly'}
                    onChange={() => setSelectedPlan('yearly')}
                    className="peer sr-only" 
                  />
                  <div className="p-4 border-2 border-[#1c1c18] bg-white rounded-xl peer-checked:bg-[#fcd400] transition-all group-hover:scale-[1.01] hard-shadow-sm flex justify-between items-center select-none">
                    <div className="flex flex-col">
                      <span className="font-sans font-extrabold text-[#5b403e] text-[9px] uppercase tracking-wide">Yearly • Best Value Save 33%</span>
                      <span className="font-display font-black text-lg text-[#1c1c18]">$39.99/year</span>
                    </div>
                    <div className="w-6 h-6 rounded-full border-4 border-[#1c1c18] bg-white peer-checked:bg-[#b71422] transition-colors flex items-center justify-center">
                      {selectedPlan === 'yearly' && <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c18]" />}
                    </div>
                  </div>
                </label>

                <label className="relative cursor-pointer group">
                  <input 
                    type="radio" 
                    name="plan"
                    checked={selectedPlan === 'monthly'}
                    onChange={() => setSelectedPlan('monthly')}
                    className="peer sr-only" 
                  />
                  <div className="p-4 border-2 border-[#1c1c18] bg-white rounded-xl peer-checked:bg-[#fcd400] transition-all group-hover:scale-[1.01] hard-shadow-sm flex justify-between items-center select-none">
                    <div className="flex flex-col">
                      <span className="font-sans font-extrabold text-[#5b403e] text-[9px] uppercase tracking-wide">Monthly</span>
                      <span className="font-display font-black text-lg text-[#1c1c18]">$4.99/mo</span>
                    </div>
                    <div className="w-6 h-6 rounded-full border-4 border-[#1c1c18] bg-white peer-checked:bg-[#b71422] transition-colors flex items-center justify-center">
                      {selectedPlan === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c18]" />}
                    </div>
                  </div>
                </label>
              </div>
            </section>

            {/* Continuous marquee */}
            <div className="overflow-hidden py-2 border-t border-b border-[#1c1c18]">
              <div className="flex whitespace-nowrap gap-6 animate-marquee uppercase font-display font-extrabold text-xs tracking-wide text-[#b71422]/50">
                <span>NO ADS • UNLIMITED SKIPS • DOUBLE XP • NO ADS • UNLIMITED SKIPS • DOUBLE XP • NO ADS • UNLIMITED SKIPS • DOUBLE XP •</span>
              </div>
            </div>

            {/* See comparision button */}
            <div className="fixed bottom-20 left-0 w-full px-4 z-40 md:relative md:bg-transparent md:border-none md:p-0">
              <button 
                onClick={handlePlansSubmit}
                className="w-full max-w-sm mx-auto block bg-[#1c1c18] hover:bg-[#b71422] text-[#fcf9f2] hover:text-white py-4 rounded-full font-display font-black text-sm uppercase tracking-wide border-2 border-[#1c1c18] hard-shadow"
              >
                SEE COMPARISON PERKS
              </button>
            </div>
          </div>
        )}


        {/* ================= STAGE 2: THE VERDICT (PERK TABLE) ================= */}
        {phase === 'verdict' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="font-display font-black text-2xl uppercase tracking-tighter italic">THE VERDICT</h2>
              <p className="font-sans text-xs text-[#5b403e] mt-1">See how Pro transforms your lyric mastery experience.</p>
            </div>

            <div className="border-4 border-[#1c1c18] bg-white hard-shadow rounded-2xl overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-4 border-[#1c1c18]">
                    <th className="p-3 text-left font-sans font-black text-xs uppercase bg-[#ebe8e1] tracking-wider">Feature</th>
                    <th className="p-3 text-center font-sans font-black text-xs uppercase bg-[#ebe8e1] tracking-wider">Free</th>
                    <th className="p-3 text-center font-sans font-black text-xs uppercase bg-[#fcd400] tracking-wider">Pro</th>
                  </tr>
                </thead>
                <tbody className="font-sans font-semibold text-xs md:text-sm">
                  <tr className="border-b-2 border-[#1c1c18]">
                    <td className="p-3 font-bold">Ad-Free Gameplay</td>
                    <td className="p-3 text-center">
                      <span className="material-symbols-outlined text-[#ba1a1a]">cancel</span>
                    </td>
                    <td className="p-3 text-center bg-[#fcd400]/10">
                      <span className="material-symbols-outlined text-[#b71422] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-[#1c1c18]">
                    <td className="p-3 font-bold">Unlimited Skips</td>
                    <td className="p-3 text-center text-[10px] text-[#5b403e]">3 / DAY</td>
                    <td className="p-3 text-center bg-[#fcd400]/10">
                      <span className="material-symbols-outlined text-[#b71422] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-[#1c1c18]">
                    <td className="p-3 font-bold">Exclusive Tracks</td>
                    <td className="p-3 text-center">
                      <span className="material-symbols-outlined text-[#ba1a1a]">cancel</span>
                    </td>
                    <td className="p-3 text-center bg-[#fcd400]/10">
                      <span className="material-symbols-outlined text-[#b71422] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-[#1c1c18]">
                    <td className="p-3 font-bold">Double XP</td>
                    <td className="p-3 text-center">
                      <span className="material-symbols-outlined text-[#ba1a1a]">cancel</span>
                    </td>
                    <td className="p-3 text-center bg-[#fcd400]/10">
                      <span className="material-symbols-outlined text-[#b71422] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">VIP Badge Banner</td>
                    <td className="p-3 text-center">
                      <span className="material-symbols-outlined text-[#ba1a1a]">cancel</span>
                    </td>
                    <td className="p-3 text-center bg-[#fcd400]/10">
                      <span className="material-symbols-outlined text-[#b71422] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="fixed bottom-20 left-0 w-full px-4 z-40 md:relative md:bg-transparent md:border-none md:p-0">
              <button 
                onClick={handleVerdictSubmit}
                className="w-full max-w-sm mx-auto block bg-[#1c1c18] hover:bg-[#b71422] text-[#fcf9f2] hover:text-white py-4 rounded-full font-display font-black text-sm uppercase tracking-wide border-2 border-[#1c1c18] hard-shadow"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        )}


        {/* ================= STAGE 3: PAYMENT CHECKOUT ================= */}
        {phase === 'checkout' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-black text-2xl uppercase tracking-tighter italic">Upgrade to Pro</h2>
              <p className="font-sans text-xs text-[#5b403e] mt-1">Personalise your lyric-slaying experience securely.</p>
            </div>

            {/* Order Summary */}
            <section className="bg-white border-2 border-[#1c1c18] rounded-xl p-5 hard-shadow sticker-rotate relative overflow-hidden text-left">
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#fcd400] border-2 border-[#1c1c18] flex items-center justify-center transform rotate-12">
                <span className="material-symbols-outlined text-[#1c1c18] font-bold fill-1">stars</span>
              </div>
              <h3 className="font-sans font-black text-[#b71422] uppercase tracking-wide text-xs mb-1">Order Summary</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-display font-black text-lg text-[#1c1c18]">
                    {selectedPlan === 'yearly' ? 'Yearly Plan' : 'Monthly Plan'}
                  </p>
                  <p className="text-xs text-[#5b403e]">Billed {selectedPlan === 'yearly' ? 'annually' : 'monthly'}. Cancel anytime.</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-black text-2xl">${selectedPlan === 'yearly' ? '39.99' : '4.99'}</p>
                  {selectedPlan === 'yearly' && (
                    <p className="text-[9px] font-sans font-black bg-[#fcd400] px-2 py-0.5 inline-block border border-[#1c1c18] mt-1 rounded uppercase tracking-wide">
                      BEST VALUE
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Payment Method chips */}
            <section className="space-y-3">
              <h3 className="font-sans font-extrabold text-[10px] uppercase tracking-wider text-[#1c1c18] text-left">Payment Method</h3>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-[#1c1c18] transition-all ${
                    paymentMethod === 'card' 
                      ? 'bg-[#fcd400] hard-shadow translate-y-[-2px]' 
                      : 'bg-white text-[#5c5c5c]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">credit_card</span>
                  <span className="font-sans font-black text-[10px] tracking-tight">Credit Card</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-[#1c1c18] transition-all ${
                    paymentMethod === 'apple' 
                      ? 'bg-[#fcd400] hard-shadow translate-y-[-2px]' 
                      : 'bg-white text-[#5c5c5c]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">brand_awareness</span>
                  <span className="font-sans font-black text-[10px] tracking-tight">Apple Pay</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('google')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-[#1c1c18] transition-all ${
                    paymentMethod === 'google' 
                      ? 'bg-[#fcd400] hard-shadow translate-y-[-2px]' 
                      : 'bg-white text-[#5c5c5c]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">google_plus_reshare</span>
                  <span className="font-sans font-black text-[10px] tracking-tight">Google Pay</span>
                </button>
              </div>
            </section>

            {/* Card Inputs Form (if card chosen) */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left">
              {formError && (
                <div className="bg-[#fee2e2] text-[#b91c1c] border-2 border-[#b71422] p-3.5 rounded-xl font-sans font-extrabold text-xs text-center sticker-rotate-1 flex items-center justify-center gap-2 shadow-xs">
                  <span className="material-symbols-outlined text-sm font-black text-[#b71422]">error</span>
                  <span>{formError}</span>
                </div>
              )}
              {paymentMethod === 'card' ? (
                <div className="bg-white border-2 border-[#1c1c18] rounded-xl p-5 hard-shadow space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-sans font-black text-[10px] uppercase tracking-wide text-[#1c1c18]">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        className="w-full h-11 px-3 border-2 border-[#1c1c18] rounded-lg font-sans font-semibold text-xs placeholder-[#c6c6c6] focus:ring-[#b71422] focus:border-[#b71422]"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-lg text-[#5b403e]">lock</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-sans font-black text-[10px] uppercase tracking-wide">Expiry Date</label>
                      <input 
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
                        className="w-full h-11 px-3 border-2 border-[#1c1c18] rounded-lg font-sans font-semibold text-xs placeholder-[#c6c6c6] focus:ring-[#b71422]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-sans font-black text-[10px] uppercase tracking-wide">CVV</label>
                      <input 
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full h-11 px-3 border-2 border-[#1c1c18] rounded-lg font-sans font-semibold text-xs placeholder-[#c6c6c6] focus:ring-[#b71422]"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 pt-1">
                    <input 
                      type="checkbox"
                      id="save-card-toggle"
                      checked={saveCard}
                      onChange={() => setSaveCard(!saveCard)}
                      className="mt-0.5 w-4 h-4 border-2 border-[#1c1c18] text-[#b71422] focus:ring-[#b71422] rounded cursor-pointer"
                    />
                    <label htmlFor="save-card-toggle" className="text-[10px] font-sans text-[#5b403e] leading-normal cursor-pointer select-none">
                      Save card details for future fast-checkout. Your data is encrypted and secure.
                    </label>
                  </div>
                </div>
              ) : (
                <div className="bg-[#ebe8e1] border-2 border-[#1c1c18] rounded-xl p-5 text-center font-sans font-bold text-xs select-none">
                  {paymentMethod === 'apple' ? 'Apple Pay Secure Interface Active.' : 'Google Pay Express Wallet Activated.'}
                  <p className="text-[10px] opacity-70 mt-1 font-normal">Click pay to verify transaction instantly.</p>
                </div>
              )}

              {/* Secure lockers badging */}
              <div className="flex justify-center gap-6 py-1 opacity-70">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] font-bold">verified_user</span>
                  <span className="font-sans font-extrabold text-[9px] uppercase tracking-wider">SSL SECURE</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] font-bold">shield</span>
                  <span className="font-sans font-extrabold text-[9px] uppercase tracking-wider">PCI COMPLIANT</span>
                </div>
              </div>

              {/* Pay confirm cta */}
              <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t-4 border-[#1c1c18] z-40 md:relative md:bg-transparent md:border-none md:p-0">
                <button 
                  type="submit"
                  className="w-full h-15 bg-[#1c1c18] hover:bg-[#b52424] text-white font-display font-black text-sm rounded-full border-2 border-transparent hover:border-[#1c1c18] hard-shadow uppercase tracking-wide flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>CONFIRM &amp; PAY NOW</span>
                  <span className="material-symbols-outlined text-sm font-bold group-hover:translate-x-1.5 transition-transform">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        )}


        {/* ================= STAGE 4: SUCCESS OVERLAY ================= */}
        {phase === 'success' && (
          <div className="relative">
            {/* Confetti Spawner */}
            <div className="absolute inset-0 select-none pointer-events-none w-full h-[50vh] overflow-hidden -z-10 bg-transparent">
              {confetti.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute animate-bounce"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top + 30}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    borderRadius: particle.id % 2 === 0 ? '50%' : '2px',
                    transform: `rotate(${particle.rotate}deg)`,
                    transition: 'top 5s ease-out'
                  }}
                />
              ))}
            </div>

            <div className="space-y-8 text-center py-4">
              {/* Badge sticker rotating */}
              <div className="relative inline-block select-none scale-95 md:scale-100">
                <div className="relative flex flex-col items-center justify-center w-40 h-40 md:w-48 md:h-48 bg-[#fcd400] border-4 border-[#1c1c18] rounded-full hard-shadow rotate-random-2 transform transition-all duration-300 hover:scale-105 hover:rotate-0">
                  <span className="material-symbols-outlined text-[64px] md:text-[80px] text-[#1c1c18] mb-1 fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                    stars
                  </span>
                  <span className="font-display font-black text-lg md:text-xl text-[#1c1c18]">PRO</span>
                </div>
                <div className="absolute -top-3 -right-3 bg-[#b71422] text-white font-sans font-black py-1 px-3.5 rounded-xl border-2 border-[#1c1c18] hard-shadow-sm -rotate-12 uppercase text-[10px] tracking-wide">
                  LIT!
                </div>
                <div className="absolute -bottom-2 -left-4 bg-[#e5e2db] text-[#1c1c18] font-sans font-black py-1 px-3 rounded-xl border-2 border-[#1c1c18] hard-shadow-sm rotate-6 uppercase text-[10px] tracking-wide">
                  VIP
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="font-display font-black text-3xl uppercase leading-tight text-[#1c1c18]">
                  YOU'RE A <span className="text-[#b71422] underline decoration-4 decoration-black/10">PRO!</span>
                </h1>
                <p className="font-sans text-xs md:text-sm max-w-sm mx-auto text-[#5b403e]">
                  Welcome to the elite club. Your premium perks are now active. Prepare for legendary streaks and exclusive tracks!
                </p>
              </div>

              {/* Bento Perks check chips */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
                <div className="bg-white border-2 border-[#1c1c18] p-3 rounded-xl flex flex-col items-center space-y-1 rotate-random-1 hard-shadow-sm">
                  <span className="material-symbols-outlined text-[#b71422]">music_note</span>
                  <span className="font-sans font-black text-[10px] uppercase">Unlimited Plays</span>
                </div>
                <div className="bg-white border-2 border-[#1c1c18] p-3 rounded-xl flex flex-col items-center space-y-1 rotate-random-2 hard-shadow-sm">
                  <span className="material-symbols-outlined text-[#705d00]">ad_off</span>
                  <span className="font-sans font-black text-[10px] uppercase">Zero Ad Clips</span>
                </div>
              </div>

              {/* Return prompt redirect countdown */}
              <div className="w-full max-w-xs mx-auto pt-6">
                <button 
                  onClick={onClose}
                  className="w-full h-14 bg-[#1c1c18] text-[#fcf9f2] font-display font-black text-xs md:text-sm rounded-full hard-shadow hover:bg-[#b71422] hover:text-white transition-all uppercase tracking-widest cursor-pointer"
                >
                  START PLAYING NOW
                </button>
                <p className="mt-4 text-[10px] font-sans font-black text-[#5b403e] uppercase opacity-75 tracking-wider">
                  Redirecting in <span className="text-[#b71422]">{countdown}</span>s
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
