import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { PlanType } from '../types';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Users,
  Send,
  Zap,
  Check
} from 'lucide-react';

export const PlansPage: React.FC = () => {
  const { currentTenant, updateCurrentTenant } = useAuth();
  const { customers, campaigns, automations } = useData();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(currentTenant?.plan || 'pro');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const plans = [
    {
      id: 'start' as PlanType,
      name: 'START',
      price: 79,
      customerLimit: 1000,
      userLimit: 1,
      campaignsLimit: '5 por mês',
      automationsLimit: '2 fluxos ativos',
      aiFeatures: 'Básico (sugestões RFM)',
      support: 'E-mail em horário comercial',
      popular: false,
    },
    {
      id: 'pro' as PlanType,
      name: 'PRO',
      price: 149,
      customerLimit: 5000,
      userLimit: 3,
      campaignsLimit: 'Ilimitadas',
      automationsLimit: 'Todos os 7 fluxos oficiais',
      aiFeatures: 'IA Avançada com Copywriter de Campanhas',
      support: 'WhatsApp Prioritário & E-mail',
      popular: true,
    },
    {
      id: 'business' as PlanType,
      name: 'BUSINESS',
      price: 299,
      customerLimit: 50000,
      userLimit: 99,
      campaignsLimit: 'Ilimitadas com alta vazão',
      automationsLimit: 'Fluxos customizados ilimitados',
      aiFeatures: 'IA Turbo sem restrições de chamadas',
      support: 'Gerente de Contas Dedicado',
      popular: false,
    }
  ];

  const currentPlanObj = plans.find(p => p.id === currentTenant?.plan) || plans[1];

  const handleSelectPlan = (planId: PlanType) => {
    setSelectedPlan(planId);
    setCheckoutModalOpen(true);
  };

  const handleConfirmUpgrade = () => {
    updateCurrentTenant({
      plan: selectedPlan,
      planStatus: 'active'
    });
    setCheckoutModalOpen(false);
    alert(`Plano atualizado para ${selectedPlan.toUpperCase()} com sucesso!`);
  };

  return (
    <div className="space-y-8">
      {/* Topo */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Meu Plano & Limites da Assinatura
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gerencie seu plano de recuperação de clientes, franquias de consumo e pagamentos.
        </p>
      </div>

      {/* Card de Status do Plano Atual e Medidores de Limite */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Plano Vigente
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {currentTenant?.planStatus === 'active' ? 'Assinatura Ativa' : 'Período de Testes'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Plano {currentPlanObj.name} — R$ {currentPlanObj.price}/mês
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cobrança mensal recorrente sem fidelidade</span>
          </div>
        </div>

        {/* Medidores de Uso */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Clientes Cadastrados</span>
              <span className="font-bold text-slate-900">
                {customers.length} / {currentPlanObj.customerLimit.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min(100, (customers.length / currentPlanObj.customerLimit) * 100)}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {currentPlanObj.customerLimit - customers.length} contatos restantes
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Campanhas Criadas</span>
              <span className="font-bold text-slate-900">{campaigns.length} disparos</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full w-2/5" />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Franquia: {currentPlanObj.campaignsLimit}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Automações Ativas</span>
              <span className="font-bold text-slate-900">
                {automations.filter(a => a.active).length} ativas
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-purple-600 h-2 rounded-full w-3/5" />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {currentPlanObj.automationsLimit}
            </span>
          </div>
        </div>
      </div>

      {/* Grade de Planos para Upgrade/Downgrade (Requisito 17) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(p => {
          const isCurrent = p.id === currentTenant?.plan;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition-all ${
                p.popular
                  ? 'border-2 border-blue-600 shadow-lg relative'
                  : 'border-slate-200 hover:shadow-md'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full">
                  Mais Popular
                </span>
              )}

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Plano {p.name}
                </span>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-3xl font-black text-slate-900">R$ {p.price}</span>
                  <span className="text-slate-500 text-xs">/mês</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-600 my-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Até <strong>{p.customerLimit.toLocaleString('pt-BR')}</strong> clientes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{p.userLimit} {p.userLimit === 1 ? 'usuário' : 'usuários'} de acesso</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Campanhas: {p.campaignsLimit}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{p.automationsLimit}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{p.aiFeatures}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{p.support}</span>
                  </li>
                </ul>
              </div>

              <div>
                {isCurrent ? (
                  <div className="w-full py-2.5 bg-slate-100 text-slate-600 rounded-xl text-center text-xs font-bold">
                    Plano Atual
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(p.id)}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-xs ${
                      p.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    Migrar para {p.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Simulado de Checkout Seguro (Requisito 17) */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Confirmar Alteração para o Plano {selectedPlan.toUpperCase()}
                </h3>
                <p className="text-xs text-slate-500">Gateway Seguro (Mercado Pago / Stripe)</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span>Valor mensal do plano:</span>
                <strong className="text-slate-900">
                  R$ {selectedPlan === 'start' ? 79 : selectedPlan === 'business' ? 299 : 149},00 / mês
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Faturamento:</span>
                <span className="text-emerald-700 font-semibold">Sem taxa de adesão</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Segurança Bancária:</strong> Os dados de cartão são processados e tokenizados diretamente pelo gateway de pagamento homologado. Não armazenamos números de cartão na plataforma.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmUpgrade}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md shadow-blue-600/20"
              >
                Confirmar Assinatura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
