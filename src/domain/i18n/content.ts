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

export interface PracticeEntry {
  title: string;
  proof: string;
}

/** Career chapter an experience entry belongs to; chapters render in `career.chapters` order. */
export type CareerChapterKey = 'modernization' | 'product' | 'foundations';

export interface CareerChapter {
  key: CareerChapterKey;
  period: string;
  title: string;
  arc: string;
}

export interface ResumeEntry {
  chapter: CareerChapterKey;
  role: string;
  period: string;
  org: string;
  url?: string;
  bullets?: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  period: string;
}

export interface LanguageEntry {
  name: string;
  level: string;
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
    openMenu: string;
    closeMenu: string;
    primaryNavLabel: string;
    backToTop: string;
  };
  cv: {
    contactLabel: string;
    summaryTitle: string;
    skillsTitle: string;
    aiTitle: string;
    practicesTitle: string;
    experienceTitle: string;
    educationTitle: string;
    languagesTitle: string;
    printAction: string;
    toolbarLabel: string;
  };
  hero: {
    typedRoles: string[];
    typedPrefix: string;
    /** P vs NP easter egg in the hero network: canvas caption (`{count}` = tours measured). */
    eggChecked: string;
    /** Console hint that names the problem and the triggers. */
    eggHint: string;
  };
  sections: {
    aboutTitle: string;
    skillsTitle: string;
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
  skills: {
    aiKicker: string;
    aiTitle: string;
    aiIntro: string;
    aiPractices: PracticeEntry[];
    judgmentTitle: string;
    judgment: string[];
    stackTitle: string;
  };
  career: {
    chapters: CareerChapter[];
  };
  resume: ResumeEntry[];
  education: EducationEntry[];
  languages: LanguageEntry[];
}

const content: Record<Locale, Dict> = { en, pt };

export function getDict(lang: Locale): Dict {
  return content[lang];
}
