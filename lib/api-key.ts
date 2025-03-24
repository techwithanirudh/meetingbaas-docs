import { useCallback, useState } from 'react';

const API_KEY_STORAGE_KEY = 'baas-api-key';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
}

export function setStoredApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

export function removeStoredApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export function useApiKey() {
  const [apiKey, setApiKey] = useState(getStoredApiKey());

  const updateApiKey = useCallback((newApiKey: string) => {
    setApiKey(newApiKey);
    setStoredApiKey(newApiKey);
  }, []);

  return {
    apiKey,
    setApiKey: updateApiKey,
    removeApiKey: removeStoredApiKey,
  };
}
