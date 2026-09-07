import React, { useState } from 'react';
import { X, MessageSquare, Key, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (config: { phoneNumberId: string; wabaId: string; accessToken: string; verifiedName: string }) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [verifiedName, setVerifiedName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumberId || !wabaId) return;

    onConnect({
      phoneNumberId,
      wabaId,
      accessToken: accessToken || 'EAAG...meta_cloud_token',
      verifiedName: verifiedName || 'WhatsApp Business Oficial'
    });

    onClose();
  };

  const handleUseSandbox = () => {
    onConnect({
      phoneNumberId: '1098234857621',
      wabaId: 'waba_9988223311',
      accessToken: 'EAAG_sandbox_test_token',
      verifiedName: 'Ambiente de Testes / Sandbox Meta'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Conectar WhatsApp Business Oficial</h3>
              <p className="text-xs text-slate-500">Meta Cloud API (Plataforma Oficial)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário de Configuração */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-snug text-[11px]">
              O RecuperaIA utiliza <strong>estritamente a API Oficial da Meta</strong>. Não usamos métodos paralelos que possam colocar seu número em risco de bloqueio.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nome Comercial da Linha</label>
            <input
              type="text"
              value={verifiedName}
              onChange={e => setVerifiedName(e.target.value)}
              placeholder="Ex: Atendimento Bella Massa"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone Number ID (Meta Developer) *</label>
            <input
              type="text"
              required
              value={phoneNumberId}
              onChange={e => setPhoneNumberId(e.target.value)}
              placeholder="Ex: 104598274981245"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">WhatsApp Business Account ID (WABA ID) *</label>
            <input
              type="text"
              required
              value={wabaId}
              onChange={e => setWabaId(e.target.value)}
              placeholder="Ex: 8829401827491"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Token de Acesso Permanente (System User Token)</label>
            <input
              type="password"
              value={accessToken}
              onChange={e => setAccessToken(e.target.value)}
              placeholder="EAAG..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={handleUseSandbox}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Preencher com credenciais de Sandbox
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm"
              >
                Salvar & Conectar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
