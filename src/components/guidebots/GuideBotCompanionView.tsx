import React, { useState } from 'react';
import {
  ArrowLeft,
  Mic,
  Volume2,
  VolumeX,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Bell,
  MapPin,
  Phone,
  MessageSquare,
  Globe,
  BookOpen,
  Heart,
  Eye,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { voiceService } from '../../services/voiceservice.js';
import { deviceService } from '../../services/deviceservice.js';
import type { GuideBotItem } from '../home/GuideBotsSection.js';

interface GuideBotCompanionViewProps {
  bot: GuideBotItem;
  onBack: () => void;
  onStartVoiceWithBot: (bot: GuideBotItem, prompt?: string) => void;
  onOpenWebReader?: (siteId: string) => void;
  onOpenLocation?: () => void;
}

export const GuideBotCompanionView: React.FC<GuideBotCompanionViewProps> = ({
  bot,
  onBack,
  onStartVoiceWithBot,
  onOpenWebReader,
  onOpenLocation,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTabPrompt, setActiveTabPrompt] = useState<string>('');

  // Tailored configurations per GuideBot
  const botConfigs: Record<
    string,
    {
      eyebrow: string;
      title: string;
      subtitle: string;
      checklist: string[];
      sampleQuestion: string;
      sampleAnswer: string;
      imageSrc?: string;
      interactiveOptions?: Array<{ icon: any; label: string; action: () => void }>;
    }
  > = {
    'learning-guide': {
      eyebrow: 'LEARNING GUIDE',
      title: 'Learn at Your Pace',
      subtitle:
        'Ask questions, explore new topics, and build your knowledge — one conversation at a time.',
      checklist: [
        'Study help & explanations',
        'Homework support',
        'New skills & hobbies',
        'Curiosity, anytime',
      ],
      sampleQuestion: 'Tell me something about photosynthesis.',
      sampleAnswer:
        'Photosynthesis is the process by which plants convert sunlight, carbon dioxide and water into food (glucose) and oxygen. It is how plants feed themselves and produce the oxygen we breathe!',
      imageSrc: '/src/assets/images/learning_guide_char_1788736437321.jpg',
      interactiveOptions: [
        {
          icon: <Sparkles size={16} className="text-emerald-400" />,
          label: 'Explain Photosynthesis',
          action: () =>
            onStartVoiceWithBot(bot, 'Tell me something about photosynthesis in simple words.'),
        },
        {
          icon: <BookOpen size={16} className="text-emerald-400" />,
          label: 'How do airplanes fly?',
          action: () => onStartVoiceWithBot(bot, 'Explain how airplanes fly in the sky.'),
        },
        {
          icon: <Sparkles size={16} className="text-emerald-400" />,
          label: 'Why is the sky blue?',
          action: () => onStartVoiceWithBot(bot, 'Why is the sky blue? Explain simply.'),
        },
      ],
    },
    'everyday-helper': {
      eyebrow: 'EVERYDAY HELPER',
      title: 'Small Tasks. Big Support.',
      subtitle:
        'From reminders to directions, EchoSphere is always here for your daily needs.',
      checklist: [
        'Set reminders',
        'Get directions',
        'Find nearby places',
        'Make calls',
        'Read and write messages',
      ],
      sampleQuestion: 'What would you like to do today?',
      sampleAnswer:
        "I'm ready! I can help you set a medication reminder, find nearby hospitals, check the weather, or read incoming messages.",
      imageSrc: '/src/assets/images/everyday_helper_char_1788736455372.jpg',
      interactiveOptions: [
        {
          icon: <Bell size={16} className="text-[#f4d06f]" />,
          label: 'Set a reminder',
          action: () => {
            deviceService.sendNotification('Everyday Helper', {
              body: 'Medication reminder set for 8:00 PM.',
            });
            voiceService.speak('Reminder set. I will alert you at 8:00 PM.');
          },
        },
        {
          icon: <MapPin size={16} className="text-rose-400" />,
          label: 'Find a nearby hospital',
          action: () => {
            if (onOpenLocation) onOpenLocation();
            onStartVoiceWithBot(bot, 'Find nearby hospitals in Dehradun.');
          },
        },
        {
          icon: <Phone size={16} className="text-emerald-400" />,
          label: 'Emergency call helper',
          action: () =>
            onStartVoiceWithBot(bot, 'Help me call emergency contact or caregiver.'),
        },
        {
          icon: <MapPin size={16} className="text-blue-400" />,
          label: 'Get directions',
          action: () =>
            onStartVoiceWithBot(bot, 'Give me walking directions to the nearest pharmacy.'),
        },
        {
          icon: <MessageSquare size={16} className="text-purple-400" />,
          label: 'Read my messages',
          action: () =>
            onStartVoiceWithBot(bot, 'Read my latest messages aloud in Hindi or English.'),
        },
      ],
    },
    'senior-guide': {
      eyebrow: 'SENIOR GUIDE',
      title: 'Simple Help. Clear Answers.',
      subtitle:
        'Patient, step-by-step assistance with large readable text and gentle pacing.',
      checklist: [
        'Healthcare & pension guidance',
        'Elder card applications',
        'Medicine timing reminders',
        'Gentle, repetitive explanations',
      ],
      sampleQuestion: 'How to apply for a senior citizen card in Uttarakhand?',
      sampleAnswer:
        'To apply for a senior citizen card, you need proof of age (Aadhaar or Voter ID) and two passport photos. You can submit the form at the local Social Welfare Office or online portal.',
      imageSrc: '/src/assets/images/guidebots_group_char_1788736479443.jpg',
      interactiveOptions: [
        {
          icon: <Heart size={16} className="text-rose-400" />,
          label: 'Senior Citizen Card Process',
          action: () =>
            onStartVoiceWithBot(bot, 'How to apply for a senior citizen card in Uttarakhand?'),
        },
        {
          icon: <Bell size={16} className="text-[#f4d06f]" />,
          label: 'Set Medicine Alarm',
          action: () => {
            deviceService.sendNotification('Senior Guide Alert', {
              body: 'Time for evening blood pressure medicine.',
            });
            voiceService.speak('Medicine reminder recorded for after dinner.');
          },
        },
        {
          icon: <MapPin size={16} className="text-emerald-400" />,
          label: 'Nearby Doctors & Clinics',
          action: () =>
            onStartVoiceWithBot(bot, 'Find nearby geriatric doctors and wellness clinics.'),
        },
      ],
    },
    'internet-guide': {
      eyebrow: 'INTERNET GUIDE',
      title: 'Browse. Search. Explore.',
      subtitle:
        'Navigate news websites, look up facts, and search the web using your voice alone.',
      checklist: [
        'Hands-free news reader',
        'Search without typing',
        'Verified facts & weather',
        'Website navigation bridge',
      ],
      sampleQuestion: "Open Dainik Jagran and read today's news.",
      sampleAnswer:
        'Dainik Jagran is open. I found India, World, Sports, Business and Technology. Which section would you like me to read aloud?',
      imageSrc: '/src/assets/images/guidebots_group_char_1788736479443.jpg',
      interactiveOptions: [
        {
          icon: <Globe size={16} className="text-blue-400" />,
          label: 'Open Dainik Jagran News',
          action: () => {
            if (onOpenWebReader) onOpenWebReader('dainik-jagran');
            voiceService.speak(
              'Dainik Jagran is open. I found India, World, Sports, Business and Technology. Which one would you like me to read aloud?'
            );
          },
        },
        {
          icon: <Globe size={16} className="text-emerald-400" />,
          label: 'Open BBC News Reader',
          action: () => {
            if (onOpenWebReader) onOpenWebReader('bbc-news');
            voiceService.speak(
              'BBC News is open. I found World, Technology, Science and Health.'
            );
          },
        },
        {
          icon: <Sparkles size={16} className="text-[#f4d06f]" />,
          label: 'Search Weather in Dehradun',
          action: () => onStartVoiceWithBot(bot, 'What is the weather today in Dehradun?'),
        },
      ],
    },
    'accessibility-guide': {
      eyebrow: 'ACCESSIBILITY GUIDE',
      title: 'Extra Support. Total Independence.',
      subtitle:
        'Designed for low-vision, hearing impaired, and motor-assistive users.',
      checklist: [
        'Voice dictation & magnifier',
        'High contrast display',
        'Audio captions amplifier',
        'Screen & document reader',
      ],
      sampleQuestion: 'Help me read text on my screen or camera.',
      sampleAnswer:
        'Screen and camera readers are ready. Hold any document in front of the camera or share your screen to hear every sentence spoken clearly.',
      imageSrc: '/src/assets/images/guidebots_group_char_1788736479443.jpg',
      interactiveOptions: [
        {
          icon: <Eye size={16} className="text-purple-400" />,
          label: 'Start Camera Reader',
          action: () => onStartVoiceWithBot(bot, 'Inspect document with camera.'),
        },
        {
          icon: <Volume2 size={16} className="text-[#f4d06f]" />,
          label: 'Speak Screen Content',
          action: () =>
            voiceService.speak(
              'Accessibility mode active. Large font, slow voice pacing, and high contrast enabled.'
            ),
        },
      ],
    },
  };

  const currentConfig = botConfigs[bot.id] || botConfigs['learning-guide'];

  const handleCopy = () => {
    deviceService.writeToClipboard(currentConfig.sampleAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (isPlayingAudio) {
      voiceService.interrupt();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      voiceService.speak(currentConfig.sampleAnswer, 'en-US', () => {
        setIsPlayingAudio(false);
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 animate-fade-in text-white">
      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to GuideBots</span>
        </button>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#f4d06f]/15 border border-[#f4d06f]/30 text-[#f4d06f] flex items-center gap-1.5">
          <Sparkles size={12} /> {bot.name} Active
        </span>
      </div>

      {/* Main 3-Column / Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Descriptions & Checklist */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <span className="text-[#f4d06f] font-bold text-xs uppercase tracking-[0.2em] block mb-2">
              {currentConfig.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline text-white leading-tight">
              {currentConfig.title}
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mt-3">
              {currentConfig.subtitle}
            </p>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3 pt-2">
            {currentConfig.checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check size={14} />
                </div>
                <span className="text-sm font-medium text-zinc-200">{item}</span>
              </div>
            ))}
          </div>

          {/* Primary CTA Button */}
          <div className="pt-4">
            <button
              onClick={() => onStartVoiceWithBot(bot)}
              type="button"
              className="amber-glow-btn w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-sm sm:text-base text-[#241a00] cursor-pointer shadow-xl transition-all active:scale-95"
            >
              <div className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center">
                <Mic size={16} className="text-[#241a00]" />
              </div>
              <span>TALK TO {bot.name.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Center Column: 3D Character Illustration */}
        <div className="lg:col-span-4 flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border border-[#f4d06f]/30 shadow-[0_0_50px_rgba(244,208,111,0.2)] bg-[#141926]">
            {currentConfig.imageSrc ? (
              <img
                src={currentConfig.imageSrc}
                alt={bot.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-[#f4d06f]/20 border border-[#f4d06f]/40 flex items-center justify-center text-[#f4d06f] mb-4">
                  {bot.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{bot.name}</h3>
              </div>
            )}

            {/* Ambient subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Interactive QA Preview / Quick Action Panel */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* User Prompt / Question Preview Bubble */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-[#f4d06f] font-semibold mb-1.5">
              <Sparkles size={14} />
              <span>Voice Question Example:</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-white italic">
              "{currentConfig.sampleQuestion}"
            </p>
          </div>

          {/* AI Response Card */}
          <div className="p-5 rounded-3xl bg-[#161b29]/90 border border-[#f4d06f]/30 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#f4d06f] uppercase tracking-wider flex items-center gap-1.5">
                <Bot size={14} /> {bot.name} Answer:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToggleSpeak}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#f4d06f] transition-colors"
                  title="Listen to this response"
                >
                  {isPlayingAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                  title="Copy text"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-body">
              {currentConfig.sampleAnswer}
            </p>
          </div>

          {/* Quick Interactive Pills List */}
          {currentConfig.interactiveOptions && currentConfig.interactiveOptions.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block px-1">
                Try These Actions:
              </span>
              {currentConfig.interactiveOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={opt.action}
                  type="button"
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f4d06f]/40 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center">
                      {opt.icon}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white">
                      {opt.label}
                    </span>
                  </div>
                  <Mic size={14} className="text-[#f4d06f] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </button>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
