# INV Devs — site oficial

Site institucional da INV Devs (invdevs.com.br), feito com Astro + Tailwind CSS.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Gera a pasta `dist/`, estática. Na Vercel o framework Astro é detectado sozinho.

## Onde editar

- Contato (WhatsApp, e-mail, redes): `src/data/site.ts`
- Portfólio: `src/data/projetos.ts` — prints vão em `public/portfolio/`
- Textos da página inicial: `src/pages/index.astro`
- Política de privacidade: `src/pages/privacidade.astro`
