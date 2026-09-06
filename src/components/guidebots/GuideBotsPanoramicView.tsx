import React, { useState } from 'react';
import {
  Globe,
  GraduationCap,
  HeartHandshake,
  Accessibility,
  Bot,
  ArrowRight,
  Sparkles,
  Mic,
  Volume2,
  Check,
  ChevronRight,
  Layers,
} from 'lucide-react';
import type { GuideBotItem } from '../home/GuideBotsSection.js';
import { voiceService } from '../../services/voiceservice.js';

interface GuideBotsPanoramicViewProps {
  onSelectBot: (bot: GuideBotItem) => void;
  onExploreAllCatalog: () => void;
  onStartVoiceWithBot: (bot: GuideBotItem) => void;
  selectedRole?: string;
}

export interface PanoramicBotData extends GuideBotItem {
  imageSrc: string;
  shortDescription: string;
  accentColor: string;
  glowColor: string;
  pillBorderColor: string;
}

export const PANORAMIC_GUIDEBOTS: PanoramicBotData[] = [
  {
    id: 'internet-guide',
    name: 'Internet Guide',
    description: 'Browse, search, and navigate websites using your voice alone.',
    shortDescription: 'Browse. Search. Get information.',
    icon: <Globe size={18} />,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    iconBorder: 'border-blue-500/40',
    samplePrompt: 'Open Dainik Jagran and read today\'s news.',
    role: 'browser_navigator',
    imageSrc: '/src/assets/images/internet_guide_char_1788737255539.jpg',
    accentColor: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.3)',
    pillBorderColor: 'border-blue-500/30 hover:border-blue-400/60',
  },
  {
    id: 'learning-guide',
    name: 'Learning Guide',
    description: 'Learn new skills, explore curiosity, and get step-by-step answers.',
    shortDescription: 'Learn new things. Step by step.',
    icon: <GraduationCap size={18} />,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    iconBorder: 'border-emerald-500/40',
    samplePrompt: 'Tell me something about photosynthesis in simple words.',
    role: 'educator',
    imageSrc: '/src/assets/images/learning_guide_char_1788736437321.jpg',
    accentColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.3)',
    pillBorderColor: 'border-emerald-500/30 hover:border-emerald-400/60',
  },
  {
    id: 'senior-guide',
    name: 'Senior Guide',
    description: 'Patient, large-text assistance for health, pension, and daily tasks.',
    shortDescription: 'Simple help. Clear answers.',
    icon: <HeartHandshake size={18} />,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-[#f4d06f]',
    iconBorder: 'border-[#f4d06f]/40',
    samplePrompt: 'How to apply for a senior citizen card in Uttarakhand?',
    role: 'senior_companion',
    imageSrc: '/src/assets/images/senior_guide_char_1788737268344.jpg',
    accentColor: '#f4d06f',
    glowColor: 'rgba(244, 208, 111, 0.35)',
    pillBorderColor: 'border-[#f4d06f]/30 hover:border-[#f4d06f]/70',
  },
  {
    id: 'accessibility-guide',
    name: 'Accessibility Guide',
    description: 'Screen magnifier, voice dictation, and inclusive communication.',
    shortDescription: 'Extra support. More independence.',
    icon: <Accessibility size={18} />,
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    iconBorder: 'border-purple-500/40',
    samplePrompt: 'Help me read text on my screen and camera.',
    role: 'accessibility_expert',
    imageSrc: '/src/assets/images/accessibility_guide_char_1788737281898.jpg',
    accentColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.3)',
    pillBorderColor: 'border-purple-500/30 hover:border-purple-400/60',
  },
  {
    id: 'everyday-helper',
    name: 'Everyday Helper',
    description: 'Reminders, directions, nearby hospitals, and daily support.',
    shortDescription: 'Tasks, reminders. Daily support.',
    icon: <Bot size={18} />,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-300',
    iconBorder: 'border-amber-500/40',
    samplePrompt: 'Help me set a reminder and find nearby places.',
    role: 'copilot',
    imageSrc: '/src/assets/images/everyday_helper_char_1788736455372.jpg',
    accentColor: '#fde047',
    glowColor: 'rgba(253, 224, 71, 0.3)',
    pillBorderColor: 'border-amber-500/30 hover:border-amber-400/60',
  },
];

