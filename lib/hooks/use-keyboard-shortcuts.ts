'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUIStore } from '@/lib/store/ui-store';

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'general';
  modifiers?: {
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
  };
  // Conditions for when the shortcut should be active
  condition?: () => boolean;
}

export function useKeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const { openCommandPalette } = useUIStore();

  const shortcuts: KeyboardShortcut[] = [
    // General shortcuts
    {
      key: 'k',
      description: 'Open command palette',
      action: () => openCommandPalette(),
      category: 'general',
      modifiers: { meta: true, ctrl: true }, // Cmd+K or Ctrl+K
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts help',
      action: () => {
        window.dispatchEvent(new CustomEvent('show-shortcuts-help'));
      },
      category: 'general',
      modifiers: { shift: true },
    },
    {
      key: 's',
      description: 'Focus search',
      action: () => {
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="search"], input[placeholder*="search" i]'
        );
        if (searchInput) {
          searchInput.focus();
        } else {
          router.push('/search');
        }
      },
      category: 'navigation',
    },
    // Action shortcuts (context-dependent)
    {
      key: 'c',
      description: 'Create region',
      action: () => router.push('/regions/create'),
      category: 'actions',
      condition: () => pathname?.startsWith('/regions') || pathname === '/',
    },
    {
      key: 'h',
      description: 'Allocate host',
      action: () => router.push('/hosts/create'),
      category: 'actions',
      condition: () => pathname?.startsWith('/hosts') || pathname === '/',
    },
    // Navigation shortcuts
    {
      key: 'd',
      description: 'Go to dashboard',
      action: () => router.push('/'),
      category: 'navigation',
      modifiers: { meta: true, ctrl: true },
    },
    {
      key: 'g',
      description: 'Go to countries',
      action: () => router.push('/countries'),
      category: 'navigation',
      modifiers: { shift: true },
      condition: () => {
        // Only active when followed by 'c'
        return false; // Handled separately
      },
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Exception: Allow Cmd+K / Ctrl+K even in inputs
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          openCommandPalette();
        }
        return;
      }

      // Find matching shortcut
      for (const shortcut of shortcuts) {
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const modifiersMatch =
          (!shortcut.modifiers?.ctrl || e.ctrlKey) &&
          (!shortcut.modifiers?.meta || e.metaKey) &&
          (!shortcut.modifiers?.shift || e.shiftKey) &&
          (!shortcut.modifiers?.alt || e.altKey);

        // Check if no extra modifiers are pressed (unless specified)
        const noExtraModifiers =
          (shortcut.modifiers?.ctrl || !e.ctrlKey) &&
          (shortcut.modifiers?.meta || !e.metaKey) &&
          (shortcut.modifiers?.shift || !e.shiftKey) &&
          (shortcut.modifiers?.alt || !e.altKey);

        if (keyMatches && modifiersMatch && noExtraModifiers) {
          // Check condition if specified
          if (shortcut.condition && !shortcut.condition()) {
            continue;
          }

          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, pathname, openCommandPalette, shortcuts]);

  return { shortcuts };
}

// Export shortcuts for help modal
export function getKeyboardShortcuts(): KeyboardShortcut[] {
  return [
    {
      key: '⌘K / Ctrl+K',
      description: 'Open command palette',
      action: () => {},
      category: 'general',
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts help',
      action: () => {},
      category: 'general',
    },
    {
      key: 'S',
      description: 'Focus search',
      action: () => {},
      category: 'navigation',
    },
    {
      key: 'C',
      description: 'Create region (on regions page)',
      action: () => {},
      category: 'actions',
    },
    {
      key: 'H',
      description: 'Allocate host (on hosts page)',
      action: () => {},
      category: 'actions',
    },
    {
      key: '↑ / ↓',
      description: 'Navigate table rows',
      action: () => {},
      category: 'navigation',
    },
    {
      key: '← / →',
      description: 'Navigate table columns',
      action: () => {},
      category: 'navigation',
    },
    {
      key: 'Enter',
      description: 'Select / Open item',
      action: () => {},
      category: 'actions',
    },
    {
      key: 'Space',
      description: 'Toggle checkbox selection',
      action: () => {},
      category: 'actions',
    },
    {
      key: 'Esc',
      description: 'Close dialog / Clear selection',
      action: () => {},
      category: 'general',
    },
  ];
}
