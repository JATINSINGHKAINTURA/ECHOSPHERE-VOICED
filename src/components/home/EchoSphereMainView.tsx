import React from 'react';
import { EchoSphereHero } from './EchoSphereHero.js';
import { GuideBotsSection, type GuideBotItem } from './GuideBotsSection.js';
import { ActionChipsSection, type ActionChip } from './ActionChipsSection.js';
import { InclusiveBanner } from './InclusiveBanner.js';
import { EchoSphereFooter } from './EchoSphereFooter.js';

interface EchoSphereMainViewProps {
  onStartVoice: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  activeStatus?: 'listen' | 'understand' | 'respond' | 'help';
  transcript?: string;
  onSelectStatus?: (status: 'listen' | 'understand' | 'respond' | 'help') => void;
  onSelectGuideBot: (bot: GuideBotItem) => void;
  onExploreAllGuideBots: () => void;
  onSelectActionChip: (chip: ActionChip) => void;
  onOpenSettings: () => void;
  onSelectGuideBotsTab: () => void;
}

export const EchoSphereMainView: React.FC<EchoSphereMainViewProps> = ({
  onStartVoice,
  isListening,
  isSpeaking,
  activeStatus = 'listen',
  transcript,
  onSelectStatus,
  onSelectGuideBot,
  onExploreAllGuideBots,
  onSelectActionChip,
  onOpenSettings,
  onSelectGuideBotsTab,
}) => {
  return (
    <div className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-[#0b101d] flex flex-col justify-between">
      {/* 1. Hero Section */}
      <EchoSphereHero
        onStartVoice={onStartVoice}
        isListening={isListening}
        isSpeaking={isSpeaking}
        activeStatus={activeStatus}
        transcript={transcript}
        onSelectStatus={onSelectStatus}
      />

      {/* 2. Specialized Companions (GuideBots) */}
      <GuideBotsSection
        onSelectBot={onSelectGuideBot}
        onExploreAll={onExploreAllGuideBots}
      />

      {/* 3. One-Tap / Voice Action Chips */}
      <ActionChipsSection
        onSelectAction={onSelectActionChip}
      />

      {/* 4. Inclusive Design Banner */}
      <InclusiveBanner
        onStartVoice={onStartVoice}
      />

      {/* 5. Footer */}
      <EchoSphereFooter
        onOpenSettings={onOpenSettings}
        onSelectGuideBots={onSelectGuideBotsTab}
      />
    </div>
  );
};
