import React from 'react';
import { Logo } from '../common/logo.js';
import { LanguageSelector } from '../language/languageselector.js';
import { ModelSelector } from '../models/modelselector.js';
import { Command, Settings, PanelRight, Radio, LogIn, LogOut, Database, User as UserIcon, Sparkles, HelpCircle } from 'lucide-react';
import type { Language } from '../../data/languages.js';
import type { ModelInfo } from '../../types/index.js';
import type { User } from 'firebase/auth';

interface HeaderProps {
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
}

export const Header: React.FC<HeaderProps> = ({
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
}) => {
  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center gap-6">
        <Logo />
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
        >
          <Command size={13} />
          <span>Quick command</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Easy Echo Senior / Accessible Mode Toggle */}
        <button
          onClick={onToggleAccessibleMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
            isAccessibleMode
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
              : 'bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border-emerald-500/30'
          }`}
          title="Switch to Easy Echo Mode for seniors, kids & clear speech"
        >
          <Sparkles size={13} className={isAccessibleMode ? 'animate-spin' : ''} />
          <span>{isAccessibleMode ? 'Easy Echo: ON' : 'Easy Mode'}</span>
        </button>

        {/* Agora Voice Toggle */}
        <button
          onClick={onToggleVoice}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            isVoiceActive
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/20'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20'
          }`}
        >
          <Radio size={14} className={isVoiceActive ? 'animate-pulse' : ''} />
          <span>{isVoiceActive ? 'End Call' : 'Voice Connect'}</span>
        </button>

        {/* Model Selection */}
        <ModelSelector
          models={models}
          selectedModel={selectedModel}
          onSelectModel={onSelectModel}
        />

        {/* Language Selection */}
        <LanguageSelector
          currentLanguage={currentLanguage}
          onSelectLanguage={onSelectLanguage}
        />

        {/* Firebase Authentication Button / Profile */}
        {currentUser ? (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="w-6 h-6 rounded-full border border-emerald-500/40"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
              </div>
            )}
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-zinc-200 line-clamp-1 max-w-[100px]">
                {currentUser.displayName || 'User'}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Database size={9} />
                Firestore Synced
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 text-xs font-medium transition-all shadow-sm"
          >
            <LogIn size={13} className="text-amber-400" />
            <span>{isSigningIn ? 'Connecting...' : 'Google Sign-In'}</span>
          </button>
        )}

        {/* Voice Commands Guide / Onboarding */}
        {onOpenVoiceGuide && (
          <button
            onClick={onOpenVoiceGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-sky-400 bg-sky-950/40 hover:bg-sky-900/40 border border-sky-800/50 transition-colors shadow-sm"
            title="Voice Commands Guide for Browser Actions"
          >
            <HelpCircle size={14} />
            <span className="hidden sm:inline">Voice Guide</span>
          </button>
        )}

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
          title="Settings"
        >
          <Settings size={17} />
        </button>

        {/* Toggle Right Panel */}
        <button
          onClick={onToggleTools}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
          title="Toggle Tools"
        >
          <PanelRight size={17} />
        </button>
      </div>
    </header>
  );
};
