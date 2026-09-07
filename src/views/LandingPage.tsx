import React, { useState } from 'react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { PrivacyPolicyModal, TermsModal } from '../components/lgpd/PrivacyPolicyModal';
import { calculateCommercialPotential } from '../lib/aiEngine';
import {
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  Clock,
  HelpCircle,
  ChevronDown,
  Building,
  Target,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onNavigateAuth: (mode: 'login' | 'register') => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateAuth, onExploreDemo }) => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  // Estados da Calculadora Comercial (Seção 28)
  const [calcCustomers, setCalcCustomers] = useState(1500);
  const [calcAverageTicket, setCalcAverageTicket] = useState(85);
  const [calcInactivePct, setCalcInactivePct] = useState(30);

  const calcResults = calculateCommercialPotential({
    customerCount: calcCustomers,
    averageTicket: calcAverageTicket,
    inactivePercentage: calcInactivePct,
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'O RecuperaIA é um CRM tradicional?',
      a: 'Não. Diferente de CRMs tradicionais que exigem preenchimento complexo de formulários manuais, o RecuperaIA tem um único foco obsessivo: analisar sua base de clientes, identificar quem parou de comprar e ajudar sua empresa a trazê-los de volta com automação e inteligência.'
    },
    {
      q: 'Funciona apenas para pizzarias e restaurantes?',
      a: 'Começamos focando em restaurantes e pizzarias por seu alto volume de repetição, mas a plataforma foi desenhada com configuração dinâmica para atender salões de beleza, barbearias, clínicas, academias, pet shops, oficinas, lojas e prestadores de serviço.'
    },
    {
      q: 'O sistema dispara mensagens sozinho sem eu saber?',
      a: 'Nunca. O RecuperaIA prioriza a segurança da sua marca e exige aprovação explícita e autorizada antes de qualquer disparo em massa. Você tem controle total dos textos, ofertas e horários.'
    },
    {
      q: 'A integração com o WhatsApp é oficial?',
      a: 'Sim. Preparamos toda a arquitetura para operar através da API Oficial Cloud da Meta (WhatsApp Business Platform), garantindo conformidade com as regras da plataforma e sem risco de bloqueio indevido de chip.'
    },
    {
      q: 'Como importo meus clientes atuais?',
      a: 'Você pode importar sua base através de planilhas CSV exportadas do seu PDV, sistema de frente de caixa, iFood ou planilha Excel em poucos cliques com nosso assistente de mapeamento.'
    },
    {
      q: 'A plataforma está adequada à LGPD?',
      a: 'Totalmente. Seguimos o princípio de minimização de dados, oferecemos isolamento rigoroso multi-tenant, logs de auditoria e funcionalidades de exportação e exclusão definitiva de dados cadastrais (Direito ao Esquecimento).'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <PublicNavbar onNavigateAuth={onNavigateAuth} onScrollTo={scrollToSection} />

      {/* Modais LGPD */}
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />

      {/* HERO SECTION (Seção 4) */}
      <section id="hero" className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge de Posicionamento */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Recuperação Inteligente de Clientes e Receita para PMEs</span>
          </div>

          {/* Headline Principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
            Transforme clientes esquecidos em <span className="text-blue-600">novas vendas.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A RecuperaIA identifica clientes que deixaram de comprar e ajuda sua empresa a trazê-los de volta automaticamente com inteligência e timing perfeito.
          </p>

          {/* CTAs do Hero */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigateAuth('register')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Começar agora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('como-funciona')}
              className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-bold text-base shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Ver como funciona</span>
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Building className="w-4 h-4 text-amber-700" />
              <span>Ver Demo da Pizzaria Bella Massa</span>
            </button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sem fidelidade obrigatória</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Conforme com a LGPD</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Pronto para o WhatsApp Oficial</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: O PROBLEMA (Seção 4) */}
      <section id="problema" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-2">
              O Problema Invisível
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              “Você já conquistou milhares de clientes. Quantos deles nunca mais voltaram?”
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Adquirir um cliente novo custa até 7 vezes mais caro do que vender novamente para quem já provou e aprovou seu produto. No entanto, a maioria das empresas foca apenas em novos clientes e deixa dinheiro na mesa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Clientes Esquecidos', desc: 'Compraram várias vezes no passado e foram esquecidos na correria do dia a dia.' },
              { title: 'Clientes Inativos', desc: 'Ultrapassaram o período habitual de compra e estão prestes a ir para o concorrente.' },
              { title: 'Compraram Apenas 1 Vez', desc: 'Provaram seu produto e nunca foram incentivados para a decisiva 2ª compra.' },
              { title: 'Frequência Diminuindo', desc: 'Compravam semanalmente e agora compram uma vez por mês sem que você perceba.' },
              { title: 'Orçamentos Não Fechados', desc: 'Demonstraram interesse pelo WhatsApp ou balcão mas não finalizaram a compra.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm mb-3">
                    !
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1.5">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: COMO FUNCIONA (Seção 4) */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">
              Passo a Passo Simples
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Como a RecuperaIA funciona na prática
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Sem sistemas complicados. O processo foi desenhado para você começar a recuperar clientes no primeiro dia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Cadastre ou importe seus clientes', desc: 'Suba sua planilha CSV ou conecte sua base em minutos. Seus dados são 100% isolados.' },
              { num: '2', title: 'A RecuperaIA analisa seu histórico', desc: 'O motor RFM calcula recência, frequência de compras e intervalos médios de cada consumidor.' },
              { num: '3', title: 'A IA identifica oportunidades', desc: 'A inteligência aponta exatamente quem está inativo e quem tem mais chance de voltar esta semana.' },
              { num: '4', title: 'Crie ou automatize campanhas', desc: 'A IA redige textos persuasivos e ofertas no timing ideal com sua autorização prévia de disparo.' },
              { num: '5', title: 'Converse com os clientes', desc: 'Centralize conversas do WhatsApp oficial, envie mimos e converta respostas em novos pedidos.' },
              { num: '6', title: 'Acompanhe as vendas recuperadas', desc: 'Veja no dashboard em tempo real o dinheiro que voltou para o seu caixa.' },
            ].map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative hover:border-blue-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                  {step.num}
                </div>
                <h4 className="font-bold text-base text-slate-900 mb-2">{step.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: CALCULADORA COMERCIAL (Seção 28) */}
      <section id="calculadora" className="py-20 bg-gradient-to-b from-blue-900 to-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-2">
              Simulador Comercial Transparente
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Quanto a RecuperaIA pode recuperar?
            </h2>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Descubra quanto dinheiro pode estar parado na sua base de clientes inativos hoje.
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-3xl border border-blue-700/40 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Controles da Simulação */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                    <span>Número total de clientes cadastrados</span>
                    <span className="text-blue-400 font-extrabold text-sm">{calcCustomers.toLocaleString('pt-BR')} clientes</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="10000"
                    step="100"
                    value={calcCustomers}
                    onChange={e => setCalcCustomers(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                    <span>Ticket médio por pedido / compra</span>
                    <span className="text-blue-400 font-extrabold text-sm">R$ {calcAverageTicket.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    step="5"
                    value={calcAverageTicket}
                    onChange={e => setCalcAverageTicket(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                    <span>Percentual estimado de clientes inativos</span>
                    <span className="text-blue-400 font-extrabold text-sm">{calcInactivePct}% inativos</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={calcInactivePct}
                    onChange={e => setCalcInactivePct(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-400">
                  <span>Clientes inativos estimados na sua base: </span>
                  <strong className="text-white">{calcResults.inactiveCount} clientes</strong>
                  <span> (R$ {calcResults.inactiveMoneyTotal.toLocaleString('pt-BR')} deixados na mesa).</span>
                </div>
              </div>

              {/* Resultado do Potencial de Recuperação */}
              <div className="bg-slate-950/70 p-6 sm:p-8 rounded-2xl border border-blue-500/30 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    Projeção com 2% de Recuperação Conservadora
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-400 my-2">
                    R$ {calcResults.recoveredRevenue2Pct.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-xs text-slate-300 block mb-4">
                    em vendas adicionais resgatando apenas <strong>{calcResults.recoveredCount2Pct} clientes</strong> inativos.
                  </span>

                  <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                    <span>Com 5% de taxa de recuperação: </span>
                    <strong className="text-emerald-300">
                      R$ {calcResults.recoveredRevenue5Pct.toLocaleString('pt-BR')}
                    </strong> ({calcResults.recoveredCount5Pct} clientes recuperados).
                  </div>
                </div>

                {/* Disclaimer Obrigatório (Seção 28) */}
                <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 leading-snug">
                  <strong>ESTIMATIVA — NÃO É GARANTIA DE RESULTADO.</strong> {calcResults.disclaimer}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: O QUE A RECUPERAIA ENCONTRA & BENEFÍCIOS (Seção 4) */}
      <section id="o-que-encontra" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">
                Inteligência RFM Automática
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
                O que a RecuperaIA encontra na sua base
              </h2>
              <div className="space-y-3 text-xs sm:text-sm">
                {[
                  { name: '💤 Clientes Inativos', desc: 'Quem já te conhece e parou de comprar há mais de 45 dias.' },
                  { name: '🔥 Clientes VIP', desc: 'Seus maiores compradores para quem você deve enviar mimos e novidades.' },
                  { name: '⚠️ Clientes em Risco', desc: 'Frequência de compras em queda brusca nos últimos 30 dias.' },
                  { name: '💰 Alta Oportunidade', desc: 'Contatos com probabilidade de retorno calculada superior a 70%.' },
                  { name: '🆕 Novos Clientes', desc: 'Quem comprou apenas 1 vez e precisa ser fidelizado com pós-venda.' },
                  { name: '❌ Clientes Perdidos', desc: 'Mais de 90 dias sem contato que necessitam de ofertas agressivas.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">{item.name}</strong>
                      <span className="text-slate-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefícios */}
            <div id="beneficios" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">
                Benefícios para o seu Negócio
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Por que recuperar é mais lucrativo que prospectar?
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'Venda novamente para quem já confia em você', desc: 'Clientes antigos têm ciclo de decisão 80% mais rápido.' },
                  { title: 'Reduza o desperdício de investimento', desc: 'Pare de perder o dinheiro que você já gastou para adquirir o cliente no passado.' },
                  { title: 'Automação sem perda de tempo', desc: 'Deixe a IA monitorar a inatividade e sugerir a hora certa de enviar a mensagem.' },
                  { title: 'Decisões baseadas em dados concretos', desc: 'Saiba exatamente qual é o seu ticket médio, clientes inativos e taxa de retorno.' },
                ].map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{b.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE PREÇOS (Seção 4) */}
      <section id="precos" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">
              Planos Transparentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Investimento que se paga logo no primeiro mês
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Recupere de 1 a 2 clientes por mês e sua assinatura já estará 100% paga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* START */}
            <div className="p-8 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <span className="font-bold text-xs text-slate-500 uppercase tracking-wider block mb-1">START</span>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl font-black text-slate-900">R$ 79</span>
                  <span className="text-slate-500 text-xs">/mês</span>
                </div>
                <p className="text-xs text-slate-600 mb-6">Ideal para negócios locais iniciando a recuperação ativa da base.</p>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">✓ Até 1.000 clientes cadastrados</li>
                  <li className="flex items-center gap-2">✓ 1 usuário de acesso</li>
                  <li className="flex items-center gap-2">✓ Segmentação RFM básica</li>
                  <li className="flex items-center gap-2">✓ Campanhas manuais autorizadas</li>
                  <li className="flex items-center gap-2">✓ Suporte por e-mail</li>
                </ul>
              </div>
              <button
                onClick={() => onNavigateAuth('register')}
                className="mt-8 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors"
              >
                Começar com START
              </button>
            </div>

            {/* PRO (Destaque) */}
            <div className="p-8 rounded-3xl border-2 border-blue-600 bg-blue-50/20 flex flex-col justify-between shadow-xl relative scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Mais Escolhido
              </div>
              <div>
                <span className="font-bold text-xs text-blue-700 uppercase tracking-wider block mb-1">PRO</span>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl font-black text-slate-900">R$ 149</span>
                  <span className="text-slate-500 text-xs">/mês</span>
                </div>
                <p className="text-xs text-slate-600 mb-6">Completo para restaurantes, pizzarias e empresas em crescimento.</p>
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2 font-semibold text-blue-900">✓ Até 5.000 clientes cadastrados</li>
                  <li className="flex items-center gap-2 font-semibold text-blue-900">✓ 3 usuários de equipe</li>
                  <li className="flex items-center gap-2 font-semibold text-blue-900">✓ Criador de campanhas com IA</li>
                  <li className="flex items-center gap-2">✓ Construtor de automações visuais</li>
                  <li className="flex items-center gap-2">✓ Integração oficial WhatsApp Cloud API</li>
                  <li className="flex items-center gap-2">✓ Suporte prioritário via WhatsApp</li>
                </ul>
              </div>
              <button
                onClick={() => onNavigateAuth('register')}
                className="mt-8 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all"
              >
                Começar com PRO
              </button>
            </div>

            {/* BUSINESS */}
            <div className="p-8 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <span className="font-bold text-xs text-slate-500 uppercase tracking-wider block mb-1">BUSINESS</span>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl font-black text-slate-900">R$ 299</span>
                  <span className="text-slate-500 text-xs">/mês</span>
                </div>
                <p className="text-xs text-slate-600 mb-6">Para redes, franquias ou bases consolidadas com alto fluxo.</p>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">✓ Clientes ilimitados</li>
                  <li className="flex items-center gap-2">✓ Usuários ilimitados</li>
                  <li className="flex items-center gap-2">✓ IA avançada sem limites de geração</li>
                  <li className="flex items-center gap-2">✓ Automações sem restrições</li>
                  <li className="flex items-center gap-2">✓ Gestor de conta dedicado</li>
                </ul>
              </div>
              <button
                onClick={() => onNavigateAuth('register')}
                className="mt-8 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors"
              >
                Começar com BUSINESS
              </button>
            </div>
          </div>

          {/* Implantação Opcional Separada (Requisito 4) */}
          <div className="mt-12 max-w-2xl mx-auto p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-600">
            <span className="font-bold text-slate-800">Precisa de ajuda para subir sua base e configurar suas primeiras campanhas?</span>
            <p className="mt-1">
              Oferecemos <strong>implantação assistida opcional</strong> com especialista em retenção por taxa única de R$ 250 (consulte na contratação).
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO FAQ (Seção 4) */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">FAQ</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-slate-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL (Seção 4, 29) */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            “Pare de deixar dinheiro na mesa.”
          </h2>
          <p className="text-lg text-blue-100 max-w-xl mx-auto mb-8">
            Você já gastou tempo e recursos para conquistar seus clientes. Agora use a RecuperaIA para trazê-los de volta.
          </p>
          <button
            onClick={() => onNavigateAuth('register')}
            className="px-9 py-4 bg-white hover:bg-slate-100 text-blue-700 rounded-xl font-extrabold text-base shadow-xl transition-all inline-flex items-center gap-2"
          >
            <span>Começar agora</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <PublicFooter
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenTerms={() => setTermsOpen(true)}
        onNavigateAuth={onNavigateAuth}
      />
    </div>
  );
};
