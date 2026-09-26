import {
  LOCALES,
  LOCALE_FLAGS,
  LOCALE_LABELS,
  LOCALE_NAMES,
  HREFLANG_TAGS,
  type Locale,
} from '../../domain/i18n/config';
import { asset } from '../../shared/lib/asset';

interface LocaleSwitcherProps {
  lang: Locale;
  localeUrls: Record<Locale, string>;
  label: string;
}

export default function LocaleSwitcher({ lang, localeUrls, label }: LocaleSwitcherProps) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      {LOCALES.map((locale) => {
        const isCurrent = locale === lang;
        const persistChoice = () => {
          try {
            window.localStorage.setItem('preferred-locale', locale);
          } catch {
            /* localStorage unavailable (privacy mode) — ignore */
          }
        };
        return (
          <a
            key={locale}
            href={localeUrls[locale]}
            hrefLang={HREFLANG_TAGS[locale]}
            aria-label={LOCALE_NAMES[locale]}
            aria-current={isCurrent ? 'true' : undefined}
            title={LOCALE_NAMES[locale]}
            onClick={persistChoice}
            className={
              'flex items-center justify-center rounded-full transition ' +
              (isCurrent
                ? 'ring-2 ring-accent ring-offset-2 ring-offset-sidebar'
                : 'opacity-60 hover:opacity-100')
            }
          >
            <img
              src={asset(LOCALE_FLAGS[locale])}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-full"
              loading="lazy"
              decoding="async"
            />
            <span className="sr-only">{LOCALE_LABELS[locale]}</span>
          </a>
        );
      })}
    </div>
  );
}
