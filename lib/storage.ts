import { GameState, ThemeProgress } from '@/types/game';

const STORAGE_KEY = 'jelajah_kata_gamestate_v1';

export function calculateStars(score: number): { stars: number; label: string } {
  if (score >= 90) return { stars: 5, label: 'LUAR BIASA!' };
  if (score >= 70) return { stars: 4, label: 'HEBAT!' };
  if (score >= 50) return { stars: 3, label: 'BAGUS!' };
  if (score >= 30) return { stars: 2, label: 'TERUS SEMANGAT!' };
  return { stars: 1, label: 'AYO COBA LAGI!' };
}

export function getDefaultGameState(): GameState {
  const initialThemes: Record<number, ThemeProgress> = {};
  for (let i = 1; i <= 5; i++) {
    initialThemes[i] = {
      themeId: i,
      completed: false,
      bestScore: 0,
      stars: 0,
      timesPlayed: 0,
    };
  }

  return {
    themeProgress: initialThemes,
    totalScore: 0,
    totalXP: 0,
    totalStars: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    unlockedAchievements: [],
    settings: {
      soundEnabled: true,
      musicEnabled: false,
      volume: 0.8,
      darkMode: false,
    },
  };
}

export function loadGameState(): GameState {
  if (typeof window === 'undefined') return getDefaultGameState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultGameState();

    const parsed = JSON.parse(raw) as Partial<GameState>;
    const defaultState = getDefaultGameState();

    // Merge safely with default state
    const themeProgress = { ...defaultState.themeProgress, ...(parsed.themeProgress || {}) };
    const settings = { ...defaultState.settings, ...(parsed.settings || {}) };

    // Calculate sum of best scores and stars
    let totalScore = 0;
    let totalStars = 0;
    Object.values(themeProgress).forEach((tp) => {
      totalScore += tp.bestScore || 0;
      totalStars += tp.stars || 0;
    });

    return {
      themeProgress,
      totalScore,
      totalXP: parsed.totalXP || 0,
      totalStars,
      currentStreak: parsed.currentStreak || 0,
      bestStreak: parsed.bestStreak || 0,
      totalAnswered: parsed.totalAnswered || 0,
      totalCorrect: parsed.totalCorrect || 0,
      unlockedAchievements: parsed.unlockedAchievements || [],
      settings,
    };
  } catch (e) {
    console.error('Error loading game state:', e);
    return getDefaultGameState();
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving game state:', e);
  }
}

export function resetGameState(): GameState {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  return getDefaultGameState();
}

/** Check achievement triggers and return newly unlocked IDs */
export function checkAchievements(state: GameState): string[] {
  const newlyUnlocked: string[] = [];
  const current = new Set(state.unlockedAchievements);

  // 1. LANGKAH_PERTAMA: Selesaikan tema pertama
  const completedThemes = Object.values(state.themeProgress).filter((t) => t.completed).length;
  if (completedThemes >= 1 && !current.has('LANGKAH_PERTAMA')) {
    newlyUnlocked.push('LANGKAH_PERTAMA');
  }

  // 2. PENJELAJAH_KATA: Selesaikan 3 tema
  if (completedThemes >= 3 && !current.has('PENJELAJAH_KATA')) {
    newlyUnlocked.push('PENJELAJAH_KATA');
  }

  // 3. AHLI_KATA: Selesaikan semua 5 tema
  if (completedThemes >= 5 && !current.has('AHLI_KATA')) {
    newlyUnlocked.push('AHLI_KATA');
  }

  // 4. KOLEKTOR_BINTANG: Kumpulkan 15 bintang
  if (state.totalStars >= 15 && !current.has('KOLEKTOR_BINTANG')) {
    newlyUnlocked.push('KOLEKTOR_BINTANG');
  }

  // 5. STREAK_MASTER: Streak 5 berturut-turut
  if (state.bestStreak >= 5 && !current.has('STREAK_MASTER')) {
    newlyUnlocked.push('STREAK_MASTER');
  }

  // 6. PEMBACA_HEBAT: Selesaikan tema 5
  const theme5 = state.themeProgress[5];
  if (theme5 && theme5.completed && !current.has('PEMBACA_HEBAT')) {
    newlyUnlocked.push('PEMBACA_HEBAT');
  }

  // 7. NILAI_SEMPURNA: Raih skor 100 pada salah satu tema
  const hasPerfect = Object.values(state.themeProgress).some((t) => t.bestScore >= 100);
  if (hasPerfect && !current.has('NILAI_SEMPURNA')) {
    newlyUnlocked.push('NILAI_SEMPURNA');
  }

  // 8. PENELITI_KATA: Selesaikan 50 soal
  if (state.totalAnswered >= 50 && !current.has('PENELITI_KATA')) {
    newlyUnlocked.push('PENELITI_KATA');
  }

  return newlyUnlocked;
}
