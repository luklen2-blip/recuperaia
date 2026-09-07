import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DemoBanner } from '../common/DemoBanner';
import { getSegmentInfo } from '../../lib/segmentConfig';
import {
  LayoutDashboard,
  Users,
  Layers,
  Sparkles,
  Send,
  MessageSquare,
  Workflow,
  BarChart3,
  CreditCard,
  ShieldCheck,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  Building2,
  LogOut,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface AppLayoutProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ currentTab, onNavigate, children }) => {
  const { currentTenant, currentUser, logout, allTenants, switchTenant, isSuperAdmin } = useAuth();
  const { metrics } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const segmentInfo = currentTenant ? getSegmentInfo(currentTenant.segment) : null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Clientes (CRM)', icon: Users, badge: metrics.inactiveCustomers > 0 ? `${metrics.inactiveCustomers} inativos` : undefined },
    { id: 'segments', label: 'Segmentos', icon: Layers },
    { id: 'ai-insights', label: 'Inteligência IA', icon: Sparkles, highlight: true },
    { id: 'campaigns', label: 'Campanhas', icon: Send },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, statusDot: currentTenant?.whatsappConfig?.connected },
    { id: 'automations', label: 'Automações', icon: Workflow },
    { id: 'analytics', label: 'Resultados & ROI', icon: BarChart3 },
    { id: 'plans', label: 'Meu Plano', icon: CreditCard },
    { id: 'admin', label: 'Painel Admin', icon: ShieldCheck, adminOnly: true },
    { id: 'settings', label: 'Configurações & LGPD', icon: Settings },
  ];

  // Notificações em tempo real do sistema (Requisito 25)
  const systemNotifications = [
    {
      id: 'n1',
      title: 'Clientes recuperados recentemente',
      desc: `Sua empresa já recuperou ${metrics.recoveredCustomers} clientes através das campanhas ativas.`,
      time: 'Há 10 minutos',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      id: 'n2',
      title: 'Oportunidades quentes identificadas',
      desc: `A IA identificou ${metrics.opportunitiesCount} contatos com alta probabilidade de retorno nesta semana.`,
      time: 'Há 1 hora',
      icon: Sparkles,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'n3',
      title: 'Alerta de clientes inativos',
      desc: `${metrics.inactiveCustomers} clientes estão sem compras há mais de 45 dias.`,
      time: 'Hoje',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Banner de Demonstração */}
      <DemoBanner onOpenTenantSwitch={() => setTenantDropdownOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR DESKTOP */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
          {/* Logo & Marca */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white tracking-wider text-base">RECUPERA<span className="text-blue-400">IA</span></span>
                <span className="block text-[10px] text-slate-400 font-medium tracking-tight">Recuperação de Receita</span>
              </div>
            </div>
          </div>

          {/* Seletor de Tenant Atual */}
          <div className="p-3 border-b border-slate-800/60 bg-slate-950/40 relative">
            <button
              onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left transition-all border border-slate-700/50"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded bg-blue-900/60 text-blue-300 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-xs text-white truncate">
                    {currentTenant?.name || 'Selecione a empresa'}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <span>{segmentInfo?.label || 'Geral'}</span>
                    {currentTenant?.isDemo && (
                      <span className="bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded text-[9px]">Demo</span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Dropdown de Tenants */}
            {tenantDropdownOpen && (
              <div className="absolute left-3 right-3 top-16 z-50 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 py-1 text-xs">
                <div className="px-3 py-1.5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">
                  Minhas Empresas ({allTenants.length})
                </div>
                {allTenants.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      switchTenant(t.id);
                      setTenantDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-700/80 transition-colors ${
                      t.id === currentTenant?.id ? 'text-blue-400 font-medium bg-slate-700/40' : 'text-slate-200'
                    }`}
                  >
                    <span className="truncate">{t.name}</span>
                    {t.isDemo && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">Demo</span>}
                  </button>
                ))}
                <div className="border-t border-slate-700/60 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setTenantDropdownOpen(false);
                      onNavigate('register');
                    }}
                    className="w-full text-left px-3 py-2 text-blue-400 hover:bg-slate-700/80 flex items-center gap-1.5 font-medium"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Nova Empresa</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Destaque Dinheiro na Mesa */}
          <div className="mx-3 mt-3 p-3 bg-gradient-to-br from-blue-950/70 to-slate-900 rounded-lg border border-blue-800/40">
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block mb-1">
              Dinheiro na Mesa
            </span>
            <div className="text-base font-extrabold text-white">
              R$ {metrics.moneyLeftOnTable.toLocaleString('pt-BR')}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {metrics.inactiveCustomers} clientes inativos
            </div>
          </div>

          {/* Links de Navegação */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              if (item.adminOnly && !isSuperAdmin && currentTenant?.id !== 'demo-bella-massa') return null;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.statusDot !== undefined && (
                      <span className={`w-2 h-2 rounded-full ${item.statusDot ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                    )}
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Rodapé da Sidebar */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs uppercase">
                  {currentUser?.name?.substring(0, 2) || 'US'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">{currentUser?.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser?.email}</div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sair"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL COM HEADER */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header Superior */}
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-3">
              {/* Botão Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  {navItems.find(i => i.id === currentTab)?.label || 'RecuperaIA'}
                </h1>
                <p className="text-xs text-slate-500">
                  {currentTenant?.name} • Segmento: {segmentInfo?.label}
                </p>
              </div>
            </div>

            {/* Ações do Header */}
            <div className="flex items-center gap-3">
              {/* Notificações Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600"></span>
                </button>

                {/* Popover de Notificações */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                    <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">Notificações Inteligentes</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                        3 novas
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                      {systemNotifications.map(n => {
                        const Icon = n.icon;
                        return (
                          <div key={n.id} className="p-3.5 hover:bg-slate-50/80 transition-colors flex gap-3 items-start">
                            <div className={`p-2 rounded-lg ${n.color} shrink-0 mt-0.5`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-xs text-slate-800">{n.title}</div>
                              <div className="text-xs text-slate-600 mt-0.5 leading-snug">{n.desc}</div>
                              <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de Nova Campanha Rápida */}
              <button
                onClick={() => onNavigate('campaigns')}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nova Campanha com IA</span>
              </button>

              {/* Menu Usuário Topbar */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {currentUser?.name?.substring(0, 2) || 'US'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-800">{currentUser?.name}</div>
                      <div className="text-[11px] text-slate-500">{currentUser?.email}</div>
                      <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-700 font-medium px-1.5 py-0.2 rounded">
                        {currentTenant?.plan?.toUpperCase()} • {currentUser?.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('settings');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Configurações da Empresa</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('plans');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>Meu Plano & Limites</span>
                    </button>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Encerrar Sessão</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* SIDEBAR MOBILE OVERLAY */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex">
              <div className="w-72 bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white tracking-wider text-sm">RECUPERA<span className="text-blue-400">IA</span></span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 border-b border-slate-800">
                  <div className="text-xs font-semibold text-white">{currentTenant?.name}</div>
                  <div className="text-[11px] text-slate-400">{segmentInfo?.label}</div>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 text-xs font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
              <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
            </div>
          )}

          {/* Conteúdo da Página */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
