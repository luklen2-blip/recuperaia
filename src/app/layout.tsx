import React from 'react';
import '../index.css';

export const metadata = {
  title: 'RecuperaIA - Recuperação Inteligente de Vendas e Carrinhos Abandonados com IA',
  description: 'Plataforma SaaS Multi-tenant com Inteligência Artificial para recuperação de carrinhos abandonados, boletos e PIX via WhatsApp Business.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RecuperaIA',
  },
};

export const viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
