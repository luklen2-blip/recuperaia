import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Campaign, CustomerSegmentKey } from '../types';
import { CampaignCard } from '../components/campaigns/CampaignCard';
import { CampaignWizard } from '../components/campaigns/CampaignWizard';
import { EmptyState } from '../components/common/EmptyState';
import {
  Send,
  Sparkles,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

interface CampaignsPageProps {
  onOpenWizard: (segment?: CustomerSegmentKey) => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ onOpenWizard }) => {
  const { campaigns, updateCampaignStatus, metrics } = useData();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'paused' | 'draft'>('all');

  const filteredCampaigns = campaigns.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="space-y-8">
      {/* Wizard Modal */}
      <CampaignWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />

      {/* Topo da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campanhas de Recuperação
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Disparos autorizados via WhatsApp com métricas de entrega, resposta e receita gerada.
          </p>
        </div>

        <button
          onClick={() => setWizardOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>+ Nova Campanha com IA</span>
        </button>
      </div>

      {/* Resumo de Performance das Campanhas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Receita Total Resgatada
          </span>
          <span className="text-xl font-black text-emerald-600">
            R$ {metrics.recoveredRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Clientes Convertidos
          </span>
          <span className="text-xl font-black text-blue-700">
            {metrics.recoveredCustomers} clientes
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total de Disparos
          </span>
          <span className="text-xl font-black text-slate-800">
            {metrics.campaignsSent} mensagens
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Taxa Média de Retorno
          </span>
          <span className="text-xl font-black text-emerald-600">
            {metrics.recoveryRate}%
          </span>
        </div>
      </div>

      {/* Filtros de Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'all', label: 'Todas as Campanhas' },
          { key: 'active', label: 'Ativas em Andamento' },
          { key: 'completed', label: 'Concluídas' },
          { key: 'paused', label: 'Pausadas' },
          { key: 'draft', label: 'Rascunhos' },
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setStatusFilter(filter.key as any)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              statusFilter === filter.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Lista de Campanhas ou Empty State */}
      {filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Nenhuma campanha encontrada"
          description="Crie sua primeira campanha com o assistente de IA. Ele redigirá a mensagem ideal para resgatar seus clientes inativos."
          actionText="Criar Primeira Campanha com IA"
          onAction={() => setWizardOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map(camp => (
            <CampaignCard
              key={camp.id}
              campaign={camp}
              onUpdateStatus={updateCampaignStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};
