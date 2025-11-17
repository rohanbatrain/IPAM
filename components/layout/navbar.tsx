'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DarkModeToggle } from '@/components/theme/dark-mode-toggle';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { UserMenu } from '@/components/layout/user-menu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavbarProps {
  onMenuClick?: () => void;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/countries', label: 'Countries' },
  { href: '/dashboard/regions', label: 'Regions' },
  { href: '/dashboard/hosts', label: 'Hosts' },
  { href: '/dashboard/audit', label: 'Audit Log' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-expanded="false"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Menu</span>
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="IPAM Home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground" aria-hidden="true">
              <span className="text-lg font-bold">IP</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              IPAM
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2" role="toolbar" aria-label="User actions">
          <NotificationCenter />
          <DarkModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
