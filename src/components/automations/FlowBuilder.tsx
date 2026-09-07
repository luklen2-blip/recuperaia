import React, { useState } from 'react';
import { Automation, AutomationStep } from '../../types';
import {
  Workflow,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  ArrowDown,
  Power,
  Layers,
  Send,
  UserCheck
} from 'lucide-react';

interface FlowBuilderProps {
  automations: Automation[];
  onToggle: (id: string) => void;
}

export const FlowBuilder: React.FC<FlowBuilderProps> = ({ automations, onToggle }) => {
  const [selectedAutomationId, setSelectedAutomationId] = useState<string>(
    automations[0]?.id || ''
  );

  const selectedAutomation = automations.find(a => a.id === selectedAutomationId) || automations[0];

  const getStepIcon = (type: AutomationStep['type']) => {
    switch (type) {
      case 'trigger':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'condition':
        return <Layers className="w-5 h-5 text-blue-600" />;
      case 'ai_action':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'approval':
        return <UserCheck className="w-5 h-5 text-orange-600" />;
      case 'channel':
        return <Send className="w-5 h-5 text-emerald-600" />;
      case 'outcome':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getStepBadgeColor = (type: AutomationStep['type']) => {
    switch (type) {
      case 'trigger': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'condition': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ai_action': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'approval': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'channel': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'outcome': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Grade de Automações Pré-Configuradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {automations.map(auto => {
          const isSelected = auto.id === selectedAutomation?.id;
          return (
            <div
              key={auto.id}
              onClick={() => setSelectedAutomationId(auto.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/50 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  auto.active ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {auto.active ? 'Ativa' : 'Inativa'}
                </span>

                {/* Switch de Ativação */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(auto.id);
                  }}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                    auto.active ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      auto.active ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <h4 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1">{auto.name}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-snug">
                {auto.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{auto.runsCount} execuções</span>
                <span className="font-bold text-emerald-700">
                  {auto.recoveredCustomers > 0 ? `+${auto.recoveredCustomers} recuperados` : 'Sem disparos'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visualizador do Fluxo Encadeado */}
      {selectedAutomation && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Construtor Visual de Automação
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedAutomation.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {selectedAutomation.active ? 'Ativo em Produção' : 'Pausado'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{selectedAutomation.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedAutomation.description}</p>
            </div>

            <button
              onClick={() => onToggle(selectedAutomation.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto ${
                selectedAutomation.active
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{selectedAutomation.active ? 'Desativar Automação' : 'Ativar Automação'}</span>
            </button>
          </div>

          {/* Diagrama Visual das Etapas (Requisito 15) */}
          <div className="pt-8 max-w-xl mx-auto flex flex-col items-center">
            {selectedAutomation.steps.map((step, index) => {
              const isLast = index === selectedAutomation.steps.length - 1;
              return (
                <React.Fragment key={step.id}>
                  {/* Card do Passo */}
                  <div className="w-full bg-slate-50 hover:bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-400 p-4 shadow-xs transition-all flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
                      {getStepIcon(step.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStepBadgeColor(step.type)}`}>
                          Passo {index + 1}: {step.type.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">Automático</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800">{step.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>

                  {/* Seta de Conexão */}
                  {!isLast && (
                    <div className="my-2 flex flex-col items-center">
                      <div className="w-0.5 h-6 bg-slate-300" />
                      <ArrowDown className="w-4 h-4 text-slate-400 -mt-1" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
