/**
 * Camada de Armazenamento Resiliente do RecuperaIA
 * Tenta persistir no PostgreSQL via Prisma ORM; caso o banco ainda não esteja
 * provisionado em ambiente local de desenvolvimento, mantém persistência síncrona em memória
 * para permitir navegação e testes completos sem bloquear o desenvolvedor.
 */

import { prisma } from './prisma';

interface InMemoryTenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  segment: string;
  companySize: string;
  plan: string;
  planStatus: string;
  isLiveMode: boolean;
  onboardingCompleted: boolean;
  salesChannels: string[];
  mainObjective: string;
  createdAt: string;
}

interface InMemoryUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  tenantId: string;
}

interface InMemoryCustomer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  segment: string;
  totalSpend: number;
  purchaseCount: number;
  averageTicket: number;
  daysSinceLastPurchase: number;
  returnProbability: number;
  aiRecommendation?: string;
  consentGiven: boolean;
  consentDate: string;
  notes: string;
}

interface InMemoryOrder {
  id: string;
  tenantId: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  externalId?: string;
  source: string;
  status: string;
  totalValue: number;
  itemsJson: string;
  checkoutUrl?: string;
  createdAt: string;
}

interface InMemoryMessage {
  id: string;
  tenantId: string;
  customerId: string;
  channel: string;
  direction: string;
  content: string;
  status: string;
  isAiGenerated: boolean;
  isSandbox: boolean;
  createdAt: string;
}

