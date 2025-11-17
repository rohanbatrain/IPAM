import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login, signup } from '@/lib/api/auth';
import type { User, LoginCredentials, SignupCredentials, AuthError } from '@/lib/types/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  error: AuthError | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  setHasHydrated: (state: boolean) => void;
  clearError: () => void;
  setError: (error: AuthError) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      _hasHydrated: false,
      error: null,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      clearError: () => {
        set({ error: null });
      },

      setError: (error) => {
        set({ error });
      },

      login: async (credentials) => {
        try {
          set({ error: null }); // Clear any previous errors
          const response = await login(credentials);
          console.log('Login response:', { user: response.user, hasTokens: !!response.access_token });
          
          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            error: null,
          });
          
          console.log('Auth state updated, isAuthenticated:', true);
        } catch (error) {
          console.error('Login failed in store:', {
            error: (error as any)?.error,
            message: (error as any)?.message,
            code: (error as any)?.code,
            status: (error as any)?.response?.status
          });
          const authError = error as AuthError;
          set({ error: authError });
          throw authError;
        }
      },

      signup: async (credentials) => {
        try {
          set({ error: null }); // Clear any previous errors
          const response = await signup(credentials);
          console.log('Signup response:', { hasTokens: !!response.access_token, isVerified: response.is_verified });
          
          set({
            user: null, // User will be set after email verification
            accessToken: response.access_token,
            refreshToken: null, // Signup doesn't return refresh token
            isAuthenticated: false, // Not fully authenticated until email verified
            error: null,
          });
          
          console.log('Auth state updated after signup, isAuthenticated:', false);
        } catch (error) {
          console.error('Signup failed in store:', error);
          const authError = error as AuthError;
          set({ error: authError });
          throw authError;
        }
      },

      logout: () => {
        // Note: logout API call removed as it's not implemented in the new auth functions
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) throw new Error('No refresh token');

        // Note: refresh functionality removed as it's not implemented in the new auth functions
        throw new Error('Token refresh not implemented');
      },

      hasPermission: (permission) => {
        const { user } = get();
        return user?.permissions.includes(permission) ?? false;
      },
    }),
    {
      name: 'ipam-auth',
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
