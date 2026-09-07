import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Customer, ChatMessage } from '../../types';
import { ConnectModal } from './ConnectModal';
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Search,
  Send,
  User,
  Clock,
  ShieldCheck,
  Tag,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Power
} from 'lucide-react';

interface WhatsAppHubProps {
  onOpenCustomerDrawer: (customer: Customer) => void;
}

export const WhatsAppHub: React.FC<WhatsAppHubProps> = ({ onOpenCustomerDrawer }) => {
  const { currentTenant } = useAuth();
  const { customers, chatMessages, sendChatMessage, connectWhatsApp, disconnectWhatsApp } = useData();

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const isConnected = currentTenant?.whatsappConfig?.connected ?? false;

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  const currentMessages = activeCustomer 
    ? chatMessages.filter(m => m.customerId === activeCustomer.id)
    : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeCustomer) return;

    sendChatMessage(activeCustomer.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="space-y-6">
      <ConnectModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        onConnect={connectWhatsApp}
      />

      {/* Barra de Status da Integração Oficial (Requisitos 14 e 27) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${
            isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}>
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">WhatsApp Business Platform (Meta Oficial)</h2>
              {isConnected ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  WhatsApp Conectado ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                  Não conectado
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isConnected
                ? `Linha verificada: ${currentTenant?.whatsappConfig?.verifiedName || 'Meta Cloud API Oficial'}`
                : 'Conecte sua API oficial para disparo autorizado de campanhas e conversas com clientes.'}
            </p>
          </div>
        </div>

        <div>
          {isConnected ? (
            <button
              onClick={disconnectWhatsApp}
              className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200"
            >
              Desconectar Linha
            </button>
          ) : (
            <button
              onClick={() => setConnectModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Conectar WhatsApp</span>
            </button>
          )}
        </div>
      </div>

      {/* Alerta de Transparência quando não conectado (Regra 27) */}
      {!isConnected && (
        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Atenção: Integração oficial não configurada</span>
            <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
              O RecuperaIA segue as diretrizes da Meta. As conversas e disparos só são transmitidos para telefones reais após a conexão de sua conta oficial do WhatsApp Business API. Você pode explorar a interface ou conectar o modo de testes acima.
            </p>
          </div>
        </div>
      )}

      {/* Caixa de Entrada e Chat (Requisito 14) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col md:flex-row h-[620px]">
        {/* Lista de Contatos Lateral */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
          {/* Busca */}
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar conversa..."
                className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
              />
            </div>
          </div>

          {/* Lista de Clientes */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredCustomers.slice(0, 30).map(cust => {
              const isSelected = cust.id === activeCustomer?.id;
              const hasMsgs = chatMessages.some(m => m.customerId === cust.id);

              return (
                <button
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`w-full text-left p-3.5 flex items-center justify-between hover:bg-white transition-colors ${
                    isSelected ? 'bg-white border-l-4 border-blue-600 font-semibold shadow-xs' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {cust.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="text-xs text-slate-900 truncate">{cust.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{cust.phone}</div>
                    </div>
                  </div>
                  {hasMsgs && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Janela de Conversa Ativa */}
        {activeCustomer ? (
          <div className="flex-1 flex flex-col h-full bg-slate-50/30">
            {/* Topbar da Conversa */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {activeCustomer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{activeCustomer.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{activeCustomer.phone}</span>
                    <span>•</span>
                    <span className="text-blue-600 font-medium">{activeCustomer.daysSinceLastPurchase} dias sem compras</span>
                  </div>
                </div>
              </div>

              {/* Ações da Conversa (Requisito 14) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenCustomerDrawer(activeCustomer)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Ver Ficha do Cliente</span>
                </button>

                <button
                  onClick={() => alert(`Conversa de ${activeCustomer.name} transferida para atendente humano na fila de atendimento.`)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-200"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Transferir p/ Humano</span>
                </button>
              </div>
            </div>

            {/* Mensagens do Histórico */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {currentMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-xs">Nenhuma mensagem recente nesta conversa</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                    Envie uma mensagem de reativação ou inicie uma conversa autorizada abaixo.
                  </p>
                </div>
              ) : (
                currentMessages.map(msg => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isAgent
                            ? 'bg-blue-600 text-white rounded-br-xs shadow-sm'
                            : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`text-[9px] mt-1 block text-right ${
                            isAgent ? 'text-blue-200' : 'text-slate-400'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          {isAgent && ' • Entregue'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Campo de Envio de Mensagem */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={`Responder ${activeCustomer.name.split(' ')[0]} via WhatsApp...`}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-600 text-slate-900"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Selecione um cliente para visualizar o chat
          </div>
        )}
      </div>
    </div>
  );
};
