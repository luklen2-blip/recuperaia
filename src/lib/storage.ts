import { Tenant, Customer, Campaign, Automation, ChatMessage, AuditLog, PlatformMetrics } from '../types';
import { DEMO_TENANT, DEMO_TENANT_ID, generateDemoCustomers, DEMO_CAMPAIGNS, DEMO_AUTOMATIONS, DEMO_CHAT_MESSAGES, DEMO_AUDIT_LOGS } from './demoData';

const STORAGE_KEYS = {
  TENANTS: 'recuperaia_tenants_v1',
  ACTIVE_TENANT_ID: 'recuperaia_active_tenant_id_v1',
  CUSTOMERS_PREFIX: 'recuperaia_customers_',
  CAMPAIGNS_PREFIX: 'recuperaia_campaigns_',
  AUTOMATIONS_PREFIX: 'recuperaia_automations_',
  CHATS_PREFIX: 'recuperaia_chats_',
  LOGS_PREFIX: 'recuperaia_logs_',
  CURRENT_USER: 'recuperaia_current_user_v1',
};

// Inicialização segura dos dados iniciais
export function initStorage() {
  const existingTenants = getTenants();
  if (existingTenants.length === 0) {
    // Carrega o tenant de demonstração (Pizzaria Bella Massa)
    saveTenant(DEMO_TENANT);
    setActiveTenantId(DEMO_TENANT_ID);

    // Carrega clientes, campanhas, automações da demo
    const demoCustomers = generateDemoCustomers();
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS_PREFIX + DEMO_TENANT_ID, JSON.stringify(demoCustomers));
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS_PREFIX + DEMO_TENANT_ID, JSON.stringify(DEMO_CAMPAIGNS));
    localStorage.setItem(STORAGE_KEYS.AUTOMATIONS_PREFIX + DEMO_TENANT_ID, JSON.stringify(DEMO_AUTOMATIONS));
    localStorage.setItem(STORAGE_KEYS.CHATS_PREFIX + DEMO_TENANT_ID, JSON.stringify(DEMO_CHAT_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.LOGS_PREFIX + DEMO_TENANT_ID, JSON.stringify(DEMO_AUDIT_LOGS));
  }
}

// === TENANTS ===
export function getTenants(): Tenant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TENANTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTenant(tenant: Tenant): void {
  const tenants = getTenants();
  const index = tenants.findIndex(t => t.id === tenant.id);
  if (index >= 0) {
    tenants[index] = tenant;
  } else {
    tenants.push(tenant);
  }
  localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
}

export function getActiveTenantId(): string {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_TENANT_ID) || DEMO_TENANT_ID;
}

export function setActiveTenantId(tenantId: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_TENANT_ID, tenantId);
}

export function getActiveTenant(): Tenant | null {
  const activeId = getActiveTenantId();
  const tenants = getTenants();
  return tenants.find(t => t.id === activeId) || null;
}

// === CUSTOMERS (ISOLAMENTO MULTI-TENANT) ===
export function getCustomers(tenantId: string): Customer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS_PREFIX + tenantId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomers(tenantId: string, customers: Customer[]): void {
  // Garante isolamento estrito: todos os clientes devem ter tenantId correspondente
  const sanitized = customers.map(c => ({ ...c, tenantId }));
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS_PREFIX + tenantId, JSON.stringify(sanitized));
}

export function addCustomer(tenantId: string, customer: Customer): void {
  const list = getCustomers(tenantId);
  list.unshift({ ...customer, tenantId });
  saveCustomers(tenantId, list);
}

export function updateCustomer(tenantId: string, updated: Customer): void {
  const list = getCustomers(tenantId);
  const index = list.findIndex(c => c.id === updated.id);
  if (index >= 0) {
    list[index] = { ...updated, tenantId };
    saveCustomers(tenantId, list);
  }
}

export function deleteCustomer(tenantId: string, customerId: string): void {
  const list = getCustomers(tenantId);
  const filtered = list.filter(c => c.id !== customerId);
  saveCustomers(tenantId, filtered);
}

// === CAMPAIGNS ===
export function getCampaigns(tenantId: string): Campaign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS_PREFIX + tenantId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCampaign(tenantId: string, campaign: Campaign): void {
  const list = getCampaigns(tenantId);
  const index = list.findIndex(c => c.id === campaign.id);
  if (index >= 0) {
    list[index] = { ...campaign, tenantId };
  } else {
    list.unshift({ ...campaign, tenantId });
  }
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS_PREFIX + tenantId, JSON.stringify(list));
}

