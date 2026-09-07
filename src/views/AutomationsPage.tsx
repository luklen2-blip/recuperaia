import React from 'react';
import { useData } from '../context/DataContext';
import { FlowBuilder } from '../components/automations/FlowBuilder';
import { Workflow, Sparkles, Plus } from 'lucide-react';

export const AutomationsPage: React.FC = () => {
  const { automations, toggleAutomation } = useData();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Automações de Recuperação
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fluxos encadeados para monitorar clientes inativos e gerar mensagens com IA para sua aprovação.
          </p>
        </div>

        <button
          onClick={() => alert('Para criar novos fluxos personalizados além dos pré-configurados, solicite liberação no plano Business.')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Fluxo de Automação</span>
        </button>
      </div>

      <FlowBuilder
        automations={automations}
        onToggle={toggleAutomation}
      />
    </div>
  );
};
