import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, User, SegmentType, PlanType } from '../types';
import { 
  initStorage, 
  getTenants, 
  saveTenant, 
  getActiveTenant, 
  setActiveTenantId, 
  addAuditLog 
} from '../lib/storage';

interface RegisterData {
  companyName: string;
  managerName: string;
  email: string;
  phone: string;
  segment: SegmentType;
  companySize: string;
  password?: string;
}

interface AuthContextType {
  currentUser: User | null;
  currentTenant: Tenant | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchTenant: (tenantId: string) => void;
  updateCurrentTenant: (updates: Partial<Tenant>) => void;
  completeOnboarding: (data: { salesChannels: string[]; mainObjective: string }) => void;
  allTenants: Tenant[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    initStorage();
    const loadedTenants = getTenants();
    setAllTenants(loadedTenants);

    const activeTenant = getActiveTenant();
    if (activeTenant) {
      setCurrentTenant(activeTenant);
      // Cria sessão de usuário padrão correspondente
      setCurrentUser({
        id: `user_${activeTenant.id}`,
        tenantId: activeTenant.id,
        name: activeTenant.managerName,
        email: activeTenant.email,
        role: activeTenant.id === 'demo-bella-massa' ? 'owner' : 'owner',
        createdAt: activeTenant.createdAt,
      });
    }
  }, []);

  const login = async (email: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    const tenants = getTenants();
    const cleanEmail = email.trim().toLowerCase();

    // Verificação de acesso de Super Administrador da plataforma
    if (cleanEmail === 'admin@recuperaia.com.br' || cleanEmail === 'admin') {
      const adminUser: User = {
        id: 'usr_superadmin',
        tenantId: tenants[0]?.id || 'demo-bella-massa',
        name: 'Administrador RecuperaIA',
        email: 'admin@recuperaia.com.br',
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(adminUser);
      if (tenants[0]) {
        setCurrentTenant(tenants[0]);
        setActiveTenantId(tenants[0].id);
      }
      return { success: true };
    }

    // Busca empresa pelo email cadastrado
    const matchedTenant = tenants.find(t => t.email.toLowerCase() === cleanEmail);
    if (matchedTenant) {
      setCurrentTenant(matchedTenant);
      setActiveTenantId(matchedTenant.id);
      setCurrentUser({
        id: `usr_${matchedTenant.id}`,
        tenantId: matchedTenant.id,
        name: matchedTenant.managerName,
        email: matchedTenant.email,
        role: 'owner',
        createdAt: matchedTenant.createdAt,
      });
      addAuditLog(matchedTenant.id, {
        userEmail: matchedTenant.email,
        action: 'LOGIN',
        resource: 'Sessão',
        details: 'Login bem-sucedido na plataforma'
      });
      return { success: true };
    }

    // Se for o email demo da Bella Massa
    if (cleanEmail === 'demo' || cleanEmail.includes('bella')) {
      const demoTenant = tenants.find(t => t.id === 'demo-bella-massa') || tenants[0];
      if (demoTenant) {
        setCurrentTenant(demoTenant);
        setActiveTenantId(demoTenant.id);
        setCurrentUser({
          id: `usr_${demoTenant.id}`,
          tenantId: demoTenant.id,
          name: demoTenant.managerName,
          email: demoTenant.email,
          role: 'owner',
          createdAt: demoTenant.createdAt,
        });
        return { success: true };
      }
    }

    return { 
      success: false, 
      error: 'E-mail ou senha não encontrados. Experimente usar contato@bellamassa.com.br ou crie uma nova conta.' 
    };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const newTenantId = `tenant_${Date.now()}`;
      const newTenant: Tenant = {
        id: newTenantId,
        name: data.companyName,
        managerName: data.managerName,
        email: data.email.trim().toLowerCase(),
        phone: data.phone,
        segment: data.segment,
        companySize: data.companySize,
        plan: 'start',
        planStatus: 'trialing',
        active: true,
        isDemo: false,
        createdAt: new Date().toISOString(),
        salesChannels: [],
        mainObjective: 'Recuperar clientes inativos',
        onboardingCompleted: false,
        whatsappConfig: {
          connected: false
        }
      };

      saveTenant(newTenant);
      setActiveTenantId(newTenantId);
      setCurrentTenant(newTenant);
      setAllTenants(getTenants());

      const newUser: User = {
        id: `usr_${newTenantId}`,
        tenantId: newTenantId,
        name: newTenant.managerName,
        email: newTenant.email,
        role: 'owner',
        createdAt: newTenant.createdAt,
      };
      setCurrentUser(newUser);

      addAuditLog(newTenantId, {
        userEmail: newTenant.email,
        action: 'REGISTRO_TENANT',
        resource: 'Empresa',
        details: `Cadastro de nova conta para a empresa ${newTenant.name}`
      });

      return { success: true };
    } catch {
      return { success: false, error: 'Falha ao criar conta. Tente novamente.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchTenant = (tenantId: string) => {
    const tenants = getTenants();
    const found = tenants.find(t => t.id === tenantId);
    if (found) {
      setCurrentTenant(found);
      setActiveTenantId(found.id);
      if (currentUser && currentUser.role !== 'superadmin') {
        setCurrentUser({
          id: `usr_${found.id}`,
          tenantId: found.id,
          name: found.managerName,
          email: found.email,
          role: 'owner',
          createdAt: found.createdAt,
        });
      }
    }
  };

  const updateCurrentTenant = (updates: Partial<Tenant>) => {
    if (!currentTenant) return;
    const updated: Tenant = { ...currentTenant, ...updates };
    saveTenant(updated);
    setCurrentTenant(updated);
    setAllTenants(getTenants());
  };

  const completeOnboarding = (data: { salesChannels: string[]; mainObjective: string }) => {
    if (!currentTenant) return;
    updateCurrentTenant({
      salesChannels: data.salesChannels,
      mainObjective: data.mainObjective,
      onboardingCompleted: true,
    });
  };

  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentTenant,
        isAuthenticated: !!currentUser,
        isSuperAdmin,
        login,
        register,
        logout,
        switchTenant,
        updateCurrentTenant,
        completeOnboarding,
        allTenants,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
