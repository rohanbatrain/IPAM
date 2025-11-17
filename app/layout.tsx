import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ServerGuard } from '@/components/providers/server-guard';
import { ApiInitializer } from '@/components/providers/api-initializer';
import { WebVitalsProvider } from '@/components/providers/web-vitals-provider';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IPAM - IP Address Management',
  description: 'Hierarchical IP Address Management System for 10.X.Y.Z address space',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <ThemeProvider>
            <ServerGuard>
              <ApiInitializer />
              <WebVitalsProvider />
              {children}
              <Toaster position="top-right" richColors />
            </ServerGuard>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
