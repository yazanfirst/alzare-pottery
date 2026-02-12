import './globals.css';
import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-english',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Al Zare\' Pottery - قصاري الزارع',
  description: 'Handcrafted traditional Emirati pottery and ceramics',
  keywords: 'pottery, ceramics, UAE, Dubai, handmade, traditional, planters, قصاري, فخار',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cairo.variable} ${inter.variable} font-english`}>
        {children}
      </body>
    </html>
  );
}
