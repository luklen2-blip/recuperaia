import React from 'react';
import { RotateCcw, ShieldCheck, Heart } from 'lucide-react';

interface PublicFooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onNavigateAuth: (mode: 'login' | 'register') => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onOpenPrivacy, onOpenTerms, onNavigateAuth }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Coluna 1: Marca & Posicionamento */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                RECUPERA<span className="text-blue-400">IA</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              “Transforme clientes esquecidos em novas vendas.” A plataforma inteligente que resgata clientes inativos para pequenas e médias empresas.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Conforme com a LGPD (Lei 13.709/18)</span>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#problema" className="hover:text-white transition-colors">O Problema de Clientes Perdidos</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona o RecuperaIA</a></li>
              <li><a href="#o-que-encontra" className="hover:text-white transition-colors">O que a IA Encontra</a></li>
              <li><a href="#beneficios" className="hover:text-white transition-colors">Benefícios para PMEs</a></li>
              <li><a href="#calculadora" className="hover:text-white transition-colors">Calculadora de Receita</a></li>
            </ul>
          </div>

          {/* Coluna 3: Segmentos Atendidos */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Segmentos</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-slate-300">Restaurantes & Pizzarias</li>
              <li>Hamburguerias & Lanchonetes</li>
              <li>Salões de Beleza & Barbearias</li>
              <li>Clínicas & Consultórios</li>
              <li>Academias & Studios</li>
              <li>Pet Shops & Lojas de Varejo</li>
            </ul>
          </div>

          {/* Coluna 4: Legal & Acesso */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Privacidade & Acesso</h4>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-white transition-colors text-left">
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-white transition-colors text-left">
                  Termos de Uso do Serviço
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateAuth('login')} className="hover:text-white transition-colors text-left">
                  Área do Cliente (Login)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateAuth('register')} className="hover:text-white transition-colors text-left text-blue-400 font-semibold">
                  Criar Nova Conta Grátis
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} RecuperaIA Tecnologia Ltda. CNPJ fictício para fins de validação comercial. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Desenvolvido com foco em conversão e retenção de receita</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