// Armazém em memória com dados semente padrão (Demo Bella Massa & Admin)
const memoryStore = {
  tenants: [
    {
      id: 'demo-bella-massa',
      name: 'Bella Massa Pizzaria & Empório',
      slug: 'bella-massa',
      email: 'contato@bellamassa.com.br',
      phone: '11987654321',
      segment: 'restaurant',
      companySize: 'small',
      plan: 'pro',
      planStatus: 'active',
      isLiveMode: false,
      onboardingCompleted: true,
      salesChannels: ['WhatsApp', 'Cardápio Digital', 'iFood'],
      mainObjective: 'Recuperar clientes inativos e carrinhos do cardápio',
      createdAt: new Date().toISOString(),
    },
  ] as InMemoryTenant[],

  users: [
    {
      id: 'usr_admin',
      email: 'admin@recuperaia.com.br',
      passwordHash: '$2a$10$w85LqV4rF6bL3jX.4Lq/Ou7vK5aXv3zU.G5gIq6f6C1xG9B5F9Z.', // admin123
      name: 'Administrador RecuperaIA',
      role: 'SUPERADMIN',
      tenantId: 'demo-bella-massa',
    },
    {
      id: 'usr_bella',
      email: 'contato@bellamassa.com.br',
      passwordHash: '$2a$10$w85LqV4rF6bL3jX.4Lq/Ou7vK5aXv3zU.G5gIq6f6C1xG9B5F9Z.',
      name: 'Luciano Gerente',
      role: 'OWNER',
      tenantId: 'demo-bella-massa',
    },
  ] as InMemoryUser[],

  customers: [
    {
      id: 'cust_1',
      tenantId: 'demo-bella-massa',
      name: 'Mariana Silveira',
      phone: '11988887777',
      email: 'mariana.silveira@gmail.com',
      segment: 'inactive',
      totalSpend: 420.0,
      purchaseCount: 4,
      averageTicket: 105.0,
      daysSinceLastPurchase: 48,
      returnProbability: 72,
      aiRecommendation: 'Cliente com alto histórico. Disparar cupom de fidelidade com sobremesa cortesia.',
      consentGiven: true,
      consentDate: new Date().toISOString(),
      notes: 'Preferência por pizzas artesanais aos sábados.',
    },
    {
      id: 'cust_2',
      tenantId: 'demo-bella-massa',
      name: 'Carlos Eduardo Mendes',
      phone: '11977776666',
      email: 'carlos.mendes@uol.com.br',
      segment: 'at_risk',
      totalSpend: 750.0,
      purchaseCount: 7,
      averageTicket: 107.14,
      daysSinceLastPurchase: 28,
      returnProbability: 58,
      aiRecommendation: 'Envia mensagem cordial oferecendo 10% de cashback no PIX.',
      consentGiven: true,
      consentDate: new Date().toISOString(),
      notes: 'Costuma pedir combos família.',
    },
    {
      id: 'cust_3',
      tenantId: 'demo-bella-massa',
      name: 'Beatriz Almeida',
      phone: '11966665555',
      email: 'bia.almeida@outlook.com',
      segment: 'vip',
      totalSpend: 1350.0,
      purchaseCount: 12,
      averageTicket: 112.5,
      daysSinceLastPurchase: 10,
      returnProbability: 95,
      aiRecommendation: 'Agradecimento VIP com convite para experimentar novos sabores da semana.',
      consentGiven: true,
      consentDate: new Date().toISOString(),
      notes: 'Cliente VIP mais assídua da região dos Jardins.',
    },
  ] as InMemoryCustomer[],

  orders: [
    {
      id: 'ord_1',
      tenantId: 'demo-bella-massa',
      customerId: 'cust_1',
      customerName: 'Mariana Silveira',
      customerPhone: '11988887777',
      externalId: 'CART_9821',
      source: 'SHOPIFY',
      status: 'ABANDONED_CART',
      totalValue: 124.9,
      itemsJson: JSON.stringify(['Pizza Margherita Especial', 'Vinho Chileno Tinto', 'Petit Gâteau']),
      checkoutUrl: 'https://bellamassa.com.br/checkout/recupera-9821',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'ord_2',
      tenantId: 'demo-bella-massa',
      customerId: 'cust_2',
      customerName: 'Carlos Eduardo Mendes',
      customerPhone: '11977776666',
      externalId: 'PIX_5512',
      source: 'MERCADOPAGO',
      status: 'PENDING_PIX',
      totalValue: 98.0,
      itemsJson: JSON.stringify(['Combo Pizza Grande + Refrigerante 2L']),
      checkoutUrl: 'https://bellamassa.com.br/checkout/pix-5512',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ] as InMemoryOrder[],

  messages: [] as InMemoryMessage[],
};

export const resilientStore = {
  // TENANTS
  async findTenantById(id: string) {
    try {
      const dbTenant = await prisma.tenant.findUnique({ where: { id } });
      if (dbTenant) return dbTenant;
    } catch {
      // Falha de banco, usa memória
    }
    return memoryStore.tenants.find((t) => t.id === id) || null;
  },

  async findTenantByEmail(email: string) {
    const clean = email.trim().toLowerCase();
    try {
      const dbTenant = await prisma.tenant.findFirst({ where: { email: clean } });
      if (dbTenant) return dbTenant;
    } catch {
      // Fallback
    }
    return memoryStore.tenants.find((t) => t.email.toLowerCase() === clean) || null;
  },

  async listTenants() {
    try {
      const dbTenants = await prisma.tenant.findMany();
      if (dbTenants.length > 0) return dbTenants;
    } catch {
      // Fallback
    }
    return memoryStore.tenants;
  },

  async createTenant(data: {
    name: string;
    email: string;
    phone?: string;
    segment?: string;
    companySize?: string;
  }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36);
    const newTenant: InMemoryTenant = {
      id: `tenant_${Date.now()}`,
      name: data.name,
      slug,
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      segment: data.segment || 'retail',
      companySize: data.companySize || 'small',
      plan: 'start',
      planStatus: 'trialing',
      isLiveMode: false,
      onboardingCompleted: false,
      salesChannels: [],
      mainObjective: 'Recuperação de Vendas e Carrinhos',
      createdAt: new Date().toISOString(),
    };

    try {
      const dbTenant = await prisma.tenant.create({
        data: {
          id: newTenant.id,
          name: newTenant.name,
          slug: newTenant.slug,
          email: newTenant.email,
          phone: newTenant.phone,
          segment: newTenant.segment,
          companySize: newTenant.companySize,
          plan: newTenant.plan,
          planStatus: newTenant.planStatus,
          isLiveMode: newTenant.isLiveMode,
        },
      });
      memoryStore.tenants.push(newTenant);
      return dbTenant;
    } catch {
      memoryStore.tenants.push(newTenant);
      return newTenant;
    }
  },

  // USERS
  async findUserByEmail(email: string) {
    const clean = email.trim().toLowerCase();
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: clean },
        include: { members: true },
      });
      if (dbUser) return dbUser;
    } catch {
      // Fallback
    }
    return memoryStore.users.find((u) => u.email.toLowerCase() === clean) || null;
  },

  async createUser(data: {
    email: string;
    name: string;
    passwordHash: string;
    role?: string;
    tenantId: string;
  }) {
    const newUser: InMemoryUser = {
      id: `usr_${Date.now()}`,
      email: data.email.trim().toLowerCase(),
      name: data.name,
      passwordHash: data.passwordHash,
      role: data.role || 'OWNER',
      tenantId: data.tenantId,
    };

    try {
      const dbUser = await prisma.user.create({
        data: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          passwordHash: newUser.passwordHash,
          role: newUser.role,
          members: {
            create: {
              tenantId: data.tenantId,
              role: newUser.role,
            },
          },
        },
      });
      memoryStore.users.push(newUser);
      return dbUser;
    } catch {
      memoryStore.users.push(newUser);
      return newUser;
    }
  },

  // CUSTOMERS (Strict multi-tenant)
  async listCustomers(tenantId: string, segment?: string) {
    try {
      const where: { tenantId: string; segment?: string } = { tenantId };
      if (segment) where.segment = segment;
      const dbCust = await prisma.customer.findMany({ where });
      if (dbCust.length > 0) return dbCust;
    } catch {
      // Fallback
    }
    return memoryStore.customers.filter((c) => {
      if (c.tenantId !== tenantId) return false;
      if (segment && c.segment !== segment) return false;
      return true;
    });
  },

  async createCustomer(data: {
    tenantId: string;
    name: string;
    phone: string;
    email?: string;
    segment?: string;
    notes?: string;
    totalSpend?: number;
  }) {
    const newCust: InMemoryCustomer = {
      id: `cust_${Date.now()}`,
      tenantId: data.tenantId,
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      segment: data.segment || 'new',
      totalSpend: data.totalSpend || 0,
      purchaseCount: 1,
      averageTicket: data.totalSpend || 0,
      daysSinceLastPurchase: 0,
      returnProbability: 60,
      consentGiven: true,
      consentDate: new Date().toISOString(),
      notes: data.notes || '',
    };

    try {
      const dbCust = await prisma.customer.create({
        data: {
          id: newCust.id,
          tenantId: newCust.tenantId,
          name: newCust.name,
          phone: newCust.phone,
          email: newCust.email,
          segment: newCust.segment,
          totalSpend: newCust.totalSpend,
          purchaseCount: newCust.purchaseCount,
          averageTicket: newCust.averageTicket,
          daysSinceLastPurchase: newCust.daysSinceLastPurchase,
          returnProbability: newCust.returnProbability,
          notes: newCust.notes,
        },
      });
      memoryStore.customers.push(newCust);
      return dbCust;
    } catch {
      memoryStore.customers.push(newCust);
      return newCust;
    }
  },

  // ORDERS / CARTS (Strict multi-tenant)
  async listOrders(tenantId: string, status?: string) {
    try {
      const where: { tenantId: string; status?: string } = { tenantId };
      if (status) where.status = status;
      const dbOrders = await prisma.order.findMany({
        where,
        include: { customer: true },
      });
      if (dbOrders.length > 0) return dbOrders;
    } catch {
      // Fallback
    }
    return memoryStore.orders.filter((o) => {
      if (o.tenantId !== tenantId) return false;
      if (status && o.status !== status) return false;
      return true;
    });
  },

  // MESSAGES LOG
  async recordMessage(data: {
    tenantId: string;
    customerId: string;
    content: string;
    channel: string;
    isAiGenerated: boolean;
    isSandbox: boolean;
    status: string;
  }) {
    const msg: InMemoryMessage = {
      id: `msg_${Date.now()}`,
      tenantId: data.tenantId,
      customerId: data.customerId,
      content: data.content,
      channel: data.channel,
      direction: 'OUTBOUND',
      status: data.status,
      isAiGenerated: data.isAiGenerated,
      isSandbox: data.isSandbox,
      createdAt: new Date().toISOString(),
    };

    try {
      await prisma.recoveryMessage.create({
        data: {
          id: msg.id,
          tenantId: msg.tenantId,
          customerId: msg.customerId,
          content: msg.content,
          channel: msg.channel,
          direction: msg.direction,
          status: msg.status,
          isAiGenerated: msg.isAiGenerated,
          isSandbox: msg.isSandbox,
        },
      });
    } catch {
      // Fallback
    }
    memoryStore.messages.push(msg);
    return msg;
  },
};