export const GuideBotsPanoramicView: React.FC<GuideBotsPanoramicViewProps> = ({
  onSelectBot,
  onExploreAllCatalog,
  onStartVoiceWithBot,
  selectedRole,
}) => {
  const [hoveredBotId, setHoveredBotId] = useState<string | null>(null);
  const [activePreviewBot, setActivePreviewBot] = useState<PanoramicBotData | null>(null);

  const handleCardClick = (bot: PanoramicBotData) => {
    setActivePreviewBot(bot);
    voiceService.speak(
      `Hello! I am ${bot.name}. ${bot.shortDescription}. How can I assist you today?`
    );
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden select-none bg-[#090e1a] text-white">
      {/* 1. Cinematic Panoramic Scenic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/guidebots_panorama_bg_1788737297665.jpg"
          alt="Scenic Mountain Landscape with GuideBots"
          className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        {/* Soft Vignette and dark gradient overlays to ensure high contrast for typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090e1a]/95 via-[#090e1a]/65 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-[#090e1a]/40 to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#090e1a]/80 to-transparent pointer-events-none" />
      </div>

      {/* 2. Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-between">
        
        {/* Top Hero Section: Headline + Copy + Pill Button */}
        <div className="max-w-xl space-y-4 pt-2 sm:pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#f4d06f] font-semibold">
            <Sparkles size={13} />
            <span>AI Voice Companions</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-headline text-white leading-[1.08] tracking-tight drop-shadow-md">
            Your Personal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffeecb] to-[#f4d06f]">
              GuideBots
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white font-medium drop-shadow leading-snug">
            Different needs. Same friendly voice.
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md drop-shadow-sm font-body">
            Each GuideBot is trained to help you with specific tasks, from finding information to learning new skills.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onExploreAllCatalog}
              type="button"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#121826]/80 hover:bg-[#182033] border border-white/20 hover:border-[#f4d06f]/60 backdrop-blur-xl text-xs sm:text-sm font-bold text-white shadow-xl transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>Explore All GuideBots</span>
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#f4d06f] group-hover:text-[#241a00] transition-colors">
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Section: 5 Characters Lineup with Floating Glass Capsule Cards */}
        <div className="w-full pt-8 sm:pt-12 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 items-end">
            {PANORAMIC_GUIDEBOTS.map((bot) => {
              const isSelected = selectedRole === bot.role;
              const isHovered = hoveredBotId === bot.id;

              return (
                <div
                  key={bot.id}
                  onMouseEnter={() => setHoveredBotId(bot.id)}
                  onMouseLeave={() => setHoveredBotId(null)}
                  onClick={() => handleCardClick(bot)}
                  className="group relative flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* 3D Character Avatar Portrait */}
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 mb-2 flex items-center justify-center">
                    {/* Ambient Aura */}
                    <div
                      className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
                      style={{ backgroundColor: bot.accentColor }}
                    />

                    {/* Character Card / Portrait Container */}
                    <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 group-hover:border-white/40 shadow-2xl bg-[#141926]/90 transition-all duration-300 group-hover:scale-105">
                      <img
                        src={bot.imageSrc}
                        alt={bot.name}
                        className="w-full h-full object-cover object-top filter brightness-[0.95] group-hover:brightness-105 transition-all"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Active Check badge */}
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#f4d06f] text-[#241a00] flex items-center justify-center shadow-lg border border-white">
                        <Check size={14} className="stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Frosted Glass Capsule Card matching guidebot fe.png */}
                  <div
                    className={`w-full p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#0c1220]/85 group-hover:bg-[#121a2d]/95 backdrop-blur-xl border ${
                      isSelected
                        ? 'border-[#f4d06f] shadow-[0_0_20px_rgba(244,208,111,0.3)]'
                        : 'border-white/15 group-hover:border-white/30'
                    } shadow-xl text-center flex flex-col items-center transition-all duration-200`}
                  >
                    {/* Circle Icon Badge */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${bot.iconBg} ${bot.iconColor} border ${bot.iconBorder} flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform`}
                    >
                      {bot.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xs sm:text-sm font-bold font-headline text-white group-hover:text-[#ffeecb] transition-colors leading-tight mb-1 truncate w-full">
                      {bot.name}
                    </h3>

                    {/* Subtitle / Description */}
                    <p className="text-[10px] sm:text-[11px] text-zinc-300 font-normal leading-tight line-clamp-2 h-7 flex items-center justify-center">
                      {bot.shortDescription}
                    </p>

                    {/* Interactive Prompt Chip */}
                    <div className="mt-2.5 pt-2 border-t border-white/10 w-full flex items-center justify-center">
                      <span className="text-[10px] font-semibold text-[#f4d06f] flex items-center gap-1 opacity-90 group-hover:opacity-100 group-hover:underline">
                        <span>Talk with Voice</span>
                        <Mic size={10} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Interactive Quick Action Modal / Sheet when a bot is tapped */}
      {activePreviewBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg p-6 rounded-3xl bg-[#111726] border border-[#f4d06f]/40 shadow-2xl text-white space-y-5">
            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shrink-0">
                <img
                  src={activePreviewBot.imageSrc}
                  alt={activePreviewBot.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-headline text-white">
                    {activePreviewBot.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-0.5">
                  {activePreviewBot.shortDescription}
                </p>
              </div>
            </div>

            {/* Prompt Preview */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[10px] font-bold text-[#f4d06f] uppercase tracking-wider block mb-1">
                Sample Voice Request:
              </span>
              <p className="text-xs sm:text-sm text-zinc-200 italic font-body">
                "{activePreviewBot.samplePrompt}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  const bot = activePreviewBot;
                  setActivePreviewBot(null);
                  onStartVoiceWithBot(bot);
                }}
                className="amber-glow-btn py-3 px-4 rounded-2xl text-xs font-bold text-[#241a00] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Mic size={16} />
                <span>Start Speaking</span>
              </button>

              <button
                onClick={() => {
                  const bot = activePreviewBot;
                  setActivePreviewBot(null);
                  onSelectBot(bot);
                }}
                className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Layers size={15} />
                <span>Companion Details</span>
              </button>
            </div>

            {/* Close */}
            <div className="text-center pt-1">
              <button
                onClick={() => {
                  voiceService.interrupt();
                  setActivePreviewBot(null);
                }}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
