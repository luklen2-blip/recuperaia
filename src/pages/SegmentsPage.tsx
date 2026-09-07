import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { CustomerSegmentKey } from '../types';
import { SYSTEM_SEGMENTS } from '../lib/rfmEngine';
import {
  Layers,
  Sparkles,
  Plus,
  Users,
  ArrowRight,
  Filter,
  DollarSign,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface SegmentsPageProps {
  onSelectSegment: (key: CustomerSegmentKey) => void;
  onOpenCampaignForSegment: (key: CustomerSegmentKey) => void;
}

export const SegmentsPage: React.FC<SegmentsPageProps> = ({
  onSelectSegment,
  onOpenCampaignForSegment,
}) => {
  const { customers } = useData();
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customSegmentName, setCustomSegmentName] = useState('');
  const [minDays, setMinDays] = useState('30');
  const [minSpend, setMinSpend] = useState('150');
  const [customSegmentsList, setCustomSegmentsList] = useState<Array<{ name: string; filterDesc: string; count: number }>>([
    { name: 'Amantes de Pizza Artesanal', filterDesc: 'Compram no fim de semana e ticket > R$ 100', count: 48 },
    { name: 'Novos clientes de Delivery', filterDesc: 'Cadastrados há menos de 15 dias via app', count: 26 },
  ]);

  const segmentKeys: CustomerSegmentKey[] = [
    'inactive',
    'high_opportunity',
    'at_risk',
    'vip',
    'new',
    'lost'
  ];

  const handleCreateCustomSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSegmentName) return;

    const count = customers.filter(c => c.daysSinceLastPurchase >= Number(minDays) && c.totalSpend >= Number(minSpend)).length;

    setCustomSegmentsList(prev => [
      {
        name: customSegmentName,
        filterDesc: `Inativos há mais de ${minDays} dias e gasto acumulado > R$ ${minSpend}`,
        count
      },
      ...prev
    ]);

    setCustomSegmentName('');
    setCustomModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Segmentação Inteligente de Clientes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Grupos dinâmicos calculados pelo algoritmo RFM para disparos com máxima conversão.
          </p>
        </div>

        <button
          onClick={() => setCustomModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Segmento Personalizado</span>
        </button>
      </div>

      {/* Grade de Segmentos Automáticos RFM (Requisito 10) */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Segmentos Automáticos do Sistema (RFM)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {segmentKeys.map(key => {
            const seg = SYSTEM_SEGMENTS[key];
            const matchingCustomers = customers.filter(c => c.segment === key);
            const count = matchingCustomers.length;
            const totalSpendInGroup = matchingCustomers.reduce((acc, c) => acc + c.totalSpend, 0);

            return (
              <div
                key={key}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${seg.badgeColor}`}>
                      {seg.name}
                    </span>
                    <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                      {count} clientes
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {seg.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Volume Financeiro Acumulado:</span>
                      <strong className="text-slate-900 font-extrabold">
                        R$ {totalSpendInGroup.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectSegment(key)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <span>Ver clientes ({count})</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onOpenCampaignForSegment(key)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Criar Campanha</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Segmentos Personalizados (Requisito 10) */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Segmentos Personalizados Criados
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {customSegmentsList.map((cs, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{cs.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{cs.filterDesc}</p>
                <span className="inline-block mt-2 text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full border border-purple-200">
                  {cs.count} clientes correspondentes
                </span>
              </div>
              <button
                onClick={() => onOpenCampaignForSegment('inactive')}
                className="px-3.5 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold text-slate-700 transition-colors"
              >
                Disparar Campanha
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Criar Segmento Personalizado */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Novo Segmento Customizado</h3>
              </div>
              <button onClick={() => setCustomModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomSegment} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Segmento</label>
                <input
                  type="text"
                  required
                  value={customSegmentName}
                  onChange={e => setCustomSegmentName(e.target.value)}
                  placeholder="Ex: Clientes de Final de Semana"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mínimo de dias inativo</label>
                  <input
                    type="number"
                    value={minDays}
                    onChange={e => setMinDays(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mínimo gasto total (R$)</label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={e => setMinSpend(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Salvar Segmento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
