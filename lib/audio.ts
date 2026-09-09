/**
 * Centralized Web Audio API Sound Engine for Jelajah Kata
 * 100% client-side, zero external network requests, zero CORS issues, offline-ready.
 */

class AudioManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private volume: number = 0.8;
  private bgmInterval: number | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  public init(soundEnabled = true, musicEnabled = false, volume = 0.8) {
    this.soundEnabled = soundEnabled;
    this.musicEnabled = musicEnabled;
    this.volume = Math.max(0, Math.min(1, volume));

    if (typeof window !== 'undefined' && this.musicEnabled) {
      this.startMusic();
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    try {
      if (!this.ctx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      return this.ctx;
    } catch {
      return null;
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  public isSoundOn(): boolean {
    return this.soundEnabled;
  }

  public isMusicOn(): boolean {
    return this.musicEnabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  // --- SOUND EFFECTS ---

  /** Soft tactile button click */
  public playButtonClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.04);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  /** Menu navigation swoosh/chime */
  public playMenuOpen() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);

      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  /** Sweet uplifting correct answer chime (Major triad) */
  public playAnswerCorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.045;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.23);
      });
    } catch {}
  }

  /** Gentle, encouraging wrong answer feedback (non-punitive) */
  public playAnswerWrong() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [220, 185]; // A3, F#3 soft thud
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.14 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } catch {}
  }

  /** Streak milestone sound */
  public playStreak() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const freqs = [440, 554.37, 659.25, 880];
      const now = ctx.currentTime;

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.2 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.21);
      });
    } catch {}
  }

  /** Star revealed sparkle */
  public playStarEarned(index: number = 0) {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const basePitches = [587.33, 659.25, 783.99, 880, 1046.5]; // D5, E5, G5, A5, C6
      const pitch = basePitches[index % basePitches.length];
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.15);

      gain.gain.setValueAtTime(0.22 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  /** Achievement Unlocked triumphant chime */
  public playAchievement() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      const now = ctx.currentTime;

      arpeggio.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.22 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.42);
      });
    } catch {}
  }

  /** Theme Completion fan celebration */
  public playGameComplete() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const chords = [
        [523.25, 659.25, 783.99],
        [587.33, 739.99, 880],
        [659.25, 830.61, 987.77],
        [783.99, 987.77, 1174.66, 1567.98],
      ];
      const now = ctx.currentTime;

      chords.forEach((chord, i) => {
        const start = now + i * 0.14;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime((0.14 / chord.length) * this.volume, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + (i === 3 ? 0.6 : 0.22));

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + (i === 3 ? 0.65 : 0.25));
        });
      });
    } catch {}
  }

  /** New High Score bell */
  public playNewRecord() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const melody = [659.25, 783.99, 987.77, 1318.51];
      const now = ctx.currentTime;

      melody.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.24 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.46);
      });
    } catch {}
  }

  // --- BACKGROUND AMBIENT MUSIC (Synthesized Peaceful Chimes) ---

  private startMusic() {
    this.stopMusic();
    if (!this.musicEnabled) return;

    const pentatonicScale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C, D, E, G, A, C
    let step = 0;

    const tick = () => {
      if (!this.musicEnabled) return;
      const ctx = this.getContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;
        const note = pentatonicScale[step % pentatonicScale.length];
        step++;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now);

        // Very quiet, gentle ambient bell
        const targetGain = 0.035 * this.volume;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(targetGain, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.25);
      } catch {}
    };

    tick();
    this.bgmInterval = window.setInterval(tick, 1400);
  }

  private stopMusic() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audio = new AudioManager();
