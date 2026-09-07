import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Política de Privacidade & LGPD</h3>
              <p className="text-xs text-slate-500">Conforme a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">1. Princípio de Minimização de Dados</h4>
            <p>
              O RecuperaIA coleta e armazena estritamente os dados necessários para o cálculo de recência, frequência e histórico de recompras (nome, telefone, e-mail e data/valor de transações). Não solicitamos nem armazenamos dados bancários, números de cartão de crédito ou dados pessoais sensíveis.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">2. Isolamento Multi-Tenant Rigoroso</h4>
            <p>
              Todos os dados pertencentes a cada empresa contratante são isolados logicamente por meio de identificador exclusivo (Tenant ID). Nenhuma empresa tem acesso direto ou indireto a clientes, métricas, conversas ou campanhas de outra empresa cadastrada.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">3. Base Legal e Gestão de Consentimento</h4>
            <p>
              O envio de mensagens de reativação e pós-venda fundamenta-se no Legítimo Interesse e no Consentimento prévio do titular estabelecido no momento da compra/cadastro. Todas as mensagens incluem mecanismos transparentes de opt-out (cancelamento de envio).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">4. Direitos do Titular (Direito ao Esquecimento)</h4>
            <p>
              Em conformidade com o Artigo 18 da LGPD, a qualquer momento o usuário ou o titular dos dados pode solicitar a exportação integral de seus registros em formato estruturado (JSON/CSV) ou a eliminação definitiva e irreversível dos dados cadastrais na plataforma.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">5. Integrações Oficiais</h4>
            <p>
              Todas as comunicações via WhatsApp são estruturadas exclusivamente através da API Oficial Cloud da Meta (WhatsApp Business Platform), cumprindo as políticas de comércio e privacidade do ecossistema oficial.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Entendido e Concordo
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Termos de Uso do Serviço</h3>
              <p className="text-xs text-slate-500">RecuperaIA Plataforma SaaS B2B</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">1. Objeto do Contrato</h4>
            <p>
              A RecuperaIA provê software como serviço (SaaS) especializado em inteligência de retenção, cálculo de probabilidade de recompra e auxílio na formulação de campanhas de reativação para pequenas e médias empresas.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">2. Não Promessa de Venda Garantida</h4>
            <p>
              A plataforma disponibiliza ferramentas analíticas e estimativas de potencial financeiro baseadas no histórico informado pelo cliente. Os valores simulados na calculadora representam projeções estimadas e não constituem garantia de resultado financeiro.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">3. Responsabilidade pelos Conteúdos Enviados</h4>
            <p>
              O cliente é o único responsável pelas ofertas, descontos e mensagens enviadas aos seus consumidores finais, cabendo-lhe a revisão e aprovação explícita de qualquer campanha antes do disparo. O sistema proíbe o envio não autorizado ou spam.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">4. Planos e Cancelamento</h4>
            <p>
              Os planos possuem renovação mensal sem fidelidade obrigatória, podendo ser cancelados diretamente na aba "Meu Plano" com encerramento das cobranças ao final do ciclo vigente.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
