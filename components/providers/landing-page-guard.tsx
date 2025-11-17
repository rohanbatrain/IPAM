'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useServerStore } from '@/lib/store/server-store';
import { useAuthStore } from '@/lib/store/auth-store';

export function LandingPageGuard() {
  const router = useRouter();
  const { isConfigured } = useServerStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Only perform redirects when the server is configured.
    // When the server is not configured, show a user-facing notice below
    // instead of forcing navigation.
    if (isConfigured) {
      // If server is configured but user is not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // If server is configured and user is authenticated, redirect to dashboard
      if (isAuthenticated) {
        router.push('/dashboard');
        return;
      }
    }
  }, [isConfigured, isAuthenticated, router]);

  // If server is not configured, render a friendly notice with a link
  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <h2 className="text-2xl font-semibold mb-2">Server Not Configured</h2>
          <p className="text-sm text-gray-600 mb-4">This instance hasn't been connected to a backend API yet. You can configure the server to continue.</p>
          <div className="flex items-center justify-center gap-3">
            <a href="/server-setup" className="px-4 py-2 bg-yellow-600 text-white rounded-md">Configure Server</a>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}