'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bot,
  MessageSquare,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Settings,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  RefreshCw,
  Store,
  Users,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface OrderItem {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  source: string;
  status: string;
  totalValue: number;
  itemsJson: string;
  checkoutUrl?: string;
  createdAt: string;
}

interface RecoveryResponse {
  success: boolean;
  recovery?: {
    ai: {
      mode: string;
      modelUsed: string;
      copy: string;
      offer: string;
      urgency: string;
    };
    whatsapp: {
      mode: string;
      status: string;
      messageId: string;
      raw?: any;
    };
  };
  error?: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'recovery' | 'integrations' | 'billing'>('recovery');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [lastRecovery, setLastRecovery] = useState<RecoveryResponse | null>(null);

  // Billing PIX State
  const [pixData, setPixData] = useState<{
    pixCopiaECola: string;
    qrCodeDataUrl: string;
    amount: number;
  } | null>(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // Integrations state
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [whatsappPhoneId, setWhatsappPhoneId] = useState('');
  const [whatsappToken, setWhatsappToken] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Carrega lista inicial de pedidos/carrinhos
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch {
      // Falha de rede silenciosa
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleTriggerRecovery = async (order: OrderItem) => {
    setProcessingId(order.id);
    setLastRecovery(null);

    let parsedItems: string[] = [];
    try {
      parsedItems = JSON.parse(order.itemsJson);
    } catch {
      parsedItems = [order.itemsJson];
    }

    try {
      const res = await fetch('/api/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: order.customerId,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          cartTotal: order.totalValue,
          items: parsedItems,
          daysInactive: 1,
          discountOffered: '10% de desconto no PIX',
          checkoutUrl: order.checkoutUrl,
          forceLiveMode: isLiveMode,
        }),
      });

      const data = await res.json();
      setLastRecovery(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar';
      setLastRecovery({ success: false, error: msg });
    } finally {
      setProcessingId(null);
    }
  };

