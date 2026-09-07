import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Customer, Campaign, Automation, ChatMessage, AuditLog } from '../types';
import { useAuth } from './AuthContext';
import {
  getCustomers,
  saveCustomers,
  addCustomer as storageAddCustomer,
  updateCustomer as storageUpdateCustomer,
  deleteCustomer as storageDeleteCustomer,
  getCampaigns,
  saveCampaign as storageSaveCampaign,
  getAutomations,
  toggleAutomation as storageToggleAutomation,
  getChatMessages,
  sendChatMessage as storageSendChatMessage,
  getAuditLogs,
  addAuditLog,
  exportTenantData as storageExportTenantData,
  deleteTenantData as storageDeleteTenantData,
} from '../lib/storage';
import { 
  calculateDaysSince, 
  calculateReturnProbability, 
  classifyCustomerSegment, 
  generateCustomerRecommendation 
} from '../lib/rfmEngine';
import { getSegmentInfo } from '../lib/segmentConfig';

interface DataContextType {
  customers: Customer[];
  campaigns: Campaign[];
  automations: Automation[];
  chatMessages: ChatMessage[];
  auditLogs: AuditLog[];
  loading: boolean;
  addCustomer: (data: Omit<Customer, 'id' | 'tenantId' | 'registeredAt' | 'segment' | 'returnProbability'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  importCsvCustomers: (rawList: Array<{ name: string; phone: string; email?: string; lastPurchaseDate?: string; totalSpend?: number; purchaseCount?: number }>) => number;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'tenantId' | 'createdAt' | 'sentCount' | 'deliveredCount' | 'responseCount' | 'conversionCount' | 'recoveredRevenue'>) => Campaign;
  updateCampaignStatus: (campaignId: string, status: Campaign['status']) => void;
  toggleAutomation: (automationId: string) => void;
  sendChatMessage: (customerId: string, text: string) => void;
  connectWhatsApp: (config: { phoneNumberId: string; wabaId: string; accessToken: string; verifiedName: string }) => void;
  disconnectWhatsApp: () => void;
  exportData: () => string;
  deleteAccount: () => void;
  metrics: {
    recoveredRevenue: number;
    recoveredCustomers: number;
    inactiveCustomers: number;
    opportunitiesCount: number;
    campaignsSent: number;
    recoveryRate: number;
    moneyLeftOnTable: number;
    averageTicket: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTenant, updateCurrentTenant } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const tenantId = currentTenant?.id;

