// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth/session-provider';
import { SidebarNavigation } from '@/components/layout/sidebar-navigation';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LandManager - Hệ thống Quản lý Đất đai',
  description: 'Hệ thống quản lý đất đai với Next.js 15 và TypeScript',
  keywords: ['quản lý đất đai', 'bản đồ địa chính', 'đấu giá đất', 'hệ thống hành chính'],
};

// Auth pages that should not show sidebar
const getIsAuthPage = (pathname: string) => {
  return ['/auth/login', '/auth/register'].includes(pathname);
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster 
              position="top-right"
              richColors
              closeButton
              expand={false}
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(226, 232, 240)',
                  borderRadius: '8px',
                  fontSize: '14px',
                },
                className: 'my-toast',
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// Client component to handle pathname detection
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') {
    // Server-side: render with sidebar by default, will be hydrated correctly
    return <SidebarNavigation>{children}</SidebarNavigation>;
  }

  // Client-side: check current pathname
  const isAuthPage = getIsAuthPage(window.location.pathname);
  
  return isAuthPage ? (
    <>{children}</>
  ) : (
    <SidebarNavigation>{children}</SidebarNavigation>
  );
}