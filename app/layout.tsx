import '@/styles/globals.css';
import type { Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { Body } from '@/app/layout.client';
import { Providers } from './providers';
import { AISearchTrigger } from '@/components/fumadocs/ai';
import { MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';

export const metadata = createMetadata({
  title: {
    template: '%s | Meeting BaaS',
    default: 'Meeting BaaS',
  },
  description: 'Deploy AI for video meetings through a single unified API.',
  metadataBase: baseUrl,
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <Body>
        <Providers>
          {children}
          <AISearchTrigger>
            <MessageCircle className="size-4" />
            Ask AI
          </AISearchTrigger>
        </Providers>
      </Body>
    </html>
  );
}
