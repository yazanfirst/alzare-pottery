import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Al Zare' Pottery - قصاري الزارع",
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
      <body className="font-english">{children}</body>
    </html>
  );
}
