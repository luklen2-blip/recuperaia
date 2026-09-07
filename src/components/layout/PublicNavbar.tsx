import React, { useState } from 'react';
import { RotateCcw, Menu, X, ArrowRight, Shield } from 'lucide-react';

interface PublicNavbarProps {
  onNavigateAuth: (mode: 'login' | 'register') => void;
  onScrollTo: (sectionId: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onNavigateAuth, onScrollTo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onScrollTo(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('hero')}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              RECUPERA<span className="text-blue-600">IA</span>
            </span>
            <span className="block text-[11px] text-slate-500 font-medium -mt-1">
              Recuperação de Clientes e Receita
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button onClick={() => handleNavClick('problema')} className="hover:text-blue-600 transition-colors">
            O Problema
          </button>
          <button onClick={() => handleNavClick('como-funciona')} className="hover:text-blue-600 transition-colors">
            Como Funciona
          </button>
          <button onClick={() => handleNavClick('o-que-encontra')} className="hover:text-blue-600 transition-colors">
            Oportunidades
          </button>
          <button onClick={() => handleNavClick('calculadora')} className="hover:text-blue-600 text-blue-600 font-semibold transition-colors flex items-center gap-1">
            <span>Simulador de Receita</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">Simular</span>
          </button>
          <button onClick={() => handleNavClick('precos')} className="hover:text-blue-600 transition-colors">
            Preços
          </button>
          <button onClick={() => handleNavClick('faq')} className="hover:text-blue-600 transition-colors">
            FAQ
          </button>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => onNavigateAuth('login')}
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors"
          >
            Entrar
          </button>
          <button
            onClick={() => onNavigateAuth('register')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center gap-2 group"
          >
            <span>Começar agora</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick('problema')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            O Problema
          </button>
          <button
            onClick={() => handleNavClick('como-funciona')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Como Funciona
          </button>
          <button
            onClick={() => handleNavClick('o-que-encontra')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            O que a RecuperaIA Encontra
          </button>
          <button
            onClick={() => handleNavClick('calculadora')}
            className="block w-full text-left py-2 text-sm font-semibold text-blue-600"
          >
            Simulador Comercial de Receita
          </button>
          <button
            onClick={() => handleNavClick('precos')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Preços
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Dúvidas Frequentes
          </button>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => onNavigateAuth('login')}
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              Entrar na Plataforma
            </button>
            <button
              onClick={() => onNavigateAuth('register')}
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-blue-600 rounded-lg shadow"
            >
              Começar agora
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
