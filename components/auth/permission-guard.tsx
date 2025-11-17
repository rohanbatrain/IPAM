'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PermissionGuardProps {
  children: ReactNode;
  permission: string | string[];
  fallback?: ReactNode;
  showFallback?: boolean;
}

export function PermissionGuard({
  children,
  permission,
  fallback,
  showFallback = true,
}: PermissionGuardProps) {
  const { hasPermission, user } = useAuthStore();
  const router = useRouter();

  // Check if user has required permission(s)
  const hasRequiredPermission = Array.isArray(permission)
    ? permission.some((p) => hasPermission(p))
    : hasPermission(permission);

  if (!hasRequiredPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showFallback) {
      return null;
    }

    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-destructive" />
            <div>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access this feature
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Required permission:</strong>{' '}
              {Array.isArray(permission) ? permission.join(' or ') : permission}
            </p>
            {user && (
              <p className="text-sm text-muted-foreground">
                <strong>Your permissions:</strong>{' '}
                {user.permissions.length > 0
                  ? user.permissions.join(', ')
                  : 'None'}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

// Hook for checking permissions in components
export function usePermission(permission: string | string[]): boolean {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (Array.isArray(permission)) {
    return permission.some((p) => hasPermission(p));
  }

  return hasPermission(permission);
}

// Component for conditionally rendering based on permissions
interface RequirePermissionProps {
  permission: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequirePermission({
  permission,
  children,
  fallback = null,
}: RequirePermissionProps) {
  const hasRequiredPermission = usePermission(permission);

  if (!hasRequiredPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
