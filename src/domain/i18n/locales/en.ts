import type { Dict } from '../content';

const en: Dict = {
  meta: {
    title: 'Johnson Mauro - Software Engineer',
    description:
      'Software engineer with 13+ years in full-stack web and mobile: legacy modernization, integrations and offline-first apps, now delivered with AI coding agents under specs, tests and review.',
    keywords:
      'software engineer, full-stack, front-end, ai-assisted development, agentic workflows, claude code, mcp, context engineering, react, react native, expo, angular, typescript, node.js, nestjs, go, postgresql, .net core, vitest, playwright, tdd, legacy modernization, offline-first, azure devops, agile, mentoring',
    mailSubject: 'Mail from johnsonmauro.github.io',
    jobTitle: 'Software Engineer',
  },
  nav: {
    home: 'Home',
    about: 'About',
    experience: 'Experience',
    languageSwitcherLabel: 'Switch language',
    themeToggleLabel: 'Toggle theme',
    themeToggleToDark: 'Switch to dark theme',
    themeToggleToLight: 'Switch to light theme',
    printCv: 'Print / download CV',
    printCvShort: 'CV',
    backToSite: 'Back to site',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    primaryNavLabel: 'Primary',
    backToTop: 'Back to top',
  },
  cv: {
    contactLabel: 'Contact',
    summaryTitle: 'Professional summary',
    skillsTitle: 'Core skills',
    aiTitle: 'How I build with AI',
    practicesTitle: 'Engineering practices',
    experienceTitle: 'Professional experience',
    printAction: 'Print / Save as PDF',
    generatedOn: 'Generated on',
    toolbarLabel: 'CV actions',
  },
  hero: {
    typedPrefix: "I'm a",
    typedRoles: ['Software Engineer', 'Full-stack Engineer', 'Front-end & Mobile Engineer'],
  },
  sections: {
    aboutTitle: 'About me',
    skillsTitle: 'Skills',
    experienceTitle: 'Experience',
    stackPrimaryLabel: 'Primary',
    stackSecondaryLabel: 'Production experience',
    stackToolsLabel: 'Tools & AI',
  },
  about: {
    greeting: 'Hi There 👋🏽',
    summary:
      'Software engineer with 13+ years across telecom, healthcare, retail and education, from .NET ERPs and RPA bots to web and mobile apps in React, Angular, TypeScript and Node.js. I modernize legacy systems while they keep shipping and back each change with tests. Since 2026 I also deliver with AI coding agents: I write the specs, delegate implementation and verify every diff with tests and review.',
    current:
      'Co-leading the React 19 rewrite of a US telephony platform and, as partner in an ERP startup, building its field-sales mobile app.',
    currentLabel: 'Current focus',
    stats: [
      { value: '13+', label: 'Years shipping software' },
      { value: '10+', label: 'Companies served' },
      { value: '0→3k', label: 'Tests in a co-led rewrite' },
      { value: 'Remote', label: 'First, time-zone fluent' },
    ],
    ctaCv: 'Download CV',
    ctaLinkedin: 'LinkedIn',
    expertise: [
      { key: 'ai', label: 'AI engineering' },
      { key: 'frontend', label: 'Front-end & mobile' },
      { key: 'backend', label: 'Back-end' },
      { key: 'database', label: 'Database' },
      { key: 'quality', label: 'Testing' },
      { key: 'devops', label: 'DevOps & delivery' },
    ],
  },
  skills: {
    aiKicker: 'How I work now',
    aiTitle: 'I direct the agents. I own the result.',
    aiIntro:
      'The same habits, applied to AI agents: less time typing code, more time deciding what gets built, how agents build it, and whether it is right. Each practice below is backed by work in real repositories.',
    aiPractices: [
      {
        title: 'Agent context design',
        proof:
          '40+ Claude Code skills and CLAUDE.md contracts across 7 repositories, turning team conventions into rules agents follow.',
      },
      {
        title: 'Spec-first delegation',
        proof:
          'Plans, ADRs and acceptance criteria before code; 200+ agent-paired commits since March 2026.',
      },
      {
        title: 'Verification over trust',
        proof:
          'TDD and human review on every agent diff: 1,300+ tests in projects I own, plus a 0→3k suite in a co-led rewrite.',
      },
      {
        title: 'Architecture guardrails',
        proof:
          'DDD and feature-sliced boundaries enforced by lint, plus security and accessibility skills agents must apply.',
      },
    ],
    judgmentTitle: 'Engineering judgment',
    judgment: [
      'Legacy modernization',
      'Offline-first mobile',
      'Multi-tenant APIs',
      'OAuth & webhook integrations',
      'Real-time messaging',
      'WCAG 2.2 AA',
      'OWASP hardening',
      'Team standards & mentoring',
    ],
    stackTitle: 'Stack',
  },
  resume: [
    {
      role: 'Software Engineer',
      period: 'Jan 2022 - Present',
      org: 'InPhonex',
      url: 'https://www.inphonex.com/',
      bullets: [
        'Co-led the rewrite of a 227k-line telephony admin app from React 16/CRA to React 19, Vite 8 and TypeScript 6: 788 commits, #2 of 22.',
        'Grew test coverage from zero to ~3,000 cases and 71.5% of lines, adding 459 test files with Vitest and Testing Library.',
        'Built a CRM-to-telephony integration end to end, with a 14-module API, embedded calling SDK and 985 tests, using NestJS, NATS and Playwright.',
        'Standardized AI-assisted delivery across 4 team repositories with 26 Claude Code skills and ~1.2k lines of agent context.',
        'Cut dependency install size 37% (720 to 454 MB) by migrating Yarn to pnpm.',
        'Shipped 1,135 commits to the 12-year-old AngularJS product while the rewrite progressed.',
      ],
    },
    {
      role: 'Partner & Software Engineer',
      period: 'May 2026 - Present',
      org: 'ERP startup',
      bullets: [
        'Built a field-sales mobile app solo in 6 weeks: 92 commits, 13 screens, ~18k lines, using Expo SDK 56, React Native 0.85 and TypeScript.',
        'Designed offline-first ordering across 8 DDD modules, queuing orders in on-device SQLite and syncing in the background.',
        'Wrote ~347 unit and component tests; 53% of commits were paired with Claude Code, guided by 8 custom project skills.',
        'Delivered the ERP returns module in 5 phases (~6k lines), covering the .NET 10 API, a React wizard and returns e-invoicing.',
      ],
    },
    {
      role: 'Freelance Software Engineer',
      period: 'Sep 2025 - Present',
      org: 'Freelance clients',
      bullets: [
        'Shipped a bilingual English-school platform from v1.0 to v2.4: 91 commits, 14 merged PRs, push-to-deploy CI, built with Next.js 16.',
        'Reached Lighthouse mobile scores of 96 accessibility, 100 best practices and 100 SEO after a WCAG 2.2 AA pass.',
        'Closed a 10-finding OWASP-aligned audit, adding HSTS, CSP and COOP headers and patching 16 vulnerable dependencies.',
        'Designed a multi-tenant REST API with 19 endpoints, role-based JWT and 11 documented ADRs, tested against real PostgreSQL in Go.',
      ],
    },
    {
      role: 'Open-source contributor',
      period: 'Jul 2026 - Present',
      org: 'Browser extension for a game trading site',
      bullets: [
        'Merged 2 PRs into a 38k-line Chrome and Firefox extension, including a scroll bug fix backed by 9 regression tests (Svelte 5, WXT).',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Oct 2021 - Feb 2022',
      org: 'Accountfy',
      url: 'https://accountfy.com/',
      bullets: [
        'Delivered front-end features, proofs of concept and tech-debt removal in 5 months, and trained the team (AngularJS, Commerce Cloud).',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Oct 2020 - Jun 2021',
      org: 'IT Lean',
      url: 'https://www.itlean.com.br/',
      bullets: [
        'Built the front end of Leanbot, a proprietary conversational-AI product, over 9 months (Angular, PO-UI, Node.js, PostgreSQL, AWS).',
      ],
    },
    {
      role: 'Software Engineer (parallel side project)',
      period: 'Jan 2020 - Jun 2021',
      org: 'nevtec.eu',
      url: 'https://nevtec.eu/',
      bullets: [
        'Delivered on-demand front-end work as a freelancer for 18 months (React, React Native, Node.js, GraphQL).',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Jun 2020 - Aug 2020',
      org: 'Foco Aluguel de Carros',
      url: 'https://www.aluguefoco.com.br/',
      bullets: [
        'In 3 months, built Coral, a fleet check-in and check-out system, and ran client and supplier meetings (Angular, Node.js, MySQL, Power BI).',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Aug 2019 - Jun 2020',
      org: 'Devexo (OrtoClin)',
      url: 'https://clin.digital/',
      bullets: [
        'Developed a dental-health product across 2 platforms, web and mobile (Angular, Ionic, React Native, .NET Core, SQL Server).',
      ],
    },
    {
      role: 'Associate Software Engineer',
      period: 'Jun 2018 - Aug 2019',
      org: 'Avanade',
      url: 'https://www.avanade.com/',
      bullets: [
        'Delivered 8 Power BI dashboards for 3 top-tier Brazilian telecom operators, cutting executive report lag from D+5 to D+1.',
        'Built 5 RPA bots that eliminated ~30 back-office hours per week across billing and ticket triage.',
        'Migrated ~2M rows/day from legacy mainframe tables into a SQL Server warehouse through a scheduled ETL pipeline.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Jan 2018 - May 2018',
      org: 'Tella World',
      bullets: [
        'Built the front end of iBoltt, a ride- and delivery-sharing mobile app, in 5 months (AngularJS, Node.js).',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Oct 2012 - Dec 2017',
      org: 'Qualytech',
      bullets: [
        'Over 5 years, built ConsegnaERP for small businesses and ran software-factory projects for utility, education and real-estate clients (WebForms, .NET, SQL Server).',
      ],
    },
  ],
};

export default en;
