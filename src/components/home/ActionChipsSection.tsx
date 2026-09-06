import React from 'react';
import { MessageSquare, GraduationCap, Search, MapPin, BookOpen, HelpCircle, ArrowUpRight } from 'lucide-react';

export interface ActionChip {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  prompt: string;
}

export const ACTION_CHIPS: ActionChip[] = [
  {
    id: 'ask-something',
    label: 'Ask Something',
    icon: <MessageSquare size={16} />,
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/15',
    iconBorder: 'border-sky-500/30',
    prompt: 'I have a question, can you help me answer it clearly?',
  },
  {
    id: 'learn-something',
    label: 'Learn Something',
    icon: <GraduationCap size={16} />,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
    iconBorder: 'border-emerald-500/30',
    prompt: 'Teach me something interesting today in simple words.',
  },
  {
    id: 'find-something',
    label: 'Find Something',
    icon: <Search size={16} />,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15',
    iconBorder: 'border-cyan-500/30',
    prompt: 'Help me search for helpful resources and websites.',
  },
  {
    id: 'get-directions',
    label: 'Get Directions',
    icon: <MapPin size={16} />,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/15',
    iconBorder: 'border-purple-500/30',
    prompt: 'How do I get directions to nearby places or explore maps?',
  },
  {
    id: 'read-this',
    label: 'Read This',
    icon: <BookOpen size={16} />,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/15',
    iconBorder: 'border-rose-500/30',
    prompt: 'Can you read a story or explain an article aloud for me?',
  },
  {
    id: 'help-me',
    label: 'Help Me',
    icon: <HelpCircle size={16} />,
    iconColor: 'text-[#f4d06f]',
    iconBg: 'bg-amber-500/15',
    iconBorder: 'border-[#f4d06f]/30',
    prompt: 'I need simple help navigating and using my voice to do things.',
  },
];

interface ActionChipsSectionProps {
  onSelectAction: (chip: ActionChip) => void;
}

export const ActionChipsSection: React.FC<ActionChipsSectionProps> = ({ onSelectAction }) => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center select-none">
      {/* Eyebrow */}
      <span className="text-[#f4d06f] font-bold text-xs uppercase tracking-[0.2em] block mb-2">
        ONE-TAP OR VOICE
      </span>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-headline mb-3">
        What would you like to do?
      </h2>

      {/* Subtitle */}
      <p className="text-zinc-300 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
        Just speak or tap. Voice navigation engineered for effortless comfort.
      </p>

      {/* Chips Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-3xl">
        {ACTION_CHIPS.map((chip) => (
          <button
            key={chip.id}
            onClick={() => onSelectAction(chip)}
            type="button"
            className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#0e1424] hover:bg-[#151e34] border border-white/10 hover:border-[#f4d06f]/50 text-zinc-200 hover:text-white transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(244,208,111,0.18)] hover:-translate-y-0.5 active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl ${chip.iconBg} ${chip.iconColor} border ${chip.iconBorder} flex items-center justify-center transition-transform group-hover:scale-110`}>
                {chip.icon}
              </div>
              <span className="text-xs sm:text-sm font-bold text-left tracking-tight">
                {chip.label}
              </span>
            </div>
            <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-[#f4d06f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </section>
  );
};
