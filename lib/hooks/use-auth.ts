import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { LoginCredentials } from '@/lib/types/api';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    login: loginAction,
    logout: logoutAction,
    hasPermission,
  } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      await loginAction(credentials);
    },
    [loginAction]
  );

  const logout = useCallback(() => {
    logoutAction();
    router.push('/login');
  }, [logoutAction, router]);

  const checkPermission = useCallback(
    (permission: string | string[]): boolean => {
      if (Array.isArray(permission)) {
        return permission.some((p) => hasPermission(p));
      }
      return hasPermission(permission);
    },
    [hasPermission]
  );

  return {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission: checkPermission,
  };
}
