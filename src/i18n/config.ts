export const LOCALES = ['en', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  pt: 'PT',
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  pt: 'Português (BR)',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: 'flags/en.svg',
  pt: 'flags/br.svg',
};

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}
