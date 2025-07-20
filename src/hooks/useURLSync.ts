import { useEffect, useLayoutEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  getStateFromURL, 
  updateURLWithState, 
  copyShareableURL, 
  clearURLHash
} from '../lib/urlSync';

export function useURLSync() {
  const { state, dispatch } = useApp();
  const isInitialLoadRef = useRef(true);
  const lastStateRef = useRef<string>('');

  // Load state from URL on initial mount - use useLayoutEffect for synchronous loading
  useLayoutEffect(() => {
    if (isInitialLoadRef.current) {
      const urlState = getStateFromURL();
      
      if (urlState) {
        // Apply URL state to context using the new action
        dispatch({ type: 'LOAD_STATE_FROM_URL', state: urlState });
        // Trigger recalculation immediately (no setTimeout needed)
        dispatch({ type: 'RECALCULATE' });
      }

      isInitialLoadRef.current = false;
    }
  }, [dispatch]);

  // Sync state to URL when state changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoadRef.current) {
      const currentStateString = JSON.stringify({
        buyInputs: state.buyInputs,
        rentInputs: state.rentInputs,
        appSettings: {
          projectionYears: state.appSettings.projectionYears,
          showCashOut: state.appSettings.showCashOut,
          currentLanguage: state.appSettings.currentLanguage,
        },
      });

      // Only update URL if state actually changed
      if (currentStateString !== lastStateRef.current) {
        updateURLWithState(state);
        lastStateRef.current = currentStateString;
      }
    }
  }, [state]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlState = getStateFromURL();
      if (urlState) {
        // Apply URL state changes using the new action
        dispatch({ type: 'LOAD_STATE_FROM_URL', state: urlState });
        dispatch({ type: 'RECALCULATE' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  // Return utility functions
  return {
    shareCurrentState: () => copyShareableURL(state),
    clearURL: clearURLHash,
    hasURLState: () => Boolean(window.location.hash),
  };
}