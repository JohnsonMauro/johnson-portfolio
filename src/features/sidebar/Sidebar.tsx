import { useEffect, useState } from 'react';
import {
  LinkedInIcon,
  GitHubIcon,
  MediumIcon,
  MailIcon,
  WhatsAppIcon,
  MenuIcon,
  CloseIcon,
  HomeIcon,
  UserIcon,
  FileIcon,
  PrinterIcon,
} from '../../shared/ui/icons';
import type { Locale } from '../../domain/i18n/config';
import type { Dict } from '../../domain/i18n/content';
import { NAV_SECTIONS, type NavIcon } from '../../domain/sections/sections';
import SocialLink from './SocialLink';
import LocaleSwitcher from './LocaleSwitcher';
import ThemeToggle from './ThemeToggle';

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
    whatsapp: string;
  };
  email: string;
  homeHref: string;
  mailSubject: string;
  nav: Dict['nav'];
  lang: Locale;
  localeUrls: Record<Locale, string>;
  cvHref: string;
}

const NAV_ICONS: Record<NavIcon, typeof HomeIcon> = {
  home: HomeIcon,
  user: UserIcon,
  file: FileIcon,
};

export default function Sidebar({
  name,
  photo,
  social,
  email,
  homeHref,
  mailSubject,
  nav,
  lang,
  localeUrls,
  cvHref,
}: SidebarProps) {
  const NAV: NavItem[] = NAV_SECTIONS.map((section) => ({
    href: `#${section.id}`,
    label: nav[section.nav.label],
    Icon: NAV_ICONS[section.nav.icon],
  }));

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('hero');

  useEffect(() => {
    const sections = NAV_SECTIONS
      .map(({ id }) => document.getElementById(id))
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
        aria-label={open ? nav.closeMenu : nav.openMenu}
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
          'fixed inset-y-0 left-0 z-40 flex w-sidebar flex-col overflow-y-auto overflow-x-clip bg-sidebar px-4 py-6 transition-transform duration-500 ease-out ' +
          (open ? 'translate-x-0' : '-translate-x-full xl:translate-x-0')
        }
      >
        <div className="flex items-center justify-center gap-3 pb-4">
          <LocaleSwitcher lang={lang} localeUrls={localeUrls} label={nav.languageSwitcherLabel} />
          <span aria-hidden="true" className="h-6 w-px bg-white/15" />
          <ThemeToggle
            label={nav.themeToggleLabel}
            toDarkLabel={nav.themeToggleToDark}
            toLightLabel={nav.themeToggleToLight}
          />
        </div>

        <div className="flex flex-col items-center pt-2">
          <img
            src={photo}
            alt={name}
            width={120}
            height={120}
            className="h-[120px] w-[120px] rounded-full border-8 border-sidebar-ring object-cover"
          />
          <p className="mt-4 text-center font-display text-2xl font-semibold text-white">
            <a href={homeHref} className="text-white hover:text-white">
              {name}
            </a>
          </p>

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
              href={`https://wa.me/${social.whatsapp.replace(/\D/g, '')}`}
              label={`WhatsApp ${social.whatsapp}`}
            >
              <WhatsAppIcon />
            </SocialLink>
            <SocialLink
              href={`mailto:${email}?subject=${encodeURIComponent(mailSubject)}`}
              label={email}
              external={false}
            >
              <MailIcon />
            </SocialLink>
          </ul>
        </div>

        <div className="mt-6 px-3">
          <a
            href={cvHref}
            aria-label={nav.printCv}
            title={nav.printCv}
            className="group flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <PrinterIcon width={16} height={16} />
            <span>{nav.printCvShort}</span>
          </a>
        </div>

        <nav className="mt-6" aria-label={nav.primaryNavLabel}>
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

      </aside>
    </>
  );
}

