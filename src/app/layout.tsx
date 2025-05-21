import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/AuthProvider'; // Import the AuthProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DevOps Digest - Articles on DevOps, Cloud, and Automation',
  description: 'Your daily digest of articles on DevOps, cloud computing, CI/CD, Kubernetes, and more automation topics.',
  keywords: ['devops', 'cloud', 'automation', 'ci/cd', 'kubernetes', 'terraform', 'articles', 'blog'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider> {/* AuthProvider (and thus SessionProvider) now wraps ThemeProvider and everything else */}
          <ThemeProvider
            defaultTheme="system"
            storageKey="devops-digest-theme"
          >
            <div className="flex flex-col min-h-screen">
              <Header /> {/* Header is now a child of AuthProvider */}
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <footer className="py-6 border-t">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                  <p>&copy; {new Date().getFullYear()} DevOps Digest. All rights reserved.</p>
                </div>
              </footer>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
