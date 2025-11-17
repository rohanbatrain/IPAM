'use client';

import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DarkModeToggle } from '@/components/theme/dark-mode-toggle';
import { NotificationCenter } from '@/components/ipam/notification-center';
import { Button } from '@/components/ui/button';
import { CommandPalette } from '@/components/layout/command-palette';
import { KeyboardShortcutsHelp } from '@/components/layout/keyboard-shortcuts-help';
import { MobileNav } from '@/components/layout/mobile-nav';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!_hasHydrated) {
      console.log('Waiting for auth store to hydrate...');
      return;
    }

    console.log('Dashboard layout - isAuthenticated:', isAuthenticated, 'user:', user?.username);
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [isAuthenticated, user, router, _hasHydrated]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Command Palette */}
      <CommandPalette />
      
      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-card" role="banner">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Mobile Navigation */}
            <MobileNav />
            
            <h1 className="text-xl font-bold">IPAM</h1>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-4" aria-label="Main navigation">
              <a 
                href="/dashboard" 
                className="text-sm font-medium hover:text-primary"
                aria-current={typeof window !== 'undefined' && window.location.pathname === '/dashboard' ? 'page' : undefined}
              >
                Dashboard
              </a>
              <a 
                href="/dashboard/countries" 
                className="text-sm font-medium hover:text-primary"
                aria-current={typeof window !== 'undefined' && window.location.pathname === '/dashboard/countries' ? 'page' : undefined}
              >
                Countries
              </a>
              <a 
                href="/dashboard/regions" 
                className="text-sm font-medium hover:text-primary"
                aria-current={typeof window !== 'undefined' && window.location.pathname === '/dashboard/regions' ? 'page' : undefined}
              >
                Regions
              </a>
              <a 
                href="/dashboard/hosts" 
                className="text-sm font-medium hover:text-primary"
                aria-current={typeof window !== 'undefined' && window.location.pathname === '/dashboard/hosts' ? 'page' : undefined}
              >
                Hosts
              </a>
              <a 
                href="/dashboard/audit" 
                className="text-sm font-medium hover:text-primary"
                aria-current={typeof window !== 'undefined' && window.location.pathname === '/dashboard/audit' ? 'page' : undefined}
              >
                Audit Log
              </a>
              <a 
                href="/dashboard/settings" 
                className="text-sm font-medium hover:text-primary"
                aria-current={typeof window !== 'undefined' && window.location.pathname === '/dashboard/settings' ? 'page' : undefined}
              >
                Settings
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4" role="toolbar" aria-label="User actions">
            <NotificationCenter />
            <DarkModeToggle />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-muted-foreground" aria-label={`Logged in as ${user?.username}`}>
                {user?.username}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout} aria-label="Logout">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="container mx-auto p-4 md:p-6" role="main">
        {children}
      </main>
      
      {/* Bottom Navigation (Mobile Only) */}
      <BottomNav />
    </div>
  );
}
