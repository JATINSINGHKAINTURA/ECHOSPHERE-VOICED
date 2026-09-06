import React from 'react';

interface EchoSphereFooterProps {
  onOpenSettings: () => void;
  onSelectGuideBots: () => void;
}

export const EchoSphereFooter: React.FC<EchoSphereFooterProps> = ({
  onOpenSettings,
  onSelectGuideBots,
}) => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0b101d] py-6 sm:py-8 px-6 sm:px-12 mt-auto select-none">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        {/* Left tagline */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="w-2 h-2 rounded-full bg-[#f4d06f] inline-block shadow-[0_0_6px_#f4d06f]" />
          <span className="text-zinc-400">
            <strong className="text-zinc-200 font-semibold">EchoSphere</strong> — Designed for human connection and accessible computing.
          </span>
        </div>

        {/* Right links */}
        <div className="flex items-center gap-6 text-zinc-400">
          <button
            onClick={onOpenSettings}
            type="button"
            className="hover:text-[#f4d06f] transition-colors cursor-pointer"
          >
            Voice Settings
          </button>
          <button
            onClick={onSelectGuideBots}
            type="button"
            className="hover:text-[#f4d06f] transition-colors cursor-pointer"
          >
            GuideBots
          </button>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500">Privacy & Accessibility First</span>
        </div>
      </div>
    </footer>
  );
};
