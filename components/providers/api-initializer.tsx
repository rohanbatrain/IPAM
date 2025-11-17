'use client';

import { useEffect } from 'react';
import { useServerStore } from '@/lib/store/server-store';
import { setServerUrlGetter } from '@/lib/api/client';

export function ApiInitializer() {
  const { serverUrl } = useServerStore();

  useEffect(() => {
    // Set the server URL getter for the API client
    setServerUrlGetter(() => serverUrl);
  }, [serverUrl]);

  return null;
}