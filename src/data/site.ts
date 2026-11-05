// Dados de contato e marca usados em todo o site.
// Preencha antes de publicar: o formulário de orçamento só envia com o WhatsApp configurado.

export const site = {
  nome: 'INV Devs',
  // Endereço que existe HOJE. Usado no canonical, no sitemap e na imagem de compartilhamento
  // (WhatsApp busca a imagem neste endereço). Quando invdevs.com.br estiver registrado e ligado
  // na Vercel, trocar aqui, em astro.config.mjs e em public/robots.txt.
  url: 'https://invdevs.vercel.app',
  slogan: 'Transformamos ideias em soluções digitais para o seu negócio.',
  descricao:
    'A INV Devs desenvolve sites, landing pages, sistemas web e aplicativos sob medida para empresas e profissionais. Solicite seu orçamento.',
  cidade: 'São Paulo, SP',

  // Número com DDI e DDD, só dígitos.
  whatsapp: '5511925272694',
  // Trocar por contato@invdevs.com.br quando o domínio e o e-mail profissional existirem.
  email: 'contato.invdevs@gmail.com',
  // Responsável pelos dados (LGPD). Pessoa física por enquanto; trocar pelo CNPJ quando houver.
  responsavel: 'João Victor dos Santos Rodrigues',

  // Vercel Web Analytics: ligar aqui SÓ depois de ativar na aba Analytics do projeto na Vercel.
  // Liga o script no <head> e o parágrafo correspondente na política de privacidade.
  analytics: false,

  instagram: 'https://www.instagram.com/inv.devs',
  tiktok: 'https://www.tiktok.com/@inv.devs',
};

export function linkWhatsApp(mensagem = 'Olá! Vim pelo site da INV Devs e gostaria de um orçamento.') {
  if (!site.whatsapp) return '#orcamento';
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
