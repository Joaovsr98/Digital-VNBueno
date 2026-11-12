// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Domínio oficial (ver src/data/site.ts e public/robots.txt).
  site: 'https://digital.vnbueno.com.br',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Segurança (CSP): gera todo <script> do Astro como arquivo em /_astro/, nunca inline.
      // Assim a política `script-src 'self'` do vercel.json funciona sem 'unsafe-inline' nem hashes.
      // Validado em 12/11/2026: com 0, as páginas ficam sem módulo inline; o CSS gerado não muda.
      assetsInlineLimit: 0,
    },
  },
});
