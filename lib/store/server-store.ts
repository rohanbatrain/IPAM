import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ServerConfig {
  serverUrl: string;
  isConfigured: boolean;
}

interface ServerStore extends ServerConfig {
  setServerUrl: (url: string) => void;
  resetServer: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const defaultServerUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const useServerStore = create<ServerStore>()(
  persist(
    (set) => ({
      serverUrl: defaultServerUrl,
      isConfigured: false,
      // Hydration flag to indicate persisted state has been loaded
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
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
      name: 'sbd-server-config',
      // Only persist serverUrl and isConfigured
      partialize: (state) => ({
        serverUrl: state.serverUrl,
        isConfigured: state.isConfigured,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration completes, mark persisted state as hydrated.
        // We cannot rely on the `set` closure here in the options object,
        // so mutate the rehydrated state directly when available.
        if (state) {
          // eslint-disable-next-line no-param-reassign
          (state as unknown as { _hasHydrated: boolean })._hasHydrated = true;
        }
      },
    }
  )
);