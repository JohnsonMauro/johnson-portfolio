import type { Locale } from './config';
import en from './locales/en';
import pt from './locales/pt';

export interface ExpertiseEntry {
  label: string;
  value: string;
}

export interface ResumeEntry {
  role: string;
  period: string;
  org: string;
  bullets?: string[];
}

export interface Dict {
  meta: {
    title: string;
    description: string;
    keywords: string;
    mailSubject: string;
    jobTitle: string;
  };
  nav: {
    home: string;
    about: string;
    experience: string;
    languageSwitcherLabel: string;
  };
  hero: {
    typedRoles: string[];
    typedPrefix: string;
  };
  sections: {
    aboutTitle: string;
    skillsTitle: string;
    experienceTitle: string;
  };
  about: {
    greeting: string;
    summary: string;
    current: string;
    expertise: ExpertiseEntry[];
  };
  resume: ResumeEntry[];
  footer: {
    builtWith: string;
  };
}

const content: Record<Locale, Dict> = { en, pt };

export function getDict(lang: Locale): Dict {
  return content[lang];
}
