import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ServerConfig {
  serverUrl: string;
  isConfigured: boolean;
}

interface ServerStore extends ServerConfig {
  setServerUrl: (url: string) => void;
  resetServer: () => void;
}

const defaultServerUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const useServerStore = create<ServerStore>()(
  persist(
    (set, get) => ({
      serverUrl: defaultServerUrl,
      isConfigured: false,
      // Hydration flag to indicate persisted state has been loaded
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        // @ts-ignore - update internal flag
        set({ _hasHydrated: state });
      },

      setServerUrl: (url: string) => {
        // Validate URL format
        try {
          new URL(url);
          set({ serverUrl: url, isConfigured: true });
        } catch (error) {
          console.error('Invalid server URL:', error);
          throw new Error('Invalid server URL format');
        }
      },

      resetServer: () => {
        set({ serverUrl: defaultServerUrl, isConfigured: false });
      },
    }),
    {
      name: 'ipam-server-config',
      // Only persist serverUrl and isConfigured
      partialize: (state) => ({
        serverUrl: state.serverUrl,
        isConfigured: state.isConfigured,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration completes, update the store so components know
        // persisted values are available. Use the `set` from the outer scope.
        try {
          // @ts-ignore - call set from closure
          set({ _hasHydrated: true });
        } catch (e) {
          // If set isn't available for some reason, fall back to mutating
          if (state) {
            // eslint-disable-next-line no-param-reassign
            (state as any)._hasHydrated = true;
          }
        }
      },
    }
  )
);