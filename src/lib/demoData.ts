import { Tenant, Customer, Campaign, Automation, ChatMessage, AuditLog } from '../types';
import { calculateDaysSince, calculateReturnProbability, classifyCustomerSegment, generateCustomerRecommendation } from './rfmEngine';

export const DEMO_TENANT_ID = 'demo-bella-massa';

export const DEMO_TENANT: Tenant = {
  id: DEMO_TENANT_ID,
  name: 'Pizzaria Bella Massa',
  managerName: 'Carlos Eduardo Silveira',
  email: 'carlos@bellamassa.com.br',
  phone: '(11) 98765-4321',
  segment: 'pizzeria',
  companySize: '6-15 funcionários',
  plan: 'pro',
  planStatus: 'active',
  active: true,
  isDemo: true,
  createdAt: '2024-03-15T10:00:00.000Z',
  salesChannels: ['WhatsApp', 'Delivery (iFood/Próprio)', 'Salão'],
  mainObjective: 'Recuperar clientes inativos e aumentar frequência de pedidos',
  onboardingCompleted: true,
  whatsappConfig: {
    connected: false, // Regra 27: Mostrar "Não conectado" até configurar ou simular conexão oficial
    verifiedName: 'Pizzaria Bella Massa Delivery',
  }
};

const FIRST_NAMES = [
  'Lucas', 'Juliana', 'Gabriel', 'Camila', 'Rodrigo', 'Beatriz', 'Matheus', 'Larissa',
  'Felipe', 'Fernanda', 'Bruno', 'Mariana', 'Thiago', 'Aline', 'Leonardo', 'Amanda',
  'Rafael', 'Bruna', 'Gustavo', 'Carolina', 'Vinicius', 'Patricia', 'Guilherme', 'Vanessa',
  'Eduardo', 'Renata', 'Diego', 'Tatiane', 'Marcelo', 'Priscila', 'Caio', 'Daniela',
  'Alexandre', 'Nathalia', 'Vitor', 'Carla', 'Henrique', 'Sabrina', 'Murilo', 'Bianca',
  'Danilo', 'Leticia', 'Andre', 'Jessica', 'Igor', 'Luana', 'Renan', 'Thais', 'Joao', 'Helena'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
  'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade',
  'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos'
];

const MENU_ITEMS = [
  'Pizza Calabresa Especial',
  'Pizza Margherita com Muçarela de Búfala',
  'Pizza Quatro Queijos Tradicional',
  'Pizza Frango com Catupiry Original',
  'Pizza Portuguesa Completa',
  'Pizza Pepperoni Supreme',
  'Pizza Parma com Rúcula',
  'Borda Vulcão de Catupiry',
  'Pizza Doce Nutella com Morangos',
  'Pizza Doce Banana com Canela',
  'Combo Família (2 Pizzas G + Guaraná 2L)',
  'Esfiha Aberta Artesanal (Porção c/ 6)'
];

/**
 * Gera deterministicamente ~500 clientes fictícios para a Pizzaria Bella Massa
 */
