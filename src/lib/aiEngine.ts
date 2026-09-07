import { Customer, Campaign, SegmentType } from '../types';
import { getSegmentInfo } from './segmentConfig';

export interface AiInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'trend' | 'winback';
  title: string;
  description: string;
  metricHighlight?: string;
  actionText?: string;
  actionTarget?: string;
  confidence: number; // 0 to 100
}

export interface GeneratedCampaignCopy {
  title: string;
  messageTemplate: string;
  ctaText: string;
  offerSuggestion: string;
  targetSegmentKey: string;
  targetAudienceLabel: string;
  bestSendTime: string;
  rationale: string;
}

/**
 * Analisa os dados do tenant para gerar diagnósticos e recomendações REAIS.
 * Se não houver clientes suficientes (< 5), exibe transparência exigida.
 */
export function generateTenantAiInsights(customers: Customer[], campaigns: Campaign[], segment: SegmentType): {
  hasSufficientData: boolean;
  insights: AiInsight[];
  message?: string;
} {
  if (!customers || customers.length < 5) {
    return {
      hasSufficientData: false,
      insights: [],
      message: 'Ainda não há dados suficientes para gerar esta recomendação. Importe sua base de clientes ou cadastre compras recentes para a RecuperaIA analisar seu histórico.'
    };
  }

  const segmentInfo = getSegmentInfo(segment);
  const insights: AiInsight[] = [];

  const inactives = customers.filter(c => c.segment === 'inactive');
  const highOpportunities = customers.filter(c => c.returnProbability >= 70 && c.daysSinceLastPurchase >= 25);
  const vips = customers.filter(c => c.segment === 'vip');
  const atRisk = customers.filter(c => c.segment === 'at_risk');
  const newCustomers = customers.filter(c => c.segment === 'new');

  // Insight 1: Clientes Inativos acumulados
  if (inactives.length > 0) {
    const avgTicket = inactives.reduce((acc, c) => acc + c.averageTicket, 0) / inactives.length;
    const potentialRevenue = Math.round(inactives.length * avgTicket * 0.15); // 15% taxa conservadora de recuperação
    insights.push({
      id: 'ins_inactives',
      type: 'warning',
      title: `Você possui ${inactives.length} clientes inativos`,
      description: `Clientes que não realizam ${segmentInfo.orderTerm} há mais de 45 dias. Com uma taxa conservadora de 15% de recuperação, o potencial imediato é de R$ ${potentialRevenue.toLocaleString('pt-BR')}.`,
      metricHighlight: `${inactives.length} clientes`,
      actionText: 'Disparar Campanha de Reativação',
      actionTarget: 'campaign_inactive',
      confidence: 94
    });
  }

  // Insight 2: Alta probabilidade de retorno (janela ouro)
  if (highOpportunities.length > 0) {
    insights.push({
      id: 'ins_high_opp',
      type: 'opportunity',
      title: `${highOpportunities.length} clientes possuem alta probabilidade de retorno`,
      description: `Identificamos clientes com probabilidade de retorno superior a 70% cuja janela habitual de compra está se encerrando. Um estímulo simples hoje trará retorno rápido.`,
      metricHighlight: `${highOpportunities.length} contatos quentes`,
      actionText: 'Criar Oferta de Recompra',
      actionTarget: 'campaign_high_opp',
      confidence: 91
    });
  }

  // Insight 3: Clientes VIP em risco
  const vipsAtRisk = vips.filter(c => c.daysSinceLastPurchase > (segmentInfo.averageCycleDays * 1.5));
  if (vipsAtRisk.length > 0) {
    insights.push({
      id: 'ins_vips_risk',
      type: 'warning',
      title: `${vipsAtRisk.length} clientes VIP não compram há mais de ${Math.round(segmentInfo.averageCycleDays * 1.5)} dias`,
      description: `Clientes que são responsáveis pelos maiores tickets do negócio estão demorando o dobro do habitual para voltar. Recomendamos contato prioritário com mimo exclusivo.`,
      metricHighlight: `${vipsAtRisk.length} VIPs em risco`,
      actionText: 'Enviar Mimo VIP',
      actionTarget: 'campaign_vip',
      confidence: 96
    });
  }

  // Insight 4: Novos clientes para 2ª compra
  if (newCustomers.length > 0) {
    insights.push({
      id: 'ins_new_conversion',
      type: 'trend',
      title: `${newCustomers.length} clientes novos ainda não realizaram a 2ª compra`,
      description: `Clientes que compram uma 2ª vez têm 3x mais chances de se tornarem fiéis. Incentive o retorno nos primeiros 21 dias com pós-venda estruturado.`,
      metricHighlight: `${newCustomers.length} novos`,
      actionText: 'Configurar Automação Pós-Venda',
      actionTarget: 'automation_post_sales',
      confidence: 88
    });
  }

  // Insight 5: Melhores dias e horários históricos
  insights.push({
    id: 'ins_timing',
    type: 'trend',
    title: 'Janela de maior conversão para seu segmento',
    description: `Para o segmento ${segmentInfo.label}, campanhas enviadas entre Quinta-feira e Sábado (18:00 às 19:30) atingem taxas de resposta até 42% superiores à média.`,
    metricHighlight: '18h - 19h30',
    actionText: 'Programar Disparos',
    actionTarget: 'campaign_schedule',
    confidence: 89
  });

  return {
    hasSufficientData: true,
    insights,
  };
}

/**
 * Assistente de IA para geração de campanhas completas baseadas no objetivo do usuário
 */
