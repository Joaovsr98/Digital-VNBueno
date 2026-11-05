// Dados de contato e marca usados em todo o site.
// Preencha antes de publicar: o formulário de orçamento só envia com o WhatsApp configurado.

export const site = {
  nome: 'INV Devs',
  url: 'https://invdevs.com.br',
  slogan: 'Transformamos ideias em soluções digitais para o seu negócio.',
  descricao:
    'A INV Devs desenvolve sites, landing pages, sistemas web e aplicativos sob medida para empresas e profissionais. Solicite seu orçamento.',
  cidade: 'São Paulo, SP',

  // Número com DDI e DDD, só dígitos.
  whatsapp: '5511925272694',
  // TODO: preencher quando o e-mail profissional existir (ex.: contato@invdevs.com.br)
  email: '',

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
