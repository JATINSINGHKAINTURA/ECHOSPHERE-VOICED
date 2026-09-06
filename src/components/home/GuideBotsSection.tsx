import React from 'react';
import { Globe, GraduationCap, HeartHandshake, Accessibility, Bot, ArrowRight, Sparkles } from 'lucide-react';

export interface GuideBotItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  iconBorder: string;
  samplePrompt: string;
  role: string;
  imageSrc?: string;
}

export const GUIDE_BOTS: GuideBotItem[] = [
  {
    id: 'internet-guide',
    name: 'Internet Guide',
    description: 'Browse, search, get simple clear information.',
    icon: <Globe size={20} />,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    iconBorder: 'border-blue-500/40',
    samplePrompt: 'Open Dainik Jagran and read today\'s news.',
    role: 'browser_navigator',
    imageSrc: '/src/assets/images/internet_guide_char_1788737255539.jpg',
  },
  {
    id: 'learning-guide',
    name: 'Learning Guide',
    description: 'Learn new things easily, step by comfortable step.',
    icon: <GraduationCap size={20} />,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    iconBorder: 'border-emerald-500/40',
    samplePrompt: 'Can you teach me something new in simple steps?',
    role: 'educator',
    imageSrc: '/src/assets/images/learning_guide_char_1788736437321.jpg',
  },
  {
    id: 'senior-guide',
    name: 'Senior Guide',
    description: 'Simple help, patient attitude, crystal clear answers.',
    icon: <HeartHandshake size={20} />,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-[#f4d06f]',
    iconBorder: 'border-[#f4d06f]/40',
    samplePrompt: 'Hello! I need some patient guidance today.',
    role: 'senior_companion',
    imageSrc: '/src/assets/images/senior_guide_char_1788737268344.jpg',
  },
  {
    id: 'accessibility-guide',
    name: 'Accessibility Guide',
    description: 'Inclusive voice tools, custom pacing, and extra support.',
    icon: <Accessibility size={20} />,
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    iconBorder: 'border-purple-500/40',
    samplePrompt: 'What accessibility and voice tools can I use?',
    role: 'accessibility_expert',
    imageSrc: '/src/assets/images/accessibility_guide_char_1788737281898.jpg',
  },
  {
    id: 'everyday-helper',
    name: 'Everyday Helper',
    description: 'Tasks, reminders, weather updates, and daily support.',
    icon: <Bot size={20} />,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-300',
    iconBorder: 'border-amber-500/40',
    samplePrompt: 'What is on my schedule and how is the weather?',
    role: 'copilot',
    imageSrc: '/src/assets/images/everyday_helper_char_1788736455372.jpg',
  },
];

interface GuideBotsSectionProps {
  onSelectBot: (bot: GuideBotItem) => void;
  onExploreAll?: () => void;
}

export const GuideBotsSection: React.FC<GuideBotsSectionProps> = ({
  onSelectBot,
  onExploreAll,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <span className="text-[#f4d06f] font-bold text-xs uppercase tracking-wider block mb-1">
            SPECIALIZED COMPANIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-headline">
            Meet Your GuideBots
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base mt-1">
            Different needs. Same friendly, patient voice.
          </p>
        </div>

        {onExploreAll && (
          <button
            onClick={onExploreAll}
            type="button"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f4d06f]/40 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-all mt-3 sm:mt-0 cursor-pointer"
          >
            <span>Explore All GuideBots</span>
            <ArrowRight
              size={14}
              className="text-[#f4d06f] group-hover:translate-x-1 transition-transform"
            />
          </button>
        )}
      </div>

      {/* 5 GuideBot Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {GUIDE_BOTS.map((bot) => (
          <div
            key={bot.id}
            onClick={() => onSelectBot(bot)}
            className="group glass-panel glass-panel-hover rounded-3xl p-4 flex flex-col justify-between cursor-pointer border border-white/10 bg-[#111726]/80 hover:border-[#f4d06f]/50 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-lg"
          >
            <div>
              {/* Character Image Thumbnail */}
              {bot.imageSrc && (
                <div className="relative h-32 rounded-2xl overflow-hidden mb-3.5 border border-white/10 bg-black/40">
                  <img
                    src={bot.imageSrc}
                    alt={bot.name}
                    className="w-full h-full object-cover object-top filter brightness-95 group-hover:brightness-105 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-2 left-2">
                    <div
                      className={`w-7 h-7 rounded-lg ${bot.iconBg} ${bot.iconColor} border ${bot.iconBorder} backdrop-blur-md flex items-center justify-center`}
                    >
                      {bot.icon}
                    </div>
                  </div>
                </div>
              )}

              <h3 className="text-base font-bold text-white font-headline mb-1 group-hover:text-[#f4d06f] transition-colors leading-tight">
                {bot.name}
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {bot.description}
              </p>
            </div>

            {/* Bottom action trigger */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 group-hover:text-[#f4d06f]">
              <span className="font-semibold text-[11px]">Talk with {bot.name.split(' ')[0]}</span>
              <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-[#f4d06f] text-zinc-400 group-hover:text-[#241a00] flex items-center justify-center transition-all">
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
