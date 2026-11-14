// O que vem em todo site entregue pela VN Bueno Digital. Usado na home (Preços) e na página /sites.
// Mudou alguma regra (prazo, garantia)? Atualize aqui e em site.ts.
import { site } from './site';

export const inclusos = [
  'Visual personalizado com a sua marca (logo, cores, textos e fotos)',
  'Feito primeiro para o celular',
  'Botões de WhatsApp com a mensagem já pronta',
  'Preparado para o Google (conteúdo legível e dados estruturados)',
  'Imagem de compartilhamento para o WhatsApp',
  'Cadeado (HTTPS) e cabeçalhos de segurança nota A',
  'Política de privacidade e cuidado com a LGPD',
  `Pronto em até ${site.prazoSiteDiasUteis} dias úteis depois do material`,
  '30 dias de ajustes depois da entrega',
  'Garantia contra defeitos: 30 dias no pagamento à vista e o tempo todo nos planos com mensalidade',
];
