import { useCallback } from 'react';

export function useShareLink() {
  const generateLink = useCallback((params: URLSearchParams): string => {
    const url = new URL(window.location.href);
    url.pathname = '/search';
    url.search = params.toString();
    return url.toString();
  }, []);

  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
  }, []);

  return { generateLink, copyToClipboard };
}