  const loadData = useCallback(() => {
    if (!tenantId) {
      setCustomers([]);
      setCampaigns([]);
      setAutomations([]);
      setChatMessages([]);
      setAuditLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const loadedCustomers = getCustomers(tenantId);
    const loadedCampaigns = getCampaigns(tenantId);
    const loadedAutomations = getAutomations(tenantId);
    const loadedChats = getChatMessages(tenantId);
    const loadedLogs = getAuditLogs(tenantId);

    setCustomers(loadedCustomers);
    setCampaigns(loadedCampaigns);
    setAutomations(loadedAutomations);
    setChatMessages(loadedChats);
    setAuditLogs(loadedLogs);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addCustomer = (data: Omit<Customer, 'id' | 'tenantId' | 'registeredAt' | 'segment' | 'returnProbability'>) => {
    if (!tenantId || !currentTenant) return;

    const daysAgo = calculateDaysSince(data.lastPurchaseDate);
    const returnProb = calculateReturnProbability(daysAgo, data.purchaseCount, data.totalSpend);
    const segment = classifyCustomerSegment(daysAgo, data.purchaseCount, data.totalSpend, returnProb);

    const newCustomer: Customer = {
      ...data,
      id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      tenantId,
      registeredAt: new Date().toISOString().split('T')[0],
      daysSinceLastPurchase: daysAgo,
      segment,
      returnProbability: returnProb,
      consentGiven: true,
      consentDate: new Date().toISOString(),
    };

    newCustomer.aiRecommendation = generateCustomerRecommendation(newCustomer, currentTenant.segment);

    storageAddCustomer(tenantId, newCustomer);
    setCustomers(prev => [newCustomer, ...prev]);

    addAuditLog(tenantId, {
      userEmail: currentTenant.email,
      action: 'CLIENTE_CRIADO',
      resource: 'CRM',
      details: `Cliente ${newCustomer.name} (${newCustomer.phone}) adicionado manualmente`
    });
  };

  const updateCustomer = (updated: Customer) => {
    if (!tenantId || !currentTenant) return;
    storageUpdateCustomer(tenantId, updated);
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const deleteCustomer = (customerId: string) => {
    if (!tenantId || !currentTenant) return;
    const target = customers.find(c => c.id === customerId);
    storageDeleteCustomer(tenantId, customerId);
    setCustomers(prev => prev.filter(c => c.id !== customerId));

    if (target) {
      addAuditLog(tenantId, {
        userEmail: currentTenant.email,
        action: 'LGPD_EXCLUSAO_CLIENTE',
        resource: 'CRM',
        details: `Exclusão definitiva dos dados pessoais de ${target.name} (Direito ao Esquecimento)`
      });
    }
  };

  const importCsvCustomers = (rawList: Array<{ name: string; phone: string; email?: string; lastPurchaseDate?: string; totalSpend?: number; purchaseCount?: number }>): number => {
    if (!tenantId || !currentTenant) return 0;
    const now = new Date();

    const createdList: Customer[] = rawList.map((item, idx) => {
      const daysAgo = item.lastPurchaseDate ? calculateDaysSince(item.lastPurchaseDate) : 30;
      const count = item.purchaseCount || 1;
      const spend = item.totalSpend || 80.00;
      const avg = Math.round((spend / count) * 100) / 100;
      const returnProb = calculateReturnProbability(daysAgo, count, spend);
      const segment = classifyCustomerSegment(daysAgo, count, spend, returnProb);

      const cust: Customer = {
        id: `cust_csv_${Date.now()}_${idx}`,
        tenantId,
        name: item.name,
        phone: item.phone,
        email: item.email || '',
        registeredAt: now.toISOString().split('T')[0],
        lastPurchaseDate: item.lastPurchaseDate || now.toISOString().split('T')[0],
        totalSpend: spend,
        purchaseCount: count,
        averageTicket: avg,
        daysSinceLastPurchase: daysAgo,
        segment,
        returnProbability: returnProb,
        purchaseHistory: [
          {
            id: `ord_csv_${idx}`,
            date: item.lastPurchaseDate || now.toISOString().split('T')[0],
            value: avg,
            items: ['Item da base importada']
          }
        ],
        notes: 'Importado via arquivo CSV',
        tags: ['Importado CSV'],
        preferredChannel: 'whatsapp',
        consentGiven: true,
        consentDate: now.toISOString(),
      };
      cust.aiRecommendation = generateCustomerRecommendation(cust, currentTenant.segment);
      return cust;
    });

    const updated = [...createdList, ...customers];
    saveCustomers(tenantId, updated);
    setCustomers(updated);

    addAuditLog(tenantId, {
      userEmail: currentTenant.email,
      action: 'IMPORTACAO_CSV',
      resource: 'CRM',
      details: `Importação de ${createdList.length} clientes via planilha CSV com sucesso.`
    });

    return createdList.length;
  };

  const createCampaign = (campaignData: Omit<Campaign, 'id' | 'tenantId' | 'createdAt' | 'sentCount' | 'deliveredCount' | 'responseCount' | 'conversionCount' | 'recoveredRevenue'>): Campaign => {
    if (!tenantId || !currentTenant) throw new Error('Tenant não definido');

    const newCampaign: Campaign = {
      ...campaignData,
      id: `camp_${Date.now()}`,
      tenantId,
      createdAt: new Date().toISOString(),
      sentCount: campaignData.status === 'active' ? campaignData.audienceCount : 0,
      deliveredCount: campaignData.status === 'active' ? Math.round(campaignData.audienceCount * 0.96) : 0,
      responseCount: campaignData.status === 'active' ? Math.round(campaignData.audienceCount * 0.28) : 0,
      conversionCount: campaignData.status === 'active' ? Math.round(campaignData.audienceCount * 0.18) : 0,
      recoveredRevenue: campaignData.status === 'active' ? Math.round(campaignData.audienceCount * 0.18 * 85) : 0,
    };

    storageSaveCampaign(tenantId, newCampaign);
    setCampaigns(prev => [newCampaign, ...prev]);

    addAuditLog(tenantId, {
      userEmail: currentTenant.email,
      action: 'CRIACAO_CAMPANHA',
      resource: 'Campanhas',
      details: `Campanha "${newCampaign.title}" criada para segmento ${newCampaign.targetSegment}`
    });

    return newCampaign;
  };

  const updateCampaignStatus = (campaignId: string, status: Campaign['status']) => {
    if (!tenantId || !currentTenant) return;
    const target = campaigns.find(c => c.id === campaignId);
    if (!target) return;

    const updated: Campaign = {
      ...target,
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : target.completedAt
    };

    storageSaveCampaign(tenantId, updated);
    setCampaigns(prev => prev.map(c => c.id === campaignId ? updated : c));
  };

  const toggleAutomation = (automationId: string) => {
    if (!tenantId) return;
    storageToggleAutomation(tenantId, automationId);
    setAutomations(prev => prev.map(a => a.id === automationId ? { ...a, active: !a.active } : a));
  };

  const sendChatMessage = (customerId: string, text: string) => {
    if (!tenantId) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      tenantId,
      customerId,
      sender: 'agent',
      text,
      timestamp: new Date().toISOString(),
      status: 'delivered'
    };
    storageSendChatMessage(tenantId, newMsg);
    setChatMessages(prev => [...prev, newMsg]);
  };

  const connectWhatsApp = (config: { phoneNumberId: string; wabaId: string; accessToken: string; verifiedName: string }) => {
    if (!currentTenant) return;
    updateCurrentTenant({
      whatsappConfig: {
        connected: true,
        phoneNumberId: config.phoneNumberId,
        wabaId: config.wabaId,
        accessToken: config.accessToken,
        verifiedName: config.verifiedName,
        connectedAt: new Date().toISOString(),
      }
    });

    addAuditLog(currentTenant.id, {
      userEmail: currentTenant.email,
      action: 'WHATSAPP_CONECTADO',
      resource: 'Integrações',
      details: `Conexão estabelecida com WhatsApp Cloud API (WABA ID: ${config.wabaId})`
    });
  };

  const disconnectWhatsApp = () => {
    if (!currentTenant) return;
    updateCurrentTenant({
      whatsappConfig: {
        connected: false
      }
    });
  };

  const exportData = () => {
    if (!tenantId) return '';
    return storageExportTenantData(tenantId);
  };

  const deleteAccount = () => {
    if (!tenantId) return;
    storageDeleteTenantData(tenantId);
    loadData();
  };

  // Métricas calculadas para o Dashboard e Resultados
  const metrics = useMemo(() => {
    const recoveredRevenue = campaigns.reduce((acc, c) => acc + (c.recoveredRevenue || 0), 0);
    const recoveredCustomers = campaigns.reduce((acc, c) => acc + (c.conversionCount || 0), 0);
    const inactives = customers.filter(c => c.segment === 'inactive');
    const highOpps = customers.filter(c => c.returnProbability >= 70 && c.daysSinceLastPurchase >= 25);
    const campaignsSent = campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);

    const totalTickets = customers.length > 0
      ? customers.reduce((acc, c) => acc + c.averageTicket, 0) / customers.length
      : 80;

    const moneyLeftOnTable = Math.round(inactives.length * totalTickets);

    const recoveryRate = customers.length > 0 
      ? Math.min(100, Math.round((recoveredCustomers / Math.max(1, inactives.length + recoveredCustomers)) * 100))
      : 0;

    return {
      recoveredRevenue,
      recoveredCustomers,
      inactiveCustomers: inactives.length,
      opportunitiesCount: highOpps.length,
      campaignsSent,
      recoveryRate,
      moneyLeftOnTable,
      averageTicket: Math.round(totalTickets * 100) / 100
    };
  }, [customers, campaigns]);

  return (
    <DataContext.Provider
      value={{
        customers,
        campaigns,
        automations,
        chatMessages,
        auditLogs,
        loading,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        importCsvCustomers,
        createCampaign,
        updateCampaignStatus,
        toggleAutomation,
        sendChatMessage,
        connectWhatsApp,
        disconnectWhatsApp,
        exportData,
        deleteAccount,
        metrics,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider');
  }
  return context;
};
