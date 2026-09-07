import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidade e LGPD - RecuperaIA',
  description: 'Conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e proteção de dados.',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 rounded-full mb-2">
              Privacidade & LGPD
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white">Política de Privacidade</h1>
            <p className="text-slate-400 text-sm mt-1">Conformidade com a Lei nº 13.709/2018 (LGPD) • Ano 2026</p>
          </div>
          <Link
            href="/"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← Voltar ao Início
          </Link>
        </div>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Compromisso com a Proteção de Dados</h2>
            <p>
              O <strong>RecuperaIA</strong> atua como Operador de Dados em relação às bases de clientes inseridas por nossos contratantes (Controladores)
              e como Controlador no tocante aos dados cadastrais dos próprios usuários administradores da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Dados Coletados e Finalidade</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong>Dados Cadastrais do Usuário:</strong> Nome, e-mail comercial, telefone e dados da empresa contratante, para fins de autenticação e suporte.</li>
              <li><strong>Dados de Clientes Finais:</strong> Nome, número de WhatsApp, histórico de compras e valor do carrinho abandonado, para a finalidade exclusiva de automação de mensagens de recuperação contratadas pelo Tenant.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Proteção aos Direitos de Crianças e Adolescentes (Art. 14 da LGPD e ECA)</h2>
            <p className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-slate-300">
              Em estrita conformidade com o Artigo 14 da LGPD e o Estatuto da Criança e do Adolescente (ECA), o RecuperaIA não coleta intencionalmente
              nem processa dados de menores de 16 anos. O cadastro na plataforma é restrito a empresas e profissionais legalmente capazes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Direitos do Titular (Art. 18 da LGPD)</h2>
            <p>
              Qualquer titular poderá solicitar confirmação da existência de tratamento, acesso aos dados, correção de dados incompletos
              ou a eliminação definitiva de seus dados de nossas bases através do canal do Encarregado de Dados (DPO): <code className="text-emerald-400">dpo@recuperaia.com.br</code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
