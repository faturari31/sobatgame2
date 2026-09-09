'use client';

import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Star,
  Zap,
  BookOpen,
  Award,
  Flame,
} from 'lucide-react';
import { THEMES } from '@/data/themes';
import { GameState } from '@/types/game';
import { audio } from '@/lib/audio';

interface ProgressViewProps {
  state: GameState;
  onBack: () => void;
  onSelectTheme: (themeId: number) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  state,
  onBack,
  onSelectTheme,
}) => {
  const completedThemesCount = Object.values(state.themeProgress).filter(
    (t) => t.completed
  ).length;

  const totalProgressPercent = Math.min(
    100,
    Math.round((state.totalAnswered / 50) * 100)
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn">
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
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Rekap Petualangan
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            PROGRES BELAJAR
          </h2>
        </div>
      </div>

      {/* Main Stats 4-Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Soal Selesai */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Soal Selesai
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {state.totalAnswered} <span className="text-xs text-slate-400">/ 50</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full"
              style={{ width: `${totalProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Tema Selesai */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Tema Tuntas
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {completedThemesCount} <span className="text-xs text-slate-400">/ 5</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${(completedThemesCount / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Total Skor */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Skor
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {state.totalScore} <span className="text-xs text-slate-400">/ 500</span>
          </div>
          <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>Skor Akumulasi</span>
          </div>
        </div>

        {/* Total Bintang */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Bintang Emas
          </div>
          <div className="text-2xl font-black text-amber-500">
            {state.totalStars} <span className="text-xs text-slate-400">/ 25</span>
          </div>
          <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-sky-400" />
            <span>{state.totalXP} Total XP</span>
          </div>
        </div>
      </div>

      {/* Detail Per Tema Breakdown */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-500" />
            <span>Rincian 5 Tema Belajar</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            10 Soal per Tema
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
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
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-extrabold text-xs">
                      Tema {theme.id}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {theme.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {theme.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx <= progress.stars
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Best Score */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-xs text-slate-400 block">Skor Terbaik</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {progress.bestScore} / 100
                    </span>
                  </div>

                  {/* Play button */}
                  <button
                    onClick={() => {
                      audio.playButtonClick();
                      onSelectTheme(theme.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Main
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak and Achievements Mini Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rekor Streak */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Rekor Streak Terbaik
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {state.bestStreak} Jawaban Benar Beruntun
            </div>
          </div>
        </div>

        {/* Prestasi Terbuka */}
        <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
              Prestasi Terbuka
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {state.unlockedAchievements.length} / 8 Prestasi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
