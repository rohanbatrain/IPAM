'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useServerStore } from '@/lib/store/server-store';

interface ServerGuardProps {
  children: React.ReactNode;
}

export function ServerGuard({ children }: ServerGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isConfigured } = useServerStore();
  const _hasHydrated = useServerStore((s: any) => s._hasHydrated);

  useEffect(() => {
    // During initial render pathname may be empty; avoid making redirect decisions
    // until we have a defined pathname and the server store has hydrated.
    if (!pathname || !_hasHydrated) return;

    // We intentionally do NOT perform automatic navigation here. Redirects
    // should be user-initiated to avoid unwanted navigations caused by
    // prefetches or hydration races. The render path below will show a
    // full-screen notice for unconfigured instances on guarded pages.
    // Keep effect around for observability in case we want to add analytics.
  }, [isConfigured, router, pathname, _hasHydrated]);

  // If store hasn't hydrated yet, don't block rendering.
  if (!_hasHydrated) return null;

  // If server is not configured and this is a guarded page, render a
  // non-disruptive full-screen notice (no automatic redirect). The user can
  // explicitly navigate to `/server-setup` using the button below.
  if (
    !isConfigured &&
    pathname !== '/' &&
    pathname !== '/server-setup' &&
    !pathname.startsWith('/download') &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/signup')
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <h2 className="text-2xl font-semibold mb-2">Server Not Configured</h2>
          <p className="text-sm text-gray-600 mb-4">This instance hasn't been connected to a backend API yet. Configure the server to continue.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => router.push('/server-setup')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md"
            >
              Configure Server
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}