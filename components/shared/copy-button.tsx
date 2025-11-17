'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';

interface CopyButtonProps {
  value: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  showToast?: boolean;
  toastMessage?: string;
}

export function CopyButton({
  value,
  className,
  size = 'icon',
  variant = 'ghost',
  showToast = true,
  toastMessage = 'Copied to clipboard',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      
      if (showToast) {
        toast.success(toastMessage);
      }

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      if (showToast) {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('relative', className)}
      onClick={handleCopy}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}

// Inline copy button for use with text
interface InlineCopyButtonProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function InlineCopyButton({
  value,
  children,
  className,
}: InlineCopyButtonProps) {
  return (
    <div className={cn('group relative inline-flex items-center gap-2', className)}>
      {children}
      <CopyButton
        value={value}
        size="icon"
        variant="ghost"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
