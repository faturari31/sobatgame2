'use client';

import React from 'react';
import { ArrowLeft, Play, Star, BookOpen, Puzzle, FileText, Newspaper, Compass, Trophy } from 'lucide-react';
import { THEMES } from '@/data/themes';
import { GameState } from '@/types/game';
import { audio } from '@/lib/audio';

interface ThemeSelectViewProps {
  state: GameState;
  onSelectTheme: (themeId: number) => void;
  onBack: () => void;
}

export const ThemeSelectView: React.FC<ThemeSelectViewProps> = ({
  state,
  onSelectTheme,
  onBack,
}) => {
  const getThemeIcon = (iconName: string) => {
    switch (iconName) {
      case 'alphabet':
        return <Compass className="w-7 h-7 text-sky-500" />;
      case 'book':
        return <BookOpen className="w-7 h-7 text-blue-500" />;
      case 'puzzle':
        return <Puzzle className="w-7 h-7 text-emerald-500" />;
      case 'pencil':
        return <FileText className="w-7 h-7 text-indigo-500" />;
      case 'newspaper':
        return <Newspaper className="w-7 h-7 text-teal-500" />;
      default:
        return <BookOpen className="w-7 h-7 text-sky-500" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            audio.playButtonClick();
            onBack();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-bold text-sm shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            5 Tema Petualangan
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            PILIH TEMA
          </h2>
        </div>
      </div>

      {/* Theme Cards List (All 5 themes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {THEMES.map((theme) => {
          const progress = state.themeProgress[theme.id] || {
            completed: false,
            bestScore: 0,
            stars: 0,
            timesPlayed: 0,
          };

          return (
            <div
              key={theme.id}
              className="flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                {/* Top badge row: Theme Number & Status */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-black">
                    TEMA {theme.id}
                  </span>

                  {progress.completed ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span>✓ Selesai</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      10 Soal
                    </span>
                  )}
                </div>

                {/* Theme Title & Icon */}
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-100 dark:border-slate-600 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {getThemeIcon(theme.iconName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {theme.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {theme.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {theme.description}
                </p>

                {/* Mechanics badge */}
                <div className="pt-1">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/80 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    🎮 {theme.mechanics}
                  </span>
                </div>

                {/* Score & Stars Info */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Skor Terbaik: {progress.bestScore}/100</span>
                  </div>

                  {/* Stars 0-5 */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx <= progress.stars
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Play Button */}
              <button
                onClick={() => {
                  audio.playButtonClick();
                  onSelectTheme(theme.id);
                }}
                className="mt-5 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{progress.completed ? 'MAIN LAGI' : 'MAIN'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
