import LZString from 'lz-string';
import type { AppState, BuyInputs, RentInputs, AppSettings } from '../contexts/AppContext';

// Serializable state interface - only the essential inputs for sharing
export interface SerializableState {
  buyInputs?: Partial<BuyInputs>;
  rentInputs?: Partial<RentInputs>;
  appSettings?: Partial<Pick<AppSettings, 'projectionYears' | 'showCashOut' | 'currentLanguage'>>;
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
      currentLanguage: state.appSettings.currentLanguage,
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
 * Validate that an object has the expected structure
 */
function isValidSerializableState(obj: any): obj is SerializableState {
  if (!obj || typeof obj !== 'object') return false;
  
  // Check if it has at least one of the expected top-level properties
  const hasValidProperty = 
    (obj.buyInputs && typeof obj.buyInputs === 'object') ||
    (obj.rentInputs && typeof obj.rentInputs === 'object') ||
    (obj.appSettings && typeof obj.appSettings === 'object');
    
  return hasValidProperty;
}

/**
 * Deserialize compressed URL hash string to partial app state
 */
export function deserializeState(hash: string): SerializableState | null {
  if (!hash) return null;

  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(hash);
    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed);
    
    // Validate the structure before returning
    if (!isValidSerializableState(parsed)) {
      console.warn('Invalid state structure in URL hash');
      return null;
    }
    
    return parsed;
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
export function getStateFromURL(): SerializableState | null {
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
 * Copy shareable URL to clipboard with fallback
 */
export async function copyShareableURL(state: AppState): Promise<{ success: boolean; url?: string; fallback?: boolean }> {
  const shareableURL = generateShareableURL(state);
  
  // Try modern clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(shareableURL);
      return { success: true, url: shareableURL };
    } catch (error) {
      console.warn('Clipboard API failed, falling back:', error);
    }
  }
  
  // Fallback: create temporary text area for copying
  try {
    const textArea = document.createElement('textarea');
    textArea.value = shareableURL;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      return { success: true, url: shareableURL, fallback: true };
    } else {
      return { success: false, url: shareableURL, fallback: true };
    }
  } catch (error) {
    console.error('All clipboard methods failed:', error);
    return { success: false, url: shareableURL };
  }
}

/**
 * Clear URL hash
 */
export function clearURLHash(): void {
  window.history.replaceState(null, '', window.location.pathname);
}