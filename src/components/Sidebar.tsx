import { useEffect, useState } from 'react';
import {
  LinkedInIcon,
  GitHubIcon,
  MediumIcon,
  MailIcon,
  MenuIcon,
  CloseIcon,
  HomeIcon,
  UserIcon,
  FileIcon,
} from './icons';
import { LOCALES, LOCALE_LABELS, type Locale } from '../i18n/config';

interface NavItem {
  href: string;
  label: string;
  Icon: typeof HomeIcon;
}

interface SidebarProps {
  name: string;
  photo: string;
  social: {
    linkedin: string;
    github: string;
    medium: string;
  };
  email: string;
  homeHref: string;
  mailSubject: string;
  navLabels: { home: string; about: string; experience: string };
  lang: Locale;
  localeUrls: Record<Locale, string>;
  langSwitchLabel: string;
}

const NAV_ICONS = {
  home: HomeIcon,
  about: UserIcon,
  experience: FileIcon,
} as const;

export default function Sidebar({
  name,
  photo,
  social,
  email,
  homeHref,
  mailSubject,
  navLabels,
  lang,
  localeUrls,
  langSwitchLabel,
}: SidebarProps) {
  const NAV: NavItem[] = [
    { href: '#hero', label: navLabels.home, Icon: NAV_ICONS.home },
    { href: '#about', label: navLabels.about, Icon: NAV_ICONS.about },
    { href: '#resume', label: navLabels.experience, Icon: NAV_ICONS.experience },
  ];

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('hero');

  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const closeAndNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', href);
    }
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-sidebar text-white shadow-lg ring-1 ring-white/10 transition hover:bg-sidebar-ring xl:hidden"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm xl:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={
          'fixed inset-y-0 left-0 z-40 flex w-sidebar flex-col overflow-y-auto bg-sidebar px-4 py-6 transition-transform duration-500 ease-out ' +
          (open ? 'translate-x-0' : '-translate-x-full xl:translate-x-0')
        }
      >
        <div className="flex flex-col items-center pt-4">
          <img
            src={photo}
            alt={name}
            width={120}
            height={120}
            className="h-[120px] w-[120px] rounded-full border-8 border-sidebar-ring object-cover"
          />
          <h1 className="mt-4 text-center font-display text-2xl font-semibold text-white">
            <a href={homeHref} className="text-white hover:text-white">
              {name}
            </a>
          </h1>

          <ul className="mt-3 flex items-center gap-2">
            <SocialLink href={social.linkedin} label="LinkedIn">
              <LinkedInIcon />
            </SocialLink>
            <SocialLink href={social.github} label="GitHub">
              <GitHubIcon />
            </SocialLink>
            <SocialLink href={social.medium} label="Medium">
              <MediumIcon />
            </SocialLink>
            <SocialLink
              href={`mailto:${email}?subject=${encodeURIComponent(mailSubject)}`}
              label="Email"
              external={false}
            >
              <MailIcon />
            </SocialLink>
          </ul>
        </div>

        <nav className="mt-8" aria-label="Primary">
          <ul className="space-y-1">
            {NAV.map(({ href, label, Icon }) => {
              const id = href.slice(1);
              const isActive = active === id;
              return (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => closeAndNav(e, href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={
                      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ' +
                      (isActive
                        ? 'text-white'
                        : 'text-white/60 hover:text-white')
                    }
                  >
                    <span
                      className={
                        'flex h-7 w-7 items-center justify-center rounded-full transition ' +
                        (isActive
                          ? 'bg-accent text-white'
                          : 'bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white')
                      }
                    >
                      <Icon width={16} height={16} />
                    </span>
                    <span>{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          role="group"
          aria-label={langSwitchLabel}
          className="mt-auto flex items-center justify-center gap-1 pt-6"
        >
          {LOCALES.map((locale) => {
            const isCurrent = locale === lang;
            return (
              <a
                key={locale}
                href={localeUrls[locale]}
                hrefLang={locale === 'pt' ? 'pt-BR' : locale}
                aria-current={isCurrent ? 'true' : undefined}
                className={
                  'rounded-md px-2 py-1 text-xs font-semibold transition ' +
                  (isCurrent
                    ? 'bg-accent text-white'
                    : 'text-white/50 hover:bg-white/10 hover:text-white')
                }
              >
                {LOCALE_LABELS[locale]}
              </a>
            );
          })}
        </div>
      </aside>
    </>
  );
}

interface SocialLinkProps {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}

function SocialLink({
  href,
  label,
  external = true,
  children,
}: SocialLinkProps) {
  return (
    <li>
      <a
        href={href}
        aria-label={label}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-social text-white/80 transition hover:bg-accent hover:text-white"
      >
        <span aria-hidden="true">{children}</span>
      </a>
    </li>
  );
}
