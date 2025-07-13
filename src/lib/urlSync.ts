import LZString from 'lz-string';
import type { AppState, BuyInputs, RentInputs, AppSettings } from '../contexts/AppContext';

// Serializable state interface - only the essential inputs for sharing
export interface SerializableState {
  buyInputs: BuyInputs;
  rentInputs: RentInputs;
  appSettings: Pick<AppSettings, 'projectionYears' | 'showCashOut'>;
}

/**
 * Serialize app state to compressed URL hash string
 */
export function serializeState(state: AppState): string {
  const serializableState: SerializableState = {
    buyInputs: state.buyInputs,
    rentInputs: state.rentInputs,
    appSettings: {
      projectionYears: state.appSettings.projectionYears,
      showCashOut: state.appSettings.showCashOut,
    },
  };

  try {
    const jsonString = JSON.stringify(serializableState);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    return compressed;
  } catch (error) {
    console.error('Failed to serialize state:', error);
    return '';
  }
}

/**
 * Deserialize compressed URL hash string to partial app state
 */
export function deserializeState(hash: string): Partial<SerializableState> | null {
  if (!hash) return null;

  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(hash);
    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed);
    return parsed as SerializableState;
  } catch (error) {
    console.error('Failed to deserialize state:', error);
    return null;
  }
}

/**
 * Generate shareable URL with current state
 */
export function generateShareableURL(state: AppState, baseURL: string = window.location.origin): string {
  const serializedState = serializeState(state);
  if (!serializedState) return baseURL;

  return `${baseURL}/#${serializedState}`;
}

/**
 * Extract state from current URL hash
 */
export function getStateFromURL(): Partial<SerializableState> | null {
  const hash = window.location.hash.slice(1); // Remove the '#' prefix
  return deserializeState(hash);
}

/**
 * Update URL hash with current state without triggering navigation
 */
export function updateURLWithState(state: AppState): void {
  const serializedState = serializeState(state);
  if (serializedState) {
    const newURL = `${window.location.pathname}#${serializedState}`;
    window.history.replaceState(null, '', newURL);
  }
}

/**
 * Copy shareable URL to clipboard
 */
export async function copyShareableURL(state: AppState): Promise<boolean> {
  try {
    const shareableURL = generateShareableURL(state);
    await navigator.clipboard.writeText(shareableURL);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Clear URL hash
 */
export function clearURLHash(): void {
  window.history.replaceState(null, '', window.location.pathname);
}