import React from 'react';

export const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => {
  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight text-white select-none ${className}`}>
      {/* EchoSphere Concentric Golden Rings Icon */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#f4d06f] bg-[#1a1f2d] shadow-[0_0_12px_rgba(244,208,111,0.3)]">
        <div className="w-4 h-4 rounded-full border-2 border-[#ffeecb]/80 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#f4d06f] shadow-[0_0_6px_#f4d06f]" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-white font-headline">
          EchoSphere
        </span>
      </div>
    </div>
  );
};
