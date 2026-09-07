export type SegmentType = 
  | 'restaurant'
  | 'pizzeria'
  | 'burger'
  | 'bakery'
  | 'confectionery'
  | 'beauty_salon'
  | 'barbershop'
  | 'clinic'
  | 'dentistry'
  | 'physiotherapy'
  | 'fitness'
  | 'pet_shop'
  | 'auto_repair'
  | 'retail'
  | 'services'
  | 'real_estate'
  | 'education'
  | 'other';

export type CustomerSegmentKey = 
  | 'vip'
  | 'inactive'
  | 'at_risk'
  | 'new'
  | 'high_opportunity'
  | 'lost';

export type PlanType = 'start' | 'pro' | 'business';

export interface Tenant {
  id: string;
  name: string;
  managerName: string;
  email: string;
  phone: string;
  segment: SegmentType;
  companySize: string;
  plan: PlanType;
  planStatus: 'active' | 'trialing' | 'past_due' | 'canceled';
  active: boolean;
  isDemo: boolean;
  createdAt: string;
  salesChannels: string[];
  mainObjective: string;
  onboardingCompleted: boolean;
  whatsappConfig?: {
    connected: boolean;
    phoneNumberId?: string;
    wabaId?: string;
    accessToken?: string;
    verifiedName?: string;
    connectedAt?: string;
  };
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'superadmin' | 'owner' | 'manager' | 'operator';
  createdAt: string;
}

export interface PurchaseRecord {
  id: string;
  date: string;
  value: number;
  items: string[];
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  registeredAt: string;
  lastPurchaseDate: string;
  totalSpend: number;
  purchaseCount: number;
  averageTicket: number;
  daysSinceLastPurchase: number;
  segment: CustomerSegmentKey;
  returnProbability: number; // 0 to 100%
  purchaseHistory: PurchaseRecord[];
  notes: string;
  tags: string[];
  preferredChannel: 'whatsapp' | 'sms' | 'email';
  aiRecommendation?: string;
  consentGiven: boolean;
  consentDate: string;
}

export type CampaignType = 
  | 'winback'          // Reativação
  | 'repurchase'       // Recompra
  | 'birthday'         // Aniversário
  | 'post_sale'        // Pós-venda
  | 'special_offer'    // Oferta especial
  | 'cart_abandoned';  // Carrinho/orçamento abandonado

export interface Campaign {
  id: string;
  tenantId: string;
  title: string;
  type: CampaignType;
  targetSegment: CustomerSegmentKey | string;
  channel: 'whatsapp';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  audienceCount: number;
  sentCount: number;
  deliveredCount: number;
  responseCount: number;
  conversionCount: number;
  recoveredRevenue: number;
  messageTemplate: string;
  offerSuggestion: string;
  ctaText: string;
  bestSendTime: string;
  scheduledFor?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AutomationStep {
  id: string;
  title: string;
  description: string;
  type: 'trigger' | 'condition' | 'ai_action' | 'approval' | 'channel' | 'outcome';
  status?: 'active' | 'pending' | 'success';
}

export interface Automation {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  triggerType: 'inactive_days' | 'new_customer' | 'at_risk' | 'birthday' | 'repurchase_due' | 'post_sales' | 'abandoned_quote';
  active: boolean;
  steps: AutomationStep[];
  requireApproval: boolean;
  runsCount: number;
  recoveredCustomers: number;
  recoveredRevenue: number;
  createdAt: string;
}

export interface SegmentDefinition {
  id: string;
  tenantId?: string;
  key: CustomerSegmentKey | string;
  name: string;
  description: string;
  badgeColor: string;
  iconName: string;
  isSystem: boolean;
  customerCount?: number;
  estimatedRecoveryRevenue?: number;
  criteria?: {
    minDaysInactive?: number;
    maxDaysInactive?: number;
    minSpend?: number;
    minOrders?: number;
    maxOrders?: number;
  };
}

export interface ChatMessage {
  id: string;
  tenantId: string;
  customerId: string;
  sender: 'customer' | 'agent' | 'ai';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId?: string;
  userEmail: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
}

export interface PlatformMetrics {
  totalCompanies: number;
  activeCompanies: number;
  newSignupsThisMonth: number;
  mrr: number;
  churnRate: number;
  totalCustomersProcessed: number;
  globalRecoveredRevenue: number;
  totalCampaignsSent: number;
}
