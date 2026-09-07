import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { generateTenantAiInsights } from '../lib/aiEngine';
import { CustomerSegmentKey } from '../types';
import {
  DollarSign,
  Users,
  Moon,
  Sparkles,
  Send,
  Percent,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Clock,
  RotateCcw
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateTab: (tab: string, filter?: CustomerSegmentKey) => void;
  onOpenCampaignWizard: (segment?: CustomerSegmentKey) => void;
  onOpenCsvImport: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateTab,
  onOpenCampaignWizard,
  onOpenCsvImport,
}) => {
  const { currentTenant } = useAuth();
  const { customers, campaigns, metrics } = useData();

  const aiAnalysis = generateTenantAiInsights(customers, campaigns, currentTenant?.segment || 'pizzeria');

  // Checklist de Primeiro Acesso (Requisito 23)
  const isFirstAccess = customers.length === 0 || customers.length < 5;
  const checklistSteps = [
    { step: 1, title: 'Importar ou cadastrar clientes', done: customers.length > 0, action: onOpenCsvImport },
    { step: 2, title: 'Analisar histórico e ciclo de compras', done: customers.length > 0, action: () => onNavigateTab('customers') },
    { step: 3, title: 'Identificar oportunidades com IA', done: metrics.opportunitiesCount > 0 || customers.length > 0, action: () => onNavigateTab('ai-insights') },
    { step: 4, title: 'Criar ou autorizar primeira campanha', done: campaigns.length > 0, action: () => onOpenCampaignWizard() },
  ];

  // Dados para o Gráfico de Receita dos Últimos 30 Dias (simulação baseada nas campanhas ativas)
  const last30DaysRevenue = [
    { day: '01/08', value: Math.round(metrics.recoveredRevenue * 0.05) },
    { day: '05/08', value: Math.round(metrics.recoveredRevenue * 0.12) },
    { day: '10/08', value: Math.round(metrics.recoveredRevenue * 0.18) },
    { day: '15/08', value: Math.round(metrics.recoveredRevenue * 0.28) },
    { day: '20/08', value: Math.round(metrics.recoveredRevenue * 0.45) },
    { day: '25/08', value: Math.round(metrics.recoveredRevenue * 0.68) },
    { day: '30/08', value: metrics.recoveredRevenue },
  ];

  const maxRevenue = Math.max(...last30DaysRevenue.map(d => d.value), 100);

  return (
    <div className="space-y-8">
      {/* Topo do Dashboard (Requisito 7) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Olá, {currentTenant?.name || 'Sua Empresa'} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Veja quanto dinheiro sua empresa pode recuperar hoje.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCsvImport}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Importar Clientes (CSV)
          </button>
          <button
            onClick={() => onOpenCampaignWizard()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Criar Campanha com IA</span>
          </button>
        </div>
      </div>

      {/* BLOCO DESTACADO: DINHEIRO DEIXADO NA MESA (Requisito 7) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/40 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Oportunidade Financeira Oculta</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              DINHEIRO DEIXADO NA MESA
            </h2>

            <p className="text-sm text-blue-100/90 leading-relaxed">
              Você possui <strong className="text-white underline decoration-amber-400 font-extrabold">{metrics.inactiveCustomers} clientes inativos</strong> que já compraram no passado e pararam de comprar.
            </p>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl sm:text-5xl font-black text-amber-300">
                R$ {metrics.moneyLeftOnTable.toLocaleString('pt-BR')}
              </span>
              <span className="text-xs text-blue-200 font-medium">Potencial total estimado em pedidos</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('customers', 'inactive')}
              className="px-6 py-3.5 bg-white hover:bg-blue-50 text-blue-900 rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Ver oportunidades de inativos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onOpenCampaignWizard('inactive')}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Disparar Resgate com IA</span>
            </button>
          </div>
        </div>

        {/* Glow decorativo de fundo */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* CHECKLIST DE PRIMEIRO ACESSO (Requisito 23) */}
      {isFirstAccess && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">“Vamos encontrar seu dinheiro perdido.”</h3>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Conclua os passos iniciais para a RecuperaIA mapear todos os clientes com probabilidade de retorno:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {checklistSteps.map(step => (
              <div
                key={step.step}
                onClick={step.action}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  step.done
                    ? 'bg-emerald-50/50 border-emerald-300 text-emerald-900'
                    : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Passo {step.step}
                  </span>
                  {step.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                </div>
                <h4 className="font-bold text-xs text-slate-800">{step.title}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6 CARDS PRINCIPAIS (Requisito 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Receita Recuperada */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Receita Recuperada</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-600">
              R$ {metrics.recoveredRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block font-medium">Voltou para o seu caixa</span>
        </div>

        {/* Card 2: Clientes Recuperados */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Clientes Recuperados</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-blue-700">
              {metrics.recoveredCustomers}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block font-medium">Reativados com sucesso</span>
        </div>

        {/* Card 3: Clientes Inativos */}
        <div 
          onClick={() => onNavigateTab('customers', 'inactive')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-400 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Clientes Inativos</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-800">
              {metrics.inactiveCustomers}
            </div>
          </div>
          <span className="text-[10px] text-blue-600 font-semibold mt-2 block">Ver lista completa →</span>
        </div>

        {/* Card 4: Oportunidades Identificadas */}
        <div 
          onClick={() => onNavigateTab('customers', 'high_opportunity')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-purple-400 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Oportunidades</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-purple-700">
              {metrics.opportunitiesCount}
            </div>
          </div>
          <span className="text-[10px] text-purple-600 font-semibold mt-2 block">Score de retorno &gt; 70%</span>
        </div>

        {/* Card 5: Campanhas Enviadas */}
        <div 
          onClick={() => onNavigateTab('campaigns')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-400 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Campanhas</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-800">
              {metrics.campaignsSent}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block font-medium">Disparos autorizados</span>
        </div>

        {/* Card 6: Taxa de Recuperação */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Taxa de Conversão</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-600">
              {metrics.recoveryRate}%
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block font-medium">Média do negócio</span>
        </div>
      </div>

      {/* GRÁFICOS DO DASHBOARD (Requisito 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Receita Recuperada nos Últimos 30 Dias */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Receita Recuperada nos Últimos 30 Dias</h3>
              <p className="text-xs text-slate-500">Crescimento acumulado de vendas salvas</p>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              +R$ {metrics.recoveredRevenue.toLocaleString('pt-BR')}
            </span>
          </div>

          {/* Gráfico de Barras Responsivo */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-slate-100">
            {last30DaysRevenue.map((d, idx) => {
              const heightPct = Math.max(10, Math.round((d.value / maxRevenue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[9px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    R$ {d.value}
                  </span>
                  <div
                    className="w-full bg-blue-500 hover:bg-emerald-500 rounded-t-lg transition-all duration-300"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-slate-400 font-medium">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico 2: Clientes Recuperados por Campanha */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Clientes Recuperados por Campanha</h3>
              <p className="text-xs text-slate-500">Distribuição de retorno por estratégia</p>
            </div>
            <button
              onClick={() => onNavigateTab('campaigns')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.slice(0, 4).map(camp => (
              <div key={camp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 truncate max-w-[200px]">{camp.title}</span>
                  <span className="font-extrabold text-emerald-700">
                    +{camp.conversionCount} clientes (R$ {camp.recoveredRevenue.toLocaleString('pt-BR')})
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, camp.conversionCount * 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEÇÃO: AÇÕES RECOMENDADAS PELA IA (Requisito 7, 11) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Ações Recomendadas pela IA</h3>
              <p className="text-xs text-slate-500">Diagnósticos dinâmicos com base no comportamento dos seus clientes</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('ai-insights')}
            className="text-xs text-purple-700 font-bold hover:underline"
          >
            Abrir Inteligência RecuperaIA →
          </button>
        </div>

        {!aiAnalysis.hasSufficientData ? (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
            {aiAnalysis.message}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiAnalysis.insights.slice(0, 3).map(insight => (
              <div
                key={insight.id}
                className="p-4 bg-slate-50 hover:bg-blue-50/30 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded-full inline-block mb-2">
                    {insight.confidence}% de assertividade
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5">{insight.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{insight.description}</p>
                </div>

                <button
                  onClick={() => {
                    if (insight.actionTarget?.includes('inactive')) onOpenCampaignWizard('inactive');
                    else if (insight.actionTarget?.includes('vip')) onOpenCampaignWizard('vip');
                    else onOpenCampaignWizard('high_opportunity');
                  }}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{insight.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
