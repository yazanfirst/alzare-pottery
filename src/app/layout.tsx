import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Al Zare' Pottery - قصاري الزارع",
  description: 'Plant pots and planters for homes, gardens, and commercial spaces',
  keywords: 'plant pots, planters, UAE, Dubai, indoor pots, outdoor pots, قصاري الزارع, قصاري',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
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
