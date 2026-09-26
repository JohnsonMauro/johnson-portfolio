import type { Dict } from '../content';

const pt: Dict = {
  meta: {
    title: 'Johnson Mauro - Engenheiro de Software',
    description:
      'Engenheiro de software com 13+ anos em full-stack web e mobile. Entrega com agentes de IA sob specs, testes e revisão: modernização de legado, integrações e apps offline-first.',
    keywords:
      'engenheiro de software, software engineer, full-stack, front-end, desenvolvimento assistido por ia, agentes de ia, claude code, mcp, engenharia de contexto, react, react native, expo, angular, typescript, node.js, nestjs, go, postgresql, .net core, vitest, playwright, tdd, modernização de legado, offline-first, azure devops, agile, mentoria',
    mailSubject: 'Mensagem de johnsonmauro.github.io',
    jobTitle: 'Engenheiro de Software · Entrega com agentes de IA',
  },
  nav: {
    home: 'Início',
    about: 'Sobre',
    experience: 'Experiência',
    languageSwitcherLabel: 'Alternar idioma',
    themeToggleLabel: 'Alternar tema',
    themeToggleToDark: 'Ativar tema escuro',
    themeToggleToLight: 'Ativar tema claro',
    printCv: 'Imprimir / baixar currículo',
    printCvShort: 'CV',
    backToSite: 'Voltar ao site',
  },
  cv: {
    contactLabel: 'Contato',
    summaryTitle: 'Resumo profissional',
    skillsTitle: 'Habilidades principais',
    aiTitle: 'Como construo com IA',
    practicesTitle: 'Práticas de engenharia',
    experienceTitle: 'Experiência profissional',
    printAction: 'Imprimir / Salvar como PDF',
    generatedOn: 'Gerado em',
  },
  hero: {
    typedPrefix: 'Sou',
    typedRoles: [
      'Engenheiro de Software',
      'Engenheiro Full-stack',
      'Orquestrador de agentes de IA',
    ],
  },
  sections: {
    aboutTitle: 'Sobre mim',
    skillsTitle: 'Habilidades',
    experienceTitle: 'Experiência',
    stackPrimaryLabel: 'Principal',
    stackSecondaryLabel: 'Experiência em produção',
    stackToolsLabel: 'Ferramentas & IA',
  },
  about: {
    greeting: 'Olá 👋🏽',
    summary:
      'Engenheiro de software com 13+ anos entregando produtos web e mobile em telecom, saúde, varejo e educação. Orquestro agentes de IA: escrevo as specs, o contexto e as regras, delego a implementação e valido com testes e revisão antes de qualquer merge. Mais forte em React, Angular, TypeScript e Node.js, da modernização de legado ao mobile offline-first.',
    current:
      'Coliderando a reescrita em React 19 de uma plataforma de telefonia dos EUA, dono da integração com CRM, e construindo um app mobile de força de vendas como sócio de uma startup de ERP.',
    currentLabel: 'Foco atual',
    stats: [
      { value: '13+', label: 'Anos entregando software' },
      { value: '40+', label: 'Skills de Claude Code criadas' },
      { value: '0→3k', label: 'Testes numa reescrita coliderada' },
      { value: 'Remote', label: 'First, fluente em fusos' },
    ],
    ctaCv: 'Baixar CV',
    ctaLinkedin: 'LinkedIn',
    expertise: [
      { key: 'ai', label: 'Engenharia com IA' },
      { key: 'frontend', label: 'Front-end & mobile' },
      { key: 'backend', label: 'Back-end' },
      { key: 'database', label: 'Banco de dados' },
      { key: 'quality', label: 'Testes' },
      { key: 'devops', label: 'DevOps & entrega' },
    ],
  },
  skills: {
    aiKicker: 'Como trabalho hoje',
    aiTitle: 'Eu direciono os agentes. O resultado é meu.',
    aiIntro:
      'Menos tempo digitando código, mais tempo decidindo o que construir, como os agentes constroem e se está certo. Cada prática abaixo tem lastro em repositórios reais.',
    aiPractices: [
      {
        title: 'Design de contexto para agentes',
        proof:
          '40+ skills de Claude Code e contratos CLAUDE.md em 7 repositórios, transformando convenções do time em regras que os agentes seguem.',
      },
      {
        title: 'Delegação guiada por spec',
        proof:
          'Planos, ADRs e critérios de aceite antes do código; 200+ commits em par com agentes desde março de 2026.',
      },
      {
        title: 'Verificar, não confiar',
        proof:
          'TDD e revisão humana em todo diff de agente: 1.300+ testes em projetos que lidero, mais uma suíte de 0→3k numa reescrita coliderada.',
      },
      {
        title: 'Guardrails de arquitetura',
        proof:
          'Fronteiras DDD e feature-sliced checadas pelo lint, mais skills de segurança e acessibilidade que os agentes precisam aplicar.',
      },
    ],
    judgmentTitle: 'Julgamento de engenharia',
    judgment: [
      'Modernização de legado',
      'Mobile offline-first',
      'APIs multi-tenant',
      'Integrações OAuth & webhooks',
      'Mensageria em tempo real',
      'WCAG 2.2 AA',
      'Hardening OWASP',
      'Padrões de time & mentoria',
    ],
    stackTitle: 'Stack',
  },
  resume: [
    {
      role: 'Software Engineer',
      period: 'Jan 2022 - Presente',
      org: 'InPhonex',
      url: 'https://www.inphonex.com/',
      bullets: [
        'Coliderei a reescrita de um admin de telefonia (227k linhas) de React 16/CRA para React 19, Vite 8 e TypeScript 6: 788 commits, 2º/22.',
        'Levei a cobertura de zero a ~3.000 casos e 71,5% das linhas, adicionando 459 arquivos de teste com Vitest e Testing Library.',
        'Construí de ponta a ponta a integração CRM-telefonia, com API de 14 módulos, SDK de chamadas embarcado e 985 testes, em NestJS, NATS e Playwright.',
        'Padronizei a entrega assistida por IA em 4 repositórios do time com 26 skills de Claude Code e ~1,2k linhas de contexto para agentes.',
        'Reduzi em 37% o tamanho da instalação de dependências (720 para 454 MB) migrando de Yarn para pnpm.',
        'Entreguei 1.135 commits no produto AngularJS de 12 anos enquanto a reescrita avançava.',
      ],
    },
    {
      role: 'Sócio & Software Engineer',
      period: 'Mai 2026 - Presente',
      org: 'Startup de ERP',
      bullets: [
        'Construí sozinho um app de força de vendas em 6 semanas: 92 commits, 13 telas, ~18k linhas, em Expo SDK 56, React Native 0.85, TypeScript.',
        'Desenhei pedidos offline-first em 8 módulos DDD, enfileirando no SQLite do aparelho e sincronizando em segundo plano.',
        'Escrevi ~347 testes unitários e de componente; 53% dos commits foram em par com Claude Code, guiados por 8 skills próprias do projeto.',
        'Entreguei o módulo de devoluções do ERP em 5 fases (~6k linhas), cobrindo API .NET 10, wizard em React e NF-e de devolução.',
      ],
    },
    {
      role: 'Software Engineer Freelancer',
      period: 'Set 2025 - Presente',
      org: 'Clientes freelance',
      bullets: [
        'Entreguei a plataforma bilíngue de uma escola de inglês da v1.0 à v2.4: 91 commits, 14 PRs mergeados, deploy contínuo, em Next.js 16.',
        'Atingi no Lighthouse mobile 96 em acessibilidade, 100 em boas práticas e 100 em SEO após adequação WCAG 2.2 AA.',
        'Fechei uma auditoria alinhada ao OWASP com 10 achados, adicionando headers HSTS, CSP e COOP e corrigindo 16 dependências vulneráveis.',
        'Desenhei uma API REST multi-tenant com 19 endpoints, JWT com papéis e 11 ADRs documentados, testada contra PostgreSQL real, em Go.',
      ],
    },
    {
      role: 'Contribuidor open source',
      period: 'Jul 2026 - Presente',
      org: 'Extensão de navegador para site de trade de jogo',
      bullets: [
        'Tive 2 PRs mergeados numa extensão Chrome/Firefox de 38k linhas, incluindo correção de scroll com 9 testes de regressão (Svelte 5, WXT).',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Out 2021 - Fev 2022',
      org: 'Accountfy',
      url: 'https://accountfy.com/',
      bullets: [
        'Entreguei features front-end, provas de conceito e eliminação de débito técnico, e treinei o time (AngularJS, Commerce Cloud).',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Out 2020 - Jun 2021',
      org: 'IT Lean',
      url: 'https://www.itlean.com.br/',
      bullets: [
        'Construí o front-end do Leanbot, produto proprietário de IA conversacional (Angular, PO-UI, Node.js, PostgreSQL, AWS).',
      ],
    },
    {
      role: 'Software Engineer (projeto pessoal paralelo)',
      period: 'Jan 2020 - Jun 2021',
      org: 'nevtec.eu',
      url: 'https://nevtec.eu/',
      bullets: [
        'Entreguei trabalhos front-end sob demanda como freelancer (React, React Native, Node.js, GraphQL).',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Jun 2020 - Ago 2020',
      org: 'Foco Aluguel de Carros',
      url: 'https://www.aluguefoco.com.br/',
      bullets: [
        'Construí o Coral, sistema de entrada e saída de frota, e conduzi reuniões com clientes e fornecedores (Angular, Node.js, MySQL, Power BI).',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Ago 2019 - Jun 2020',
      org: 'Devexo (OrtoClin)',
      url: 'https://clin.digital/',
      bullets: [
        'Desenvolvi um produto de odontologia sanitária em web e mobile (Angular, Ionic, React Native, .NET Core, SQL Server).',
      ],
    },
    {
      role: 'Associate Software Engineer',
      period: 'Jun 2018 - Ago 2019',
      org: 'Avanade',
      url: 'https://www.avanade.com/',
      bullets: [
        'Entreguei 8 dashboards Power BI para 3 das maiores operadoras de telefonia do Brasil, reduzindo o lag de relatórios executivos de D+5 para D+1.',
        'Construí 5 bots RPA que eliminaram ~30 horas/semana de back-office em billing e triagem de chamados.',
        'Migrei ~2M linhas/dia de tabelas legadas em mainframe para um warehouse SQL Server via pipeline ETL agendado.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Jan 2018 - Mai 2018',
      org: 'Tella World',
      bullets: [
        'Construí o front-end do iBoltt, app mobile de caronas e entregas compartilhadas (AngularJS, Node.js).',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Out 2012 - Dez 2017',
      org: 'Qualytech',
      bullets: [
        'Construí o ConsegnaERP para pequenas empresas e atuei como fábrica de software para clientes de energia, educação e imobiliário (WebForms, .NET, SQL Server).',
      ],
    },
  ],
};

export default pt;
