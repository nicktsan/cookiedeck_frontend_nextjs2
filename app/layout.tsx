import { GeistSans } from 'geist/font/sans';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import ReactQueryProvider from '@/providers/ReactQueryProvider';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ReactQueryProvider>
          <main className="flex min-h-screen flex-col">{children}</main>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
