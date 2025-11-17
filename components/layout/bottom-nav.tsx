'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Globe, Server, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  action?: () => void;
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    {
      label: 'Home',
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: 'Countries',
      href: '/dashboard/countries',
      icon: <Globe className="h-5 w-5" />,
    },
    {
      label: 'Create',
      href: '#',
      icon: <Plus className="h-6 w-6" />,
      action: () => {
        // Open command palette or show quick actions
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
      },
    },
    {
      label: 'Hosts',
      href: '/dashboard/hosts',
      icon: <Server className="h-5 w-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    if (href === '#') {
      return false;
    }
    return pathname?.startsWith(href);
  };

  const handleClick = (item: NavItem) => {
    if (item.action) {
      item.action();
    } else {
      router.push(item.href);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleClick(item)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
              'min-h-[56px] min-w-[64px]', // Touch target size
              isActive(item.href)
                ? 'text-primary'
                : 'text-muted-foreground',
              item.label === 'Create' && 'relative'
            )}
            aria-label={item.label}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {item.label === 'Create' ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                {item.icon}
              </div>
            ) : (
              <>
                {item.icon}
                <span className="text-[10px]">{item.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
