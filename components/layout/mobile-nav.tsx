'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, Home, Globe, MapPin, Server, Search, BarChart3, History, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
  { label: 'Countries', href: '/dashboard/countries', icon: <Globe className="h-5 w-5" /> },
  { label: 'Regions', href: '/dashboard/regions', icon: <MapPin className="h-5 w-5" /> },
  { label: 'Hosts', href: '/dashboard/hosts', icon: <Server className="h-5 w-5" /> },
  { label: 'Search', href: '/dashboard/search', icon: <Search className="h-5 w-5" /> },
  { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Audit Log', href: '/dashboard/audit', icon: <History className="h-5 w-5" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-5 w-5" /> },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Navigation Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px]">
          <>
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'min-h-[44px]', // Touch target size
                    isActive(item.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </>
        </SheetContent>
      </Sheet>
    </>
  );
}
