import type { Locale } from './config';

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

const pt: Dict = {
  meta: {
    title: 'Johnson Mauro - Engenheiro de Software',
    description:
      'Engenheiro de software com mais de 14 anos de experiência em backend, DevOps e Fintech.',
    keywords:
      'engenheiro de software, backend, devops, python, golang, csharp, fintech',
    mailSubject: 'Mensagem de johnsonmauro.github.io',
    jobTitle: 'Engenheiro de Software',
  },
  nav: {
    home: 'Início',
    about: 'Sobre',
    experience: 'Experiência',
    languageSwitcherLabel: 'Alternar idioma',
  },
  hero: {
    typedPrefix: 'Sou',
    typedRoles: [
      'Engenheiro de Software',
      'Desenvolvedor Front-end',
      'Freelancer',
    ],
  },
  sections: {
    aboutTitle: 'Sobre mim',
    skillsTitle: 'Habilidades',
    experienceTitle: 'Experiência',
  },
  about: {
    greeting: 'Olá 👋🏽',
    summary:
      'Sou engenheiro de software com mais de 14 anos de atuação em desenvolvimento, ciência de dados, DevOps e áreas de negócio em empresas dos setores de software, financeiro, varejo, militar, educação e indústria. Nos últimos 4 anos, foco em Fintechs, passando por 5 empresas de médio e grande porte.',
    current:
      'Atualmente desenvolvendo e projetando serviços financeiros em Python, C# .Net Core e Go, com foco em arquiteturas escaláveis e de alta performance.',
    expertise: [
      { label: 'Programação', value: 'Python, C#, Go.' },
      {
        label: 'DevOps',
        value:
          'Cloud na AWS, Google, Azure e IBM | Containers com Docker | Integrações CI / CD | Integrações entre APIs | Configuração e monitoramento de serviços | Bitbucket, Gitlab, Github e Microsoft Devops.',
      },
      {
        label: 'Banco de dados',
        value: 'Postgres, MongoDB, NoSQL, ElasticSearch, SQL Server.',
      },
      {
        label: 'Gestão',
        value:
          'Scrum, Kanban, Lean | Jira, Asana, Trello, Redmine, ClickUp, Kitemaker.',
      },
      {
        label: 'Blockchain',
        value:
          'Smart contracts | NFTs | ICOs | Cadence, Ganache, Go Ethereum.',
      },
    ],
  },
  resume: [
    {
      role: 'Líder Técnico',
      period: '2021 - Presente',
      org: 'Prosperità, São Paulo, Brasil',
      bullets: [
        'Liderança de time com 5 desenvolvedores.',
        'Definição, design, desenvolvimento e manutenção de aplicações.',
        'Parceria com o time de gestão de produto.',
      ],
    },
    {
      role: 'Engenheiro de Software Sênior',
      period: '2020 - 2021',
      org: 'Inmetrics, São Paulo, Brasil',
      bullets: [
        'Atuação na implementação do PIX em uma grande instituição financeira.',
        'Design e desenvolvimento de novas soluções.',
        'Referência técnica no time.',
      ],
    },
    {
      role: 'Engenheiro de Software Sênior',
      period: '2019 - 2020',
      org: 'Grupo Moura, Pernambuco, Brasil',
      bullets: [
        'Liderança técnica em projeto de microsserviços para pagamento, transação, análise de risco, logística, compras e cadastro.',
        'Responsável pelo projeto de conciliação financeira, elevando a assertividade de vendas e liquidações de menos de 30% para 99% e ampliando controle, segurança e ganhos da empresa.',
        'Comunicação próxima com os times de produto e DevOps.',
      ],
    },
    {
      role: 'Engenheiro DevOps',
      period: '2018 - 2019',
      org: 'Pitang, Pernambuco, Brasil',
      bullets: [
        'Design e implementação de recursos de infraestrutura/DevOps, garantindo agilidade em planejamento, desenvolvimento, testes, release e monitoramento contínuo.',
        'Sustentação de produção em ambiente com mais de 50 sistemas educacionais integrados.',
        'Análise e resolução de problemas técnicos complexos, gerenciando configurações e aplicando upgrades e migrações de serviço.',
      ],
    },
    {
      role: 'Engenheiro de Software',
      period: '2018 - 2018',
      org: 'Kurier, Pernambuco, Brasil',
      bullets: [
        'Atuação no projeto de justiça analítica, usando ElasticSearch e Machine Learning para prever resultados em sentenças judiciais.',
        'Atuação em sistema de gestão de venda de licenças e cadastro de clientes e parceiros.',
        'Manutenção de Web Crawlers que conectam a mais de 60 portais de acompanhamento processual e convertem dados em texto.',
      ],
    },
    {
      role: 'Analista de Sistemas Sênior',
      period: '2016 - 2018',
      org: 'Ondunorte, Pernambuco, Brasil',
    },
    {
      role: 'Analista de Sistemas Sênior',
      period: '2015 - 2016',
      org: 'Grupo Rangel, Rio de Janeiro, Brasil',
    },
    {
      role: 'Analista de Sistemas',
      period: '2013 - 2015',
      org: 'Grupo Trigo, Rio de Janeiro, Brasil',
    },
    {
      role: 'Analista de Infraestrutura, Militar',
      period: '2006 - 2012',
      org: 'Marinha do Brasil, Brasil',
    },
  ],
  footer: {
    builtWith: 'Feito com',
  },
};

const content: Record<Locale, Dict> = { en, pt };

export function getDict(lang: Locale): Dict {
  return content[lang];
}
