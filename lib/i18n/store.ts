import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/i18n/config";

/**
 * The selected locale lives in localStorage rather than React state so it can
 * be read through useSyncExternalStore. That gives us an SSR-safe snapshot
 * (always English on the server) without a setState-in-effect sync, and every
 * component using the hook re-renders together when the locale changes.
 */

let cached: Locale | null = null;
const listeners = new Set<() => void>();

function read(): Locale {
  if (cached !== null) return cached;
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    cached = isLocale(stored) ? stored : DEFAULT_LOCALE;
  } catch {
    // Private mode / storage disabled — fall back to English.
    cached = DEFAULT_LOCALE;
  }
  return cached;
}

export function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function getSnapshot(): Locale {
  return read();
}

/** The server has no storage, so it always renders the default locale. */
export function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

export function setLocale(locale: Locale): void {
  if (cached === locale) return;
  cached = locale;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Non-fatal: the choice just won't survive a reload.
  }
  // Drives the :lang(km) font rule and tells the browser how to line-break
  // Khmer, which has no spaces between words.
  document.documentElement.lang = locale;
  for (const listener of listeners) listener();
}
