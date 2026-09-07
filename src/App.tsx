import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Customer, CustomerSegmentKey } from './types';

// Páginas Públicas & Autenticação
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';

// Layout e Páginas do Painel SaaS
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { SegmentsPage } from './pages/SegmentsPage';
import { AiInsightsPage } from './pages/AiInsightsPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { WhatsAppPage } from './pages/WhatsAppPage';
import { AutomationsPage } from './pages/AutomationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PlansPage } from './pages/PlansPage';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';

// Modais Globais
import { CampaignWizard } from './components/campaigns/CampaignWizard';
import { CsvImportModal } from './components/crm/CsvImportModal';
import { CustomerDrawer } from './components/crm/CustomerDrawer';

const AppContent: React.FC = () => {
  const { isAuthenticated, currentTenant, login } = useAuth();
  const { importCsvCustomers, deleteCustomer } = useData();

  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [segmentFilter, setSegmentFilter] = useState<CustomerSegmentKey | undefined>(undefined);

  // Modais globais
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardSegment, setWizardSegment] = useState<CustomerSegmentKey | undefined>(undefined);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [drawerCustomer, setDrawerCustomer] = useState<Customer | null>(null);

  // Se o usuário deslogar, retorna para a landing page
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthView('landing');
    }
  }, [isAuthenticated]);

  // Se o usuário estiver autenticado e não tiver concluído o onboarding
  if (isAuthenticated && currentTenant && !currentTenant.onboardingCompleted) {
    return <OnboardingPage onFinish={() => setCurrentTab('dashboard')} />;
  }

  // Se o usuário NÃO estiver autenticado
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginPage
          onNavigateRegister={() => setAuthView('register')}
          onNavigateHome={() => setAuthView('landing')}
        />
      );
    }

    if (authView === 'register') {
      return (
        <RegisterPage
          onNavigateLogin={() => setAuthView('login')}
          onNavigateHome={() => setAuthView('landing')}
          onRegistered={() => {
            // Após cadastro, o AuthContext já define o usuário autenticado e exibirá o OnboardingPage
          }}
        />
      );
    }

    // Landing Page Pública
    return (
      <LandingPage
        onNavigateAuth={(mode) => setAuthView(mode)}
        onExploreDemo={async () => {
          await login('contato@bellamassa.com.br');
          setCurrentTab('dashboard');
        }}
      />
    );
  }

  // Manipuladores de Navegação Contextual
  const handleNavigateTabWithFilter = (tab: string, filter?: CustomerSegmentKey) => {
    setSegmentFilter(filter);
    setCurrentTab(tab);
  };

  const handleOpenCampaignWizard = (segment?: CustomerSegmentKey) => {
    setWizardSegment(segment);
    setWizardOpen(true);
  };

  const handleOpenWhatsAppWithCustomer = (_customer: Customer) => {
    setCurrentTab('whatsapp');
  };

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigateTab={handleNavigateTabWithFilter}
            onOpenCampaignWizard={handleOpenCampaignWizard}
            onOpenCsvImport={() => setCsvModalOpen(true)}
          />
        );
      case 'customers':
        return (
          <CustomersPage
            initialSegmentFilter={segmentFilter}
            onOpenWhatsAppCustomer={handleOpenWhatsAppWithCustomer}
            onOpenCampaignCustomer={(c) => {
              setDrawerCustomer(null);
              handleOpenCampaignWizard(c.segment);
            }}
          />
        );
      case 'segments':
        return (
          <SegmentsPage
            onSelectSegment={(key) => handleNavigateTabWithFilter('customers', key)}
            onOpenCampaignForSegment={(key) => handleOpenCampaignWizard(key)}
          />
        );
      case 'ai-insights':
        return (
          <AiInsightsPage
            onOpenCampaignWizard={handleOpenCampaignWizard}
            onNavigateTab={(t) => setCurrentTab(t)}
          />
        );
      case 'campaigns':
        return (
          <CampaignsPage
            onOpenWizard={handleOpenCampaignWizard}
          />
        );
      case 'whatsapp':
        return (
          <WhatsAppPage
            onOpenCustomerDrawer={(c) => setDrawerCustomer(c)}
          />
        );
      case 'automations':
        return <AutomationsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'plans':
        return <PlansPage />;
      case 'admin':
        return <AdminPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            onNavigateTab={handleNavigateTabWithFilter}
            onOpenCampaignWizard={handleOpenCampaignWizard}
            onOpenCsvImport={() => setCsvModalOpen(true)}
          />
        );
    }
  };

  return (
    <AppLayout currentTab={currentTab} onNavigate={(tab) => {
      setSegmentFilter(undefined);
      setCurrentTab(tab);
    }}>
      {renderActiveTab()}

      {/* Modais Globais acessíveis de qualquer tela */}
      <CampaignWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        prefillSegment={wizardSegment}
      />

      <CsvImportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onImport={importCsvCustomers}
      />

      <CustomerDrawer
        customer={drawerCustomer}
        onClose={() => setDrawerCustomer(null)}
        onOpenWhatsApp={(c) => {
          setDrawerCustomer(null);
          handleOpenWhatsAppWithCustomer(c);
        }}
        onSendCampaign={(c) => {
          setDrawerCustomer(null);
          handleOpenCampaignWizard(c.segment);
        }}
        onDeleteCustomer={deleteCustomer}
      />
    </AppLayout>
  );
};

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
