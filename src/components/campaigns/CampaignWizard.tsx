import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { generateCampaignWithAi } from '../../lib/aiEngine';
import { getSegmentInfo } from '../../lib/segmentConfig';
import { Campaign, CustomerSegmentKey } from '../../types';
import { 
  X, 
  Sparkles, 
  Send, 
  Clock, 
  Users, 
  Gift, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface CampaignWizardProps {
  isOpen: boolean;
  onClose: () => void;
  prefillSegment?: CustomerSegmentKey;
}

export const CampaignWizard: React.FC<CampaignWizardProps> = ({ isOpen, onClose, prefillSegment }) => {
  const { currentTenant } = useAuth();
  const { customers, createCampaign } = useData();

  const segmentInfo = currentTenant ? getSegmentInfo(currentTenant.segment) : getSegmentInfo('other');

  const [step, setStep] = useState<1 | 2>(1);
  const [objective, setObjective] = useState('Recuperar clientes que não compram há mais de 45-60 dias');
  const [customOffer, setCustomOffer] = useState(segmentInfo.defaultOffer);
  const [isGenerating, setIsGenerating] = useState(false);

  // Campos gerados pela IA (editáveis)
  const [title, setTitle] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [offerSuggestion, setOfferSuggestion] = useState('');
  const [targetSegmentKey, setTargetSegmentKey] = useState<string>('inactive');
  const [bestSendTime, setBestSendTime] = useState('');
  const [userConfirmedConsent, setUserConfirmedConsent] = useState(false);

  if (!isOpen) return null;

  const quickObjectives = [
    'Recuperar clientes que não compram há mais de 45-60 dias',
    'Convidar clientes VIP para produto/prato exclusivo',
    'Incentivar segunda compra para novos clientes (Pós-venda)',
    'Aniversariantes do mês com sobremesa/mimo especial',
  ];

  const handleGenerateCopy = () => {
    if (!currentTenant) return;
    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateCampaignWithAi({
        objective,
        segmentType: currentTenant.segment,
        targetAudience: prefillSegment || targetSegmentKey,
        customOffer
      });

      setTitle(generated.title);
      setMessageTemplate(generated.messageTemplate);
      setCtaText(generated.ctaText);
      setOfferSuggestion(generated.offerSuggestion);
      setTargetSegmentKey(prefillSegment || generated.targetSegmentKey);
      setBestSendTime(generated.bestSendTime);

      setIsGenerating(false);
      setStep(2);
    }, 600);
  };

  // Contagem do público-alvo filtrado
  const audienceCount = customers.filter(c => {
    if (targetSegmentKey === 'all') return true;
    return c.segment === targetSegmentKey;
  }).length;

  const handleSaveAndSchedule = (status: Campaign['status']) => {
    if (!title || !messageTemplate || !userConfirmedConsent) return;

    createCampaign({
      title,
      type: targetSegmentKey === 'vip' ? 'special_offer' : targetSegmentKey === 'new' ? 'post_sale' : 'winback',
      targetSegment: targetSegmentKey,
      channel: 'whatsapp',
      status,
      audienceCount,
      messageTemplate,
      offerSuggestion,
      ctaText,
      bestSendTime,
    });

    onClose();
    setStep(1);
    setUserConfirmedConsent(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Criador de Campanhas com IA</h3>
              <p className="text-xs text-slate-500">
                {step === 1 ? 'Etapa 1: Defina o objetivo de resgate' : 'Etapa 2: Revise, personalize e autorize o disparo'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Assistente */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  O que você deseja alcançar?
                </label>
                <input
                  type="text"
                  value={objective}
                  onChange={e => setObjective(e.target.value)}
                  placeholder="Ex: Trazer de volta clientes que não compram há 60 dias"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-2">Sugestões rápidas de objetivos:</span>
                <div className="flex flex-wrap gap-2">
                  {quickObjectives.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setObjective(q)}
                      className={`text-left px-3 py-1.5 rounded-lg border text-xs transition-all ${
                        objective === q
                          ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Sugestão de Benefício / Oferta de Retorno
                </label>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={customOffer}
                    onChange={e => setCustomOffer(e.target.value)}
                    placeholder="Ex: Borda recheada grátis ou 15% OFF"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 outline-none font-medium"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  A RecuperaIA usará esta oferta para compor a mensagem persuasiva.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Título da Campanha */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Título Interno da Campanha</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold outline-none focus:border-blue-600"
                />
              </div>

              {/* Segmento Alvo e Estimativa de Público */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-200/60">
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Público Alvo Selecionado</label>
                  <select
                    value={targetSegmentKey}
                    onChange={e => setTargetSegmentKey(e.target.value)}
                    className="w-full p-2 bg-white border border-blue-300 rounded-lg font-semibold text-slate-800 outline-none"
                  >
                    <option value="inactive">Clientes Inativos (45-90 dias)</option>
                    <option value="at_risk">Clientes em Risco de Abandono</option>
                    <option value="high_opportunity">Alta Oportunidade (Score &gt; 70%)</option>
                    <option value="vip">Clientes VIP de Alto Valor</option>
                    <option value="new">Novos Clientes (1ª compra)</option>
                    <option value="lost">Clientes Perdidos (&gt; 90 dias)</option>
                    <option value="all">Toda a Base ({customers.length} clientes)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Alcance Estimado</label>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-extrabold text-sm text-slate-900">
                      {audienceCount} clientes elegíveis
                    </span>
                  </div>
                </div>
              </div>

              {/* Mensagem do WhatsApp com Variáveis */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-800">
                    Mensagem que será enviada no WhatsApp
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Variáveis disponíveis: <code className="text-blue-600 font-mono">{"{nome}"}</code>, <code className="text-blue-600 font-mono">{"{dias_sem_comprar}"}</code>
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={messageTemplate}
                  onChange={e => setMessageTemplate(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-sans text-xs focus:bg-white focus:border-blue-600 outline-none leading-relaxed"
                />
              </div>

              {/* Linha de Melhor Horário e CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Melhor Horário Sugerido pela IA
                  </span>
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>{bestSendTime}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Chamada para Ação (CTA)
                  </span>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={e => setCtaText(e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 font-medium outline-none text-xs"
                  />
                </div>
              </div>

              {/* Trava de Segurança e Autorização do Usuário (Requisito 13) */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 block text-xs">
                    Autorização Explícita de Disparo
                  </span>
                  <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                    A RecuperaIA nunca dispara mensagens sem sua expressa autorização. Marque abaixo para aprovar o texto e liberar o agendamento da campanha.
                  </p>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userConfirmedConsent}
                      onChange={e => setUserConfirmedConsent(e.target.checked)}
                      className="rounded border-amber-400 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-bold text-xs text-amber-950">
                      Revisei a mensagem e autorizo o envio desta campanha para os {audienceCount} contatos.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer com Ações */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isGenerating || !objective}
                onClick={handleGenerateCopy}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>A IA está redigindo a campanha...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Mensagem com IA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs"
              >
                ← Voltar e ajustar objetivo
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveAndSchedule('draft')}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs"
                >
                  Salvar como Rascunho
                </button>
                <button
                  type="button"
                  disabled={!userConfirmedConsent || audienceCount === 0}
                  onClick={() => handleSaveAndSchedule('active')}
                  className={`px-5 py-2 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-2 ${
                    userConfirmedConsent && audienceCount > 0
                      ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-blue-600/20'
                      : 'bg-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Aprovar & Iniciar Campanha</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
