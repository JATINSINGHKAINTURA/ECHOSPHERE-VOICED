import React, { useState } from 'react';
import { Wrench, Play, CheckCircle, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import type { ToolDefinition, Incident, PendingAction } from '../../types/tools.js';

interface ToolsPanelProps {
  tools: ToolDefinition[];
  incidents: Incident[];
  pendingActions: PendingAction[];
  onExecuteTool: (name: string, params: any) => Promise<void>;
  onApproveAction: (actionId: string, approved: boolean) => Promise<void>;
}

export const ToolsPanel: React.FC<ToolsPanelProps> = ({
  tools,
  incidents,
  pendingActions,
  onExecuteTool,
  onApproveAction,
}) => {
  const [activeTab, setActiveTab] = useState<'actions' | 'incidents' | 'tools'>('actions');
  const [executingTool, setExecutingTool] = useState<string | null>(null);

  const handleRunTool = async (name: string) => {
    setExecutingTool(name);
    try {
      await onExecuteTool(name, {});
    } finally {
      setExecutingTool(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/60 border-l border-zinc-800/80 w-80 shrink-0">
      {/* Tab Header */}
      <div className="flex border-b border-zinc-800 px-3 pt-3 gap-1">
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'actions'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck size={14} />
          Approvals
          {pendingActions.filter((a) => a.status === 'pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'incidents'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <AlertCircle size={14} />
          Incidents
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'tools'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Wrench size={14} />
          Tools
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'actions' && (
          <div className="space-y-3">
            <div className="text-xs text-zinc-400 font-medium flex items-center justify-between">
              <span>Human-in-the-Loop Actions</span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {pendingActions.length} total
              </span>
            </div>

            {pendingActions.map((action) => (
              <div
                key={action.id}
                className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-zinc-200">{action.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                      action.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : action.status === 'rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {action.status}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{action.description}</p>

                {action.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onApproveAction(action.id, true)}
                      className="flex-1 px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                    >
                      Authorize
                    </button>
                    <button
                      onClick={() => onApproveAction(action.id, false)}
                      className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}

            {pendingActions.length === 0 && (
              <div className="text-center py-8 text-xs text-zinc-500">
                No pending actions requiring operator approval.
              </div>
            )}
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="space-y-3">
            <div className="text-xs text-zinc-400 font-medium flex items-center justify-between">
              <span>Active Ops Incidents</span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {incidents.length} active
              </span>
            </div>

            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-blue-400 font-medium">{inc.id}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-medium ${
                      inc.priority === 'high' || inc.priority === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {inc.priority}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-zinc-200">{inc.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{inc.description}</p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
                  <span>Service: {inc.service}</span>
                  <span className="capitalize">{inc.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-3">
            <div className="text-xs text-zinc-400 font-medium">Available Workspace Tools</div>
            {tools.map((t) => (
              <div
                key={t.name}
                className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-200 font-medium">{t.name}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {t.category}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">{t.description}</p>
                <button
                  disabled={executingTool === t.name}
                  onClick={() => handleRunTool(t.name)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors disabled:opacity-50"
                >
                  <Play size={12} />
                  {executingTool === t.name ? 'Running...' : 'Run Diagnostics'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
