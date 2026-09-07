import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RotateCcw, ArrowRight, Lock, Mail, AlertCircle, Building, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onNavigateRegister: () => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateRegister, onNavigateHome }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Credenciais inválidas.');
    }
  };

  const handleQuickDemo = async () => {
    setEmail('contato@bellamassa.com.br');
    setPassword('senha123');
    setLoading(true);
    await login('contato@bellamassa.com.br');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
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
          Acesse sua conta
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">
          “Transforme clientes esquecidos em novas vendas.”
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200">
          {/* Botão de Demonstração Rápida */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-300 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Acessar Demo: Pizzaria Bella Massa (500 clientes)</span>
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400">
              <span className="bg-white px-2">ou entre com seu e-mail</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">E-mail corporativo</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="voce@suaempresa.com.br"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Senha</label>
                <button
                  type="button"
                  onClick={() => alert('Link de recuperação enviado para seu e-mail cadastrado.')}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 outline-none text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Entrando...' : 'Entrar na Plataforma'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">Ainda não tem uma conta? </span>
            <button
              onClick={onNavigateRegister}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Criar conta da sua empresa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
