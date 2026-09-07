import React from 'react';
import { Customer } from '../../types';
import { SYSTEM_SEGMENTS } from '../../lib/rfmEngine';
import {
  X,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Clock,
  Sparkles,
  MessageSquare,
  Send,
  Trash2,
  Tag,
  ShieldCheck,
  Receipt
} from 'lucide-react';

interface CustomerDrawerProps {
  customer: Customer | null;
  onClose: () => void;
  onOpenWhatsApp: (customer: Customer) => void;
  onSendCampaign: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  customer,
  onClose,
  onOpenWhatsApp,
  onSendCampaign,
  onDeleteCustomer,
}) => {
  if (!customer) return null;

  const segmentDef = SYSTEM_SEGMENTS[customer.segment] || SYSTEM_SEGMENTS.inactive;

  const getProbabilityColor = (prob: number) => {
    if (prob >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (prob >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getProbabilityLabel = (prob: number) => {
    if (prob >= 75) return 'Alta Probabilidade';
    if (prob >= 50) return 'Média Probabilidade';
    return 'Baixa (Risco de Perda)';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header do Drawer */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20 shrink-0">
              {customer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">{customer.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${segmentDef.badgeColor}`}>
                  {segmentDef.name}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {customer.daysSinceLastPurchase} dias sem comprar
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Indicador de Probabilidade de Retorno */}
          <div className={`p-4 rounded-xl border ${getProbabilityColor(customer.returnProbability)}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">Probabilidade de Retorno</span>
              <span className="text-xs font-bold">{getProbabilityLabel(customer.returnProbability)}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black">{customer.returnProbability}%</span>
              <span className="text-xs opacity-80">calculado pelo algoritmo de recência e frequência</span>
            </div>
            <div className="w-full bg-slate-200/60 rounded-full h-2 mt-2.5 overflow-hidden">
              <div
                className="bg-current h-2 rounded-full transition-all duration-500"
                style={{ width: `${customer.returnProbability}%` }}
              />
            </div>
          </div>

          {/* Bloco de Recomendação da IA */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-200/80">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Diagnóstico Inteligente da RecuperaIA</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {customer.aiRecommendation || 'Cliente analisado pelo motor RFM. Recomenda-se abordagem personalizada com oferta de retorno.'}
            </p>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onOpenWhatsApp(customer)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Abrir Conversa</span>
            </button>
            <button
              onClick={() => onSendCampaign(customer)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Campanha</span>
            </button>
          </div>

          {/* Métricas Financeiras & Frequência */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Métricas de Consumo</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Total Gasto</span>
                <span className="text-base font-extrabold text-slate-900">
                  R$ {customer.totalSpend.toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Ticket Médio</span>
                <span className="text-base font-extrabold text-slate-900">
                  R$ {customer.averageTicket.toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Número de Compras</span>
                <span className="text-base font-extrabold text-slate-900">
                  {customer.purchaseCount} {customer.purchaseCount === 1 ? 'pedido' : 'pedidos'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Última Compra</span>
                <span className="text-xs font-bold text-slate-800">
                  {new Date(customer.lastPurchaseDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Dados de Contato */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dados Cadastrais</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Telefone / WhatsApp:
                </span>
                <span className="font-semibold text-slate-800">{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    E-mail:
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">{customer.email}</span>
                </div>
              )}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Cliente desde:
                </span>
                <span className="font-semibold text-slate-800">
                  {new Date(customer.registeredAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Histórico de Compras e Itens */}
          {customer.purchaseHistory && customer.purchaseHistory.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Histórico de Pedidos</h4>
              <div className="space-y-2">
                {customer.purchaseHistory.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Receipt className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="font-extrabold text-emerald-700">R$ {item.value.toFixed(2)}</span>
                    </div>
                    {item.items && item.items.length > 0 && (
                      <div className="text-slate-500 flex flex-wrap gap-1 mt-1">
                        {item.items.map((prod, pIdx) => (
                          <span key={pIdx} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                            {prod}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observações & Tags */}
          {customer.notes && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Observações</h4>
              <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-amber-900 leading-relaxed">
                {customer.notes}
              </div>
            </div>
          )}

          {/* Exclusão LGPD */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                if (window.confirm(`Tem certeza que deseja excluir todos os dados de ${customer.name}? Esta ação é irreversível conforme a LGPD.`)) {
                  onDeleteCustomer(customer.id);
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir cliente definitivamente (Direito ao Esquecimento - LGPD)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
