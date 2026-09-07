import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Customer, CustomerSegmentKey } from '../types';
import { SYSTEM_SEGMENTS } from '../lib/rfmEngine';
import { CustomerDrawer } from '../components/crm/CustomerDrawer';
import { CustomerModal } from '../components/crm/CustomerModal';
import { CsvImportModal } from '../components/crm/CsvImportModal';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  UserPlus,
  Upload,
  Filter,
  Eye,
  MessageSquare,
  Send,
  Trash2,
  Calendar,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface CustomersPageProps {
  initialSegmentFilter?: CustomerSegmentKey;
  onOpenWhatsAppCustomer: (customer: Customer) => void;
  onOpenCampaignCustomer: (customer: Customer) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  initialSegmentFilter,
  onOpenWhatsAppCustomer,
  onOpenCampaignCustomer,
}) => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, importCsvCustomers } = useData();

  const [activeFilter, setActiveFilter] = useState<CustomerSegmentKey | 'all'>(
    initialSegmentFilter || 'all'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filterTabs = [
    { key: 'all', label: 'Todos os Clientes', count: customers.length },
    { key: 'inactive', label: '💤 Inativos', count: customers.filter(c => c.segment === 'inactive').length },
    { key: 'high_opportunity', label: '💰 Alta Oportunidade', count: customers.filter(c => c.segment === 'high_opportunity').length },
    { key: 'at_risk', label: '⚠️ Em Risco', count: customers.filter(c => c.segment === 'at_risk').length },
    { key: 'vip', label: '🔥 VIP', count: customers.filter(c => c.segment === 'vip').length },
    { key: 'new', label: '🆕 Novos', count: customers.filter(c => c.segment === 'new').length },
    { key: 'lost', label: '❌ Perdidos', count: customers.filter(c => c.segment === 'lost').length },
  ];

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchSegment = activeFilter === 'all' || c.segment === activeFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        (c.email && c.email.toLowerCase().includes(term));

      return matchSegment && matchSearch;
    });
  }, [customers, activeFilter, searchTerm]);

  // Paginação
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Drawer Ficha do Cliente */}
      <CustomerDrawer
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onOpenWhatsApp={(c) => {
          setSelectedCustomer(null);
          onOpenWhatsAppCustomer(c);
        }}
        onSendCampaign={(c) => {
          setSelectedCustomer(null);
          onOpenCampaignCustomer(c);
        }}
        onDeleteCustomer={deleteCustomer}
      />

      {/* Modais */}
      <CustomerModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={addCustomer}
      />

      <CsvImportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onImport={importCsvCustomers}
      />

      {/* Topo e Botões Principais */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Base de Clientes (CRM)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerenciamento de contatos, recência, probabilidade de retorno e ações rápidas.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCsvModalOpen(true)}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Importar CSV</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Adicionar Cliente</span>
          </button>
        </div>
      </div>

      {/* Filtros e Barra de Pesquisa */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        {/* Barra de Busca */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Pesquisar por nome, telefone ou e-mail..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-colors"
          />
        </div>

        {/* Abas de Filtros RFM (Requisito 8) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {filterTabs.map(tab => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveFilter(tab.key as any);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabela de Clientes ou Empty State */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum cliente encontrado com estes filtros"
          description="Tente alterar os termos de pesquisa ou importar novos clientes através de planilha CSV."
          actionText="Importar Clientes CSV"
          onAction={() => setCsvModalOpen(true)}
          secondaryActionText="Limpar Filtros"
          onSecondaryAction={() => {
            setSearchTerm('');
            setActiveFilter('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* TABELA DESKTOP */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Cliente / Contato</th>
                  <th className="p-4">Segmento RFM</th>
                  <th className="p-4">Última Compra</th>
                  <th className="p-4">Dias sem Comprar</th>
                  <th className="p-4">Total Gasto</th>
                  <th className="p-4">Probab. Retorno</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCustomers.map(cust => {
                  const segDef = SYSTEM_SEGMENTS[cust.segment] || SYSTEM_SEGMENTS.inactive;
                  return (
                    <tr
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {cust.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{cust.name}</div>
                            <div className="text-[11px] text-slate-500">{cust.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${segDef.badgeColor}`}>
                          {segDef.name}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600 font-medium">
                        {new Date(cust.lastPurchaseDate).toLocaleDateString('pt-BR')}
                      </td>

                      <td className="p-4">
                        <span className={`font-bold ${
                          cust.daysSinceLastPurchase > 60 ? 'text-rose-600' : 'text-slate-800'
                        }`}>
                          {cust.daysSinceLastPurchase} dias
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">
                          R$ {cust.totalSpend.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {cust.purchaseCount} {cust.purchaseCount === 1 ? 'pedido' : 'pedidos'}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                cust.returnProbability >= 75 ? 'bg-emerald-500' : cust.returnProbability >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${cust.returnProbability}%` }}
                            />
                          </div>
                          <span className="font-bold text-[11px] text-slate-800">
                            {cust.returnProbability}%
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenWhatsAppCustomer(cust)}
                            title="Abrir WhatsApp"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            title="Ver Ficha Completa"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* VISUALIZAÇÃO EM CARDS NO MOBILE (Requisito 21) */}
          <div className="md:hidden divide-y divide-slate-100">
            {paginatedCustomers.map(cust => {
              const segDef = SYSTEM_SEGMENTS[cust.segment] || SYSTEM_SEGMENTS.inactive;
              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className="p-4 hover:bg-slate-50 flex flex-col gap-2 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{cust.name}</h4>
                      <p className="text-xs text-slate-500">{cust.phone}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${segDef.badgeColor}`}>
                      {segDef.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Sem Comprar</span>
                      <span className="font-bold text-slate-800">{cust.daysSinceLastPurchase} dias</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Gasto</span>
                      <span className="font-bold text-slate-800">R$ {cust.totalSpend.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Probab. Retorno</span>
                      <span className="font-bold text-emerald-700">{cust.returnProbability}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginação */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Mostrando {Math.min(filteredCustomers.length, (currentPage - 1) * pageSize + 1)} a{' '}
              {Math.min(filteredCustomers.length, currentPage * pageSize)} de {filteredCustomers.length} clientes
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-slate-800">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
