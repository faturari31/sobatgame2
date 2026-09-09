'use client';

import React, { useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { audio } from '@/lib/audio';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const letters = ['J', 'E', 'L', 'A', 'J', 'A', 'H'];
  const words = ['K', 'A', 'T', 'A'];

  useEffect(() => {
    // Play gentle entrance sound
    const timer = setTimeout(() => {
      audio.playMenuOpen();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    audio.playButtonClick();
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-radial from-sky-50 via-white to-blue-50/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors select-none overflow-hidden">
      {/* Background Decorative Geometric Shapes & Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-20">
        <div className="absolute top-12 left-12 w-32 h-32 rounded-3xl bg-sky-200/40 dark:bg-sky-500/10 rotate-12 blur-xl animate-pulse" />
        <div className="absolute bottom-16 right-16 w-48 h-48 rounded-full bg-emerald-200/40 dark:bg-emerald-500/10 -rotate-12 blur-2xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-2xl bg-indigo-200/30 dark:bg-indigo-500/10 rotate-45 blur-lg" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center">
        {/* Supporting Brand: sobat game */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-extrabold tracking-widest uppercase">
            sobat game
          </span>
        </div>

        {/* Central Geometric App Logo Emblem */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 shadow-xl shadow-sky-500/30 flex items-center justify-center border-2 border-white/40 dark:border-white/20 transform hover:scale-105 transition-transform">
            <div className="relative flex items-center gap-1 font-black text-3xl sm:text-4xl text-white">
              <span className="drop-shadow-sm">J</span>
              <span className="text-emerald-300 drop-shadow-sm">K</span>
              <Sparkles className="w-5 h-5 text-amber-300 absolute -top-3 -right-3 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>
        </div>

        {/* Floating Alphabet Tiles for JELAJAH */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2">
          {letters.map((char, index) => (
            <div
              key={`letter-${index}`}
              className="w-8 h-10 sm:w-10 sm:h-12 rounded-xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 shadow-sm flex items-center justify-center font-black text-slate-800 dark:text-white text-base sm:text-xl transform hover:-translate-y-1 transition-transform"
              style={{
                boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.12)',
              }}
            >
              {char}
            </div>
          ))}
        </div>

        {/* Floating Alphabet Tiles for KATA */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-5">
          {words.map((char, index) => (
            <div
              key={`word-${index}`}
              className="w-8 h-10 sm:w-10 sm:h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 flex items-center justify-center font-black text-base sm:text-xl transform hover:-translate-y-1 transition-transform"
            >
              {char}
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 mb-8 max-w-sm">
          Petualangan seru bersama huruf dan kata
        </p>

        {/* Call to Action Button */}
        <button
          onClick={handleStart}
          className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-sky-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-lg shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
        >
          <span>Mulai Petualangan</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <span className="mt-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
          Game Edukasi Bahasa Indonesia untuk Anak
        </span>
      </div>
    </div>
  );
};
