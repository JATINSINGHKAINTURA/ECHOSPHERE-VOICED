import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  Trash2,
  Calendar,
  Search,
  Mic,
  Clock,
  Bookmark,
  Link as LinkIcon,
  ChevronRight,
  Sun,
  BookOpen,
  CreditCard,
  HeartPulse,
  Languages,
  Volume2,
  Sparkles,
} from 'lucide-react';
import type { Conversation } from '../../types/chat.js';
import { voiceService } from '../../services/voiceservice.js';

interface ConversationHistoryViewProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onBackToHome: () => void;
  onNewConversation: () => void;
}

type HistoryTab = 'recent' | 'saved' | 'links' | 'notes';

interface PreloadedHistoryItem {
  id: string;
  title: string;
  timestamp: string;
  category: string;
  iconBg: string;
  iconColor: string;
  icon: any;
  summary: string;
  details: string;
}

const DESIGN_PRELOADED_HISTORY: PreloadedHistoryItem[] = [
  {
    id: 'hist-1',
    title: 'Weather in Dehradun',
    timestamp: 'Today, 10:24 AM',
    category: 'Weather & Daily',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    icon: <Sun size={20} />,
    summary: 'Partly cloudy with pleasant breeze. 24°C expected today in Dehradun.',
    details:
      'Currently 22°C in Dehradun with light mountain breeze. Humidity is 62%. Air Quality Index is Good (AQI 42). Pleasant afternoon expected.',
  },
  {
    id: 'hist-2',
    title: 'Best design books for coding',
    timestamp: 'Yesterday, 4:32 PM',
    category: 'Learning & Skills',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    icon: <BookOpen size={20} />,
    summary: 'Refactoring UI, Don\'t Make Me Think, and The Design of Everyday Things.',
    details:
      'Top recommended books: 1) Refactoring UI by Adam Wathan & Steve Schoger, 2) Don\'t Make Me Think by Steve Krug, 3) Designing Data-Intensive Applications.',
  },
  {
    id: 'hist-3',
    title: 'How to apply for a senior citizen card',
    timestamp: 'Aug 20, 2025',
    category: 'Senior Guide',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-[#f4d06f]',
    icon: <CreditCard size={20} />,
    summary: 'Requirements: Age proof (Aadhaar/Voter ID), 2 passport photos, address verification.',
    details:
      'Applications can be submitted at the local District Social Welfare Office or online via the State Portal. Free medical checkups and transport concessions are included.',
  },
  {
    id: 'hist-4',
    title: 'Nearby hospitals',
    timestamp: 'Aug 19, 2025',
    category: 'Everyday Helper',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    icon: <HeartPulse size={20} />,
    summary: 'Max Super Speciality Hospital (2.4 km) and Synergy Hospital (3.1 km) located.',
    details:
      'Emergency departments are operational 24/7. Max Hospital Dehradun contact: +91 135 719 3000. Synergy Hospital contact: +91 135 222 6000.',
  },
  {
    id: 'hist-5',
    title: 'Translate this text to Hindi',
    timestamp: 'Aug 14, 2025',
    category: 'Language Guide',
    iconBg: 'bg-pink-500/20',
    iconColor: 'text-pink-400',
    icon: <Languages size={20} />,
    summary: '"Take your time. I am here to listen." -> "अपना समय लें। मैं सुनने के लिए यहाँ हूँ।"',
    details:
      'Audio pronunciation verified in natural conversational Hindi. Speech synthesis saved for replay.',
  },
];

export const ConversationHistoryView: React.FC<ConversationHistoryViewProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onBackToHome,
  onNewConversation,
}) => {
  const [activeTab, setActiveTab] = useState<HistoryTab>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemDetails, setSelectedItemDetails] = useState<PreloadedHistoryItem | null>(null);

  const tabs: { id: HistoryTab; label: string; icon: any }[] = [
    { id: 'recent', label: 'Recent Conversations', icon: <Clock size={16} /> },
    { id: 'saved', label: 'Saved Information', icon: <Bookmark size={16} /> },
    { id: 'links', label: 'Helpful Links', icon: <LinkIcon size={16} /> },
    { id: 'notes', label: 'Voice Notes', icon: <Mic size={16} /> },
  ];

  const filteredPreloaded = DESIGN_PRELOADED_HISTORY.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpeakItem = (item: PreloadedHistoryItem) => {
    voiceService.speak(`${item.title}. ${item.details}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 animate-fade-in text-white">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToHome}
          type="button"
          className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/5 border border-white/10"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <button
          onClick={onNewConversation}
          type="button"
          className="amber-glow-btn flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-[#241a00]"
        >
          <Mic size={16} />
          <span>New Voice Session</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Title & Category Tabs */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <span className="text-[#f4d06f] font-bold text-xs uppercase tracking-[0.2em] block mb-2">
              YOUR HISTORY
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-headline text-white leading-tight">
              Keep Track of Your Conversations
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mt-3">
              Easily revisit your past chats, saved information and helpful responses.
            </p>
          </div>

          {/* Sub-Category Frosted Tabs */}
          <div className="space-y-2 pt-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`w-full p-4 rounded-2xl flex items-center gap-3.5 transition-all text-left cursor-pointer border ${
                    isActive
                      ? 'bg-[#182032] border-[#f4d06f]/60 shadow-[0_0_20px_rgba(244,208,111,0.2)] text-white'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isActive
                        ? 'bg-[#f4d06f]/20 text-[#f4d06f]'
                        : 'bg-black/30 text-zinc-400'
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <span className="text-sm font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Frosted Glass Container with Conversations */}
        <div className="lg:col-span-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141926]/90 border border-white/10 backdrop-blur-xl shadow-2xl space-y-5">
            
            {/* Header of the right panel */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-headline text-white">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f4d06f]/15 text-[#f4d06f] font-semibold">
                  {filteredPreloaded.length} Saved
                </span>
              </div>

              <span className="text-xs text-[#f4d06f] font-semibold hover:underline cursor-pointer">
                View All
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search past conversations or keywords..."
                className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#f4d06f]"
              />
            </div>

            {/* List of History Items */}
            <div className="space-y-3 pt-2">
              {filteredPreloaded.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemDetails(item)}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f4d06f]/40 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1 pr-3">
                    {/* Circle icon matching design */}
                    <div
                      className={`w-11 h-11 rounded-full ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 shadow-md`}
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#ffeecb] truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5 truncate">
                        {item.timestamp} • <span className="text-zinc-500">{item.category}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakItem(item);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#f4d06f] opacity-80 group-hover:opacity-100 transition-all"
                      title="Speak aloud"
                    >
                      <Volume2 size={16} />
                    </button>
                    <ChevronRight
                      size={18}
                      className="text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Item Detail Modal / Overlay */}
      {selectedItemDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#141a29] border border-[#f4d06f]/40 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${selectedItemDetails.iconBg} ${selectedItemDetails.iconColor} flex items-center justify-center`}
                >
                  {selectedItemDetails.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedItemDetails.title}</h3>
                  <p className="text-xs text-zinc-400">{selectedItemDetails.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItemDetails(null)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
              >
                Close
              </button>
            </div>

            <p className="text-sm text-zinc-200 leading-relaxed">{selectedItemDetails.details}</p>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => handleSpeakItem(selectedItemDetails)}
                className="px-5 py-2.5 rounded-full bg-[#f4d06f] text-[#241a00] font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <Volume2 size={16} />
                <span>Read Aloud</span>
              </button>
              <button
                onClick={() => setSelectedItemDetails(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
