'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Plus } from 'lucide-react';

interface BulkTagEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onApply: (tagsToAdd: Record<string, string>, tagsToRemove: string[]) => Promise<void>;
}

export function BulkTagEditor({ open, onOpenChange, selectedCount, onApply }: BulkTagEditorProps) {
  const [tagKey, setTagKey] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [tagsToAdd, setTagsToAdd] = useState<Record<string, string>>({});
  const [tagsToRemove, setTagsToRemove] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  const handleAddTag = () => {
    if (!tagKey.trim()) return;

    // Validate tag key format (alphanumeric, underscore, hyphen only)
    if (!/^[a-zA-Z0-9_-]+$/.test(tagKey)) {
      return;
    }

    setTagsToAdd({ ...tagsToAdd, [tagKey]: tagValue });
    setTagKey('');
    setTagValue('');
  };

  const handleRemoveFromAdd = (key: string) => {
    const newTags = { ...tagsToAdd };
    delete newTags[key];
    setTagsToAdd(newTags);
  };

  const handleAddToRemoveList = () => {
    if (!tagKey.trim() || tagsToRemove.includes(tagKey)) return;
    setTagsToRemove([...tagsToRemove, tagKey]);
    setTagKey('');
  };

  const handleRemoveFromRemoveList = (key: string) => {
    setTagsToRemove(tagsToRemove.filter((k) => k !== key));
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply(tagsToAdd, tagsToRemove);
      // Reset state
      setTagsToAdd({});
      setTagsToRemove([]);
      setTagKey('');
      setTagValue('');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to apply tags:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const hasChanges = Object.keys(tagsToAdd).length > 0 || tagsToRemove.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Tag Editor</DialogTitle>
          <DialogDescription>
            Add or remove tags for {selectedCount} selected item(s). Tags help organize and categorize
            your resources.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add Tags Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Add Tags</h4>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Tag key (e.g., environment)"
                  value={tagKey}
                  onChange={(e) => setTagKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Tag value (e.g., production)"
                  value={tagValue}
                  onChange={(e) => setTagValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
              </div>
              <Button type="button" size="sm" onClick={handleAddTag} disabled={!tagKey.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Tag keys can only contain letters, numbers, hyphens, and underscores
            </p>

            {Object.keys(tagsToAdd).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tags to add:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(tagsToAdd).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="gap-1">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                      <button
                        onClick={() => handleRemoveFromAdd(key)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Remove Tags Section */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium text-sm">Remove Tags</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Tag key to remove (e.g., old-tag)"
                value={tagKey}
                onChange={(e) => setTagKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddToRemoveList();
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleAddToRemoveList}
                disabled={!tagKey.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {tagsToRemove.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tags to remove:</p>
                <div className="flex flex-wrap gap-2">
                  {tagsToRemove.map((key) => (
                    <Badge key={key} variant="destructive" className="gap-1">
                      {key}
                      <button
                        onClick={() => handleRemoveFromRemoveList(key)}
                        className="ml-1 hover:text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          {hasChanges && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Summary</p>
              <p className="text-sm text-muted-foreground mt-1">
                {Object.keys(tagsToAdd).length > 0 && (
                  <span>Add {Object.keys(tagsToAdd).length} tag(s)</span>
                )}
                {Object.keys(tagsToAdd).length > 0 && tagsToRemove.length > 0 && <span> • </span>}
                {tagsToRemove.length > 0 && <span>Remove {tagsToRemove.length} tag(s)</span>}
                <span> to {selectedCount} item(s)</span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!hasChanges || isApplying}>
            {isApplying ? 'Applying...' : 'Apply Tags'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
