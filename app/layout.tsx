import type { Metadata } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { RoadmapProvider } from '@/context/RoadmapContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { themeInitScript } from '@/lib/theme/theme-script';
import { ToastProvider } from '@/components/ui/Toast';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  applicationName: 'Campus to Career',
  title: {
    default: 'Campus to Career',
    template: '%s · Campus to Career',
  },
  description:
    'A unified platform guiding collegiate students from first year through graduation: technical mastery, talent discovery, personalized dual-lane roadmaps, curated resources, campus activities, and placement tracking.',
  keywords: [
    'Campus to Career',
    'Student Development',
    'Placement Preparation',
    'Career Roadmap',
    'Whole Person Development',
    'Talent Discovery',
    'College Clubs',
    'Internship Tracker',
    'Skill Gap Analysis',
  ],
  icons: {
    // Prefer generated static /icon + /apple-icon (app/icon.tsx) — no live theme swap
    icon: [{ url: '/icon', type: 'image/png' }],
    apple: [{ url: '/apple-icon', type: 'image/png' }],
    shortcut: ['/icon'],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* ── Zero-FOUC Blocking Theme Initializer ── */}
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-bg text-text-primary selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <AuthProvider>
          <RoadmapProvider>
            <div className="ambient-bg" aria-hidden />

            <Navbar />

            <main className="flex-1 w-full min-w-0 max-w-7xl mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              {children}
            </main>

            <Footer />
            <ToastProvider />
          </RoadmapProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
