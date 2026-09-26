export interface TechIcon {
  names: string[];
  file?: string;
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
      { names: ['TypeScript'], file: 'typescript.svg' },
      { names: ['React', 'React Native'], file: 'react.svg' },
      { names: ['Angular', 'AngularJS'], file: 'angular.svg' },
      { names: ['Expo'], file: 'expo.svg', tone: 'mono' },
      { names: ['Next.js'], file: 'nextjs.svg', tone: 'mono' },
      { names: ['Vue'], file: 'vue.svg' },
      { names: ['Svelte'], file: 'svelte.svg' },
      { names: ['Ionic'], file: 'ionic.svg' },
      { names: ['HTML5'], file: 'html5.svg' },
      { names: ['CSS3'], file: 'css3.svg' },
    ],
  },
  {
    key: 'backend',
    items: [
      { names: ['Node.js'], file: 'nodejs.svg' },
      { names: ['NestJS'], file: 'nestjs.svg' },
      { names: ['Go'], file: 'go.svg' },
      { names: ['.NET Core', 'ASP.NET MVC'], file: 'dotnet.svg' },
    ],
  },
  {
    key: 'database',
    items: [
      { names: ['PostgreSQL'], file: 'postgresql.svg' },
      { names: ['SQL Server'], file: 'mssql.svg' },
      { names: ['MySQL'], file: 'mysql.svg' },
      { names: ['SQLite'] },
    ],
  },
  {
    key: 'quality',
    items: [
      { names: ['Vitest'] },
      { names: ['Jest'] },
      { names: ['Testing Library'] },
      { names: ['Playwright'] },
      { names: ['testcontainers'] },
    ],
  },
  {
    key: 'devops',
    items: [
      { names: ['GitHub Actions'], file: 'github.svg', darkFile: 'github-dark.svg' },
      { names: ['AWS'], file: 'aws.svg', darkFile: 'aws-dark.svg' },
      { names: ['Azure DevOps'], file: 'azuredevops.svg' },
      { names: ['Git'], file: 'git.svg' },
      { names: ['Jira'], file: 'jira.svg' },
    ],
  },
  {
    key: 'ai',
    items: [
      { names: ['Claude Code'], file: 'claude.svg', tone: 'mono' },
      { names: ['Codex'], file: 'codex.svg', tone: 'mono' },
      { names: ['MCP'] },
      { names: ['Agent skills & context engineering'] },
    ],
  },
];

export function findExpertiseByKey(key: string): ExpertiseCategory | undefined {
  return expertise.find((c) => c.key === key);
}

export type StackTierKey = 'primary' | 'secondary' | 'tools';

export interface StackTier {
  key: StackTierKey;
  items: TechIcon[];
}

export const stackTiers: StackTier[] = [
  {
    key: 'primary',
    items: [
      { names: ['TypeScript'], file: 'typescript.svg' },
      { names: ['React', 'React Native'], file: 'react.svg' },
      { names: ['Angular'], file: 'angular.svg' },
      { names: ['Expo'], file: 'expo.svg', tone: 'mono' },
      { names: ['Node.js'], file: 'nodejs.svg' },
      { names: ['NestJS'], file: 'nestjs.svg' },
      { names: ['Go'], file: 'go.svg' },
      { names: ['PostgreSQL'], file: 'postgresql.svg' },
    ],
  },
  {
    key: 'secondary',
    items: [
      { names: ['Next.js'], file: 'nextjs.svg', tone: 'mono' },
      { names: ['.NET'], file: 'dotnet.svg' },
      { names: ['Vue'], file: 'vue.svg' },
      { names: ['Svelte'], file: 'svelte.svg' },
      { names: ['Solid'], file: 'solid.svg' },
      { names: ['Ionic'], file: 'ionic.svg' },
      { names: ['SQL Server'], file: 'mssql.svg' },
      { names: ['MySQL'], file: 'mysql.svg' },
    ],
  },
  {
    key: 'tools',
    items: [
      { names: ['Vitest'] },
      { names: ['Playwright'] },
      { names: ['GitHub Actions'], file: 'github.svg', darkFile: 'github-dark.svg' },
      { names: ['AWS'], file: 'aws.svg', darkFile: 'aws-dark.svg' },
      { names: ['Azure DevOps'], file: 'azuredevops.svg' },
      { names: ['Jira'], file: 'jira.svg' },
      { names: ['Claude Code'], file: 'claude.svg', tone: 'mono' },
      { names: ['Codex'], file: 'codex.svg', tone: 'mono' },
      { names: ['MCP'] },
    ],
  },
];
