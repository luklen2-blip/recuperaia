import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Termos de Uso - RecuperaIA',
  description: 'Termos e Condições de Uso da Plataforma RecuperaIA em conformidade com a legislação brasileira.',
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 rounded-full mb-2">
              Conformidade Legal Brasileira
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white">Termos e Condições de Uso</h1>
            <p className="text-slate-400 text-sm mt-1">RecuperaIA Tecnologia Ltda • Última atualização: 2026</p>
          </div>
          <Link
            href="/"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← Voltar ao Início
          </Link>
        </div>

        {/* Aviso Ético e Regulatório Obrigatório */}
        <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-5 mb-8 text-amber-200 text-sm leading-relaxed">
          <p className="font-semibold text-amber-100 mb-1">⚠️ Avisos Importantes de Natureza Operacional e Faixa Etária:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-300">
            <li>O RecuperaIA é uma plataforma de automação e produtividade para recuperação de vendas comerciais e mensagens via WhatsApp. Não substitui consultoria jurídica, contábil ou financeira individualizada.</li>
            <li><strong>Classificação Indicativa:</strong> O acesso e uso da plataforma são recomendados para pessoas com idade igual ou superior a <strong>16 anos</strong>. A contratação de planos pagos e assinaturas é <strong>estritamente restrita a maiores de 18 anos</strong> ou emancipados/assistidos nos termos do Código Civil Brasileiro.</li>
          </ul>
        </div>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Objeto e Natureza do Serviço</h2>
            <p>
              O <strong>RecuperaIA</strong> disponibiliza serviços de software como serviço (SaaS) multi-tenant com integração a inteligência artificial,
              comunicação via WhatsApp Business Platform e processamento de pagamentos para auxílio na reativação de clientes e conversão de carrinhos abandonados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Responsabilidade pelo Conteúdo das Mensagens</h2>
            <p>
              O Contratante (Tenant) é o único responsável pelos contatos cadastrados em sua base de clientes, pela obtenção do consentimento prévio (opt-in)
              e pelas políticas de atendimento e descontos ofertados, respeitando as diretrizes oficiais de uso da Meta e o Código de Defesa do Consumidor (Lei nº 8.078/1990).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Pagamentos e Assinaturas via PIX</h2>
            <p>
              As assinaturas dos planos (Start, Pro e Business) podem ser liquidadas via PIX oficial conforme padrão estabelecido pelo Banco Central do Brasil (BACEN)
              ou checkout transparente. O acesso ao plano é liberado imediatamente após a compensação bancária automática do webhook.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Foro e Legislação Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis da República Federativa do Brasil, em especial o Marco Civil da Internet (Lei nº 12.965/2014)
              e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Fica eleito o Foro da Comarca de São Paulo/SP para dirimir quaisquer litígios decorrentes deste instrumento.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
