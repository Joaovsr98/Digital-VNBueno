// Portfólio exibido no site.
//
// Regras (ver CLAUDE.md §5):
// - `tipo` precisa refletir a realidade: só use 'contratado' para trabalho pago com autorização de divulgação.
// - `publicar: false` esconde o projeto até ele ser revisado.
// - `demo: false` esconde o link quando o projeto não está 100% funcional para demonstração.
// - Imagens: salve capturas reais em public/portfolio/<arquivo> e preencha `imagem`.
// - `resultado` fala com o dono do negócio (o que ele ganha), sem termo técnico.
//   A parte técnica fica em `stack`, pequena, no fim do card.

export type TipoProjeto = 'contratado' | 'em-andamento' | 'pessoal' | 'academico' | 'demonstracao' | 'modelo' | 'a-confirmar';

// 'sistemas' = produtos próprios (SaaS): vão para a seção "Produtos VN Bueno Digital", fora da grade de sites.
export type Categoria = 'imobiliario' | 'servicos' | 'empresas' | 'eventos' | 'sistemas';

export const categorias: Record<Categoria, string> = {
  imobiliario: 'Imobiliário',
  servicos: 'Oficinas e serviços',
  empresas: 'Empresas',
  eventos: 'Eventos',
  sistemas: 'Sistemas e apps',
};

export interface Projeto {
  nome: string;
  categoria: Categoria;
  segmento: string;
  resultado: string;
  descricao: string;
  destaques: string[];
  stack: string[];
  url: string;
  tipo: TipoProjeto;
  publicar: boolean;
  demo: boolean;
  imagem?: string;
  /** Notas reais medidas (Lighthouse do Google, computador, e securityheaders.com). Só preencher com medição feita. */
  notas?: { desempenho?: number; seguranca: string; medidoEm: string };
  /** Só para produtos (categoria 'sistemas'): situação atual, mostrada no lugar do tipo. */
  status?: string;
}

export const rotuloTipo: Record<TipoProjeto, string | null> = {
  contratado: 'Projeto para cliente',
  'em-andamento': 'Projeto em andamento',
  pessoal: 'Projeto autoral',
  academico: 'Projeto acadêmico',
  demonstracao: 'Projeto demonstrativo',
  modelo: 'Modelo disponível', // demo sem dono, à venda como modelo pronto (com a marca do cliente)
  'a-confirmar': null, // TODO: definir o tipo de cada projeto antes de publicar
};

/** Mensagem pronta do botão "Quero um site assim". */
export function mensagemInteresse(p: Projeto) {
  if (p.tipo === 'modelo') return `Olá! Vi o modelo ${p.nome} no portfólio da VN Bueno Digital e quero esse modelo com a marca do meu negócio.`;
  const oQue = p.categoria === 'sistemas' ? 'um sistema' : 'um site';
  return `Olá! Vi o projeto ${p.nome} no portfólio da VN Bueno Digital e quero ${oQue} parecido para o meu negócio.`;
}

