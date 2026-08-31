export const LOCALES = ["en", "km"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Label for each locale, written in that locale. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  km: "ខ្មែរ",
};

/** Short label for the compact toggle. */
export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  en: "EN",
  km: "ខ្មែរ",
};

export const LOCALE_STORAGE_KEY = "rattanak-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Marks a translatable string that lives in module-level data rather than in
 * JSX — category titles in lib/categories.ts, grind labels in lib/beans.ts.
 *
 * It returns the English text unchanged. Its only job is to be a call the
 * extractor can find, so the string lands in messages/km.json; components then
 * localize it at render time with t(value). Server-side callers such as
 * lib/seo.ts keep getting English, which is what we want for metadata.
 */
export function msg(text: string): string {
  return text;
}
