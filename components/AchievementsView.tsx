'use client';

import React from 'react';
import { ArrowLeft, Award, Lock, CheckCircle2, Star, Flame, BookOpen, Crown, Map, Compass, Medal } from 'lucide-react';
import { ACHIEVEMENTS } from '@/data/achievements';
import { GameState } from '@/types/game';
import { audio } from '@/lib/audio';

interface AchievementsViewProps {
  state: GameState;
  onBack: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  state,
  onBack,
}) => {
  const unlockedSet = new Set(state.unlockedAchievements);
  const unlockedCount = state.unlockedAchievements.length;

  const getAchievementIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = isUnlocked
      ? 'w-6 h-6 text-amber-500'
      : 'w-6 h-6 text-slate-400 dark:text-slate-500';

    switch (iconName) {
      case 'compass':
        return <Compass className={iconClass} />;
      case 'map':
        return <Map className={iconClass} />;
      case 'crown':
        return <Crown className={iconClass} />;
      case 'star':
        return <Star className={iconClass} />;
      case 'flame':
        return <Flame className={iconClass} />;
      case 'book-open':
        return <BookOpen className={iconClass} />;
      case 'medal':
        return <Medal className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            audio.playButtonClick();
            onBack();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-sm shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Koleksi Prestasi
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            PRESTASI
          </h2>
        </div>
      </div>

      {/* Progress banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Torehan Prestasi Anak
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Kumpulkan seluruh lencana dengan menyelesaikan petualangan kata
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 font-black text-sm text-amber-700 dark:text-amber-300 shadow-xs flex-shrink-0">
          {unlockedCount} / {ACHIEVEMENTS.length} Terbuka
        </div>
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((item) => {
          const isUnlocked = unlockedSet.has(item.id);

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-800/95 border-amber-300/80 dark:border-amber-700/60 shadow-md'
                  : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isUnlocked
                    ? 'bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800'
                    : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {getAchievementIcon(item.icon, isUnlocked)}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-base font-black ${
                      isUnlocked
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.title}
                  </h4>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Terbuka</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      <span>Terkunci</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Syarat: {item.requiredMetric}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