export function generateDemoCustomers(): Customer[] {
  const customers: Customer[] = [];
  const total = 500;
  const now = new Date();

  // Sementes para garantir distribuição realista:
  // ~25% Inativos (45-90 dias)
  // ~15% VIP (alto valor e frequência)
  // ~15% Em Risco (queda de frequência, 30-60 dias)
  // ~15% Novos (1 compra recente, <30 dias)
  // ~20% Alta Oportunidade (retorno provável)
  // ~10% Perdidos (>90 dias)

  for (let i = 1; i <= total; i++) {
    const firstName = FIRST_NAMES[(i * 7 + 3) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 11 + 5) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i % 10 === 0 ? i : ''}@gmail.com`;
    const phone = `(11) 98${String(1000 + (i * 37) % 8999)}-${String(1000 + (i * 53) % 8999)}`;

    let daysAgo = 10;
    let orderCount = 2;
    let avgItemPrice = 85;

    // Distribuição proposital para cobrir todas as categorias do SaaS
    if (i <= 75) {
      // Clientes VIP: frequentes, pedidos recentes
      daysAgo = 5 + (i % 25);
      orderCount = 5 + (i % 8);
      avgItemPrice = 110;
    } else if (i <= 200) {
      // Clientes Inativos: 46 a 88 dias sem comprar
      daysAgo = 46 + (i % 42);
      orderCount = 2 + (i % 4);
      avgItemPrice = 82;
    } else if (i <= 280) {
      // Clientes Em Risco: 32 a 58 dias sem comprar
      daysAgo = 32 + (i % 26);
      orderCount = 3 + (i % 4);
      avgItemPrice = 89;
    } else if (i <= 350) {
      // Clientes Novos: compraram há 2 a 28 dias, 1 compra
      daysAgo = 2 + (i % 26);
      orderCount = 1;
      avgItemPrice = 79;
    } else if (i <= 440) {
      // Alta Oportunidade: bom histórico, 28 a 55 dias
      daysAgo = 28 + (i % 27);
      orderCount = 3 + (i % 3);
      avgItemPrice = 96;
    } else {
      // Clientes Perdidos: >90 dias
      daysAgo = 92 + (i % 45);
      orderCount = 1 + (i % 3);
      avgItemPrice = 75;
    }

    const lastPurchase = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const registeredDate = new Date(lastPurchase.getTime() - (orderCount * 25) * 24 * 60 * 60 * 1000);

    const totalSpend = Math.round(orderCount * avgItemPrice * 100) / 100;
    const averageTicket = Math.round((totalSpend / orderCount) * 100) / 100;

    const returnProb = calculateReturnProbability(daysAgo, orderCount, totalSpend, 18);
    const segment = classifyCustomerSegment(daysAgo, orderCount, totalSpend, returnProb);

    // Histórico de pedidos
    const history = [];
    for (let o = 0; o < Math.min(orderCount, 5); o++) {
      const orderDate = new Date(lastPurchase.getTime() - (o * 18) * 24 * 60 * 60 * 1000);
      history.push({
        id: `ord_${i}_${o}`,
        date: orderDate.toISOString().split('T')[0],
        value: Math.round((averageTicket + (o % 2 === 0 ? 12 : -8)) * 100) / 100,
        items: [
          MENU_ITEMS[(i + o) % MENU_ITEMS.length],
          MENU_ITEMS[(i + o + 3) % MENU_ITEMS.length]
        ]
      });
    }

    const customer: Customer = {
      id: `cust_demo_${i}`,
      tenantId: DEMO_TENANT_ID,
      name: fullName,
      phone,
      email,
      registeredAt: registeredDate.toISOString().split('T')[0],
      lastPurchaseDate: lastPurchase.toISOString().split('T')[0],
      totalSpend,
      purchaseCount: orderCount,
      averageTicket,
      daysSinceLastPurchase: daysAgo,
      segment,
      returnProbability: returnProb,
      purchaseHistory: history,
      notes: i % 4 === 0 ? 'Prefere entrega sem campainha devido a bebê' : (i % 7 === 0 ? 'Gosta de borda recheada de catupiry bem tostada' : ''),
      tags: segment === 'vip' ? ['Frequente', 'Final de Semana'] : (daysAgo > 60 ? ['Inativo', 'Alvo Reativação'] : ['Delivery Regular']),
      preferredChannel: 'whatsapp',
      consentGiven: true,
      consentDate: '2024-01-10T12:00:00.000Z',
    };

    customer.aiRecommendation = generateCustomerRecommendation(customer, 'Pizzaria');
    customers.push(customer);
  }

  return customers;
}

export const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_demo_1',
    tenantId: DEMO_TENANT_ID,
    title: 'Reativação de Inativos 60+ Dias (Borda Recheada Grátis)',
    type: 'winback',
    targetSegment: 'inactive',
    channel: 'whatsapp',
    status: 'completed',
    audienceCount: 180,
    sentCount: 180,
    deliveredCount: 174,
    responseCount: 52,
    conversionCount: 34,
    recoveredRevenue: 3240.00,
    messageTemplate: 'Olá, {nome}! Notamos que faz {dias_sem_comprar} dias que você não saboreia nossa pizza artesanal. Preparamos para você hoje uma BORDA RECHEADA GRÁTIS no seu próximo pedido! Responda SIM para ativar.',
    offerSuggestion: 'Borda Vulcão de Catupiry ou Chocolate Cortesia',
    ctaText: 'Responda SIM para resgatar seu cupom',
    bestSendTime: 'Quinta a Domingo às 18:30',
    createdAt: '2024-05-10T14:00:00.000Z',
    completedAt: '2024-05-18T22:00:00.000Z'
  },
  {
    id: 'camp_demo_2',
    tenantId: DEMO_TENANT_ID,
    title: 'Campanha VIP: Degustação Exclusiva Pizza Parma Trufada',
    type: 'special_offer',
    targetSegment: 'vip',
    channel: 'whatsapp',
    status: 'active',
    audienceCount: 65,
    sentCount: 65,
    deliveredCount: 65,
    responseCount: 38,
    conversionCount: 26,
    recoveredRevenue: 3120.00,
    messageTemplate: 'Olá, {nome}! Como nosso cliente VIP especial, você tem acesso em 1ª mão à nossa nova Pizza Parma Trufada com 20% de desconto de lançamento. Quer reservar para hoje?',
    offerSuggestion: '20% OFF na nova receita artesanal',
    ctaText: 'Responda QUERO para reservar',
    bestSendTime: 'Sexta-feira às 19:00',
    createdAt: '2024-06-01T15:30:00.000Z'
  },
  {
    id: 'camp_demo_3',
    tenantId: DEMO_TENANT_ID,
    title: 'Resgate de Clientes em Risco de Abandono (Ciclo de 30 dias)',
    type: 'repurchase',
    targetSegment: 'at_risk',
    channel: 'whatsapp',
    status: 'active',
    audienceCount: 94,
    sentCount: 94,
    deliveredCount: 91,
    responseCount: 29,
    conversionCount: 19,
    recoveredRevenue: 1780.00,
    messageTemplate: 'Olá, {nome}! Que tal deixar o jantar por nossa conta hoje? Separamos um Guaraná Antarctica 2L gelado de cortesia no seu pedido. Vamos matar a saudade?',
    offerSuggestion: 'Refrigerante 2L de presente no pedido',
    ctaText: 'Responda PEDIR para receber o cardápio',
    bestSendTime: 'Sábado às 18:45',
    createdAt: '2024-06-12T16:00:00.000Z'
  },
  {
    id: 'camp_demo_4',
    tenantId: DEMO_TENANT_ID,
    title: 'Boas-Vindas 2ª Compra (Clientes Novos)',
    type: 'post_sale',
    targetSegment: 'new',
    channel: 'whatsapp',
    status: 'completed',
    audienceCount: 70,
    sentCount: 70,
    deliveredCount: 68,
    responseCount: 31,
    conversionCount: 22,
    recoveredRevenue: 1890.00,
    messageTemplate: 'Olá, {nome}! Esperamos que tenha adorado seu primeiro pedido na Bella Massa! Como presente de boas-vindas contínuas, ganhe 15% OFF no seu segundo pedido até este domingo.',
    offerSuggestion: '15% de desconto de incentivo para 2ª compra',
    ctaText: 'Clique no link ou responda SIM',
    bestSendTime: 'Quarta ou Quinta às 18:30',
    createdAt: '2024-04-20T10:00:00.000Z',
    completedAt: '2024-04-28T22:00:00.000Z'
  }
];

export const DEMO_AUTOMATIONS: Automation[] = [
  {
    id: 'auto_1',
    tenantId: DEMO_TENANT_ID,
    name: 'Reativação Automática 60 Dias',
    description: 'Quando o cliente atinge 60 dias sem novos pedidos, a IA gera mensagem com oferta de retorno e submete para aprovação antes de enviar.',
    triggerType: 'inactive_days',
    active: true,
    requireApproval: true,
    runsCount: 164,
    recoveredCustomers: 48,
    recoveredRevenue: 4460.00,
    createdAt: '2024-03-20T10:00:00.000Z',
    steps: [
      { id: 's1', title: 'Gatilho: Inatividade 60 dias', description: 'Detecta cliente sem compra nos últimos 60 dias', type: 'trigger', status: 'active' },
      { id: 's2', title: 'Filtro: Verificar Segmento', description: 'Garante que o cliente não comprou e tem score > 35%', type: 'condition', status: 'active' },
      { id: 's3', title: 'IA: Gerar Copy Persuasiva', description: 'Redige mensagem contextualizada com nome e cupom', type: 'ai_action', status: 'active' },
      { id: 's4', title: 'Aprovação do Operador', description: 'Envia para fila de disparo autorizado', type: 'approval', status: 'active' },
      { id: 's5', title: 'Disparo via WhatsApp Oficial', description: 'Envia via Meta Cloud API', type: 'channel', status: 'active' },
      { id: 's6', title: 'Mensuração de Conversão', description: 'Registra compra recuperada nos próximos 7 dias', type: 'outcome', status: 'active' }
    ]
  },
  {
    id: 'auto_2',
    tenantId: DEMO_TENANT_ID,
    name: 'Alerta de Retenção de Clientes VIP',
    description: 'Detecta quando um cliente VIP está há mais de 35 dias sem realizar pedidos (ultrapassando seu ciclo médio habitual).',
    triggerType: 'at_risk',
    active: true,
    requireApproval: true,
    runsCount: 42,
    recoveredCustomers: 27,
    recoveredRevenue: 3180.00,
    createdAt: '2024-03-22T10:00:00.000Z',
    steps: [
      { id: 's1', title: 'Gatilho: VIP > 35 dias sem comprar', description: 'Cliente VIP excede o dobro do intervalo médio', type: 'trigger', status: 'active' },
      { id: 's2', title: 'IA: Criar Oferta de Fidelidade', description: 'Sugere mimo exclusivo (ex: sobremesa cortesia)', type: 'ai_action', status: 'active' },
      { id: 's3', title: 'Aprovação Manual', description: 'Revisão rápida de 1 clique', type: 'approval', status: 'active' },
      { id: 's4', title: 'Disparo via WhatsApp', description: 'Mensagem com tom próximo e cordial', type: 'channel', status: 'active' },
      { id: 's5', title: 'Acompanhamento de Retorno', description: 'Mapeia nova compra e recalcula score RFM', type: 'outcome', status: 'active' }
    ]
  },
  {
    id: 'auto_3',
    tenantId: DEMO_TENANT_ID,
    name: 'Pós-Venda e Conversão de Novos Clientes (D+3)',
    description: '3 dias após a primeira compra, envia pesquisa de satisfação e incentivo para a próxima semana.',
    triggerType: 'new_customer',
    active: true,
    requireApproval: true,
    runsCount: 95,
    recoveredCustomers: 39,
    recoveredRevenue: 3410.00,
    createdAt: '2024-04-01T10:00:00.000Z',
    steps: [
      { id: 's1', title: 'Gatilho: Novo Cliente + 3 dias', description: 'Cliente com 1º pedido há 72 horas', type: 'trigger', status: 'active' },
      { id: 's2', title: 'IA: Mensagem de Satisfação', description: 'Pergunta como foi a pizza e agradece a preferência', type: 'ai_action', status: 'active' },
      { id: 's3', title: 'Envio WhatsApp Autorizado', description: 'Mensagem simpática sem tom invasivo', type: 'channel', status: 'active' },
      { id: 's4', title: 'Registro de Feedback', description: 'Identifica promotores e oportunidades de recompra', type: 'outcome', status: 'active' }
    ]
  },
  {
    id: 'auto_4',
    tenantId: DEMO_TENANT_ID,
    name: 'Campanha de Aniversariantes',
    description: 'Envia mensagem comemorativa 2 dias antes do aniversário do cliente com voucher de sobremesa.',
    triggerType: 'birthday',
    active: false,
    requireApproval: true,
    runsCount: 22,
    recoveredCustomers: 14,
    recoveredRevenue: 1350.00,
    createdAt: '2024-04-10T10:00:00.000Z',
    steps: [
      { id: 's1', title: 'Gatilho: Aniversário em 48h', description: 'Verifica data de aniversário cadastrada', type: 'trigger', status: 'active' },
      { id: 's2', title: 'IA: Cupom de Celebração', description: 'Gera mensagem festiva com voucher de pizza doce', type: 'ai_action', status: 'active' },
      { id: 's3', title: 'Envio WhatsApp', description: 'Disparo com link direto de reserva/pedido', type: 'channel', status: 'active' }
    ]
  }
];

export const DEMO_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust_demo_1',
    sender: 'agent',
    text: 'Olá, Lucas! Notamos que faz um tempinho que você não pede sua Margherita favorita. Separamos uma borda de Catupiry grátis para hoje!',
    timestamp: '2024-06-15T18:45:00.000Z',
    status: 'read'
  },
  {
    id: 'msg_2',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust_demo_1',
    sender: 'customer',
    text: 'Opa, que maravilha! Estava mesmo pensando no que pedir pro jantar. Como faço pra resgatar?',
    timestamp: '2024-06-15T18:48:00.000Z',
    status: 'read'
  },
  {
    id: 'msg_3',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust_demo_1',
    sender: 'agent',
    text: 'Perfeito! É só confirmar o seu endereço que já lanço no sistema com a borda de cortesia!',
    timestamp: '2024-06-15T18:50:00.000Z',
    status: 'delivered'
  },
  {
    id: 'msg_4',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust_demo_2',
    sender: 'customer',
    text: 'Recebi a mensagem da pizza trufada, ainda dá tempo de pedir para hoje?',
    timestamp: '2024-06-15T19:20:00.000Z',
    status: 'read'
  }
];

export const DEMO_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    tenantId: DEMO_TENANT_ID,
    userEmail: 'carlos@bellamassa.com.br',
    action: 'LOGIN',
    resource: 'Sessão',
    details: 'Login realizado com sucesso via web',
    timestamp: '2024-06-15T18:00:00.000Z'
  },
  {
    id: 'log_2',
    tenantId: DEMO_TENANT_ID,
    userEmail: 'carlos@bellamassa.com.br',
    action: 'CAMPANHA_APROVADA',
    resource: 'Campanha Reativação 60+ dias',
    details: 'Disparo autorizado para 180 contatos',
    timestamp: '2024-06-15T18:30:00.000Z'
  },
  {
    id: 'log_3',
    tenantId: DEMO_TENANT_ID,
    userEmail: 'carlos@bellamassa.com.br',
    action: 'CONSENTIMENTO_LGPD',
    resource: 'Base de Clientes',
    details: 'Validação de consentimento de marketing e opt-out registrado',
    timestamp: '2024-06-15T18:32:00.000Z'
  }
];
