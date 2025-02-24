import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: `Air's Gallery Challenge`,
  description: 'A modern gallery application showcasing beautiful images',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gray-150 min-h-screen antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
