'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useServerStore } from '@/lib/store/server-store';
import { useAuthStore } from '@/lib/store/auth-store';

interface SmartLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function SmartLink({ href, children, onClick, ...props }: SmartLinkProps) {
  const router = useRouter();
  const { isConfigured } = useServerStore();
  const { isAuthenticated } = useAuthStore();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Special case: if href is /login, always go to login (for landing page)
    if (href === '/login') {
      router.push('/login');
      if (onClick) onClick(e);
      return;
    }

    // If server is not configured, ask the user before navigating to setup
    if (!isConfigured) {
      const go = typeof window !== 'undefined' && window.confirm('Server is not configured. Go to server setup?');
      if (go) {
        router.push('/server-setup');
      }
      return;
    }

    // If server is configured but user is not authenticated, go to login
    if (isConfigured && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // If server is configured and user is authenticated, go to dashboard
    if (isConfigured && isAuthenticated) {
      router.push('/dashboard');
      return;
    }

    // Fallback to original href
    router.push(href);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}