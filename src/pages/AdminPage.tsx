import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPlatformMetrics, getTenants, saveTenant } from '../lib/storage';
import { Tenant, PlanType } from '../types';
import {
  ShieldCheck,
  Building,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Power,
  RotateCcw,
  Search,
  Activity,
  Layers,
  FileText
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { allTenants, switchTenant } = useAuth();
  const [tenantsList, setTenantsList] = useState<Tenant[]>(getTenants());
  const [searchTerm, setSearchTerm] = useState('');

  const metrics = getPlatformMetrics();

  const handleToggleActive = (tenantId: string) => {
    const list = getTenants();
    const target = list.find(t => t.id === tenantId);
    if (target) {
      target.active = !target.active;
      saveTenant(target);
      setTenantsList([...getTenants()]);
    }
  };

  const handleChangePlan = (tenantId: string, newPlan: PlanType) => {
    const list = getTenants();
    const target = list.find(t => t.id === tenantId);
    if (target) {
      target.plan = newPlan;
      saveTenant(target);
      setTenantsList([...getTenants()]);
    }
  };

  const filteredTenants = tenantsList.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Topo Super Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Painel do Administrador Geral (Super Admin)</span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestão Global da Plataforma RecuperaIA
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visão executiva de empresas cadastradas, receita recorrente (MRR), churn e métricas multi-tenant.
          </p>
        </div>
      </div>

      {/* Grade de KPIs Globais do SaaS (Requisito 18) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Empresas Cadastradas
          </span>
          <span className="text-2xl font-black text-slate-900">{metrics.totalCompanies}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Empresas Ativas
          </span>
          <span className="text-2xl font-black text-emerald-600">{metrics.activeCompanies}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            MRR da Plataforma
          </span>
          <span className="text-2xl font-black text-blue-700">
            R$ {metrics.mrr.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Taxa de Churn
          </span>
          <span className="text-2xl font-black text-slate-800">{metrics.churnRate}%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Clientes Processados
          </span>
          <span className="text-2xl font-black text-purple-700">
            {metrics.totalCustomersProcessed.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Receita Global Salva
          </span>
          <span className="text-xl font-black text-emerald-600 truncate block">
            R$ {metrics.globalRecoveredRevenue.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Tabela de Gestão de Empresas (Tenants) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Empresas e Contas Cadastradas</h3>
            <p className="text-xs text-slate-500">Controle de ativação, alteração de plano e inspeção de tenant</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por empresa..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 text-slate-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Empresa / Responsável</th>
                <th className="p-3">Segmento</th>
                <th className="p-3">Plano</th>
                <th className="p-3">Data Cadastro</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-400">{t.managerName} • {t.email}</div>
                  </td>

                  <td className="p-3 capitalize text-slate-700">
                    {t.segment.replace('_', ' ')}
                  </td>

                  <td className="p-3">
                    <select
                      value={t.plan}
                      onChange={e => handleChangePlan(t.id, e.target.value as PlanType)}
                      className="p-1 bg-white border border-slate-200 rounded text-xs font-bold text-blue-700 outline-none"
                    >
                      <option value="start">START (R$ 79)</option>
                      <option value="pro">PRO (R$ 149)</option>
                      <option value="business">BUSINESS (R$ 299)</option>
                    </select>
                  </td>

                  <td className="p-3 text-slate-500">
                    {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {t.active ? 'Ativa' : 'Desativada'}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => switchTenant(t.id)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold"
                      >
                        Acessar Conta
                      </button>

                      <button
                        onClick={() => handleToggleActive(t.id)}
                        title={t.active ? 'Suspender Conta' : 'Ativar Conta'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          t.active
                            ? 'text-rose-500 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
