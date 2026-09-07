import React from 'react';
import { WhatsAppHub } from '../components/whatsapp/WhatsAppHub';
import { Customer } from '../types';

interface WhatsAppPageProps {
  onOpenCustomerDrawer: (customer: Customer) => void;
}

export const WhatsAppPage: React.FC<WhatsAppPageProps> = ({ onOpenCustomerDrawer }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Central WhatsApp Business Oficial
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Conexão direta com a Meta Cloud API para conversas, histórico e disparos de reativação autorizados.
        </p>
      </div>

      <WhatsAppHub onOpenCustomerDrawer={onOpenCustomerDrawer} />
    </div>
  );
};
