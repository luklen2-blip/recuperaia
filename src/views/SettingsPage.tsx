import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { SegmentType } from '../types';
import { SEGMENT_CONFIGS } from '../lib/segmentConfig';
import { PrivacyPolicyModal, TermsModal } from '../components/lgpd/PrivacyPolicyModal';
import {
  Settings,
  Building,
  ShieldCheck,
  Download,
  Trash2,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentTenant, updateCurrentTenant } = useAuth();
  const { auditLogs, exportData, deleteAccount } = useData();

  const [companyName, setCompanyName] = useState(currentTenant?.name || '');
  const [managerName, setManagerName] = useState(currentTenant?.managerName || '');
  const [segment, setSegment] = useState<SegmentType>(currentTenant?.segment || 'pizzeria');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentTenant({
      name: companyName,
      managerName,
      segment,
    });
    alert('Configurações atualizadas com sucesso!');
  };

  const handleExportData = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recuperaia_export_${currentTenant?.id || 'tenant'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('ATENÇÃO: Deseja realmente excluir todos os dados da empresa? Esta ação é definitiva e irreversível, apagando clientes, histórico e campanhas conforme o Artigo 18 da LGPD.')) {
      deleteAccount();
      alert('Dados excluídos com sucesso.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <PrivacyPolicyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Configurações da Empresa & LGPD
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Dados cadastrais, configuração de segmento de mercado e direitos de privacidade de dados.
        </p>
      </div>

      {/* Formulário de Configuração Geral (Requisito 30) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          <span>Perfil da Empresa & Nicho de Atuação</span>
        </h3>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs max-w-2xl">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nome Comercial da Empresa</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Responsável / Administrador</label>
              <input
                type="text"
                required
                value={managerName}
                onChange={e => setManagerName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Segmento / Nicho (Configuração Modular)</label>
              <select
                value={segment}
                onChange={e => setSegment(e.target.value as SegmentType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold outline-none focus:border-blue-600"
              >
                {Object.values(SEGMENT_CONFIGS).map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/60 text-slate-600 text-[11px] leading-relaxed">
            A alteração do segmento ajusta automaticamente a terminologia (pedidos, consultas, compras) e o ciclo padrão de recompra sem necessidade de reconstruir a conta.
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
          >
            Salvar Alterações
          </button>
        </form>
      </div>

      {/* Painel LGPD e Segurança (Requisito 20) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Privacidade, Segurança e Direitos do Titular (LGPD)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-800 mb-1">Documentos Legais</h4>
              <p className="text-[11px] text-slate-500">Consulte os termos que regem o serviço e o tratamento de dados.</p>
            </div>
            <div className="pt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Privacidade
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setTermsModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Termos de Uso
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-800 mb-1">Exportação de Dados</h4>
              <p className="text-[11px] text-slate-500">Baixe um arquivo JSON com todos os seus clientes, histórico e campanhas.</p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleExportData}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Base (JSON)</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-xs text-rose-900 mb-1">Direito ao Esquecimento</h4>
              <p className="text-[11px] text-rose-700">Elimine de forma definitiva todos os registros de clientes e métricas.</p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Definitivamente</span>
              </button>
            </div>
          </div>
        </div>

        {/* Logs de Auditoria (Requisito 20) */}
        <div>
          <h4 className="font-bold text-xs text-slate-700 mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Registro de Auditoria de Ações (Últimos Eventos)</span>
          </h4>

          <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Ação</th>
                  <th className="p-2.5">Recurso</th>
                  <th className="p-2.5">Detalhes</th>
                  <th className="p-2.5 text-right">Data / Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-800">{log.action}</td>
                    <td className="p-2.5 text-slate-600">{log.resource}</td>
                    <td className="p-2.5 text-slate-500">{log.details}</td>
                    <td className="p-2.5 text-slate-400 text-right">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
