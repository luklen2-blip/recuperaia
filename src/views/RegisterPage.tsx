import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SegmentType } from '../types';
import { SEGMENT_CONFIGS } from '../lib/segmentConfig';
import { RotateCcw, ArrowRight, Building, User, Mail, Phone, Briefcase, Lock, AlertCircle } from 'lucide-react';

interface RegisterPageProps {
  onNavigateLogin: () => void;
  onNavigateHome: () => void;
  onRegistered: () => void; // abre o onboarding
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateLogin, onNavigateHome, onRegistered }) => {
  const { register } = useAuth();

  const [companyName, setCompanyName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [segment, setSegment] = useState<SegmentType>('pizzeria');
  const [companySize, setCompanySize] = useState('1-5 funcionários');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !managerName || !email || !phone) {
      setError('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await register({
      companyName,
      managerName,
      email,
      phone,
      segment,
      companySize,
      password
    });

    setLoading(false);

    if (res.success) {
      onRegistered(); // Leva ao Onboarding
    } else {
      setError(res.error || 'Erro ao registrar empresa.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center mb-6">
        <div 
          onClick={onNavigateHome}
          className="inline-flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <RotateCcw className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
            RECUPERA<span className="text-blue-600">IA</span>
          </span>
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
          Cadastre sua empresa
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Inicie o resgate de clientes inativos hoje mesmo.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome da Empresa *</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Ex: Pizzaria Forno Nobre"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Responsável *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={e => setManagerName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-mail corporativo *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="contato@empresa.com.br"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Segmento do Negócio *</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={segment}
                    onChange={e => setSegment(e.target.value as SegmentType)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none font-medium"
                  >
                    {Object.values(SEGMENT_CONFIGS).map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tamanho da Empresa</label>
                <select
                  value={companySize}
                  onChange={e => setCompanySize(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none font-medium"
                >
                  <option value="1-5 funcionários">1 a 5 colaboradores</option>
                  <option value="6-15 funcionários">6 a 15 colaboradores</option>
                  <option value="16-50 funcionários">16 a 50 colaboradores</option>
                  <option value="50+ funcionários">Mais de 50 colaboradores</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Crie sua Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Criando sua conta...' : 'Cadastrar e Abrir Onboarding'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">Já possui uma empresa cadastrada? </span>
            <button
              onClick={onNavigateLogin}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Fazer login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
