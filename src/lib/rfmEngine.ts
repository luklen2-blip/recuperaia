import { Customer, CustomerSegmentKey, SegmentDefinition } from '../types';

export const SYSTEM_SEGMENTS: Record<CustomerSegmentKey, SegmentDefinition> = {
  vip: {
    id: 'seg_vip',
    key: 'vip',
    name: '🔥 Clientes VIP',
    description: 'Clientes frequentes e de alto valor acumulado. Fidelização prioritária.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    iconName: 'Crown',
    isSystem: true,
  },
  inactive: {
    id: 'seg_inactive',
    key: 'inactive',
    name: '💤 Clientes Inativos',
    description: 'Clientes sem compras entre 45 e 90 dias. Alvos principais para reativação imediata.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    iconName: 'Moon',
    isSystem: true,
  },
  at_risk: {
    id: 'seg_at_risk',
    key: 'at_risk',
    name: '⚠️ Em Risco de Abandono',
    description: 'Clientes com queda de frequência que costumavam comprar com regularidade.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    iconName: 'AlertTriangle',
    isSystem: true,
  },
  new: {
    id: 'seg_new',
    key: 'new',
    name: '🆕 Novos Clientes',
    description: 'Clientes que fizeram apenas 1 compra nos últimos 30 dias. Momento ideal para 2ª compra.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconName: 'Sparkles',
    isSystem: true,
  },
  high_opportunity: {
    id: 'seg_high_opportunity',
    key: 'high_opportunity',
    name: '💰 Alta Oportunidade',
    description: 'Clientes com alta probabilidade de recompra (score > 70%) e bom ticket médio.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    iconName: 'TrendingUp',
    isSystem: true,
  },
  lost: {
    id: 'seg_lost',
    key: 'lost',
    name: '❌ Clientes Perdidos',
    description: 'Clientes sem nenhuma atividade há mais de 90 dias. Requerem ofertas agressivas.',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    iconName: 'UserX',
    isSystem: true,
  },
};

/**
 * Calcula os dias decorridos desde a data da última compra
 */
export function calculateDaysSince(dateStr: string): number {
  if (!dateStr) return 999;
  const target = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - target.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calcula a probabilidade de retorno (0 a 100%)
 * com base na recência, frequência e valor médio
 */
export function calculateReturnProbability(
  daysSinceLastPurchase: number,
  purchaseCount: number,
  totalSpend: number,
  averageCycleDays: number = 25
): number {
  let score = 90;

  // Penalidade por inatividade além do ciclo médio
  if (daysSinceLastPurchase > averageCycleDays) {
    const daysOverdue = daysSinceLastPurchase - averageCycleDays;
    score -= daysOverdue * 0.9;
  } else {
    // Está dentro do ciclo normal
    score += 5;
  }

  // Bônus por frequência
  if (purchaseCount >= 5) score += 12;
  else if (purchaseCount >= 3) score += 6;
  else if (purchaseCount === 1) score -= 8;

  // Bônus por volume financeiro
  if (totalSpend > 300) score += 8;
  else if (totalSpend > 150) score += 4;

  // Limite razoável entre 5% e 96%
  const finalScore = Math.max(5, Math.min(96, Math.round(score)));
  return finalScore;
}

/**
 * Classifica o cliente em um dos segmentos RFM
 */
export function classifyCustomerSegment(
  daysSinceLastPurchase: number,
  purchaseCount: number,
  totalSpend: number,
  returnProbability: number
): CustomerSegmentKey {
  // VIP: frequente e bom gasto
  if (purchaseCount >= 4 && totalSpend >= 280 && daysSinceLastPurchase <= 45) {
    return 'vip';
  }

  // Novos: 1 compra recente
  if (purchaseCount === 1 && daysSinceLastPurchase <= 30) {
    return 'new';
  }

  // Perdidos: mais de 90 dias sem contato
  if (daysSinceLastPurchase > 90) {
    return 'lost';
  }

  // Alta Oportunidade: retorno provável e janela propícia
  if (returnProbability >= 70 && daysSinceLastPurchase >= 25 && daysSinceLastPurchase <= 65) {
    return 'high_opportunity';
  }

  // Em risco: já comprou mais de 1 vez, mas está atrasando
  if (purchaseCount >= 2 && daysSinceLastPurchase > 30 && daysSinceLastPurchase <= 55) {
    return 'at_risk';
  }

  // Inativo padrão
  if (daysSinceLastPurchase > 45) {
    return 'inactive';
  }

  // Padrão de oportunidade se probabilidade boa
  if (returnProbability >= 60) {
    return 'high_opportunity';
  }

  return 'inactive';
}

/**
 * Gera recomendação personalizada de IA para a ficha do cliente
 */
export function generateCustomerRecommendation(customer: Customer, segmentLabel: string): string {
  const { name, daysSinceLastPurchase, purchaseCount, totalSpend, returnProbability } = customer;
  const firstName = name.split(' ')[0];

  if (daysSinceLastPurchase > 90) {
    return `${firstName} não realiza pedidos há ${daysSinceLastPurchase} dias e está classificado como perdido. Sugere-se uma campanha de reativação com cupom forte de boas-vindas de volta.`;
  }

  if (customer.segment === 'vip') {
    return `${firstName} é cliente VIP com ${purchaseCount} compras e R$ ${totalSpend.toFixed(2)} acumulados. Recomenda-se mimo de fidelidade ou acesso antecipado a novidades para manter alto engajamento.`;
  }

  if (customer.segment === 'at_risk') {
    return `${firstName} costumava comprar com frequência e está há ${daysSinceLastPurchase} dias sem pedir (probabilidade de retorno estimada em ${returnProbability}%). Envie uma mensagem lembrando do prato favorito para evitar perda.`;
  }

  if (customer.segment === 'new') {
    return `${firstName} realizou seu 1º pedido recentemente. Esta é a melhor janela para um contato de pós-venda garantindo satisfação e incentivando a 2ª compra em até 14 dias.`;
  }

  if (returnProbability >= 75) {
    return `${firstName} possui probabilidade alta de retorno (${returnProbability}%). Um lembrete amigável com um benefício imediato tem grande chance de conversão nesta semana.`;
  }

  return `${firstName} está há ${daysSinceLastPurchase} dias sem contato. Recomenda-se teste de mensagem personalizada pelo WhatsApp com oferta atrativa de retorno.`;
}
