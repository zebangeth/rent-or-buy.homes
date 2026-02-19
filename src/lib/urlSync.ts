import LZString from "lz-string";
import type { AppSettings, AppState, BuyInputs, RentInputs } from "../contexts/AppContext";

const STATE_QUERY_PARAM = "s";

// Serializable state interface - only the essential inputs for sharing
export interface SerializableState {
  buyInputs?: Partial<BuyInputs>;
  rentInputs?: Partial<RentInputs>;
  appSettings?: Partial<Pick<AppSettings, "projectionYears" | "showCashOut" | "currentLanguage">>;
}

/**
 * Serialize app state to compressed URL-safe string
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
    return LZString.compressToEncodedURIComponent(jsonString);
  } catch (error) {
    console.error("Failed to serialize state:", error);
    return "";
  }
}

/**
 * Validate that an object has the expected structure
 */
function isValidSerializableState(obj: unknown): obj is SerializableState {
  if (!obj || typeof obj !== "object") return false;

  const state = obj as Record<string, unknown>;
  const hasValidProperty = Boolean(
    (state.buyInputs && typeof state.buyInputs === "object") ||
      (state.rentInputs && typeof state.rentInputs === "object") ||
      (state.appSettings && typeof state.appSettings === "object"),
  );

  return hasValidProperty;
}

/**
 * Deserialize compressed URL string to partial app state
 */
export function deserializeState(value: string): SerializableState | null {
  if (!value) return null;

  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(value);
    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed);

    if (!isValidSerializableState(parsed)) {
      console.warn("Invalid state structure in URL");
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to deserialize state:", error);
    return null;
  }
}

function getSerializedStateFromURL(): string {
  if (typeof window === "undefined") return "";

  const searchParams = new URLSearchParams(window.location.search);
  const queryState = searchParams.get(STATE_QUERY_PARAM);
  if (queryState) {
    return queryState;
  }

  return window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
}

export function hasStateInURL(): boolean {
  if (typeof window === "undefined") return false;

  const searchParams = new URLSearchParams(window.location.search);
  return Boolean(searchParams.get(STATE_QUERY_PARAM) || window.location.hash);
}

/**
 * Generate shareable URL with current state
 */
export function generateShareableURL(state: AppState, baseURL?: string): string {
  const serializedState = serializeState(state);
  if (!serializedState) {
    return baseURL ?? (typeof window !== "undefined" ? window.location.origin : "");
  }

  const url = new URL(baseURL ?? (typeof window !== "undefined" ? window.location.href : "https://rent-or-buy.homes/"));
  url.searchParams.set(STATE_QUERY_PARAM, serializedState);
  url.hash = "";

  return url.toString();
}

/**
 * Extract state from current URL (query `?s=` first, then legacy hash fallback)
 */
export function getStateFromURL(): SerializableState | null {
  const serializedState = getSerializedStateFromURL();
  return deserializeState(serializedState);
}

/**
 * Update URL query with current state without triggering navigation
 */
export function updateURLWithState(state: AppState): void {
  if (typeof window === "undefined") return;

  const serializedState = serializeState(state);
  if (serializedState) {
    const currentURL = new URL(window.location.href);
    currentURL.searchParams.set(STATE_QUERY_PARAM, serializedState);
    currentURL.hash = "";

    const nextURL = `${currentURL.pathname}${currentURL.search}`;
    window.history.replaceState(null, "", nextURL);
  }
}

/**
 * Copy shareable URL to clipboard with fallback
 */
export async function copyShareableURL(
  state: AppState,
): Promise<{ success: boolean; url?: string; fallback?: boolean }> {
  const shareableURL = generateShareableURL(state);

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(shareableURL);
      return { success: true, url: shareableURL };
    } catch (error) {
      console.warn("Clipboard API failed, falling back:", error);
    }
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = shareableURL;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (successful) {
      return { success: true, url: shareableURL, fallback: true };
    }
    return { success: false, url: shareableURL, fallback: true };
  } catch (error) {
    console.error("All clipboard methods failed:", error);
    return { success: false, url: shareableURL };
  }
}

/**
 * Clear URL state (`?s=` and legacy hash)
 */
export function clearURLHash(): void {
  if (typeof window === "undefined") return;

  const currentURL = new URL(window.location.href);
  currentURL.searchParams.delete(STATE_QUERY_PARAM);
  currentURL.hash = "";

  const nextURL = `${currentURL.pathname}${currentURL.search}`;
  window.history.replaceState(null, "", nextURL);
}
