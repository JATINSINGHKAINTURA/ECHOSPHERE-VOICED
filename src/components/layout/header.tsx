import React from 'react';
import { Logo } from '../common/logo.js';
import { LanguageSelector } from '../language/languageselector.js';
import { ModelSelector } from '../models/modelselector.js';
import { Mic, Radio, LogIn, LogOut, Database, Sparkles, HelpCircle, Accessibility } from 'lucide-react';
import type { Language } from '../../data/languages.js';
import type { ModelInfo } from '../../types/index.js';
import type { User } from 'firebase/auth';

export type EchoNavTab = 'home' | 'talk' | 'guidebots' | 'history' | 'settings';

interface HeaderProps {
  activeTab: EchoNavTab;
  onSelectTab: (tab: EchoNavTab) => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  models: ModelInfo[];
  selectedModel: string;
  onSelectModel: (m: string) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onToggleTools: () => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  currentUser: User | null;
  onSignInWithGoogle: () => Promise<void>;
  onSignOut: () => Promise<void>;
  isSigningIn: boolean;
  isAccessibleMode?: boolean;
  onToggleAccessibleMode?: () => void;
  onOpenVoiceGuide?: () => void;
  onStartVoiceModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  currentLanguage,
  onSelectLanguage,
  models,
  selectedModel,
  onSelectModel,
  onOpenCommandPalette,
  onOpenSettings,
  onToggleTools,
  isVoiceActive,
  onToggleVoice,
  currentUser,
  onSignInWithGoogle,
  onSignOut,
  isSigningIn,
  isAccessibleMode,
  onToggleAccessibleMode,
  onOpenVoiceGuide,
  onStartVoiceModal,
}) => {
  const navTabs: { id: EchoNavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'talk', label: 'Talk' },
    { id: 'guidebots', label: 'GuideBots' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#070c18]/95 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between z-30 shrink-0 select-none shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* 1. Left: Brand Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onSelectTab('home')}
          type="button"
          className="focus:outline-none cursor-pointer"
        >
          <Logo />
        </button>
      </div>

      {/* 2. Center: Navigation Tabs matching guidebot fe.png */}
      <nav className="hidden md:flex items-center gap-2 lg:gap-6">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'settings') {
                  onOpenSettings();
                } else {
                  onSelectTab(tab.id);
                }
              }}
              type="button"
              className={`relative px-3 py-2 text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 left-2 right-2 h-0.5 bg-[#f4d06f] rounded-full shadow-[0_0_12px_rgba(244,208,111,0.9)] animate-fade-in" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Right: Accessibility badge + Mic Action + Extras */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Simpler Internet / Accessibility Badge */}
        <div
          onClick={onToggleAccessibleMode}
          role="button"
          tabIndex={0}
          className={`hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
            isAccessibleMode
              ? 'bg-[#f4d06f] text-[#241a00] border-[#ffeecb] shadow-[0_0_15px_rgba(244,208,111,0.4)] font-bold'
              : 'bg-[#101728] text-zinc-300 border-white/10 hover:border-white/25 hover:text-white'
          }`}
          title="Toggle Easy Echo Mode for simplified speech and larger touch targets"
        >
          <div className="w-4 h-4 rounded-full bg-[#f4d06f] text-[#241a00] flex items-center justify-center text-[10px]">
            <Accessibility size={11} className="stroke-[2.5]" />
          </div>
          <span className="text-[11px] tracking-tight font-semibold">A simpler internet for everyone</span>
        </div>

        {/* Circular Mic Button */}
        <button
          onClick={() => {
            if (onStartVoiceModal) {
              onStartVoiceModal();
            } else {
              onSelectTab('talk');
            }
          }}
          type="button"
          className="w-10 h-10 rounded-full bg-[#12192a] hover:bg-[#f4d06f] text-[#f4d06f] hover:text-[#241a00] border border-[#f4d06f]/40 hover:border-[#f4d06f] shadow-[0_0_15px_rgba(244,208,111,0.2)] flex items-center justify-center transition-all duration-200 cursor-pointer"
          title="Start Voice Conversation"
        >
          <Mic size={18} />
        </button>

        {/* Model Selection */}
        <div className="hidden xl:block">
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onSelectModel={onSelectModel}
          />
        </div>

        {/* Language Selection */}
        <LanguageSelector
          currentLanguage={currentLanguage}
          onSelectLanguage={onSelectLanguage}
        />

        {/* User Auth Profile / Google Sign-In */}
        {currentUser ? (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#161b29] border border-white/10">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="w-6 h-6 rounded-full border border-[#f4d06f]/40"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#f4d06f] flex items-center justify-center text-[#241a00] text-[10px] font-bold">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
              </div>
            )}
            <div className="hidden 2xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-zinc-200 line-clamp-1 max-w-[90px]">
                {currentUser.displayName || 'User'}
              </span>
              <span className="text-[9px] text-[#f4d06f] flex items-center gap-0.5">
                <Database size={8} />
                Synced
              </span>
            </div>
            <button
              onClick={onSignOut}
              className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={onSignInWithGoogle}
            disabled={isSigningIn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161b29] hover:bg-[#1f273b] text-zinc-200 border border-white/10 text-xs font-semibold transition-all"
          >
            <LogIn size={13} className="text-[#f4d06f]" />
            <span className="hidden sm:inline">{isSigningIn ? 'Connecting...' : 'Sign In'}</span>
          </button>
        )}
      </div>
    </header>
  );
};

