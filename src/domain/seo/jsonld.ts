import type { Locale } from '../i18n/config';

interface PersonInput {
  name: string;
  lang: Locale;
  url: string;
  imageUrl: string;
  jobTitle: string;
  description: string;
  email: string;
  sameAs: string[];
}

export function personJsonLd(input: PersonInput): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    url: input.url,
    image: input.imageUrl,
    jobTitle: input.jobTitle,
    description: input.description,
    email: `mailto:${input.email}`,
    inLanguage: input.lang === 'pt' ? 'pt-BR' : 'en-US',
    sameAs: input.sameAs,
  };
  return JSON.stringify(data);
}
