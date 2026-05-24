import type { Locale } from './config';
import en from './locales/en';
import pt from './locales/pt';

export interface ExpertiseEntry {
  key: string;
  label: string;
}

export interface StatEntry {
  value: string;
  label: string;
}

export interface ResumeEntry {
  role: string;
  period: string;
  org: string;
  url?: string;
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
    themeToggleLabel: string;
    themeToggleToDark: string;
    themeToggleToLight: string;
    printCv: string;
    printCvShort: string;
    backToSite: string;
  };
  cv: {
    contactLabel: string;
    summaryTitle: string;
    skillsTitle: string;
    softSkillsTitle: string;
    experienceTitle: string;
    printAction: string;
    generatedOn: string;
  };
  hero: {
    typedRoles: string[];
    typedPrefix: string;
  };
  sections: {
    aboutTitle: string;
    skillsTitle: string;
    softSkillsTitle: string;
    experienceTitle: string;
    stackPrimaryLabel: string;
    stackSecondaryLabel: string;
    stackToolsLabel: string;
  };
  about: {
    greeting: string;
    summary: string;
    current: string;
    currentLabel: string;
    stats: StatEntry[];
    ctaCv: string;
    ctaLinkedin: string;
    expertise: ExpertiseEntry[];
  };
  softSkills: string[];
  resume: ResumeEntry[];
  footer: {
    builtWith: string;
  };
}

const content: Record<Locale, Dict> = { en, pt };

export function getDict(lang: Locale): Dict {
  return content[lang];
}
