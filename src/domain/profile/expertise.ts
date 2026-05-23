export interface TechIcon {
  names: string[];
  file: string;
  darkFile?: string;
  tone?: 'color' | 'mono';
}

export interface ExpertiseCategory {
  key: string;
  items: TechIcon[];
}

export const expertise: ExpertiseCategory[] = [
  {
    key: 'frontend',
    items: [
      { names: ['HTML5'], file: 'html5.svg' },
      { names: ['CSS3'], file: 'css3.svg' },
      { names: ['JavaScript'], file: 'javascript.svg' },
      { names: ['TypeScript'], file: 'typescript.svg' },
      { names: ['Angular 2+'], file: 'angular.svg' },
      { names: ['React', 'React Native'], file: 'react.svg' },
      { names: ['Vue'], file: 'vue.svg' },
      { names: ['Svelte'], file: 'svelte.svg' },
      { names: ['Solid'], file: 'solid.svg' },
      { names: ['Ionic'], file: 'ionic.svg' },
      { names: ['Expo'], file: 'expo.svg', tone: 'mono' },
      { names: ['Next.js'], file: 'nextjs.svg', tone: 'mono' },
    ],
  },
  {
    key: 'backend',
    items: [
      {
        names: ['.Net Standard', '.Net Core', 'ASP.NET MVC'],
        file: 'dotnet.svg',
      },
      { names: ['Node.js'], file: 'nodejs.svg' },
      { names: ['NestJS'], file: 'nestjs.svg' },
      { names: ['Go'], file: 'go.svg' },
    ],
  },
  {
    key: 'database',
    items: [
      { names: ['SQL Server'], file: 'mssql.svg' },
      { names: ['MySQL'], file: 'mysql.svg' },
      { names: ['PostgreSQL'], file: 'postgresql.svg' },
    ],
  },
  {
    key: 'devops',
    items: [
      { names: ['AWS'], file: 'aws.svg', darkFile: 'aws-dark.svg' },
      { names: ['Azure DevOps'], file: 'azuredevops.svg' },
      { names: ['Git'], file: 'git.svg' },
      {
        names: ['GitHub'],
        file: 'github.svg',
        darkFile: 'github-dark.svg',
      },
    ],
  },
  {
    key: 'ai',
    items: [
      { names: ['Claude'], file: 'claude.svg', tone: 'mono' },
      { names: ['Codex'], file: 'codex.svg', tone: 'mono' },
    ],
  },
  {
    key: 'management',
    items: [
      { names: ['Jira'], file: 'jira.svg' },
      { names: ['Toggl'], file: 'toggl.svg', tone: 'mono' },
    ],
  },
];

export function findExpertiseByKey(key: string): ExpertiseCategory | undefined {
  return expertise.find((c) => c.key === key);
}
