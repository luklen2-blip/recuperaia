import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, ArrowRight, Building } from 'lucide-react';

interface DemoBannerProps {
  onOpenTenantSwitch?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenTenantSwitch }) => {
  const { currentTenant } = useAuth();

  if (!currentTenant?.isDemo) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 px-4 py-2.5 text-xs sm:text-sm font-medium">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-semibold text-amber-800 uppercase tracking-wider text-[11px] bg-amber-100 px-2 py-0.5 rounded">
            Ambiente Demonstrativo
          </span>
          <span className="text-amber-800">
            Você está visualizando os dados simulados da <strong>Pizzaria Bella Massa</strong> (500 clientes).
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-amber-700 hidden md:inline">Nenhum dado real foi afetado.</span>
          {onOpenTenantSwitch && (
            <button
              onClick={onOpenTenantSwitch}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium text-xs shadow-sm transition-colors"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Alternar Empresa</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