export const projetos: Projeto[] = [
  {
    // Marca fictícia VN Racing (antes INV Racing e Paddock 22). Repo: Joaovsr98/vn-racing
    // Desde 11/11/2026 é oferecido como modelo pronto (tipo 'modelo'): troca marca, cores, datas e contatos.
    nome: 'VN Racing',
    categoria: 'eventos',
    segmento: 'Campeonatos e eventos',
    resultado: 'Modelo pronto para kartódromo, campeonato ou liga de sim racing: entra com a sua marca, cores e datas.',
    descricao:
      'Visual de transmissão ao vivo, com mapa animado do circuito, telemetria e contagem regressiva para a próxima etapa.',
    destaques: ['Inscrição pelo WhatsApp', 'Contagem regressiva', 'Mapa animado', 'Calendário e ranking'],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    url: 'https://invdevs-kart.vercel.app',
    imagem: '/portfolio/inv-racing.webp',
    tipo: 'modelo',
    notas: { seguranca: 'A', medidoEm: 'novembro de 2026' },
    publicar: true,
    demo: true,
  },
  {
    // Pedido de um amigo, dono da oficina; ainda em ajustes e sem fechamento (05/11/2026). Repo: Joaovsr98/garagemnotredame
    nome: 'Garagem NotreDame',
    categoria: 'servicos',
    segmento: 'Oficina mecânica em Taboão da Serra',
    resultado: 'Site para oficina que transforma quem pesquisa no Google em agendamento pelo WhatsApp.',
    descricao:
      'Fotos e vídeo reais da equipe, selo de "aberto agora" pelo horário da oficina e orçamento de cada serviço com a mensagem pronta no WhatsApp.',
    destaques: ['Orçamento por serviço no WhatsApp', 'Fotos e vídeo reais', 'Aberto agora', 'Galeria que desliza'],
    stack: ['React', 'TypeScript', 'Tailwind CSS'],
    url: 'https://garagemnotredame.vercel.app',
    imagem: '/portfolio/garagem-notredame.webp',
    tipo: 'em-andamento',
    notas: { seguranca: 'A', medidoEm: 'novembro de 2026' },
    publicar: true,
    demo: true,
  },
  {
    nome: 'Bueno Imóveis',
    categoria: 'imobiliario',
    segmento: 'Corretor de imóveis em São Paulo',
    resultado: 'Site para corretor que recebe contatos de compradores direto no WhatsApp.',
    descricao:
      'Vitrine de apartamentos e lançamentos, páginas de bairro e um diagnóstico que entende o perfil de quem quer comprar.',
    destaques: ['Vitrine de imóveis', 'Contatos no WhatsApp', 'Aparece no Google', 'Páginas por bairro'],
    stack: ['React', 'TypeScript'],
    url: 'https://corretorbr.vercel.app',
    imagem: '/portfolio/bueno-imoveis.webp',
    tipo: 'academico', // o próprio site declara: "projeto de caráter acadêmico e curricular"
    notas: { seguranca: 'A', medidoEm: 'novembro de 2026' },
    publicar: true,
    demo: true,
  },
  {
    nome: 'Mondel Group',
    categoria: 'empresas',
    segmento: 'Logística internacional',
    resultado: 'Site institucional que recebe pedidos de cotação de clientes de vários países.',
    descricao:
      'Apresenta serviços, frota e unidades com clareza, em português, espanhol e inglês.',
    destaques: ['Pedido de cotação', '3 idiomas', 'WhatsApp', 'Site institucional'],
    stack: ['React', 'Vite'],
    url: 'https://mondel-group.vercel.app',
    imagem: '/portfolio/mondel-group.webp',
    tipo: 'demonstracao',
    notas: { seguranca: 'A', medidoEm: 'novembro de 2026' },
    publicar: true,
    demo: true,
  },
  {
    // Produto próprio do fundador. Código fica fora desta pasta (o fundador mexe nele em outro lugar).
    nome: 'Doce Gestão Financeira',
    categoria: 'sistemas',
    segmento: 'App de finanças pessoais',
    resultado: 'Aplicativo que organiza dívidas e mostra um plano possível para quitar cada uma.',
    descricao:
      'Prioriza pagamentos, calcula o Índice de Liberdade e prevê quando a pessoa fica livre das dívidas. Funciona até sem internet.',
    destaques: ['Plano de quitação', 'Índice de Liberdade', 'Funciona sem internet', '~800 testes automatizados'],
    stack: ['React', 'TypeScript', 'IndexedDB', 'Recharts'],
    url: 'https://dgfinanceira.vnbueno.com.br', // domínio próprio desde 11/11/2026 (docegestaofinanceira.vercel.app e finrotiva redirecionam)
    imagem: '/portfolio/doce-gestao-financeira.webp',
    tipo: 'pessoal',
    status: 'Versão 1.0 no ar',
    publicar: true,
    demo: true,
  },
  {
    nome: 'Posto 22',
    categoria: 'servicos',
    segmento: 'Postos e serviços rodoviários',
    resultado: 'Presença digital para posto de estrada.',
    descricao:
      'Reúne serviços, localização e contato em um só lugar.',
    destaques: ['Site institucional', 'Informações de serviços', 'Contato rápido'],
    stack: [],
    url: 'https://posto22.vercel.app',
    tipo: 'a-confirmar',
    publicar: false, // fundador: manter guardado, fora do portfólio
    demo: true,
  },
  {
    nome: 'Rota Financeira',
    categoria: 'sistemas',
    segmento: 'Finanças pessoais',
    resultado: 'Versão antiga do Doce Gestão Financeira.',
    descricao:
      'Aplicação para organizar dívidas e planejar as finanças.',
    destaques: ['Organização de dívidas', 'Planejamento financeiro'],
    stack: ['React', 'TypeScript'],
    url: 'https://rotafin.vercel.app',
    tipo: 'a-confirmar',
    publicar: false, // versão antiga do Doce Gestão
    demo: true,
  },
  {
    nome: "Bueno's House",
    categoria: 'sistemas',
    segmento: 'SaaS para restaurantes',
    // SaaS próprio do fundador, em desenvolvimento (começou como projeto acadêmico).
    resultado: 'Sistema para restaurante: cardápio, pedidos, cozinha, caixa e entregas no mesmo lugar.',
    descricao:
      'O cliente pede pelo cardápio digital e acompanha o pedido; a equipe trabalha com telas próprias para garçom, cozinha, caixa e motoboy, além de estoque e ficha técnica.',
    destaques: ['Cardápio digital', 'Pedido em tempo real', 'Telas por função', 'Estoque e ficha técnica'],
    stack: ['Angular', 'TypeScript', 'Java', 'Spring Boot', 'MySQL'],
    url: 'https://bueno-s-house.vercel.app',
    imagem: '/portfolio/bueno-s-house.webp',
    tipo: 'pessoal',
    status: 'Em desenvolvimento',
    publicar: true,
    demo: false, // backend (Render) demora a acordar: cardápio ficou carregando >8s em 05/11/2026
  },
];
