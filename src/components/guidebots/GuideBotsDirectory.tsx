import React, { useState } from 'react';
import { ArrowLeft, Mic, Sparkles, LayoutGrid, Image as ImageIcon, Volume2 } from 'lucide-react';
import { GUIDE_BOTS, type GuideBotItem } from '../home/GuideBotsSection.js';
import { GuideBotsPanoramicView, PANORAMIC_GUIDEBOTS } from './GuideBotsPanoramicView.js';
import { voiceService } from '../../services/voiceservice.js';

interface GuideBotsDirectoryProps {
  selectedRole: string;
  onSelectBot: (bot: GuideBotItem) => void;
  onBackToHome: () => void;
  onStartVoice: () => void;
  onStartVoiceWithPrompt?: (bot: GuideBotItem, prompt?: string) => void;
}

export const GuideBotsDirectory: React.FC<GuideBotsDirectoryProps> = ({
  selectedRole,
  onSelectBot,
  onBackToHome,
  onStartVoice,
  onStartVoiceWithPrompt,
}) => {
  const [viewMode, setViewMode] = useState<'panoramic' | 'grid'>('panoramic');

  if (viewMode === 'panoramic') {
    return (
      <GuideBotsPanoramicView
        selectedRole={selectedRole}
        onSelectBot={onSelectBot}
        onExploreAllCatalog={() => setViewMode('grid')}
        onStartVoiceWithBot={(bot) => {
          if (onStartVoiceWithPrompt) {
            onStartVoiceWithPrompt(bot, bot.samplePrompt);
          } else {
            onSelectBot(bot);
            onStartVoice();
          }
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setViewMode('panoramic')}
          type="button"
          className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Panoramic Scene</span>
        </button>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#141926] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('panoramic')}
              type="button"
              className="p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer text-zinc-400 hover:text-white"
              title="Scenic Panoramic View"
            >
              <ImageIcon size={14} />
              <span className="hidden sm:inline">Scenic</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              type="button"
              className="p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-[#f4d06f] text-[#241a00] font-bold shadow"
              title="All Companions Catalog"
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Catalog</span>
            </button>
          </div>

          <button
            onClick={onStartVoice}
            type="button"
            className="amber-glow-btn flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold cursor-pointer"
          >
            <Mic size={14} />
            <span>Voice Mode</span>
          </button>
        </div>
      </div>

      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-[#f4d06f] font-bold text-xs uppercase tracking-wider block mb-2">
          SPECIALIZED COMPANIONS
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-headline mb-3">
          Choose Your GuideBot
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base">
          Each companion is tuned with unique patience, specialized knowledge, and personalized pacing for your comfort.
        </p>
      </div>

      {/* Grid of full GuideBot cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PANORAMIC_GUIDEBOTS.map((bot) => {
          const isCurrent = selectedRole === bot.role;
          return (
            <div
              key={bot.id}
              className={`glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between border transition-all ${
                isCurrent
                  ? 'border-[#f4d06f] shadow-[0_0_25px_rgba(244,208,111,0.25)] bg-[#1e273a]'
                  : 'border-white/10 bg-[#101624]/90'
              }`}
            >
              <div>
                {/* Character Banner */}
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-white/10 group">
                  <img
                    src={bot.imageSrc}
                    alt={bot.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <div className={`w-10 h-10 rounded-xl ${bot.iconBg} ${bot.iconColor} border ${bot.iconBorder} backdrop-blur-md flex items-center justify-center`}>
                      {bot.icon}
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f4d06f] text-[#241a00] text-xs font-bold shadow-lg">
                        <Sparkles size={12} />
                        Active
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <h3 className="text-lg font-bold font-headline drop-shadow">
                      {bot.name}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        voiceService.speak(`Hello, I am ${bot.name}. ${bot.shortDescription}`);
                      }}
                      className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-[#f4d06f] transition-colors"
                      title="Listen to intro"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                  {bot.description}
                </p>

                <div className="bg-black/30 rounded-xl p-3 border border-white/5 mb-4">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                    Try Saying:
                  </span>
                  <p className="text-xs text-[#f4d06f] italic font-body">
                    "{bot.samplePrompt}"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onStartVoiceWithPrompt) {
                      onStartVoiceWithPrompt(bot, bot.samplePrompt);
                    } else {
                      onSelectBot(bot);
                      onStartVoice();
                    }
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#f4d06f] text-[#241a00] hover:bg-[#ffeecb] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Mic size={14} />
                  <span>Start Voice</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectBot(bot)}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Companion View</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
