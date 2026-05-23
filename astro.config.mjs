import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://johnsonmauro.github.io',
  base: '/johnson-portfolio',
  trailingSlash: 'ignore',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
});
