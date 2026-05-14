import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'TX Intelligent | Predictive Intelligence',
  description: 'Real-time Trading Intelligence Dashboard',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-bg text-white overflow-hidden">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}