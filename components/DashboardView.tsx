'use client';

import React from 'react';
import {
  Play,
  Grid,
  Trophy,
  BarChart3,
  Settings as SettingsIcon,
  Star,
  Zap,
  CheckCircle2,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { GameState, ActiveScreen } from '@/types/game';
import { audio } from '@/lib/audio';

interface DashboardViewProps {
  state: GameState;
  onNavigate: (screen: ActiveScreen) => void;
  onQuickPlay: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onNavigate,
  onQuickPlay,
}) => {
  const completedThemesCount = Object.values(state.themeProgress).filter(
    (t) => t.completed
  ).length;

  const progressPercentage = Math.min(
    100,
    Math.round((state.totalAnswered / 50) * 100)
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 text-white p-6 sm:p-10 shadow-xl shadow-sky-500/20 border border-sky-400/30">
        {/* Subtle geometric background patterns */}
        <div className="absolute -right-8 -bottom-8 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-40 h-40 rounded-3xl bg-emerald-400/15 rotate-12 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            {/* Supporting Brand: sobat game */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              <span>sobat game</span>
            </div>

            {/* Main Dominant Title */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
              JELAJAH <span className="text-emerald-300">KATA</span>
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-xl font-medium text-sky-100 max-w-lg leading-relaxed">
              Petualangan seru bersama huruf dan kata untuk anak cerdas Indonesia
            </p>
          </div>

          {/* Quick Play CTA on Hero */}
          <button
            onClick={() => {
              audio.playButtonClick();
              onQuickPlay();
            }}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 font-black text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center">
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </div>
            <span>MULAI BERMAIN</span>
          </button>
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Bintang */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-500 flex-shrink-0">
            <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              Total Bintang
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {state.totalStars} <span className="text-xs font-normal text-slate-400">/ 25</span>
            </div>
          </div>
        </div>

        {/* Total XP */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-400/10 flex items-center justify-center text-sky-500 flex-shrink-0">
            <Zap className="w-6 h-6 fill-sky-400 text-sky-500" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              Total XP
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {state.totalXP} <span className="text-xs font-normal text-slate-400">XP</span>
            </div>
          </div>
        </div>

        {/* Best Score */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
            <Trophy className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              Skor Tertinggi
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {state.totalScore} <span className="text-xs font-normal text-slate-400">/ 500</span>
            </div>
          </div>
        </div>

        {/* Tema Selesai */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-500 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              Tema Selesai
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {completedThemesCount} <span className="text-xs font-normal text-slate-400">/ 5 Tema</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-500" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Progres Belajar Keseluruhan
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Menyelesaikan 5 tema dengan total 50 soal nyata Bahasa Indonesia
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-black text-sm">
            {state.totalAnswered} / 50 Soal ({progressPercentage}%)
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Navigation Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PILIH TEMA */}
        <button
          onClick={() => {
            audio.playButtonClick();
            onNavigate('theme_select');
          }}
          className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              PILIH TEMA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Jelajahi 5 tema petualangan huruf dan kata
            </p>
          </div>
        </button>

        {/* PRESTASI */}
        <button
          onClick={() => {
            audio.playButtonClick();
            onNavigate('achievements');
          }}
          className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              PRESTASI
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {state.unlockedAchievements.length} / 8 Prestasi Terbuka
            </p>
          </div>
        </button>

        {/* PROGRES */}
        <button
          onClick={() => {
            audio.playButtonClick();
            onNavigate('progress');
          }}
          className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              PROGRES
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Statistik lengkap tiap tema dan skor
            </p>
          </div>
        </button>

        {/* PENGATURAN */}
        <button
          onClick={() => {
            audio.playButtonClick();
            onNavigate('settings');
          }}
          className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
              PENGATURAN
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Audio, Tema Tampilan, & Reset Progres
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
