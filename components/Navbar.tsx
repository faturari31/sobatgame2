'use client';

import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Settings, Flame, Star, Zap } from 'lucide-react';
import { audio } from '@/lib/audio';
import { GameState, ActiveScreen } from '@/types/game';

interface NavbarProps {
  state: GameState;
  onUpdateSettings: (updater: (prev: GameState['settings']) => GameState['settings']) => void;
  onNavigate: (screen: ActiveScreen) => void;
  currentScreen: ActiveScreen;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onUpdateSettings,
  onNavigate,
  currentScreen,
}) => {
  const toggleSound = () => {
    const next = !state.settings.soundEnabled;
    audio.playButtonClick();
    audio.setSoundEnabled(next);
    onUpdateSettings((prev) => ({ ...prev, soundEnabled: next }));
  };

  const toggleDarkMode = () => {
    audio.playButtonClick();
    const next = !state.settings.darkMode;
    onUpdateSettings((prev) => ({ ...prev, darkMode: next }));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand & Logo: "sobat game" small, "JELAJAH KATA" dominant */}
        <button
          onClick={() => {
            audio.playButtonClick();
            onNavigate('dashboard');
          }}
          className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl p-1"
          aria-label="Kembali ke Dashboard Jelajah Kata"
        >
          {/* Logo Badge Icon (SVG) */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <div className="flex items-center font-black tracking-tighter text-base sm:text-lg">
              <span className="text-white">J</span>
              <span className="text-emerald-300">K</span>
            </div>
          </div>

          <div className="flex flex-col">
            {/* Supporting Brand: sobat game (small) */}
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                sobat game
              </span>
            </div>
            {/* Main Dominant Brand: JELAJAH KATA */}
            <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              JELAJAH <span className="text-sky-500">KATA</span>
            </span>
          </div>
        </button>

        {/* Real-time Stats & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Streak indicator if active */}
          {state.currentStreak > 1 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold animate-pulse">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{state.currentStreak}x Streak</span>
            </div>
          )}

          {/* Stars Pill */}
          <div
            onClick={() => onNavigate('progress')}
            className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-black shadow-xs hover:scale-105 transition-transform"
            title="Total Bintang Terkumpul"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{state.totalStars}</span>
          </div>

          {/* XP Pill */}
          <div
            onClick={() => onNavigate('progress')}
            className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs sm:text-sm font-black shadow-xs hover:scale-105 transition-transform"
            title="Total XP Belajar"
          >
            <Zap className="w-4 h-4 fill-sky-400 text-sky-500" />
            <span>{state.totalXP}</span>
          </div>

          {/* Quick Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={state.settings.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            title={state.settings.soundEnabled ? 'Suara Aktif' : 'Suara Mati'}
          >
            {state.settings.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={state.settings.darkMode ? 'Mode Terang' : 'Mode Gelap'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            title={state.settings.darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {state.settings.darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              audio.playButtonClick();
              onNavigate('settings');
            }}
            aria-label="Buka Pengaturan"
            className={`p-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              currentScreen === 'settings'
                ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Pengaturan"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
