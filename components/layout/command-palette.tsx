'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Globe,
  MapPin,
  Server,
  Plus,
  FileSearch,
  BarChart3,
  History,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/lib/store/ui-store';
import { cn } from '@/lib/utils/cn';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
  category: 'navigation' | 'actions' | 'help';
  shortcut?: string;
}

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, closeCommandPalette } = useUIStore();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Define all available commands
  const commands: Command[] = [
    // Navigation commands
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      description: 'Go to dashboard',
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => router.push('/'),
      keywords: ['home', 'overview', 'stats'],
      category: 'navigation',
    },
    {
      id: 'nav-countries',
      label: 'Countries',
      description: 'View all countries',
      icon: <Globe className="h-4 w-4" />,
      action: () => router.push('/countries'),
      keywords: ['country', 'continent'],
      category: 'navigation',
    },
    {
      id: 'nav-regions',
      label: 'Regions',
      description: 'View all regions',
      icon: <MapPin className="h-4 w-4" />,
      action: () => router.push('/regions'),
      keywords: ['region', 'cidr'],
      category: 'navigation',
    },
    {
      id: 'nav-hosts',
      label: 'Hosts',
      description: 'View all hosts',
      icon: <Server className="h-4 w-4" />,
      action: () => router.push('/hosts'),
      keywords: ['host', 'ip', 'allocation'],
      category: 'navigation',
    },
    {
      id: 'nav-search',
      label: 'Search',
      description: 'Advanced search',
      icon: <FileSearch className="h-4 w-4" />,
      action: () => router.push('/search'),
      keywords: ['find', 'filter'],
      category: 'navigation',
    },
    {
      id: 'nav-analytics',
      label: 'Analytics',
      description: 'View analytics and reports',
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => router.push('/analytics'),
      keywords: ['charts', 'reports', 'utilization'],
      category: 'navigation',
    },
    {
      id: 'nav-audit',
      label: 'Audit Log',
      description: 'View audit history',
      icon: <History className="h-4 w-4" />,
      action: () => router.push('/audit'),
      keywords: ['history', 'changes', 'log'],
      category: 'navigation',
    },
    {
      id: 'nav-settings',
      label: 'Settings',
      description: 'Application settings',
      icon: <Settings className="h-4 w-4" />,
      action: () => router.push('/settings'),
      keywords: ['preferences', 'config'],
      category: 'navigation',
    },
    // Action commands
    {
      id: 'action-create-region',
      label: 'Create Region',
      description: 'Create a new region',
      icon: <Plus className="h-4 w-4" />,
      action: () => router.push('/regions/create'),
      keywords: ['new', 'add'],
      category: 'actions',
      shortcut: 'C',
    },
    {
      id: 'action-allocate-host',
      label: 'Allocate Host',
      description: 'Allocate a new host',
      icon: <Plus className="h-4 w-4" />,
      action: () => router.push('/hosts/create'),
      keywords: ['new', 'add', 'ip'],
      category: 'actions',
      shortcut: 'H',
    },
    {
      id: 'action-batch-hosts',
      label: 'Batch Allocate Hosts',
      description: 'Allocate multiple hosts',
      icon: <Plus className="h-4 w-4" />,
      action: () => router.push('/hosts/batch'),
      keywords: ['bulk', 'multiple'],
      category: 'actions',
    },
    // Help commands
    {
      id: 'help-shortcuts',
      label: 'Keyboard Shortcuts',
      description: 'View all keyboard shortcuts',
      icon: <HelpCircle className="h-4 w-4" />,
      action: () => {
        closeCommandPalette();
        // This will be handled by the keyboard shortcuts help modal
        window.dispatchEvent(new CustomEvent('show-shortcuts-help'));
      },
      keywords: ['help', 'keys'],
      category: 'help',
      shortcut: '?',
    },
  ];

  // Fuzzy search implementation
  const fuzzyMatch = (text: string, search: string): boolean => {
    const searchLower = search.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Exact match
    if (textLower.includes(searchLower)) return true;
    
    // Fuzzy match - check if all characters appear in order
    let searchIndex = 0;
    for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
      if (textLower[i] === searchLower[searchIndex]) {
        searchIndex++;
      }
    }
    return searchIndex === searchLower.length;
  };

  // Filter commands based on search
  const filteredCommands = commands.filter((command) => {
    if (!search) return true;
    
    const searchableText = [
      command.label,
      command.description || '',
      ...(command.keywords || []),
    ].join(' ');
    
    return fuzzyMatch(searchableText, search);
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  // Handle command execution
  const executeCommand = useCallback((command: Command) => {
    command.action();
    closeCommandPalette();
    setSearch('');
    setSelectedIndex(0);
  }, [closeCommandPalette]);

  // Keyboard navigation
  useEffect(() => {
    if (!commandPaletteOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => 
          Math.min(prev + 1, filteredCommands.length - 1)
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        closeCommandPalette();
        setSearch('');
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, filteredCommands, selectedIndex, executeCommand, closeCommandPalette]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Global keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (commandPaletteOpen) {
          closeCommandPalette();
        } else {
          useUIStore.getState().openCommandPalette();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [commandPaletteOpen, closeCommandPalette]);

  const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    help: 'Help',
  };

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={closeCommandPalette}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0"
            autoFocus
          />
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">ESC</span>
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No commands found
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category} className="mb-4 last:mb-0">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </div>
                <div className="space-y-1">
                  {cmds.map((command, index) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    const isSelected = globalIndex === selectedIndex;
                    
                    return (
                      <button
                        key={command.id}
                        onClick={() => executeCommand(command)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={cn(
                          'w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          isSelected && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <div className="flex-shrink-0">{command.icon}</div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{command.label}</div>
                          {command.description && (
                            <div className="text-xs text-muted-foreground">
                              {command.description}
                            </div>
                          )}
                        </div>
                        {command.shortcut && (
                          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            {command.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                ↵
              </kbd>
              Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ⌘K
            </kbd>
            Toggle
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
