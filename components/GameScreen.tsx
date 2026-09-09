'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Question } from '@/types/game';
import { audio } from '@/lib/audio';
import { THEMES } from '@/data/themes';

interface QuestionCardProps {
  question: Question;
  isLastQuestion: boolean;
  onAnswer: (isCorrect: boolean, earnedScore: number, earnedXP: number) => void;
  onNext: () => void;
  localStreak: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isLastQuestion,
  onAnswer,
  onNext,
  localStreak,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Scramble letters pool
  const initialPool = useMemo(() => {
    if (question.type === 'word_scramble' && question.scrambleLetters) {
      return question.scrambleLetters.map((char, i) => ({ id: i, char }));
    }
    return [];
  }, [question]);

  const [availableLetters, setAvailableLetters] = useState(initialPool);
  const [placedLetters, setPlacedLetters] = useState<{ id: number; char: string }[]>([]);

  // Handle standard option click
  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    audio.playButtonClick();
    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option.trim().toUpperCase() === question.answer.trim().toUpperCase();
    setIsCorrect(correct);

    let earnedScore = 0;
    let earnedXP = 0;

    if (correct) {
      earnedScore = 10;
      const nextStreak = localStreak + 1;
      earnedXP = 15 + nextStreak * 2;
      audio.playAnswerCorrect();
      if (nextStreak >= 2) {
        setTimeout(() => audio.playStreak(), 280);
      }
    } else {
      audio.playAnswerWrong();
    }

