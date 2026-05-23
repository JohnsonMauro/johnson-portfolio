import type { Dict } from '../content';

const en: Dict = {
  meta: {
    title: 'Johnson Mauro - Software Engineer',
    description:
      'Software engineer with 14+ years working with backend, DevOps, and Fintech.',
    keywords:
      'software engineer, backend, devops, python, golang, csharp, fintech',
    mailSubject: 'Mail from johnsonmauro.github.io',
    jobTitle: 'Software Engineer',
  },
  nav: {
    home: 'Home',
    about: 'About',
    experience: 'Experience',
    languageSwitcherLabel: 'Switch language',
  },
  hero: {
    typedPrefix: "I'm a",
    typedRoles: ['Software Engineer', 'Front-end Developer', 'Freelancer'],
  },
  sections: {
    aboutTitle: 'About me',
    skillsTitle: 'Skills',
    experienceTitle: 'Experience',
  },
  about: {
    greeting: 'Hi There 👋🏽',
    summary:
      "I'm a software engineer with 14+ years working in software, data science, DevOps and business environments in companies in the software, finance, retail, military, education and industry areas. Last 4 years of work focused on Fintechs with 5 different medium and large companies.",
    current:
      'Currently working on programming and designing financial services using Python, C# .Net Core and Go languages in high performance and scalable architectures.',
    expertise: [
      { label: 'Coding', value: 'Python, C#, Go.' },
      {
        label: 'DevOps',
        value:
          'Cloud on AWS, Google, Azure and IBM | Container with Docker | CI / CD integrations | Integrations between APIs | Service Configuration and Monitoring | Bitbucket, Gitlab, Github and Microsoft Devops.',
      },
      {
        label: 'Database',
        value: 'Postgres, MongoDB, NoSQL, ElasticSearch, SQL Server.',
      },
      {
        label: 'Management',
        value:
          'Scrum, Kanban, Lean | Jira, Asana, Trello, Redmine, ClickUp, Kitemaker.',
      },
      {
        label: 'Blockchain',
        value: 'Smart contracts | NFTs | ICOs | Cadence, Ganache, Go Ethereum.',
      },
    ],
  },
  resume: [
    {
      role: 'Technical Lead',
      period: '2021 - Present',
      org: 'Prosperità, São Paulo, Brazil',
      bullets: [
        'Leader in a team with 5 developers',
        'Definition, design, development and maintenance of applications.',
        'Partnership with the product management team',
      ],
    },
    {
      role: 'Senior Software Engineer',
      period: '2020 - 2021',
      org: 'Inmetrics, São Paulo, Brazil',
      bullets: [
        'Involved in the implementation of the new Brazilian digital payment service called "PIX" in a big financial company.',
        'Design and development of new solutions.',
        'Technical reference on team.',
      ],
    },
    {
      role: 'Senior Software Engineer',
      period: '2019 - 2020',
      org: 'Moura Group, Pernambuco, Brazil',
      bullets: [
        'Hands-on leadership in a project to create microservices to meet the needs of operation and administration of payment, transaction, risk analysis, logistics, purchasing and registration services.',
        'Directly responsible for the financial reconciliation application project, increasing the assertiveness indicator of sales and settlement operations from less than 30% to 99%, ensuring control and security and greater gains for the company.',
        'Strong communication with product management teams and DevOps.',
      ],
    },
    {
      role: 'DevOps Engineer',
      period: '2018 - 2019',
      org: 'Pitang, Pernambuco, Brazil',
      bullets: [
        'Design and implementation of infrastructure / DevOps resources, ensuring agility in the planning, development, testing, release and continuous monitoring processes.',
        'Support for production systems in an environment of more than 50 integrated education systems.',
        'Analyze and solve deep technical problems, managing configurations and applying service upgrade and migration.',
      ],
    },
    {
      role: 'Software Engineer',
      period: '2018 - 2018',
      org: 'Kurier, Pernambuco, Brazil',
      bullets: [
        'Member in the development of the analytical justice project. Using ElasticSearch search engine and Machine learning to predict legal results in court judgments.',
        'Member in the development of a system for managing license sales and customer and partner registration.',
        'Performed Web Crawler Application Maintenance that connects to more than 60 court judgment tracking portals and converts data into texts.',
      ],
    },
    {
      role: 'Senior System Analyst',
      period: '2016 - 2018',
      org: 'Ondunorte, Pernambuco, Brazil',
    },
    {
      role: 'Senior System Analyst',
      period: '2015 - 2016',
      org: 'Rangel Group, Rio de Janeiro, Brazil',
    },
    {
      role: 'System Analyst',
      period: '2013 - 2015',
      org: 'Trigo Group, Rio de Janeiro, Brazil',
    },
    {
      role: 'Infrastructure Analyst, Military',
      period: '2006 - 2012',
      org: 'Brazilian Navy, Brazil',
    },
  ],
  footer: {
    builtWith: 'Built with',
  },
};

export default en;