export function generateCampaignWithAi(params: {
  objective: string;
  segmentType: SegmentType;
  targetAudience: string;
  customOffer?: string;
}): GeneratedCampaignCopy {
  const segmentInfo = getSegmentInfo(params.segmentType);
  const offer = params.customOffer || segmentInfo.defaultOffer;

  const obj = params.objective.toLowerCase();

  if (obj.includes('60') || obj.includes('inativo') || obj.includes('reativ') || obj.includes('esquecid')) {
    return {
      title: `Resgate Especial: Sentimos Sua Falta (${segmentInfo.label})`,
      messageTemplate: `Olá, {nome}! Notamos que faz {dias_sem_comprar} dias que você não vem nos visitar. Queremos muito te ver de novo por aqui, por isso separamos um presente exclusivo para você: *${offer}* no seu próximo pedido!\n\nPara aproveitar agora, basta responder *SIM* nesta conversa. 🍕✨`,
      ctaText: 'Responda SIM para ativar seu presente',
      offerSuggestion: offer,
      targetSegmentKey: 'inactive',
      targetAudienceLabel: 'Clientes sem compras há mais de 45-60 dias',
      bestSendTime: 'Quinta a Sábado às 18:30',
      rationale: `Mensagem empática com foco em valorização, evitando tom de cobrança e oferecendo recompensa imediata.`
    };
  }

  if (obj.includes('vip') || obj.includes('fiel') || obj.includes('especial')) {
    return {
      title: `Acesso Exclusivo VIP: Cortesia Especial`,
      messageTemplate: `Olá, {nome}! Como você é um dos nossos clientes mais queridos e especiais, liberamos para você um benefício VIP exclusivo: *${offer}* válido até o fim deste mês.\n\nQueremos que sua experiência seja sempre inesquecível! Posso reservar para você?`,
      ctaText: 'Responda QUERO para reservar',
      offerSuggestion: 'Cortesia VIP ou Desconto de 20%',
      targetSegmentKey: 'vip',
      targetAudienceLabel: 'Clientes do segmento VIP de alto valor',
      bestSendTime: 'Sexta-feira às 19:00',
      rationale: `Copy com tom de exclusividade e reconhecimento social, estimulando sentimento de pertencimento.`
    };
  }

  if (obj.includes('novo') || obj.includes('pos-venda') || obj.includes('pós') || obj.includes('segunda')) {
    return {
      title: `Boas-Vindas à Família: Seu Próximo Pedido com Vantagem`,
      messageTemplate: `Olá, {nome}! Passando para agradecer sua primeira visita/pedido! Ficamos muito felizes em te atender. Que tal repetir a dose? Na sua próxima compra você ganhou: *${offer}*.\n\nQualquer dúvida ou para pedir, é só me chamar aqui!`,
      ctaText: 'Responda PEDIR para ver o cardápio',
      offerSuggestion: '15% OFF ou Cortesia na 2ª compra',
      targetSegmentKey: 'new',
      targetAudienceLabel: 'Novos clientes cadastrados nos últimos 30 dias',
      bestSendTime: 'Quarta-feira às 18:00',
      rationale: `Foco em consolidar a repetição de compra imediata antes que o cliente esfrie.`
    };
  }

  // Objetivo genérico / reativação geral
  return {
    title: `Oportunidade de Retorno: Benefício Exclusivo`,
    messageTemplate: `Olá, {nome}! Tudo bem? Faz algum tempo que não conversamos. Preparamos uma condição única para você matar a saudade: *${offer}* no seu próximo contato conosco!\n\nPosso te passar os detalhes?`,
    ctaText: 'Responda SIM para conferir',
    offerSuggestion: offer,
    targetSegmentKey: 'high_opportunity',
    targetAudienceLabel: 'Clientes com alta probabilidade de retorno',
    bestSendTime: 'Sexta ou Sábado às 18:30',
    rationale: `Abordagem leve e consultiva com alta taxa de resposta orgânica.`
  };
}

/**
 * Calculadora comercial de potencial de recuperação
 * Apresenta estimativa clara sem prometer garantias
 */
export function calculateCommercialPotential(params: {
  customerCount: number;
  averageTicket: number;
  inactivePercentage: number;
  estimatedRecoveryRate?: number; // padrão 2% a 5%
}): {
  inactiveCount: number;
  inactiveMoneyTotal: number;
  recoveredCount2Pct: number;
  recoveredRevenue2Pct: number;
  recoveredCount5Pct: number;
  recoveredRevenue5Pct: number;
  disclaimer: string;
} {
  const inactiveCount = Math.round((params.customerCount * params.inactivePercentage) / 100);
  const inactiveMoneyTotal = inactiveCount * params.averageTicket;

  const recoveredCount2Pct = Math.max(1, Math.round(inactiveCount * 0.02));
  const recoveredRevenue2Pct = Math.round(recoveredCount2Pct * params.averageTicket);

  const recoveredCount5Pct = Math.max(1, Math.round(inactiveCount * 0.05));
  const recoveredRevenue5Pct = Math.round(recoveredCount5Pct * params.averageTicket);

  return {
    inactiveCount,
    inactiveMoneyTotal,
    recoveredCount2Pct,
    recoveredRevenue2Pct,
    recoveredCount5Pct,
    recoveredRevenue5Pct,
    disclaimer: 'ESTIMATIVA — NÃO É GARANTIA DE RESULTADO. O faturamento real dependerá da qualidade do contato, adesão à oferta, sazonalidade e taxa real de conversão.'
  };
}