    onAnswer(correct, earnedScore, earnedXP);
  };

  // Susun Kata: Tap a letter from available pool to place in next slot
  const handlePlaceLetter = (item: { id: number; char: string }) => {
    if (isAnswered) return;
    audio.playButtonClick();
    setAvailableLetters((prev) => prev.filter((l) => l.id !== item.id));
    setPlacedLetters((prev) => [...prev, item]);
  };

  // Susun Kata: Tap a placed letter to return it to the pool
  const handleReturnLetter = (item: { id: number; char: string }) => {
    if (isAnswered) return;
    audio.playButtonClick();
    setPlacedLetters((prev) => prev.filter((l) => l.id !== item.id));
    setAvailableLetters((prev) => [...prev, item]);
  };

  // Susun Kata: Reset all letters
  const handleResetLetters = () => {
    if (isAnswered || !question.scrambleLetters) return;
    audio.playButtonClick();
    setAvailableLetters(initialPool);
    setPlacedLetters([]);
  };

  // Susun Kata: Check formed word
  const handleCheckWord = () => {
    if (isAnswered) return;
    const formedWord = placedLetters.map((l) => l.char).join('').toUpperCase();
    if (formedWord.length === 0) return;

    setIsAnswered(true);
    const correct = formedWord === question.answer.toUpperCase();
    setIsCorrect(correct);

    let earnedScore = 0;
    let earnedXP = 0;

    if (correct) {
      earnedScore = 10;
      const nextStreak = localStreak + 1;
      earnedXP = 15 + nextStreak * 2;
      audio.playAnswerCorrect();
      if (nextStreak >= 2) {
        setTimeout(() => audio.playStreak(), 280);
      }
    } else {
      audio.playAnswerWrong();
    }

    onAnswer(correct, earnedScore, earnedXP);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700 shadow-md space-y-6">
      {/* Reading passage if present */}
      {question.readingPassage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 space-y-2">
          <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 text-xs font-extrabold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-sky-500" />
            <span>Bacaan Cerita Pendek</span>
          </div>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
            &ldquo;{question.readingPassage}&rdquo;
          </p>
        </div>
      )}

      {/* Question Prompt */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
          <HelpCircle className="w-4 h-4" />
          <span>Pertanyaan</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
          {question.question}
        </h3>
        {question.subtext && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {question.subtext}
          </p>
        )}
      </div>

      {/* Susun Kata or Multiple Choice */}
      {question.type === 'word_scramble' ? (
        <div className="space-y-6 py-2">
          {/* Target Slots Area */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Susunan Kata:
            </span>
            <div className="flex items-center justify-center gap-2 sm:gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-700 min-h-[76px]">
              {question.scrambleLetters?.map((_, slotIdx) => {
                const placed = placedLetters[slotIdx];
                return (
                  <button
                    key={`slot-${slotIdx}`}
                    disabled={isAnswered || !placed}
                    onClick={() => placed && handleReturnLetter(placed)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center font-black text-xl sm:text-2xl transition-all ${
                      placed
                        ? isAnswered
                          ? isCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                            : 'bg-red-500 text-white border-red-600'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-sky-400 dark:border-sky-500 shadow-sm hover:scale-105 active:scale-95 cursor-pointer'
                        : 'border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40'
                    }`}
                  >
                    {placed ? placed.char : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Letters Pool */}
          {!isAnswered && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Klik huruf untuk menyusun:
                </span>
                {placedLetters.length > 0 && (
                  <button
                    onClick={handleResetLetters}
                    className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Susunan</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {availableLetters.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePlaceLetter(item)}
                    className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white font-black text-xl sm:text-2xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
                  >
                    {item.char}
                  </button>
                ))}
              </div>

              {placedLetters.length === (question.scrambleLetters?.length || 0) && (
                <div className="pt-2 text-center">
                  <button
                    onClick={handleCheckWord}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    Periksa Susunan Kata
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Multiple Choice Options */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
          {question.options?.map((option, optIdx) => {
            const isSelected = selectedOption === option;
            const isOptionCorrect =
              option.trim().toUpperCase() === question.answer.trim().toUpperCase();

            let buttonStyle =
              'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-slate-800';

            if (isAnswered) {
              if (isOptionCorrect) {
                buttonStyle =
                  'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300';
              } else if (isSelected && !isOptionCorrect) {
                buttonStyle =
                  'bg-red-500/10 border-red-400 text-red-700 dark:text-red-300';
              } else {
                buttonStyle =
                  'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={optIdx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`p-4 sm:p-5 rounded-2xl border-2 text-left font-bold text-base sm:text-lg flex items-center justify-between gap-3 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${buttonStyle} ${
                  !isAnswered ? 'hover:scale-[1.01] active:scale-[0.99]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                      isAnswered && isOptionCorrect
                        ? 'bg-white text-emerald-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && (
                  <div className="flex-shrink-0">
                    {isOptionCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : isSelected ? (
                      <XCircle className="w-6 h-6 text-red-500" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Feedback & Next Button */}
      {isAnswered && (
        <div
          className={`p-5 rounded-2xl border transition-all space-y-3 ${
            isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-lg text-emerald-700 dark:text-emerald-300">
                      ✓ BENAR! Hebat!
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-slate-400 text-white flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-lg text-slate-700 dark:text-slate-300">
                      Belum tepat.
                    </span>
                  </div>
                </>
              )}
            </div>

            {isCorrect && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+10 Poin &amp; +XP</span>
              </div>
            )}
          </div>

          <p className="text-sm font-medium leading-relaxed">
            {question.feedback}
          </p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-base shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
            >
              <span>{isLastQuestion ? 'LIHAT HASIL' : 'LANJUT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface GameScreenProps {
  themeId: number;
  questions: Question[];
  currentStreak: number;
  onAnswerQuestion: (isCorrect: boolean, earnedScore: number, earnedXP: number) => void;
  onFinishTheme: (finalScore: number, correctCount: number, wrongCount: number) => void;
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  themeId,
  questions,
  currentStreak,
  onAnswerQuestion,
  onFinishTheme,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionWrong, setSessionWrong] = useState(0);
  const [localStreak, setLocalStreak] = useState(currentStreak);

  const currentQ = questions[currentIndex];
  const themeInfo = useMemo(
    () => THEMES.find((t) => t.id === themeId) || THEMES[0],
    [themeId]
  );

  const handleAnswer = (correct: boolean, earnedScore: number, earnedXP: number) => {
    if (correct) {
      setLocalStreak((prev) => prev + 1);
      setSessionScore((prev) => prev + earnedScore);
      setSessionCorrect((prev) => prev + 1);
    } else {
      setLocalStreak(0);
      setSessionWrong((prev) => prev + 1);
    }
    onAnswerQuestion(correct, earnedScore, earnedXP);
  };

  const handleNext = () => {
    audio.playButtonClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinishTheme(sessionScore, sessionCorrect, sessionWrong);
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => {
              audio.playButtonClick();
              onExit();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          <div className="text-center">
            <span className="text-[10px] sm:text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              TEMA {themeId}: {themeInfo.title}
            </span>
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Soal {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-black text-xs sm:text-sm">
            {sessionScore} Poin
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Streak banner */}
        {localStreak > 1 && (
          <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-extrabold animate-bounce">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>🔥 {localStreak} BENAR BERTURUT-TURUT!</span>
          </div>
        )}
      </div>

      {/* Distinct Keyed Question Card for pure declarative render without setState-in-effect */}
      <QuestionCard
        key={currentQ.id}
        question={currentQ}
        isLastQuestion={currentIndex + 1 === questions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
        localStreak={localStreak}
      />
    </div>
  );
};
