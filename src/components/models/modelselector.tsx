import React, { useState } from 'react';
import { Cpu, ChevronDown } from 'lucide-react';
import type { ModelInfo } from '../../types/index.js';

interface ModelSelectorProps {
  models: ModelInfo[];
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onSelectModel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const current = models.find((m) => m.id === selectedModel) || models[0] || {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60 transition-colors"
      >
        <Cpu size={14} className="text-blue-400" />
        <span>{current.name}</span>
        <ChevronDown size={14} className="text-zinc-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl p-1 z-50 overflow-hidden">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onSelectModel(m.id);
                  setIsOpen(false);
                }}
                className={`w-full flex flex-col p-2.5 rounded-lg text-left transition-colors ${
                  m.id === selectedModel
                    ? 'bg-blue-600/15 text-blue-400'
                    : 'text-zinc-300 hover:bg-zinc-800/70'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-medium mb-0.5">
                  <span>{m.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{m.latency}</span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{m.description}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
