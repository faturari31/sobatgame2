'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Star, RotateCcw, Grid, BarChart3, Award, Sparkles } from 'lucide-react';
import { audio } from '@/lib/audio';
import { calculateStars } from '@/lib/storage';

interface ResultModalProps {
  themeId: number;
  themeTitle: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  isNewRecord: boolean;
  bestScore: number;
  earnedXP: number;
  onPlayAgain: () => void;
  onChooseTheme: () => void;
  onViewProgress: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  themeTitle,
  score,
  correctCount,
  wrongCount,
  isNewRecord,
  bestScore,
  earnedXP,
  onPlayAgain,
  onChooseTheme,
  onViewProgress,
}) => {
  const { stars, label } = calculateStars(score);
  const [animatedStars, setAnimatedStars] = useState(0);

  useEffect(() => {
    // Play celebratory sound
    if (isNewRecord) {
      audio.playNewRecord();
    } else {
      audio.playGameComplete();
    }

    // Sequentially reveal stars with audio chimes
    let starCount = 0;
    const interval = setInterval(() => {
      if (starCount < stars) {
        starCount++;
        setAnimatedStars(starCount);
        audio.playStarEarned(starCount - 1);
      } else {
        clearInterval(interval);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [stars, isNewRecord]);

  const percentage = Math.round((score / 100) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-8 text-center space-y-6 transform scale-100 transition-all">
        {/* Top Celebration Badge */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>🎉 TEMA SELESAI!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {themeTitle}
          </h2>
        </div>

        {/* New Record Banner if beaten */}
        {isNewRecord && (
          <div className="py-1.5 px-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-black text-xs sm:text-sm shadow-md inline-flex items-center gap-1.5 animate-bounce">
            <Trophy className="w-4 h-4 fill-white" />
            <span>🏆 REKOR BARU!</span>
          </div>
        )}

        {/* Stars Display & Tier Label */}
        <div className="space-y-2 py-2">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className={`transition-all duration-300 transform ${
                  idx <= animatedStars
                    ? 'scale-110 text-amber-400'
                    : 'scale-90 text-slate-200 dark:text-slate-700'
                }`}
              >
                <Star
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${
                    idx <= animatedStars ? 'fill-amber-400' : 'fill-none'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 tracking-wide">
            &ldquo;{label}&rdquo;
          </div>
        </div>

        {/* Statistics Card */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/80 text-left">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Skor Akhir</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {score} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">XP Diperoleh</span>
            <div className="text-xl font-black text-sky-600 dark:text-sky-400">
              +{earnedXP} XP
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Jawaban Benar</span>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {correctCount} Soal ({percentage}%)
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Jawaban Salah</span>
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {wrongCount} Soal
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* Main Lagi */}
          <button
            onClick={() => {
              audio.playButtonClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-base shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MAIN LAGI</span>
          </button>

          {/* Pilih Tema */}
          <button
            onClick={() => {
              audio.playButtonClick();
              onChooseTheme();
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Grid className="w-4 h-4 text-sky-500" />
            <span>PILIH TEMA</span>
          </button>

          {/* Lihat Progres */}
          <button
            onClick={() => {
              audio.playButtonClick();
              onViewProgress();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>LIHAT PROGRES</span>
          </button>
        </div>
      </div>
    </div>
  );
};
