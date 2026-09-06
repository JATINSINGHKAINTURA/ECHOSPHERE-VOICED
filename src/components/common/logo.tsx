import React from 'react';
import { Radio } from 'lucide-react';

export const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => {
  return (
    <div className={`flex items-center gap-2.5 font-semibold tracking-tight text-white ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
        <Radio size={size - 4} className="animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold tracking-tight text-zinc-100 flex items-center gap-1.5">
          EchoSphere
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-medium">
            AGORA
          </span>
        </span>
      </div>
    </div>
  );
};
