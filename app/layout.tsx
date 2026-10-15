import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { RoadmapProvider } from '@/context/RoadmapContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { themeInitScript } from '@/lib/theme/theme-script';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Campus to Career — Whole-Person Student Development & Career Platform',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
            {/* Aurora ambient mesh background */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden>
              <div className="absolute inset-0 bg-gradient-aurora opacity-75" />
              <div className="absolute top-[-15%] left-[-5%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[140px]" />
              <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[25%] w-[500px] h-[500px] rounded-full bg-[var(--chart-3)]/[0.06] blur-[130px]" />
            </div>

            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
