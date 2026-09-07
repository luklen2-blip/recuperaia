import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, DollarSign, Calendar, FileText } from 'lucide-react';
import { Customer } from '../../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Customer, 'id' | 'tenantId' | 'registeredAt' | 'segment' | 'returnProbability'>) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [lastPurchaseDate, setLastPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalSpend, setTotalSpend] = useState('95.00');
  const [purchaseCount, setPurchaseCount] = useState('2');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const count = parseInt(purchaseCount, 10) || 1;
    const spend = parseFloat(totalSpend) || 0;
    const avg = Math.round((spend / count) * 100) / 100;

    onSave({
      name,
      phone,
      email,
      lastPurchaseDate,
      totalSpend: spend,
      purchaseCount: count,
      averageTicket: avg,
      daysSinceLastPurchase: 0,
      purchaseHistory: [
        {
          id: `ord_${Date.now()}`,
          date: lastPurchaseDate,
          value: avg,
          items: ['Pedido inicial registrado']
        }
      ],
      notes,
      tags: ['Manual'],
      preferredChannel: 'whatsapp',
      consentGiven: true,
      consentDate: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Adicionar Novo Cliente</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: João Pereira"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Telefone / WhatsApp *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">E-mail (opcional)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="cliente@email.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Última Compra</label>
              <input
                type="date"
                value={lastPurchaseDate}
                onChange={e => setLastPurchaseDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nº Compras</label>
              <input
                type="number"
                min="1"
                value={purchaseCount}
                onChange={e => setPurchaseCount(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Gasto (R$)</label>
              <input
                type="number"
                step="0.01"
                value={totalSpend}
                onChange={e => setTotalSpend(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observações ou Preferências</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Prefere pedidos de sexta-feira, gosta de borda recheada..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
            >
              Cadastrar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
