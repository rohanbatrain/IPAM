'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Globe,
  MapPin,
  Server,
  Map,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/countries', label: 'Countries', icon: Globe },
  { href: '/dashboard/regions', label: 'Regions', icon: MapPin },
  { href: '/dashboard/hosts', label: 'Hosts', icon: Server },
  { href: '/dashboard/map', label: 'Map View', icon: Map },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/audit', label: 'Audit Log', icon: FileText },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
      role="complementary"
      aria-label="Sidebar navigation"
    >
      {/* Collapse Toggle */}
      <div className="flex h-16 items-center justify-end border-b px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </span>
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-2" aria-label="Main navigation">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && <span className="sr-only">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t p-4" role="contentinfo">
          <p className="text-xs text-muted-foreground">
            IPAM v1.0.0
          </p>
        </div>
      )}
    </aside>
  );
}
