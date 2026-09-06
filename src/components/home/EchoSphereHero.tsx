import React, { useState, useEffect } from 'react';
import { Mic, Volume2 } from 'lucide-react';

interface EchoSphereHeroProps {
  onStartVoice: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  activeStatus?: 'listen' | 'understand' | 'respond' | 'help';
  transcript?: string;
  onSelectStatus?: (status: 'listen' | 'understand' | 'respond' | 'help') => void;
}

export const EchoSphereHero: React.FC<EchoSphereHeroProps> = ({
  onStartVoice,
  isListening,
  isSpeaking,
  activeStatus = 'listen',
  transcript,
  onSelectStatus,
}) => {
  // Waveform bar heights for dynamic animation
  const [waveLevels, setWaveLevels] = useState<number[]>([18, 28, 42, 58, 46, 32, 20]);

  useEffect(() => {
    let interval: any;
    if (isListening || isSpeaking) {
      interval = setInterval(() => {
        setWaveLevels([
          Math.floor(Math.random() * 25) + 12,
          Math.floor(Math.random() * 40) + 18,
          Math.floor(Math.random() * 55) + 25,
          Math.floor(Math.random() * 70) + 35,
          Math.floor(Math.random() * 55) + 25,
          Math.floor(Math.random() * 40) + 18,
          Math.floor(Math.random() * 25) + 12,
        ]);
      }, 120);
    } else {
      setWaveLevels([14, 22, 36, 48, 36, 22, 14]);
    }
    return () => clearInterval(interval);
  }, [isListening, isSpeaking]);

  const steps: { key: 'listen' | 'understand' | 'respond' | 'help'; label: string }[] = [
    { key: 'listen', label: 'Listen' },
    { key: 'understand', label: 'Understand' },
    { key: 'respond', label: 'Respond' },
    { key: 'help', label: 'Help' },
  ];

  return (
    <section className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center pt-8 pb-12 px-4 select-none">
      {/* Scenic background image layer */}
      <div className="absolute inset-0 -z-20 opacity-30 rounded-3xl overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/echosphere_scenic_bg_1788736418877.jpg"
          alt="Atmospheric landscape"
          className="w-full h-full object-cover filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080d19] via-[#080d19]/80 to-[#080d19]" />
      </div>

      {/* Ambient background glow behind the orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#f4d06f]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Eyebrow */}
      <div className="text-center mb-3">
        <span className="text-[#f4d06f] font-bold text-xs md:text-sm tracking-[0.25em] uppercase">
          ECHOSPHERE
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white text-center font-headline mb-4">
        JUST TALK.
      </h1>

      {/* Subtitle */}
      <p className="text-[#a3b1c6] text-base sm:text-lg md:text-xl font-normal max-w-2xl text-center leading-relaxed mb-10 md:mb-12">
        Ask questions, get help, and explore the internet using your voice.
      </p>

      {/* Orb & Progress Ladder Container */}
      <div className="relative flex items-center justify-center w-full my-2">
        {/* Central Luminous Golden Orb */}
        <div className="relative flex items-center justify-center">
          {/* Outermost ambient ring aura */}
          <div
            className={`absolute w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border border-[#f4d06f]/20 transition-all duration-700 ${
              isListening || isSpeaking
                ? 'scale-110 border-[#f4d06f]/40 shadow-[0_0_80px_rgba(244,208,111,0.4)]'
                : 'shadow-[0_0_50px_rgba(244,208,111,0.2)]'
            }`}
          />

          {/* Inner concentric ring */}
          <div className="absolute w-64 h-64 sm:w-72 sm:h-72 md:w-84 md:h-84 rounded-full border border-[#ffeecb]/30" />

          {/* Primary Spherical Body */}
          <button
            onClick={onStartVoice}
            type="button"
            className="group relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-105 active:scale-95 flex items-center justify-center overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #fff7d6 0%, #f4d06f 35%, #c89c38 70%, #755b00 100%)',
              boxShadow: isListening
                ? '0 0 70px rgba(244, 208, 111, 0.6), inset 0 0 40px rgba(255, 247, 214, 0.8)'
                : '0 0 45px rgba(244, 208, 111, 0.35), inset 0 0 30px rgba(255, 247, 214, 0.6)',
            }}
            title={isListening ? 'Listening... click to pause' : 'Click to talk to EchoSphere'}
          >
            {/* Gloss highlight reflection */}
            <div className="absolute top-4 left-1/4 w-32 h-16 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[2px] -rotate-12 pointer-events-none" />

            {/* Vertical Animated Waveform Bars */}
            <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 px-6">
              {waveLevels.map((height, i) => (
                <div
                  key={i}
                  className="w-1.5 sm:w-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-100 ease-out"
                  style={{
                    height: `${height}px`,
                    opacity: 0.85 + (i % 2) * 0.15,
                  }}
                />
              ))}
            </div>

            {/* Subtle mic badge indicator inside when hovered */}
            <div className="absolute bottom-6 opacity-0 group-hover:opacity-90 transition-opacity bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-semibold flex items-center gap-1">
              <Mic size={12} className="text-[#ffeecb]" />
              <span>{isListening ? 'Listening' : 'Tap to Talk'}</span>
            </div>
          </button>
        </div>

        {/* Vertical Step Indicators (Desktop on the right, matching design) */}
        <div className="hidden md:flex flex-col gap-4 absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 text-left z-20">
          {steps.map((step) => {
            const isActive = activeStatus === step.key;
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => onSelectStatus ? onSelectStatus(step.key) : onStartVoice()}
                className={`flex items-center gap-3 group px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-[#f4d06f]/40 ${
                  isActive
                    ? 'bg-[#f4d06f]/15 border border-[#f4d06f]/40 shadow-[0_0_12px_rgba(244,208,111,0.2)]'
                    : 'bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10 active:scale-95'
                }`}
                title={`Switch state to ${step.label}`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#f4d06f] shadow-[0_0_10px_#f4d06f] scale-125'
                      : 'bg-zinc-600 border border-zinc-500 group-hover:bg-zinc-400'
                  }`}
                />
                <span
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-[#f4d06f] font-semibold'
                      : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Realtime transcript preview if active */}
      {transcript && (
        <div className="mt-4 px-6 py-2.5 rounded-full bg-[#161b29]/80 border border-[#f4d06f]/30 backdrop-blur-md max-w-md text-center animate-fade-in">
          <p className="text-sm text-zinc-200 line-clamp-1 italic">
            "{transcript}"
          </p>
        </div>
      )}

      {/* Primary CTA Button */}
      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={onStartVoice}
          type="button"
          className="amber-glow-btn flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg text-[#241a00] cursor-pointer shadow-lg active:scale-95 transition-all"
        >
          {isListening ? (
            <Volume2 size={22} className="text-[#241a00] animate-bounce" />
          ) : (
            <Mic size={22} className="text-[#241a00]" />
          )}
          <span className="tracking-wide">
            {isListening ? 'LISTENING NOW...' : 'TALK TO ECHOSPHERE'}
          </span>
        </button>

        {/* Sub-caption */}
        <p className="text-xs sm:text-sm text-zinc-400 font-normal italic mt-3.5 tracking-normal">
          Take your time. I'm here to listen.
        </p>
      </div>
    </section>
  );
};
