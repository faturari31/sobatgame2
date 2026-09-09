'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { SplashScreen } from '@/components/SplashScreen';
import { DashboardView } from '@/components/DashboardView';
import { ThemeSelectView } from '@/components/ThemeSelectView';
import { GameScreen } from '@/components/GameScreen';
import { ResultModal } from '@/components/ResultModal';
import { AchievementsView } from '@/components/AchievementsView';
import { ProgressView } from '@/components/ProgressView';
import { SettingsView } from '@/components/SettingsView';
import { AchievementToast } from '@/components/AchievementToast';

import {
  GameState,
  ActiveScreen,
  Achievement,
} from '@/types/game';
import {
  loadGameState,
  saveGameState,
  resetGameState,
  calculateStars,
  checkAchievements,
} from '@/lib/storage';
import { audio } from '@/lib/audio';
import { QUESTIONS } from '@/data/questions';
import { THEMES } from '@/data/themes';
import { ACHIEVEMENTS } from '@/data/achievements';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(loadGameState);
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('dashboard');
  const [showSplash, setShowSplash] = useState(true);

  // Active theme gameplay state
  const [activeThemeId, setActiveThemeId] = useState<number>(1);
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);

  // Results modal state
  const [resultData, setResultData] = useState<{
    show: boolean;
    themeId: number;
    themeTitle: string;
    score: number;
    correctCount: number;
    wrongCount: number;
    isNewRecord: boolean;
    bestScore: number;
    earnedXP: number;
  } | null>(null);

  // Initialize audio settings on mount
  useEffect(() => {
    audio.init(
      gameState.settings.soundEnabled,
      gameState.settings.musicEnabled,
      gameState.settings.volume
    );
  }, [gameState.settings.soundEnabled, gameState.settings.musicEnabled, gameState.settings.volume]);

  // Save game state changes to localStorage
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Sync Dark Mode class with HTML root
  useEffect(() => {
    if (gameState.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [gameState.settings.darkMode]);

  // Handle Question Answered in Gameplay
  const handleAnswerQuestion = (
    isCorrect: boolean,
    earnedScore: number,
    earnedXP: number
  ) => {
    setGameState((prev) => {
      if (!prev) return prev;

      const nextStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const nextBestStreak = Math.max(prev.bestStreak, nextStreak);
      const nextAnswered = prev.totalAnswered + 1;
      const nextCorrect = isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect;
      const nextXP = prev.totalXP + earnedXP;

      const updated: GameState = {
        ...prev,
        currentStreak: nextStreak,
        bestStreak: nextBestStreak,
        totalAnswered: nextAnswered,
        totalCorrect: nextCorrect,
        totalXP: nextXP,
      };

      // Check for mid-game achievements like STREAK_MASTER or PENELITI_KATA
      const newAchIds = checkAchievements(updated);
      if (newAchIds.length > 0) {
        updated.unlockedAchievements = [
          ...updated.unlockedAchievements,
          ...newAchIds,
        ];

        const firstAch = ACHIEVEMENTS.find((a) => a.id === newAchIds[0]);
        if (firstAch) {
          setActiveToast(firstAch);
        }
      }

      return updated;
    });
  };

  // Handle Finishing a 10-Question Theme
  const handleFinishTheme = (
    finalScore: number,
    correctCount: number,
    wrongCount: number
  ) => {
    if (!gameState) return;

    const currentThemeProgress = gameState.themeProgress[activeThemeId] || {
      themeId: activeThemeId,
      completed: false,
      bestScore: 0,
      stars: 0,
      timesPlayed: 0,
    };

    const isNewRecord = finalScore > currentThemeProgress.bestScore;
    const newBestScore = Math.max(currentThemeProgress.bestScore, finalScore);
    const { stars: newStars } = calculateStars(newBestScore);

    const updatedThemeProgress = {
      ...gameState.themeProgress,
      [activeThemeId]: {
        themeId: activeThemeId,
        completed: true,
        bestScore: newBestScore,
        stars: newStars,
        timesPlayed: (currentThemeProgress.timesPlayed || 0) + 1,
        lastPlayedAt: new Date().toISOString(),
      },
    };

    // Calculate total score and stars
    let totalScore = 0;
    let totalStars = 0;
    Object.values(updatedThemeProgress).forEach((tp) => {
      totalScore += tp.bestScore;
      totalStars += tp.stars;
    });

    const updatedState: GameState = {
      ...gameState,
      themeProgress: updatedThemeProgress,
      totalScore,
      totalStars,
    };

    // Check newly unlocked achievements
    const newlyUnlocked = checkAchievements(updatedState);
    if (newlyUnlocked.length > 0) {
      updatedState.unlockedAchievements = [
        ...updatedState.unlockedAchievements,
        ...newlyUnlocked,
      ];
      const ach = ACHIEVEMENTS.find((a) => a.id === newlyUnlocked[0]);
      if (ach) {
        setActiveToast(ach);
      }
    }

    setGameState(updatedState);

    const theme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0];
    const earnedXP = correctCount * 15;

    setResultData({
      show: true,
      themeId: activeThemeId,
      themeTitle: theme.title,
      score: finalScore,
      correctCount,
      wrongCount,
      isNewRecord,
      bestScore: newBestScore,
      earnedXP,
    });
  };

  // Quick Play: Find first uncompleted theme or theme with lowest score
  const handleQuickPlay = () => {
    if (!gameState) return;
    const uncompleted = THEMES.find(
      (t) => !gameState.themeProgress[t.id]?.completed
    );

    const targetThemeId = uncompleted ? uncompleted.id : 1;
    setActiveThemeId(targetThemeId);
    setCurrentScreen('gameplay');
  };

  const handleSelectTheme = (themeId: number) => {
    setActiveThemeId(themeId);
    setCurrentScreen('gameplay');
  };

  const handleUpdateSettings = (
    updater: (prev: GameState['settings']) => GameState['settings']
  ) => {
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        settings: updater(prev.settings),
      };
    });
  };

  const handleResetProgress = () => {
    const fresh = resetGameState();
    setGameState(fresh);
    audio.init(
      fresh.settings.soundEnabled,
      fresh.settings.musicEnabled,
      fresh.settings.volume
    );
  };

  // Questions for active theme
  const activeQuestions = useMemo(() => {
    return QUESTIONS.filter((q) => q.themeId === activeThemeId);
  }, [activeThemeId]);

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 animate-spin flex items-center justify-center text-white font-black">
            JK
          </div>
          <span className="text-sm font-bold text-sky-700 dark:text-sky-300">
            Menyiapkan Jelajah Kata...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onDismiss={() => setShowSplash(false)} />
      )}

      {/* Global Navigation Bar */}
      <Navbar
        state={gameState}
        onUpdateSettings={handleUpdateSettings}
        onNavigate={(screen) => {
          setResultData(null);
          setCurrentScreen(screen);
        }}
        currentScreen={currentScreen}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {currentScreen === 'dashboard' && (
          <DashboardView
            state={gameState}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onQuickPlay={handleQuickPlay}
          />
        )}

        {currentScreen === 'theme_select' && (
          <ThemeSelectView
            state={gameState}
            onSelectTheme={handleSelectTheme}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'gameplay' && (
          <GameScreen
            key={`theme-${activeThemeId}`}
            themeId={activeThemeId}
            questions={activeQuestions}
            currentStreak={gameState.currentStreak}
            onAnswerQuestion={handleAnswerQuestion}
            onFinishTheme={handleFinishTheme}
            onExit={() => setCurrentScreen('theme_select')}
          />
        )}

        {currentScreen === 'progress' && (
          <ProgressView
            state={gameState}
            onBack={() => setCurrentScreen('dashboard')}
            onSelectTheme={handleSelectTheme}
          />
        )}

        {currentScreen === 'achievements' && (
          <AchievementsView
            state={gameState}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsView
            state={gameState}
            onBack={() => setCurrentScreen('dashboard')}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Theme Complete Result Modal */}
      {resultData && (
        <ResultModal
          themeId={resultData.themeId}
          themeTitle={resultData.themeTitle}
          score={resultData.score}
          correctCount={resultData.correctCount}
          wrongCount={resultData.wrongCount}
          isNewRecord={resultData.isNewRecord}
          bestScore={resultData.bestScore}
          earnedXP={resultData.earnedXP}
          onPlayAgain={() => {
            setResultData(null);
            setCurrentScreen('gameplay');
          }}
          onChooseTheme={() => {
            setResultData(null);
            setCurrentScreen('theme_select');
          }}
          onViewProgress={() => {
            setResultData(null);
            setCurrentScreen('progress');
          }}
        />
      )}

      {/* Achievement Unlocked Floating Toast */}
      {activeToast && (
        <AchievementToast
          achievement={activeToast}
          onClose={() => setActiveToast(null)}
        />
      )}

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-sky-600 dark:text-sky-400">JELAJAH KATA</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400">sobat game</span>
          </div>
          <p>Game edukasi anak interaktif Bahasa Indonesia • 100% Offline &amp; Client-Side</p>
        </div>
      </footer>
    </div>
  );
}
