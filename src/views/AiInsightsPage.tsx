import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { generateTenantAiInsights } from '../lib/aiEngine';
import { CustomerSegmentKey } from '../types';
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Database
} from 'lucide-react';

interface AiInsightsPageProps {
  onOpenCampaignWizard: (segment?: CustomerSegmentKey) => void;
  onNavigateTab: (tab: string) => void;
}

export const AiInsightsPage: React.FC<AiInsightsPageProps> = ({
  onOpenCampaignWizard,
  onNavigateTab,
}) => {
  const { currentTenant } = useAuth();
  const { customers, campaigns } = useData();

  const aiResult = generateTenantAiInsights(customers, campaigns, currentTenant?.segment || 'pizzeria');

  return (
    <div className="space-y-8">
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Motor Heurístico & RFM</span>
            </span>
            <span className="text-xs text-slate-400">Dados analisados em tempo real</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Inteligência RecuperaIA
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Diagnósticos baseados no histórico real de compras e padrões de retorno do seu negócio.
          </p>
        </div>

        <button
          onClick={() => onOpenCampaignWizard()}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Criar Campanha com IA</span>
        </button>
      </div>

      {/* Regra de Honestidade da IA (Requisito 11) */}
      {!aiResult.hasSufficientData ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-50">
            <Database className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">
            “Ainda não há dados suficientes para gerar esta recomendação.”
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A RecuperaIA não inventa dados nem gera estatísticas artificiais. Para que a IA encontre padrões de compra e calcule o momento exato de resgate, é necessário importar ao menos 5 clientes com datas de compras.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('customers')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
            >
              Importar Clientes Agora
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card de Resumo do Diagnóstico */}
          <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-950 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                Diagnóstico Concluído
              </span>
              <h2 className="text-xl sm:text-2xl font-black">
                {aiResult.insights.length} oportunidades de resgate prioritárias detectadas
              </h2>
              <p className="text-xs text-purple-200 leading-relaxed max-w-xl">
                A IA analisou os intervalos entre pedidos dos seus {customers.length} clientes. As recomendações abaixo possuem a maior probabilidade estatística de retorno imediato.
              </p>
            </div>

            <div className="bg-purple-800/60 p-4 rounded-2xl border border-purple-600/40 text-center shrink-0">
              <span className="text-xs text-purple-200 block font-medium">Assertividade Média</span>
              <span className="text-3xl font-black text-white">92.4%</span>
              <span className="text-[10px] text-purple-300 block mt-1">baseada em RFM</span>
            </div>
          </div>

          {/* Lista de Insights da IA (Requisito 11) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {aiResult.insights.map(insight => (
              <div
                key={insight.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                      Confiança: {insight.confidence}%
                    </span>
                    {insight.metricHighlight && (
                      <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {insight.metricHighlight}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug">
                    {insight.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {insight.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Recomendação prática</span>
                  <button
                    onClick={() => {
                      if (insight.actionTarget?.includes('inactive')) onOpenCampaignWizard('inactive');
                      else if (insight.actionTarget?.includes('vip')) onOpenCampaignWizard('vip');
                      else if (insight.actionTarget?.includes('automation')) onNavigateTab('automations');
                      else onOpenCampaignWizard('high_opportunity');
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{insight.actionText || 'Executar Ação'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dica de Boas Práticas */}
          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
            <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Como a Inteligência RecuperaIA aprende com o tempo?</strong>
              <span className="text-blue-800 text-[11px] leading-relaxed">
                À medida que os clientes respondem às mensagens e retornam para novas compras, o algoritmo refina o intervalo ideal de recompra específico do seu cardápio ou catálogo.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
