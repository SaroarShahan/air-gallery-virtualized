import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Layout from '@/layouts';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `Air's Gallery Challenge`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-150`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
