'use client';

import React, { useEffect } from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import { Achievement } from '@/types/game';
import { audio } from '@/lib/audio';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onClose,
}) => {
  useEffect(() => {
    audio.playAchievement();
    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-2xl border-2 border-amber-300 flex items-center gap-3 animate-bounce">
      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0">
        <Award className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1 space-y-0.5">
        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Prestasi Terbuka!</span>
        </div>
        <h4 className="text-sm font-black leading-tight text-white">
          {achievement.title}
        </h4>
        <p className="text-[11px] text-amber-100 line-clamp-1">
          {achievement.description}
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
