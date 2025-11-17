'use client';

import { useEffect, useState } from 'react';
import { Command, Zap, Navigation, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts';

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const shortcuts = getKeyboardShortcuts();

  useEffect(() => {
    const handleShowHelp = () => setOpen(true);
    window.addEventListener('show-shortcuts-help', handleShowHelp);
    return () => window.removeEventListener('show-shortcuts-help', handleShowHelp);
  }, []);

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, typeof shortcuts>);

  const categoryConfig = {
    general: {
      label: 'General',
      icon: <Command className="h-4 w-4" />,
      description: 'Global shortcuts available everywhere',
    },
    navigation: {
      label: 'Navigation',
      icon: <Navigation className="h-4 w-4" />,
      description: 'Navigate through the application',
    },
    actions: {
      label: 'Actions',
      icon: <Zap className="h-4 w-4" />,
      description: 'Perform quick actions',
    },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and perform actions quickly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {Object.entries(groupedShortcuts).map(([category, shortcuts]) => {
            const config = categoryConfig[category as keyof typeof categoryConfig];
            
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  {config.icon}
                  <div>
                    <h3 className="font-semibold text-sm">{config.label}</h3>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Press{' '}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
              ?
            </kbd>{' '}
            anytime to view this help dialog, or{' '}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
              ⌘K
            </kbd>{' '}
            to open the command palette.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
