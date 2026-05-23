import type { Dict } from '../content';

const pt: Dict = {
  meta: {
    title: 'Johnson Mauro - Engenheiro de Software',
    description:
      'Engenheiro de software atuando desde 2012, com foco em desenvolvimento full-stack web e mobile.',
    keywords:
      'engenheiro de software, full-stack, front-end, angular, react, typescript, .net core, node.js',
    mailSubject: 'Mensagem de johnsonmauro.github.io',
    jobTitle: 'Engenheiro de Software',
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
    softSkillsTitle: 'Soft skills',
    experienceTitle: 'Experiência profissional',
    printAction: 'Imprimir / Salvar como PDF',
    generatedOn: 'Gerado em',
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
    hardSkillsTitle: 'Hard skills',
    softSkillsTitle: 'Soft skills',
    experienceTitle: 'Experiência',
  },
  about: {
    greeting: 'Olá 👋🏽',
    summary:
      'Sou engenheiro de software atuando desde 2012, com vivência em desenvolvimento full-stack, automações RPA/ETL e business intelligence em empresas dos setores de software, telecom, varejo, saúde, educação e setor público. Ênfase em front-end web e mobile, com participação em projetos full-stack e times ágeis.',
    current:
      'Atualmente foco em desenvolvimento web e mobile, projetando interfaces e serviços com Angular, React, Node.js e .Net Core em ambientes ágeis.',
    expertise: [
      { key: 'frontend', label: 'Front-end' },
      { key: 'backend', label: 'Back-end' },
      { key: 'database', label: 'Banco de dados' },
      { key: 'devops', label: 'DevOps & Cloud' },
      { key: 'ai', label: 'IA' },
      { key: 'management', label: 'Gestão' },
    ],
  },
  softSkills: [
    'Comunicação',
    'Trabalho em equipe',
    'Adaptabilidade',
    'Flexibilidade',
    'Ética profissional',
    'Organização',
    'Resolução de problemas',
    'Inteligência emocional',
  ],
  resume: [
    {
      role: 'Software Engineer',
      period: 'Jan 2022 - Presente',
      org: 'InPhonex',
      url: 'https://www.inphonex.com/',
      bullets: [
        'Empresa de telefonia sediada em Miami (EUA).',
        'Desenvolvimento front-end.',
        'Proposta e implementação de provas de conceito (POC).',
        'Proposta e execução de eliminação de débitos técnicos.',
        'Treinamento da equipe técnica.',
        'Stack: Angular.js, React, HTML5, CSS3, JavaScript, self-hosted, Jira.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Out 2021 - Fev 2022',
      org: 'Accountfy',
      url: 'https://accountfy.com/',
      bullets: [
        'Desenvolvimento front-end.',
        'Proposta e implementação de provas de conceito (POC).',
        'Eliminação de débitos técnicos.',
        'Treinamento da equipe técnica.',
        'Stack: Angular.js, HTML5, CSS3, JavaScript, Commerce Cloud, Jira.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Out 2020 - Jun 2021',
      org: 'IT Lean',
      url: 'https://www.itlean.com.br/',
      bullets: [
        'Desenvolvimento front-end do Leanbot, NLP proprietária para competir no mercado de assistentes conversacionais com abordagens específicas por cliente.',
        'Stack: Angular 8+, PO-UI, Node.js, PostgreSQL, AWS, Azure DevOps.',
      ],
    },
    {
      role: 'Software Engineer (projeto pessoal paralelo)',
      period: 'Jan 2020 - Jun 2021',
      org: 'nevtec.eu',
      url: 'https://nevtec.eu/',
      bullets: [
        'Projeto pessoal paralelo: entregas front-end sob demanda em regime freelance, com gestão de agenda via Toggl.',
        'Stack: React, React Native, Node.js, GraphQL, GitHub.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Jun 2020 - Ago 2020',
      org: 'Foco Aluguel de Carros',
      url: 'https://www.aluguefoco.com.br/',
      bullets: [
        'Desenvolvimento full-stack do sistema Coral, plataforma de gestão de entrada e saída de veículos alugados.',
        'Condução de reuniões com clientes e fornecedores para evolução de funcionalidades.',
        'Stack: Angular 7+, Node.js, MySQL, Power BI, AWS.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Ago 2019 - Jun 2020',
      org: 'Devexo (OrtoClin)',
      url: 'https://clin.digital/',
      bullets: [
        'Desenvolvimento full-stack do produto de odontologia sanitária da OrtoClin.',
        'Stack: Angular 6+, Ionic 3+, React Native, .Net Core, .Net Standard, SQL Server, IIS, Azure DevOps.',
      ],
    },
    {
      role: 'Associate Software Engineer',
      period: 'Jun 2018 - Ago 2019',
      org: 'Avanade',
      url: 'https://www.avanade.com/',
      bullets: [
        'BI, RPA, relatórios e APIs para as maiores operadoras de telefonia do Brasil.',
        'ETL de dados tabulados de mainframe para banco analítico, alimentando tomada de decisão.',
        'Desenvolvimento de robôs para automatizar processos antes executados pelo back office.',
        'Stack: .Net Standard, .Net Core, MVC, Power BI, SQL Server, Azure DevOps, Scrum.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Jan 2018 - Mai 2018',
      org: 'Tella World',
      bullets: [
        'Front-end do iBoltt, app mobile de compartilhamento de caronas e entregas.',
        'Stack: Angular.js, Node.js, MVC, Power BI, SQL Server, Azure DevOps, Scrum.',
      ],
    },
    {
      role: 'Software Engineer',
      period: 'Out 2012 - Dez 2017',
      org: 'Qualytech',
      bullets: [
        'Desenvolvimento full-stack do ERP ConsegnaERP, sistema de gestão para pequenas empresas e fornecedores.',
        'Atendimento como fábrica de software para Chesf, Senai, escolas públicas/privadas e setor imobiliário.',
        'Stack: WebForms, .Net Standard, SQL Server, IIS, SourceSafe.',
      ],
    },
  ],
  footer: {
    builtWith: 'Feito com',
  },
};

export default pt;
