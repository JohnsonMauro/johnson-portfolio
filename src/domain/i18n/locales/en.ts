import type { Dict } from '../content';

const en: Dict = {
  meta: {
    title: 'Johnson Mauro - Software Engineer',
    description:
      'Software engineer working since 2012, focused on full-stack web and mobile development.',
    keywords:
      'software engineer, full-stack, front-end, angular, react, typescript, .net core, node.js',
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
  },
  cv: {
    contactLabel: 'Contact',
    summaryTitle: 'Professional summary',
    skillsTitle: 'Core skills',
    softSkillsTitle: 'Soft skills',
    experienceTitle: 'Professional experience',
    printAction: 'Print / Save as PDF',
    generatedOn: 'Generated on',
  },
  hero: {
    typedPrefix: "I'm a",
    typedRoles: ['Software Engineer', 'Front-end Developer', 'Freelancer'],
  },
  sections: {
    aboutTitle: 'About me',
    skillsTitle: 'Skills',
    hardSkillsTitle: 'Hard skills',
    softSkillsTitle: 'Soft skills',
    experienceTitle: 'Experience',
  },
  about: {
    greeting: 'Hi There 👋🏽',
    summary:
      "I'm a software engineer working since 2012, with experience in full-stack development, RPA/ETL automation and business intelligence at companies across software, telecom, retail, healthcare, education and the public sector. Emphasis on front-end web and mobile, with full-stack delivery in agile teams.",
    current:
      'Currently focused on web and mobile development, designing interfaces and services with Angular, React, Node.js and .Net Core in agile environments.',
    expertise: [
      { key: 'frontend', label: 'Front-end' },
      { key: 'backend', label: 'Back-end' },
      { key: 'database', label: 'Database' },
      { key: 'devops', label: 'DevOps & Cloud' },
      { key: 'ai', label: 'AI' },
      { key: 'management', label: 'Management' },
    ],
  },
  softSkills: [
    'Communication',
    'Teamwork',
    'Adaptability',
    'Flexibility',
    'Work ethic',
    'Organisation',
    'Problem-solving',
    'Emotional awareness',
  ],
  resume: [
    {
      role: 'Software Engineer',
      period: 'Jan 2022 - Present',
      org: 'InPhonex',
      url: 'https://www.inphonex.com/',
      bullets: [
        'Telephony company headquartered in Miami (USA).',
        'Front-end development.',
        'Proposing and implementing proofs of concept (POC).',
        'Proposing and executing technical debt removal.',
        'Training the technical team.',
        'Stack: Angular.js, React, HTML5, CSS3, JavaScript, self-hosted, Jira.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Oct 2021 - Feb 2022',
      org: 'Accountfy',
      url: 'https://accountfy.com/',
      bullets: [
        'Front-end development.',
        'Proposing and implementing proofs of concept (POC).',
        'Technical debt removal.',
        'Training the technical team.',
        'Stack: Angular.js, HTML5, CSS3, JavaScript, Commerce Cloud, Jira.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Oct 2020 - Jun 2021',
      org: 'IT Lean',
      url: 'https://www.itlean.com.br/',
      bullets: [
        'Front-end development of Leanbot, a proprietary NLP competing in the conversational AI market with client-specific approaches.',
        'Stack: Angular 8+, PO-UI, Node.js, PostgreSQL, AWS, Azure DevOps.',
      ],
    },
    {
      role: 'Software Engineer (parallel side project)',
      period: 'Jan 2020 - Jun 2021',
      org: 'nevtec.eu',
      url: 'https://nevtec.eu/',
      bullets: [
        'Parallel side project: on-demand front-end deliveries under a freelance model, managing schedule via Toggl.',
        'Stack: React, React Native, Node.js, GraphQL, GitHub.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Jun 2020 - Aug 2020',
      org: 'Foco Aluguel de Carros',
      url: 'https://www.aluguefoco.com.br/',
      bullets: [
        'Full-stack development of Coral, a fleet check-in/check-out management system for a car rental company.',
        'Led meetings with clients and suppliers to evolve product capabilities.',
        'Stack: Angular 7+, Node.js, MySQL, Power BI, AWS.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Aug 2019 - Jun 2020',
      org: 'Devexo (OrtoClin)',
      url: 'https://clin.digital/',
      bullets: [
        "Full-stack development of OrtoClin's sanitary dentistry product.",
        'Stack: Angular 6+, Ionic 3+, React Native, .Net Core, .Net Standard, SQL Server, IIS, Azure DevOps.',
      ],
    },
    {
      role: 'Associate Software Engineer',
      period: 'Jun 2018 - Aug 2019',
      org: 'Avanade',
      url: 'https://www.avanade.com/',
      bullets: [
        'BI, RPA, reports and APIs for the largest telecom operators in Brazil.',
        'ETL of tabular mainframe data into an analytical database to feed decision-making.',
        'Built bots to automate processes previously handled by the back office.',
        'Stack: .Net Standard, .Net Core, MVC, Power BI, SQL Server, Azure DevOps, Scrum.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Jan 2018 - May 2018',
      org: 'Tella World',
      bullets: [
        'Front-end for iBoltt, a mobile app for ride and delivery sharing.',
        'Stack: Angular.js, Node.js, MVC, Power BI, SQL Server, Azure DevOps, Scrum.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Oct 2012 - Dec 2017',
      org: 'Qualytech',
      bullets: [
        'Full-stack development of ConsegnaERP, a management ERP for small companies and product suppliers.',
        'Acted as a software factory for Chesf, Senai, public/private schools and the real estate sector.',
        'Stack: WebForms, .Net Standard, SQL Server, IIS, SourceSafe.',
      ],
    },
  ],
  footer: {
    builtWith: 'Built with',
  },
};

export default en;
