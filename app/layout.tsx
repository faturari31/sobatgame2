import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Jelajah Kata - Petualangan Seru Bersama Huruf dan Kata',
  description: 'Game edukasi anak Bahasa Indonesia premium bersama sobat game untuk menjelajahi huruf dan kata secara interaktif.',
  openGraph: {
    title: 'Jelajah Kata - Petualangan Seru Bersama Huruf dan Kata',
    description: 'Game edukasi anak Bahasa Indonesia premium bersama sobat game untuk menjelajahi huruf dan kata secara interaktif.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jelajah Kata - Petualangan Seru Bersama Huruf dan Kata',
    description: 'Game edukasi anak Bahasa Indonesia premium bersama sobat game untuk menjelajahi huruf dan kata secara interaktif.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
