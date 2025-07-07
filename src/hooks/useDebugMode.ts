import { useState, useEffect } from 'react';

export function useDebugMode(): boolean {
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    const checkDebugMode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const debugParam = urlParams.get('debug');
      setIsDebugMode(debugParam === 'true' || debugParam === '1');
    };

    // Check on mount
    checkDebugMode();

    // Listen for URL changes (for SPAs)
    const handlePopState = () => {
      checkDebugMode();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return isDebugMode;
}