// Format utilities for IPAM data

export function formatPercentage(value: number | null | undefined, decimals: number = 1): string {
  // Handle null, undefined, NaN, or invalid values
  if (value == null || !isFinite(value)) {
    return '0%';
  }
  
  // Backend returns percentage as 0-100, not 0-1, so don't multiply by 100
  const result = value.toFixed(decimals);
  // Remove trailing .0 for whole numbers
  return `${result.replace(/\.0$/, '')}%`;
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const result = (bytes / Math.pow(k, i)).toFixed(decimals);
  
  // Remove trailing .0 for whole numbers
  return `${result.replace(/\.0$/, '')} ${sizes[i]}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return formatDate(d);
}

export function getUtilizationColor(percentage: number): string {
  if (percentage < 50) return 'text-green-600 dark:text-green-400';
  if (percentage < 80) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function getUtilizationBadgeVariant(
  percentage: number
): 'success' | 'warning' | 'destructive' {
  if (percentage < 50) return 'success';
  if (percentage < 80) return 'warning';
  return 'destructive';
}

export function getStatusBadgeVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'success' {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'reserved':
      return 'secondary';
    case 'retired':
    case 'released':
      return 'destructive';
    default:
      return 'default';
  }
}

export function getProgressBarWidth(percentage: number): number {
  // Ensure percentage is valid
  if (!isFinite(percentage) || percentage < 0) {
    return 0;
  }
  
  // Cap at 100%
  if (percentage > 100) {
    return 100;
  }
  
  // For very small percentages (< 1%), show at least 1% so the bar is visible
  // This ensures users can see there's some allocation even if it's tiny
  if (percentage > 0 && percentage < 1) {
    return 1;
  }
  
  return percentage;
}
