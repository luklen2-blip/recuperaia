'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
  QrCode,
  Store,
  RefreshCw,
} from 'lucide-react';

export default function HomePage() {
  const [monthlyLostRevenue, setMonthlyLostRevenue] = useState(25000);
  const estimatedRecovery = Math.round(monthlyLostRevenue * 0.28);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Bot className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Recupera<span className="text-emerald-400">IA</span>
              </span>
              <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SaaS 24/7
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#solucao" className="hover:text-emerald-400 transition-colors">Solução</a>
            <a href="#transparencia" className="hover:text-emerald-400 transition-colors">Modo Real vs Sandbox</a>
            <a href="#calculadora" className="hover:text-emerald-400 transition-colors">Calculadora</a>
            <a href="#planos" className="hover:text-emerald-400 transition-colors">Planos PIX</a>
            <Link href="/termos" className="hover:text-emerald-400 transition-colors">Termos</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Acessar Painel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-emerald-400 mb-8 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recuperação Inteligente com OpenAI GPT-4o & Meta Cloud API Oficial</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Transforme carrinhos abandonados e PIX esquecidos em{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              faturamento real
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            O copiloto de vendas multi-tenant que aborda seus clientes no WhatsApp com copy persuasiva e humanizada gerada por IA, no momento exato do abandono.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-xl shadow-emerald-500/20 transition-all text-base transform hover:-translate-y-0.5"
            >
              <span>Experimentar no Painel Demo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base"
            >
              <Store className="w-5 h-5 text-emerald-400" />
              <span>Cadastrar Minha Empresa</span>
            </Link>
          </div>

          {/* Destaque de Garantia Ética */}
          <div className="mt-12 flex items-center justify-center space-x-6 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Conforme LGPD & ECA</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>PIX Oficial BACEN</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Isolamento Multi-Tenant</span>
            </span>
          </div>
        </section>

        {/* Seção de Transparência Real vs Sandbox */}
        <section id="transparencia" className="py-16 bg-slate-900/50 border-y border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                Padrão de Integridade
              </span>
              <h2 className="text-3xl font-bold text-white mt-3">Sem Funcionalidades Falsas: Separação Estrita</h2>
              <p className="text-slate-400 mt-2 text-sm">
                Diferente de protótipos que fingem conexões falsas, o RecuperaIA possui arquitetura de provedor duplo com demarcador visual em tempo real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* WhatsApp */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">WhatsApp Business</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Integração oficial com a Meta Cloud API (v21.0). Quando sem credenciais ativas, utiliza o Sandbox Simulator para testes sem custos nem falsos sucessos.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Modo Produção:</span>
                    <span className="text-emerald-400 font-semibold">Meta Graph API</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Modo Testes:</span>
                    <span className="text-amber-400 font-semibold">Sandbox Simulator</span>
                  </div>
                </div>
              </div>

              {/* OpenAI */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Inteligência Artificial</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Motor conectado à OpenAI GPT-4o. Se a chave estiver ausente no tenant, aciona o motor determinístico baseado em regras de RFM sem simulação enganosa.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Modo Produção:</span>
                    <span className="text-emerald-400 font-semibold">OpenAI GPT-4o</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Modo Testes:</span>
                    <span className="text-amber-400 font-semibold">Fallback de Regras</span>
                  </div>
                </div>
              </div>

              {/* Mercado Pago & PIX */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Mercado Pago & PIX BACEN</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Geração matemática do payload EMV Copia-e-Cola com CRC16 oficial do Banco Central, funcionando tanto no app do banco quanto em ambiente de homologação.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Padrão Oficial:</span>
                    <span className="text-emerald-400 font-semibold">EMV QRCPS (BACEN)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Webhooks:</span>
                    <span className="text-emerald-400 font-semibold">Confirmação Instantânea</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculadora de Retorno (ROI) */}
        <section id="calculadora" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
              Simulador de Lucro
            </span>
            <h2 className="text-3xl font-bold text-white mt-3">Quanto sua empresa pode recuperar?</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
              Arraste a barra para estimar o valor mensal de carrinhos e boletos/PIX não concluídos no seu negócio:
            </p>

            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-medium">Faturamento Perdido / Mês:</span>
                <span className="text-lg font-bold text-white">R$ {monthlyLostRevenue.toLocaleString('pt-BR')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="200000"
                step="5000"
                value={monthlyLostRevenue}
                onChange={(e) => setMonthlyLostRevenue(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="mt-8 p-6 bg-slate-950/80 border border-emerald-500/20 rounded-2xl max-w-md mx-auto">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimativa de Recuperação Mensal (+28%)</span>
              <div className="text-4xl font-extrabold text-emerald-400 mt-1">
                + R$ {estimatedRecovery.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Baseado na média de conversão do RecuperaIA com abordagem nos primeiros 15 minutos via WhatsApp.
              </p>
            </div>
          </div>
        </section>

        {/* Planos com PIX Oficial */}
        <section id="planos" className="py-16 bg-slate-900/30 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">Planos Transparentes e Sem Fidelidade</h2>
            <p className="text-slate-400 text-sm mt-2">Ativação imediata via PIX Oficial do Banco Central</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
              {/* Plano Start */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Start</h3>
                  <p className="text-xs text-slate-400 mt-1">Para pequenas lojas e operações locais</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-3xl font-black text-white">R$ 97</span>
                    <span className="text-xs text-slate-400 ml-1">/mês no PIX</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-300">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Até 300 recuperações/mês</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>WhatsApp Cloud API ou Sandbox</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>1 Usuário Gerente</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 block text-center bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl text-xs transition-colors"
                >
                  Selecionar Start
                </Link>
              </div>

              {/* Plano Pro (Destaque) */}
              <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-8 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
                  Mais Escolhido
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Pro IA</h3>
                  <p className="text-xs text-slate-400 mt-1">Ideal para e-commerces e restaurantes em escala</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-3xl font-black text-emerald-400">R$ 197</span>
                    <span className="text-xs text-slate-400 ml-1">/mês no PIX</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-200">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Até 2.000 recuperações/mês</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>OpenAI GPT-4o com copy personalizada</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Segmentação RFM Inteligente</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Usuários e Atendentes Ilimitados</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 block text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Gerar PIX Pro
                </Link>
              </div>

              {/* Plano Business */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Business</h3>
                  <p className="text-xs text-slate-400 mt-1">Para grandes operações, franquias e redes</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-3xl font-black text-white">R$ 397</span>
                    <span className="text-xs text-slate-400 ml-1">/mês no PIX</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-300">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Recuperações Ilimitadas</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Múltiplos números do WhatsApp</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Suporte prioritário e DPO dedicado</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 block text-center bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl text-xs transition-colors"
                >
                  Selecionar Business
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer com Avisos Regulatórios Obrigatórios */}
      <footer className="border-t border-slate-800/80 bg-slate-950 pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Aviso Ético e Regulatório */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 text-slate-400 leading-relaxed">
            <p className="font-semibold text-slate-200">Avisos Legais & Regulatórios:</p>
            <p>
              O RecuperaIA é uma ferramenta tecnológica de apoio à produtividade comercial, automação de mensagens e recuperação de vendas. Não substitui consultoria médica, psicológica ou financeira profissional.
            </p>
            <p>
              <strong>Classificação Indicativa:</strong> 16+ anos. A aquisição de planos e assinaturas é permitida exclusivamente para maiores de 18 anos ou assistidos nos termos da legislação brasileira.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900">
            <p>© 2026 RecuperaIA Tecnologia Ltda. Todos os direitos reservados.</p>
            <div className="flex items-center space-x-6">
              <Link href="/termos" className="hover:text-emerald-400 transition-colors">Termos de Uso</Link>
              <Link href="/privacidade" className="hover:text-emerald-400 transition-colors">Privacidade & LGPD</Link>
              <a href="/api/health" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                <span>/api/health</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
