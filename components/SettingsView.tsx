'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Music,
  Moon,
  Sun,
  Trash2,
  AlertTriangle,
  Check,
  RotateCcw,
} from 'lucide-react';
import { GameState } from '@/types/game';
import { audio } from '@/lib/audio';

interface SettingsViewProps {
  state: GameState;
  onBack: () => void;
  onUpdateSettings: (updater: (prev: GameState['settings']) => GameState['settings']) => void;
  onResetProgress: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onBack,
  onUpdateSettings,
  onResetProgress,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleToggleSound = () => {
    audio.playButtonClick();
    const next = !state.settings.soundEnabled;
    audio.setSoundEnabled(next);
    onUpdateSettings((prev) => ({ ...prev, soundEnabled: next }));
  };

  const handleToggleMusic = () => {
    audio.playButtonClick();
    const next = !state.settings.musicEnabled;
    audio.setMusicEnabled(next);
    onUpdateSettings((prev) => ({ ...prev, musicEnabled: next }));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audio.setVolume(val);
    onUpdateSettings((prev) => ({ ...prev, volume: val }));
  };

  const handleToggleTheme = (darkMode: boolean) => {
    audio.playButtonClick();
    onUpdateSettings((prev) => ({ ...prev, darkMode }));
  };

  const handleConfirmReset = () => {
    audio.playButtonClick();
    onResetProgress();
    setShowConfirmReset(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 animate-fadeIn">
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
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Preferensi Game
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            PENGATURAN
          </h2>
        </div>
      </div>

      {/* Audio Settings Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-sky-500" />
          <span>Pengaturan Audio &amp; Suara</span>
        </h3>

        {/* Sound Effects Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              Efek Suara (Sound Effects)
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Bunyi klik, jawaban benar, salah, dan pencapaian bintang
            </div>
          </div>
          <button
            onClick={handleToggleSound}
            className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer focus:outline-none ${
              state.settings.soundEnabled ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                state.settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Music Ambient Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              Musik Latar Santai
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Alunan nada lembut Web Audio API penunjang fokus belajar
            </div>
          </div>
          <button
            onClick={handleToggleMusic}
            className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer focus:outline-none ${
              state.settings.musicEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                state.settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Tingkat Volume</span>
            <span>{Math.round(state.settings.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={state.settings.volume}
            onChange={handleVolumeChange}
            className="w-full accent-sky-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Theme Appearance Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          <span>Tema Tampilan</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Light Mode */}
          <button
            onClick={() => handleToggleTheme(false)}
            className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2.5 font-black text-sm transition-all cursor-pointer ${
              !state.settings.darkMode
                ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Mode Terang (Default)</span>
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => handleToggleTheme(true)}
            className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2.5 font-black text-sm transition-all cursor-pointer ${
              state.settings.darkMode
                ? 'border-sky-500 bg-slate-900 text-sky-400 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Moon className="w-5 h-5 text-sky-400" />
            <span>Mode Gelap</span>
          </button>
        </div>
      </div>

      {/* Reset Progress Danger Zone */}
      <div className="p-6 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
          <Trash2 className="w-5 h-5" />
          <h3 className="text-base font-black">Reset Data Game</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Menghapus seluruh skor, bintang, XP, dan pencapaian prestasi dari memori browser lokal perangkat ini.
        </p>

        <button
          onClick={() => {
            audio.playButtonClick();
            setShowConfirmReset(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET SEMUA PROGRES</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6 text-center space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Konfirmasi Reset
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Yakin ingin menghapus seluruh progres? Tindakan ini akan mengembalikan permainan ke kondisi awal.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  audio.playButtonClick();
                  setShowConfirmReset(false);
                }}
                className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                BATAL
              </button>
              <button
                onClick={handleConfirmReset}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition-colors cursor-pointer"
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
