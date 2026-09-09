export type QuestionType =
  | 'letter_pick'
  | 'letter_initial'
  | 'letter_final'
  | 'letter_sequence'
  | 'letter_diff'
  | 'word_pick'
  | 'word_complete'
  | 'word_scramble'
  | 'sentence_blank'
  | 'reading_comprehension'
  | 'reading_true_false';

export interface Question {
  id: string;
  themeId: number;
  themeTitle: string;
  type: QuestionType;
  question: string;
  subtext?: string;
  readingPassage?: string;
  options?: string[];
  scrambleLetters?: string[];
  answer: string;
  feedback: string;
  hintSymbol?: 'book' | 'pencil' | 'alphabet' | 'puzzle' | 'star' | 'card' | 'clock';
}

export interface ThemeInfo {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mechanics: string;
  iconName: string;
  accentColor: string;
  totalQuestions: number;
}

export interface ThemeProgress {
  themeId: number;
  completed: boolean;
  bestScore: number;
  stars: number;
  timesPlayed: number;
  lastPlayedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredMetric: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  darkMode: boolean;
}

export interface GameState {
  themeProgress: Record<number, ThemeProgress>;
  totalScore: number;
  totalXP: number;
  totalStars: number;
  currentStreak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  unlockedAchievements: string[];
  settings: GameSettings;
}

export type ActiveScreen =
  | 'dashboard'
  | 'theme_select'
  | 'gameplay'
  | 'progress'
  | 'achievements'
  | 'settings';
