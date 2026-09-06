import React, { useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ExternalLink,
  ChevronRight,
  Globe,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import {
  webReaderService,
  type WebBrowserControlState,
  type NewsArticle,
} from '../../services/webreaderservice.js';
import { voiceService } from '../../services/voiceservice.js';
import { deviceService } from '../../services/deviceservice.js';

interface WebReaderModalProps {
  onClose: () => void;
}

export const WebReaderModal: React.FC<WebReaderModalProps> = ({ onClose }) => {
  const [readerState, setReaderState] = React.useState<WebBrowserControlState>(
    webReaderService.getState()
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = webReaderService.onStateChange(setReaderState);
    return () => unsub();
  }, []);

  const website = readerState.activeWebsite;
  const article = readerState.selectedArticle;

  const handleReadArticle = (art: NewsArticle) => {
    webReaderService.selectArticle(art);
    webReaderService.setReadingState(true, 0);
    deviceService.playChime('click');

    const textToRead = `${art.title}. ${art.fullText}`;
    voiceService.speak(textToRead, art.language === 'hi' ? 'hi-IN' : 'en-US', () => {
      webReaderService.setReadingState(false, 0);
    });
  };

  const handleStopReading = () => {
    voiceService.interrupt();
    webReaderService.setReadingState(false, 0);
    deviceService.playChime('stop');
  };

  const handleScrollDown = () => {
    if (contentRef.current) {
      contentRef.current.scrollBy({ top: 250, behavior: 'smooth' });
    }
  };

  const handleScrollUp = () => {
    if (contentRef.current) {
      contentRef.current.scrollBy({ top: -250, behavior: 'smooth' });
    }
  };

  if (!readerState.isOpen || !website) return null;

  const filteredArticles =
    readerState.activeSection === 'All'
      ? website.articles
      : website.articles.filter(
          (a) => a.category.toLowerCase() === readerState.activeSection.toLowerCase()
        );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#0f1422] border border-[#f4d06f]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161b29]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f4d06f]/20 border border-[#f4d06f]/40 flex items-center justify-center text-[#f4d06f]">
              <Globe size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-headline text-white">
                  {website.name}
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#f4d06f]/20 text-[#f4d06f] font-semibold border border-[#f4d06f]/30 flex items-center gap-1">
                  <Radio size={10} className="animate-pulse" /> Voice Reader Active
                </span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-1">{website.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Safe External Link */}
            {article && (
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-colors"
                title="Open original website link in new tab"
              >
                <span>Open in Tab</span>
                <ExternalLink size={13} />
              </a>
            )}

            {/* Close button */}
            <button
              onClick={() => {
                handleStopReading();
                webReaderService.closeReader();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 bg-[#0d121f] overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1 shrink-0">
            Sections:
          </span>
          <button
            onClick={() => webReaderService.selectSection('All')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              readerState.activeSection === 'All'
                ? 'bg-[#f4d06f] text-[#241a00] shadow-[0_0_15px_rgba(244,208,111,0.4)]'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            All News
          </button>
          {website.sections.map((sec) => {
            const isActive = readerState.activeSection.toLowerCase() === sec.toLowerCase();
            return (
              <button
                key={sec}
                onClick={() => webReaderService.selectSection(sec)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#f4d06f] text-[#241a00] shadow-[0_0_15px_rgba(244,208,111,0.4)]'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {sec}
              </button>
            );
          })}
        </div>

        {/* Main Body Area: Split View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Side: Headlines / Articles List */}
          <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-white/10 p-4 overflow-y-auto bg-[#0b101d]/60 space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-medium px-1">
              <span>{filteredArticles.length} Stories Available</span>
              <span className="text-[#f4d06f]">Say "Sports" or article title</span>
            </div>

            {filteredArticles.map((art, idx) => {
              const isSelected = article?.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => handleReadArticle(art)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-[#1e2638] border-[#f4d06f]/60 shadow-[0_0_20px_rgba(244,208,111,0.15)]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4d06f]/15 text-[#f4d06f]">
                      {art.category}
                    </span>
                    <span className="text-[11px] text-zinc-400">{art.publishedAt}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-[#ffeecb] line-clamp-2 leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {art.summary}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#f4d06f] font-medium pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Play size={10} fill="currentColor" /> Tap to listen
                    </span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Active Article Detailed Reader */}
          <div className="flex-1 flex flex-col bg-[#0e1320] overflow-hidden">
            {article ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Article Header */}
                <div className="p-6 pb-4 border-b border-white/10 bg-[#141926]">
                  <div className="flex items-center gap-2 text-xs text-[#f4d06f] font-semibold mb-2">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{article.category}</span>
                    <span>•</span>
                    <span className="text-zinc-400">{article.publishedAt}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold font-headline text-white leading-snug">
                    {article.title}
                  </h1>

                  {/* Play / Stop Control Bar */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {readerState.isReadingAloud ? (
                      <button
                        onClick={handleStopReading}
                        className="px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                      >
                        <Pause size={16} />
                        <span>Stop Voice Reading</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReadArticle(article)}
                        className="px-5 py-2 rounded-full bg-[#f4d06f] hover:bg-[#ffd97d] text-[#241a00] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(244,208,111,0.4)] transition-all cursor-pointer active:scale-95"
                      >
                        <Volume2 size={16} />
                        <span>Read Full Story Aloud</span>
                      </button>
                    )}

                    {/* Scroll buttons for accessibility */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={handleScrollUp}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
                        title="Scroll Up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={handleScrollDown}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
                        title="Scroll Down"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Article Content with High-Legibility Typography */}
                <div
                  ref={contentRef}
                  className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-5 text-base sm:text-lg text-zinc-200 leading-relaxed font-body"
                >
                  <div className="p-4 rounded-2xl bg-[#f4d06f]/10 border border-[#f4d06f]/20 text-[#ffeecb] text-sm sm:text-base font-medium leading-relaxed">
                    <strong>Quick Summary:</strong> {article.summary}
                  </div>

                  <p className="text-zinc-100 text-base sm:text-lg leading-relaxed pt-2">
                    {article.fullText}
                  </p>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mt-6 flex items-center gap-3 text-xs text-zinc-400">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    <span>
                      Voice navigation is active. You can say <em>"Next article"</em>, <em>"Scroll down"</em>, or <em>"Stop reading"</em> anytime.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
                <Globe size={40} className="text-zinc-600 mb-3" />
                <p className="text-base font-medium">Select an article from the list to start reading.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Voice Command Bar */}
        <div className="px-6 py-3 bg-[#111624] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#f4d06f]" />
            <span className="text-zinc-300 font-medium">Voice Commands:</span>
            <span className="text-zinc-400 hidden sm:inline">
              "Sports" • "Read first article" • "Scroll down" • "Stop reading"
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#f4d06f]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Browser Bridge Ready</span>
          </div>
        </div>

      </div>
    </div>
  );
};
