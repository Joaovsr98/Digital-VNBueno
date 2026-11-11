// Dados de contato e marca usados em todo o site.
// Preencha antes de publicar: o formulário de orçamento só envia com o WhatsApp configurado.

export const site = {
  nome: 'VN Bueno Digital',
  // Domínio oficial desde 11/11/2026 (subdomínio de vnbueno.com.br, CNAME no Registro.br).
  // Usado no canonical, no sitemap e na imagem de compartilhamento. vnbuenodigital.vercel.app redireciona.
  // Mudou? Trocar aqui, em astro.config.mjs e em public/robots.txt.
  url: 'https://digital.vnbueno.com.br',
  slogan: 'Transformamos ideias em soluções digitais para o seu negócio.',
  descricao:
    'A VN Bueno Digital desenvolve sites, landing pages, sistemas web e aplicativos sob medida para empresas e profissionais. Solicite seu orçamento.',
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

  instagram: 'https://www.instagram.com/vnbuenodigital/',
  // TikTok da VN Bueno Digital ainda não criado. Com a URL aqui, o link volta a aparecer no rodapé.
  tiktok: '',
};

export function linkWhatsApp(mensagem = 'Olá! Vim pelo site da VN Bueno Digital e gostaria de um orçamento.') {
  if (!site.whatsapp) return '#orcamento';
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
