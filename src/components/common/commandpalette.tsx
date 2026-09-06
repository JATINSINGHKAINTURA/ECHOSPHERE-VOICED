import React, { useState, useEffect } from 'react';
import { Search, Radio, CheckSquare, GitPullRequest, FileText, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectAction }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'voice_start', label: 'Start Agora Voice Session', icon: Radio, category: 'Voice' },
    { id: 'jira_create', label: 'Create Jira Incident Ticket', icon: CheckSquare, category: 'Jira' },
    { id: 'github_prs', label: 'Inspect Open Pull Requests', icon: GitPullRequest, category: 'GitHub' },
    { id: 'notion_doc', label: 'Generate Post-Mortem in Notion', icon: FileText, category: 'Notion' },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-zinc-800">
          <Search size={18} className="text-zinc-400 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search action..."
            className="w-full bg-transparent py-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-200">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectAction(item.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-800/80 text-left group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-zinc-800 group-hover:bg-blue-600/20 group-hover:text-blue-400 text-zinc-400 transition-colors">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm text-zinc-200 group-hover:text-white font-medium">
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">
                  {item.category}
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-zinc-500">No actions found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
