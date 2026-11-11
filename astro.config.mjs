// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Endereço atual na Vercel (o projeto foi renomeado no rebrand; invdevs.vercel.app deixou de existir).
  // Trocar pelo domínio próprio quando ele for registrado e ligado (ver src/data/site.ts).
  site: 'https://vnbuenodigital.vercel.app',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