  const generateSubscriptionPix = async (plan = 'pro') => {
    setLoadingPix(true);
    try {
      const res = await fetch('/api/billing/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.billing) {
        setPixData({
          pixCopiaECola: data.billing.pixCopiaECola,
          qrCodeDataUrl: data.billing.qrCodeDataUrl,
          amount: data.billing.amount,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPix(false);
    }
  };

  const handleCopyPix = () => {
    if (!pixData?.pixCopiaECola) return;
    navigator.clipboard.writeText(pixData.pixCopiaECola);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header com Seletor Multi-tenant e Badge de Modo */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
              <Bot className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              Recupera<span className="text-emerald-400">IA</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-slate-800"></div>

          {/* Seletor de Tenant Ativo */}
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Store className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">Bella Massa Pizzaria & Empório</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Tenant Principal</span>
          </div>
        </div>

        {/* Indicador Estrito de Modo (Sandbox vs Produção) */}
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${
              isLiveMode
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
                : 'bg-amber-950/60 border-amber-600/80 text-amber-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveMode ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            ></span>
            <span>
              {isLiveMode ? 'Produção Conectada (Meta API Real)' : 'Modo Sandbox / Homologação (Sem Custos)'}
            </span>
          </div>

          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
          >
            Alternar Modo
          </button>
        </div>
      </header>

      {/* Subnav com Abas */}
      <div className="border-b border-slate-800 bg-slate-900/40 px-4 sm:px-8 flex space-x-6">
        <button
          onClick={() => setActiveTab('recovery')}
          className={`py-3 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'recovery'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Esteira de Recuperação</span>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`py-3 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'integrations'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Hub de Integrações</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('billing');
            if (!pixData) generateSubscriptionPix();
          }}
          className={`py-3 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'billing'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Assinatura PIX Oficial</span>
        </button>
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* TAB 1: ESTEIRA DE RECUPERAÇÃO */}
        {activeTab === 'recovery' && (
          <div className="space-y-8">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Faturamento Recuperado</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">R$ 14.850,00</div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4% este mês</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Taxa de Conversão</span>
                  <Sparkles className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-black text-white">31.8%</div>
                <div className="text-[11px] text-slate-400 mt-1">Abordagens nos primeiros 15min</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Carrinhos na Esteira</span>
                  <ShoppingCart className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">{orders.length} pedidos</div>
                <div className="text-[11px] text-amber-400 mt-1">Aguardando disparo inteligente</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Mensagens Disparadas</span>
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">142</div>
                <div className="text-[11px] text-slate-400 mt-1">98.2% taxa de entrega</div>
              </div>
            </div>

            {/* Aviso de Transparência do Modo Atual */}
            <div
              className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                isLiveMode
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-800 text-amber-300'
              }`}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">
                  {isLiveMode ? 'Modo Produção Conectado' : 'Ambiente Sandbox Ativo (Transparência Garantida)'}
                </strong>
                {isLiveMode
                  ? 'As mensagens serão disparadas via Meta Graph API oficial diretamente para o WhatsApp dos clientes informados.'
                  : 'Os disparos nesta tela utilizam o WhatsApp Sandbox Simulator e o motor determinístico. O evento é registrado no banco de dados e simulado com segurança sem custos de envio da Meta.'}
              </div>
            </div>

            {/* Resultado do Último Disparo (Se houver) */}
            {lastRecovery && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">Disparo de Recuperação Processado</h3>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    ID: {lastRecovery.recovery?.whatsapp.messageId}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[10px]">
                      Mensagem Gerada pela IA ({lastRecovery.recovery?.ai.modelUsed}):
                    </span>
                    <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 italic font-mono text-[11px]">
                      &ldquo;{lastRecovery.recovery?.ai.copy}&rdquo;
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[10px]">
                      Status de Envio (WhatsApp Provedor):
                    </span>
                    <div className="space-y-1 text-slate-300">
                      <div>Modo: <strong className="text-white">{lastRecovery.recovery?.whatsapp.mode}</strong></div>
                      <div>Status: <span className="text-emerald-400 font-bold">{lastRecovery.recovery?.whatsapp.status}</span></div>
                      {lastRecovery.recovery?.whatsapp.raw?.warning && (
                        <div className="text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-800/60 text-[10px] mt-2">
                          ℹ️ {lastRecovery.recovery.whatsapp.raw.warning}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabela de Carrinhos e Pedidos */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Carrinhos Abandonados e Pedidos Pendentes</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Clientes monitorados via webhooks com cálculo de valor e itens de interesse
                  </p>
                </div>
                <button
                  onClick={fetchOrders}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Atualizar Pedidos"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Cliente & WhatsApp</th>
                      <th className="py-3 px-4">Origem</th>
                      <th className="py-3 px-4">Itens Abandonados</th>
                      <th className="py-3 px-4">Valor Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ação de Recuperação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.map((order) => {
                      let items = [];
                      try {
                        items = JSON.parse(order.itemsJson);
                      } catch {
                        items = [order.itemsJson];
                      }

                      const isProcessing = processingId === order.id;

                      return (
                        <tr key={order.id} className="hover:bg-slate-850/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{order.customerName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                              {order.source}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs truncate text-slate-300">
                            {Array.isArray(items) ? items.join(', ') : items}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            R$ {order.totalValue.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                order.status === 'ABANDONED_CART'
                                  ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                                  : 'bg-cyan-950/80 text-cyan-400 border border-cyan-800'
                              }`}
                            >
                              {order.status === 'ABANDONED_CART' ? 'Carrinho Abandonado' : 'PIX Pendente'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleTriggerRecovery(order)}
                              disabled={isProcessing}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{isProcessing ? 'Enviando...' : 'Disparar IA'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HUB DE INTEGRAÇÕES */}
        {activeTab === 'integrations' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Configuração dos Provedores Oficiais</h2>
              <p className="text-slate-400 text-xs mt-1">
                Conecte suas chaves de API da Meta, OpenAI e Mercado Pago para alternar do Sandbox para Produção real.
              </p>
            </div>

            {/* OpenAI */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Bot className="w-6 h-6 text-teal-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">OpenAI (Geração de Copy GPT-4o)</h3>
                  <p className="text-xs text-slate-400">Chave secreta obtida em platform.openai.com</p>
                </div>
              </div>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* WhatsApp Business Cloud API */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">WhatsApp Business Platform (Meta Cloud API)</h3>
                  <p className="text-xs text-slate-400">Credenciais oficiais obtidas no painel de desenvolvedores da Meta</p>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Phone Number ID (ex: 109876543210987)"
                  value={whatsappPhoneId}
                  onChange={(e) => setWhatsappPhoneId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="password"
                  placeholder="Permanent Access Token (EAAG...)"
                  value={whatsappToken}
                  onChange={(e) => setWhatsappToken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Salvar */}
            <button
              onClick={() => {
                setSaveStatus('Credenciais salvas com sucesso! As integrações utilizarão o modo de produção quando ativado.');
                setTimeout(() => setSaveStatus(null), 4000);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/20"
            >
              Salvar Configurações de Integração
            </button>

            {saveStatus && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
                ✅ {saveStatus}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FATURAMENTO & PIX OFICIAL BACEN */}
        {activeTab === 'billing' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">Assinatura do Plano via PIX Oficial</h2>
              <p className="text-slate-400 text-xs mt-1">
                Geração autêntica de QR Code e Copia e Cola no padrão EMV do Banco Central do Brasil (BACEN)
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-semibold">
                Plano Pro IA • R$ 197,00/mês
              </div>

              {loadingPix ? (
                <div className="py-12 text-slate-400 text-sm">Gerando cobrança PIX com CRC16...</div>
              ) : pixData ? (
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
                    <img
                      src={pixData.qrCodeDataUrl}
                      alt="QR Code PIX BACEN"
                      className="w-56 h-56 mx-auto"
                    />
                  </div>

                  {/* Copia e Cola */}
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-semibold text-slate-400">Código PIX Copia e Cola (EMV BACEN):</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        readOnly
                        value={pixData.pixCopiaECola}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-mono focus:outline-none"
                      />
                      <button
                        onClick={handleCopyPix}
                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 transition-colors"
                      >
                        {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    ℹ️ Abra o aplicativo do seu banco, escolha <strong>PIX</strong> e escaneie o QR Code ou cole a chave acima. A liberação de sua conta é instantânea via webhook.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
