// Portfólio exibido no site.
//
// Regras (ver CLAUDE.md §5):
// - `tipo` precisa refletir a realidade: só use 'contratado' para trabalho pago com autorização de divulgação.
// - `publicar: false` esconde o projeto até ele ser revisado.
// - `demo: false` esconde o link quando o projeto não está 100% funcional para demonstração.
// - Imagens: salve capturas reais em public/portfolio/<arquivo> e preencha `imagem`.

export type TipoProjeto = 'contratado' | 'pessoal' | 'academico' | 'demonstracao' | 'a-confirmar';

export interface Projeto {
  nome: string;
  segmento: string;
  descricao: string;
  destaques: string[];
  stack: string[];
  url: string;
  tipo: TipoProjeto;
  publicar: boolean;
  demo: boolean;
  imagem?: string;
}

export const rotuloTipo: Record<TipoProjeto, string | null> = {
  contratado: 'Projeto para cliente',
  pessoal: 'Projeto autoral',
  academico: 'Projeto acadêmico',
  demonstracao: 'Projeto demonstrativo',
  'a-confirmar': null, // TODO: definir o tipo de cada projeto antes de publicar
};

export const projetos: Projeto[] = [
  {
    nome: 'Bueno Imóveis',
    segmento: 'Mercado imobiliário',
    descricao:
      'Site imobiliário com vitrine de apartamentos e lançamentos em São Paulo, captação de interessados e contato direto pelo WhatsApp. Conteúdo pré-renderizado para ser encontrado no Google.',
    destaques: ['Vitrine de imóveis', 'Captação de leads', 'Integração com WhatsApp', 'Otimizado para SEO'],
    stack: ['React'],
    url: 'https://corretorbr.vercel.app',
    tipo: 'academico', // o próprio site declara: "projeto de caráter acadêmico e curricular"
    publicar: true,
    demo: true,
  },
  {
    nome: 'Mondel Group',
    segmento: 'Logística internacional',
    descricao:
      'Site institucional para empresa de logística, com apresentação clara de serviços e canais de contato.',
    destaques: ['Site institucional', 'Layout responsivo', 'Apresentação de serviços'],
    stack: ['React', 'Tailwind CSS'],
    url: 'https://mondel-group.vercel.app',
    tipo: 'a-confirmar',
    publicar: true,
    demo: true,
  },
  {
    nome: 'Posto 22',
    segmento: 'Postos e serviços rodoviários',
    descricao:
      'Presença digital para empresa do segmento rodoviário, reunindo serviços, localização e contato em um só lugar.',
    destaques: ['Site institucional', 'Informações de serviços', 'Contato rápido'],
    stack: [],
    url: 'https://posto22.vercel.app',
    tipo: 'a-confirmar',
    publicar: false,
    demo: true,
  },
  {
    nome: 'Paddock 22',
    segmento: 'Comércio',
    descricao:
      'Interface comercial com identidade visual própria, pensada para funcionar bem no celular e no computador.',
    destaques: ['Identidade visual personalizada', 'Interface responsiva'],
    stack: ['React', 'Vite'],
    url: 'https://paddock22.vercel.app',
    tipo: 'a-confirmar',
    publicar: false,
    demo: true,
  },
  {
    nome: 'Rota Financeira',
    segmento: 'Finanças pessoais',
    descricao:
      'Aplicação para organizar dívidas e planejar as finanças, com regras de negócio e telas interativas.',
    destaques: ['Organização de dívidas', 'Planejamento financeiro', 'Interface interativa'],
    stack: ['React', 'TypeScript'],
    url: 'https://rotafin.vercel.app',
    tipo: 'a-confirmar',
    publicar: false,
    demo: true,
  },
  {
    nome: "Bueno's House",
    segmento: 'Restaurantes',
    descricao:
      'Sistema para restaurante com gestão de pedidos, perfis de usuário e integração entre frontend e backend. Em desenvolvimento.',
    destaques: ['Gestão de pedidos', 'Perfis de usuário', 'Frontend + API'],
    stack: ['Angular', 'TypeScript', 'Java', 'Spring Boot', 'MySQL'],
    url: 'https://bueno-s-house.vercel.app',
    tipo: 'academico',
    publicar: false,
    demo: false, // backend precisa ser verificado antes de liberar a demonstração
  },
];
