import React from 'react';
import { Bot, User } from 'lucide-react';

interface AvatarProps {
  role: 'user' | 'assistant' | 'system';
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ role, size = 18 }) => {
  if (role === 'assistant') {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
        <Bot size={size} />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
      <User size={size} />
    </div>
  );
};
