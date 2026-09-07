import React from 'react';
import { Campaign } from '../../types';
import { SYSTEM_SEGMENTS } from '../../lib/rfmEngine';
import {
  Send,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Play,
  Pause,
  CheckCheck,
  Clock,
  ExternalLink
} from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  onUpdateStatus: (id: string, status: Campaign['status']) => void;
  onViewDetails?: (campaign: Campaign) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onUpdateStatus, onViewDetails }) => {
  const segmentDef = (SYSTEM_SEGMENTS as Record<string, any>)[campaign.targetSegment];

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return { label: 'Ativa / Em Andamento', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'completed':
        return { label: 'Concluída', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'paused':
        return { label: 'Pausada', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'draft':
      default:
        return { label: 'Rascunho', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const statusBadge = getStatusBadge(campaign.status);

  // Taxa de conversão da campanha
  const conversionRate = campaign.sentCount > 0
    ? Math.round((campaign.conversionCount / campaign.sentCount) * 100)
    : 0;

  const responseRate = campaign.sentCount > 0
    ? Math.round((campaign.responseCount / campaign.sentCount) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all">
      {/* Header do Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.color}`}>
              {statusBadge.label}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <h3 className="font-bold text-base text-slate-900 leading-snug">{campaign.title}</h3>
        </div>

        {/* Ações de Status */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {campaign.status === 'active' && (
            <button
              onClick={() => onUpdateStatus(campaign.id, 'paused')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-amber-200"
            >
              <Pause className="w-3 h-3" />
              <span>Pausar</span>
            </button>
          )}
          {campaign.status === 'paused' && (
            <button
              onClick={() => onUpdateStatus(campaign.id, 'active')}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-emerald-200"
            >
              <Play className="w-3 h-3" />
              <span>Retomar</span>
            </button>
          )}
          {campaign.status === 'active' && (
            <button
              onClick={() => onUpdateStatus(campaign.id, 'completed')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3 h-3" />
              <span>Concluir</span>
            </button>
          )}
        </div>
      </div>

      {/* Grade de Métricas da Campanha (Requisito 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 my-4">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-[10px] text-slate-500 block">Enviados</span>
          <span className="font-extrabold text-sm text-slate-800">{campaign.sentCount}</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-[10px] text-slate-500 block">Entregues</span>
          <span className="font-extrabold text-sm text-slate-800">{campaign.deliveredCount}</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-[10px] text-slate-500 block">Respostas</span>
          <span className="font-extrabold text-sm text-blue-700">
            {campaign.responseCount} <span className="text-[10px] font-normal text-slate-400">({responseRate}%)</span>
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-[10px] text-slate-500 block">Conversões</span>
          <span className="font-extrabold text-sm text-emerald-700">
            {campaign.conversionCount} <span className="text-[10px] font-normal text-slate-400">({conversionRate}%)</span>
          </span>
        </div>

        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 sm:col-span-2">
          <span className="text-[10px] text-emerald-800 font-semibold block">Receita Recuperada</span>
          <span className="font-black text-base text-emerald-700">
            R$ {campaign.recoveredRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Visualizador da Mensagem */}
      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-700">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Mensagem Transmitida
        </span>
        <p className="line-clamp-2 italic text-slate-600">
          "{campaign.messageTemplate}"
        </p>
      </div>

      {/* Rodapé com Segmento e Canal */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Público: <strong className="text-slate-800">{segmentDef?.name || campaign.targetSegment}</strong></span>
          <span>•</span>
          <span>Canal: <strong className="text-slate-800">WhatsApp Oficial</strong></span>
        </div>
        {campaign.bestSendTime && (
          <span className="text-[11px] text-slate-400">Horário: {campaign.bestSendTime}</span>
        )}
      </div>
    </div>
  );
};
