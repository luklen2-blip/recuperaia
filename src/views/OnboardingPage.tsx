import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SegmentType } from '../types';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  RotateCcw,
  Utensils,
  Pizza,
  ShoppingBag,
  Stethoscope,
  Dumbbell,
  Scissors,
  Dog,
  Wrench,
  Briefcase,
  Layers,
  MessageSquare,
  Camera,
  Store,
  Globe,
  Bike
} from 'lucide-react';

interface OnboardingPageProps {
  onFinish: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onFinish }) => {
  const { currentTenant, updateCurrentTenant, completeOnboarding } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Estados das 4 etapas
  const [selectedSegment, setSelectedSegment] = useState<SegmentType>(currentTenant?.segment || 'pizzeria');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['WhatsApp', 'Delivery']);
  const [approxCustomers, setApproxCustomers] = useState('501 a 2.000 clientes');
  const [mainObjective, setMainObjective] = useState('Recuperar clientes');

  const businessTypes = [
    { id: 'restaurant', label: 'Restaurante', icon: Utensils },
    { id: 'pizzeria', label: 'Pizzaria', icon: Pizza },
    { id: 'retail', label: 'Loja / Varejo', icon: ShoppingBag },
    { id: 'clinic', label: 'Clínica / Saúde', icon: Stethoscope },
    { id: 'fitness', label: 'Academia', icon: Dumbbell },
    { id: 'beauty_salon', label: 'Salão / Barbearia', icon: Scissors },
    { id: 'pet_shop', label: 'Pet Shop', icon: Dog },
    { id: 'auto_repair', label: 'Oficina Mecânica', icon: Wrench },
    { id: 'services', label: 'Prestador Serviços', icon: Briefcase },
    { id: 'other', label: 'Outro Negócio', icon: Layers },
  ];

  const salesChannels = [
    { id: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'Instagram', label: 'Instagram Direct', icon: Camera },
    { id: 'Loja física', label: 'Balcão / Loja física', icon: Store },
    { id: 'Site', label: 'Site / E-commerce', icon: Globe },
    { id: 'Delivery', label: 'Delivery (App/Próprio)', icon: Bike },
    { id: 'Outros', label: 'Outros canais', icon: Layers },
  ];

  const customerRanges = [
    'Até 500 clientes',
    '501 a 2.000 clientes',
    '2.001 a 5.000 clientes',
    'Mais de 5.000 clientes'
  ];

  const objectives = [
    { id: 'Recuperar clientes', label: 'Recuperar clientes inativos', desc: 'Identificar quem parou de comprar e resgatá-los' },
    { id: 'Aumentar vendas', label: 'Aumentar vendas e recompra', desc: 'Estimular compras frequentes dentro do ciclo ideal' },
    { id: 'Melhorar retenção', label: 'Melhorar retenção e fidelidade', desc: 'Cuidar dos clientes VIP para nunca perderem o vínculo' },
    { id: 'Recuperar orçamentos', label: 'Recuperar orçamentos e carrinhos', desc: 'Converter contatos que demonstraram interesse' },
    { id: 'Automatizar atendimento', label: 'Automatizar acompanhamento', desc: 'Pós-venda e aniversários no piloto automático' },
  ];

  const toggleChannel = (channel: string) => {
    if (selectedChannels.includes(channel)) {
      setSelectedChannels(selectedChannels.filter(c => c !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as any);
    } else {
      // Salva dados no Tenant
      updateCurrentTenant({
        segment: selectedSegment,
      });
      completeOnboarding({
        salesChannels: selectedChannels,
        mainObjective,
      });
      setStep(5); // Tela de Sucesso
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 5) {
      setStep((step - 1) as any);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl w-full mx-auto">
        {/* Header do Onboarding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              RECUPERA<span className="text-blue-600">IA</span>
            </span>
          </div>

          {step <= 4 && (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Configuração Inicial</span>
                <span>Etapa {step} de 4</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Card Central */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
          {/* ETAPA 1: QUAL É O SEU NEGÓCIO? */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-extrabold text-slate-900">Qual é o seu negócio?</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  A RecuperaIA adaptará termos, métricas e campanhas ao seu segmento.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {businessTypes.map(b => {
                  const Icon = b.icon;
                  const isSelected = selectedSegment === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedSegment(b.id as SegmentType)}
                      className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-600 text-blue-900 ring-2 ring-blue-600/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-xs">{b.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPA 2: COMO VOCÊ VENDE? */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-extrabold text-slate-900">Como você vende?</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Selecione todos os canais de contato que sua empresa utiliza.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {salesChannels.map(c => {
                  const Icon = c.icon;
                  const isSelected = selectedChannels.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleChannel(c.id)}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-600 text-blue-900 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs">{c.label}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPA 3: QUANTOS CLIENTES VOCÊ POSSUI? */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Quantos clientes você possui aproximadamente?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Estimativa de contatos com histórico ou cadastrados no seu sistema.
                </p>
              </div>

              <div className="space-y-3">
                {customerRanges.map(range => {
                  const isSelected = approxCustomers === range;
                  return (
                    <div
                      key={range}
                      onClick={() => setApproxCustomers(range)}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="font-bold text-sm">{range}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPA 4: QUAL SEU PRINCIPAL OBJETIVO? */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Qual seu principal objetivo?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Vamos priorizar automações e relatórios de acordo com sua meta.
                </p>
              </div>

              <div className="space-y-3">
                {objectives.map(obj => {
                  const isSelected = mainObjective === obj.id;
                  return (
                    <div
                      key={obj.id}
                      onClick={() => setMainObjective(obj.id)}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">{obj.label}</span>
                        <span className="text-xs text-slate-500 mt-0.5 block">{obj.desc}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TELA DE SUCESSO: ETAPA 5 */}
          {step === 5 && (
            <div className="py-8 text-center space-y-5">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-12 ring-emerald-50">
                <Sparkles className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900">
                “Sua RecuperaIA está pronta para encontrar oportunidades.”
              </h3>

              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Configuramos o motor de recuperação para o segmento de <strong>{currentTenant?.name}</strong>. Agora vamos importar seus clientes ou explorar as primeiras recomendações.
              </p>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onFinish}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2"
                >
                  <span>Acessar Painel e Encontrar Dinheiro Perdido</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Botões de Navegação Inferiores */}
          {step <= 4 && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
              >
                <span>{step === 4 ? 'Concluir Configuração' : 'Avançar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
