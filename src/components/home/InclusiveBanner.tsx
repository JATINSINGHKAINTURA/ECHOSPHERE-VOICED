import React from 'react';
import { Mic } from 'lucide-react';

interface InclusiveBannerProps {
  onStartVoice: () => void;
}

export const InclusiveBanner: React.FC<InclusiveBannerProps> = ({ onStartVoice }) => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 mb-12">
      <div className="relative rounded-3xl bg-gradient-to-br from-[#161b29]/95 via-[#131926]/90 to-[#0e1320] border border-white/10 p-8 sm:p-10 md:p-12 overflow-hidden shadow-2xl">
        {/* Subtle decorative glow in top corner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f4d06f]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Eyebrow */}
          <span className="text-[#f4d06f] font-bold text-xs uppercase tracking-wider block mb-2">
            INCLUSIVE DESIGN
          </span>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-headline mb-4 tracking-tight">
            A friend in your voice.
          </h2>

          {/* Subtitle */}
          <p className="text-zinc-300 text-sm sm:text-base md:text-lg leading-relaxed mb-8">
            For seniors. For children. For everyone. Because the internet should be accessible for all of us, no tech degree required.
          </p>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <button
              onClick={onStartVoice}
              type="button"
              className="amber-glow-btn inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-[#241a00] cursor-pointer shadow-md active:scale-95 transition-all w-fit"
            >
              <Mic size={18} className="text-[#241a00]" />
              <span>TALK TO ECHOSPHERE</span>
            </button>

            <span className="text-xs sm:text-sm text-zinc-400 italic font-normal">
              "You don't need to understand technology. Just talk."
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
