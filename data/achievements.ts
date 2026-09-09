import { Achievement } from '@/types/game';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'LANGKAH_PERTAMA',
    title: 'Langkah Pertama',
    description: 'Menyelesaikan petualangan tema pertamamu dengan baik.',
    icon: 'compass',
    requiredMetric: 'Selesaikan 1 tema',
  },
  {
    id: 'PENJELAJAH_KATA',
    title: 'Penjelajah Kata',
    description: 'Berhasil menjelajahi dan menuntaskan 3 tema yang berbeda.',
    icon: 'map',
    requiredMetric: 'Selesaikan 3 tema',
  },
  {
    id: 'AHLI_KATA',
    title: 'Ahli Kata',
    description: 'Luar biasa! Berhasil menuntaskan seluruh 5 tema Jelajah Kata.',
    icon: 'crown',
    requiredMetric: 'Selesaikan semua 5 tema',
  },
  {
    id: 'KOLEKTOR_BINTANG',
    title: 'Kolektor Bintang',
    description: 'Mengumpulkan 15 bintang emas dari petualangan belajarmu.',
    icon: 'star',
    requiredMetric: 'Kumpulkan 15 bintang',
  },
  {
    id: 'STREAK_MASTER',
    title: 'Streak Master',
    description: 'Mencapai rekor 5 jawaban benar berturut-turut tanpa salah!',
    icon: 'flame',
    requiredMetric: 'Raih 5 streak berturut-turut',
  },
  {
    id: 'PEMBACA_HEBAT',
    title: 'Pembaca Hebat',
    description: 'Menyelesaikan Tema Membaca & Memahami dengan ketelitian tinggi.',
    icon: 'book-open',
    requiredMetric: 'Tuntaskan Tema 5',
  },
  {
    id: 'NILAI_SEMPURNA',
    title: 'Nilai Sempurna',
    description: 'Meraih skor sempurna 100 poin pada salah satu tema.',
    icon: 'medal',
    requiredMetric: 'Raih skor 100 di satu tema',
  },
  {
    id: 'PENELITI_KATA',
    title: 'Peneliti Kata',
    description: 'Menjawab lengkap seluruh 50 soal di seluruh tema!',
    icon: 'award',
    requiredMetric: 'Selesaikan 50 soal',
  },
];