// === AUTOMATIONS ===
export function getAutomations(tenantId: string): Automation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTOMATIONS_PREFIX + tenantId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleAutomation(tenantId: string, automationId: string): void {
  const list = getAutomations(tenantId);
  const item = list.find(a => a.id === automationId);
  if (item) {
    item.active = !item.active;
    localStorage.setItem(STORAGE_KEYS.AUTOMATIONS_PREFIX + tenantId, JSON.stringify(list));
  }
}

// === CHAT / WHATSAPP ===
export function getChatMessages(tenantId: string, customerId?: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHATS_PREFIX + tenantId);
    const messages: ChatMessage[] = raw ? JSON.parse(raw) : [];
    if (customerId) {
      return messages.filter(m => m.customerId === customerId);
    }
    return messages;
  } catch {
    return [];
  }
}

export function sendChatMessage(tenantId: string, message: ChatMessage): void {
  const messages = getChatMessages(tenantId);
  messages.push({ ...message, tenantId });
  localStorage.setItem(STORAGE_KEYS.CHATS_PREFIX + tenantId, JSON.stringify(messages));
}

// === AUDIT LOGS ===
export function getAuditLogs(tenantId: string): AuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS_PREFIX + tenantId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addAuditLog(tenantId: string, log: Omit<AuditLog, 'id' | 'tenantId' | 'timestamp'>): void {
  const logs = getAuditLogs(tenantId);
  const newLog: AuditLog = {
    ...log,
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    tenantId,
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog);
  localStorage.setItem(STORAGE_KEYS.LOGS_PREFIX + tenantId, JSON.stringify(logs.slice(0, 100)));
}

// === LGPD DIREITO AO ESQUECIMENTO & EXPORTAÇÃO ===
export function exportTenantData(tenantId: string): string {
  const tenant = getTenants().find(t => t.id === tenantId);
  const customers = getCustomers(tenantId);
  const campaigns = getCampaigns(tenantId);
  const automations = getAutomations(tenantId);
  const logs = getAuditLogs(tenantId);

  return JSON.stringify({
    tenant,
    customers,
    campaigns,
    automations,
    auditLogs: logs,
    exportedAt: new Date().toISOString(),
    lgpdCompliance: 'Lei Geral de Proteção de Dados (Lei nº 13.709/2018)'
  }, null, 2);
}

export function deleteTenantData(tenantId: string): void {
  localStorage.removeItem(STORAGE_KEYS.CUSTOMERS_PREFIX + tenantId);
  localStorage.removeItem(STORAGE_KEYS.CAMPAIGNS_PREFIX + tenantId);
  localStorage.removeItem(STORAGE_KEYS.AUTOMATIONS_PREFIX + tenantId);
  localStorage.removeItem(STORAGE_KEYS.CHATS_PREFIX + tenantId);
  localStorage.removeItem(STORAGE_KEYS.LOGS_PREFIX + tenantId);

  const tenants = getTenants().filter(t => t.id !== tenantId);
  localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
}

// === MÉTRICAS GLOBAIS DO SUPER ADMIN ===
export function getPlatformMetrics(): PlatformMetrics {
  const tenants = getTenants();
  let totalCustomers = 0;
  let globalRevenue = 0;
  let totalCampaigns = 0;

  tenants.forEach(t => {
    const customers = getCustomers(t.id);
    const campaigns = getCampaigns(t.id);
    totalCustomers += customers.length;
    campaigns.forEach(c => {
      globalRevenue += c.recoveredRevenue || 0;
    });
    totalCampaigns += campaigns.length;
  });

  // Base MRR estimado por planos
  const mrr = tenants.reduce((acc, t) => {
    if (t.plan === 'start') return acc + 79;
    if (t.plan === 'pro') return acc + 149;
    if (t.plan === 'business') return acc + 299;
    return acc;
  }, 0);

  return {
    totalCompanies: tenants.length,
    activeCompanies: tenants.filter(t => t.active).length,
    newSignupsThisMonth: tenants.length,
    mrr,
    churnRate: 1.8,
    totalCustomersProcessed: totalCustomers,
    globalRecoveredRevenue: globalRevenue,
    totalCampaignsSent: totalCampaigns,
  };
}
