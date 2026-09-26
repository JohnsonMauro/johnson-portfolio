import type { Dict } from '../i18n/content';

/** Icon a navigable section shows in the sidebar; Sidebar maps it to a component. */
export type NavIcon = 'home' | 'user' | 'file';

export interface PageSection {
  /** Must match the `id` of the <section> its widget renders. */
  id: string;
  /** Present when the section is in the sidebar nav and the scroll-spy. */
  nav?: { label: keyof Dict['nav']; icon: NavIcon };
}

export type NavSection = PageSection & { nav: NonNullable<PageSection['nav']> };

/** Sections of the portfolio page, in render order. */
export const SECTIONS: readonly PageSection[] = [
  { id: 'hero', nav: { label: 'home', icon: 'home' } },
  { id: 'about', nav: { label: 'about', icon: 'user' } },
  { id: 'skills' },
  { id: 'resume', nav: { label: 'experience', icon: 'file' } },
];

export const NAV_SECTIONS: readonly NavSection[] = SECTIONS.filter(
  (section): section is NavSection => section.nav !== undefined,
);
