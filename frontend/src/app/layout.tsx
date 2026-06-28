import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DeepGuard — AI Content Detector',
  description: 'Detect deepfakes, AI-generated images, audio, and text instantly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}