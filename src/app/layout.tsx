import './globals.css';
import type { Metadata } from 'next';

const LOGO_ASSET = '/logo.png?v=20260213';

export const metadata: Metadata = {
  title: "Al Zare' Pottery - قصاري الزارع",
  description: 'Plant pots and planters for homes, gardens, and commercial spaces',
  keywords: 'plant pots, planters, UAE, Dubai, indoor pots, outdoor pots, قصاري الزارع, قصاري',
  icons: {
    icon: LOGO_ASSET,
    shortcut: LOGO_ASSET,
    apple: LOGO_ASSET,
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
