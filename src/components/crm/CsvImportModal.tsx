import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Copy } from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (rows: Array<{ name: string; phone: string; email?: string; lastPurchaseDate?: string; totalSpend?: number; purchaseCount?: number }>) => number;
}

const SAMPLE_CSV = `Nome,Telefone,Email,UltimaCompra,TotalGasto,Compras
Roberto Guimarães,(11) 98123-4567,roberto@email.com,2024-05-10,240.00,3
Fernanda Vasconcelos,(11) 97654-3210,fernanda@email.com,2024-04-15,185.50,2
Carlos Alberto Costa,(11) 99887-6655,carlos.costa@email.com,2024-03-20,95.00,1
Renata Farias,(11) 98765-1122,renata@email.com,2024-06-01,380.00,4`;

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [csvText, setCsvText] = useState('');
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const parseCsvContent = (text: string) => {
    try {
      const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        setError('O CSV deve conter pelo menos uma linha de cabeçalho e uma linha de dados.');
        setPreviewRows([]);
        return;
      }

      // Detecção de delimitador (, ou ;)
      const delimiter = lines[0].includes(';') ? ';' : ',';
      const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/"/g, ''));

      // Mapeamento flexível de colunas comuns em português e inglês
      const nameIdx = headers.findIndex(h => h.includes('nome') || h.includes('name') || h.includes('cliente'));
      const phoneIdx = headers.findIndex(h => h.includes('tel') || h.includes('phone') || h.includes('whats') || h.includes('celular'));
      const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('e-mail') || h.includes('mail'));
      const dateIdx = headers.findIndex(h => h.includes('data') || h.includes('compra') || h.includes('date') || h.includes('ultima'));
      const spendIdx = headers.findIndex(h => h.includes('gasto') || h.includes('total') || h.includes('valor') || h.includes('spend'));
      const countIdx = headers.findIndex(h => h.includes('pedidos') || h.includes('compras') || h.includes('count') || h.includes('qtd'));

      if (nameIdx === -1 || phoneIdx === -1) {
        setError('Colunas obrigatórias não encontradas: certifique-se de incluir "Nome" e "Telefone".');
        setPreviewRows([]);
        return;
      }

      const rows: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(delimiter).map(p => p.trim().replace(/"/g, ''));
        if (parts.length > nameIdx && parts[nameIdx]) {
          rows.push({
            name: parts[nameIdx],
            phone: parts[phoneIdx] || '',
            email: emailIdx >= 0 ? parts[emailIdx] : '',
            lastPurchaseDate: dateIdx >= 0 && parts[dateIdx] ? parts[dateIdx] : new Date().toISOString().split('T')[0],
            totalSpend: spendIdx >= 0 && parts[spendIdx] ? parseFloat(parts[spendIdx].replace('R$', '').replace(',', '.')) || 80 : 80,
            purchaseCount: countIdx >= 0 && parts[countIdx] ? parseInt(parts[countIdx], 10) || 1 : 1
          });
        }
      }

      setError(null);
      setPreviewRows(rows);
    } catch {
      setError('Erro ao processar o formato do CSV. Verifique vírgulas ou pontuações.');
      setPreviewRows([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      parseCsvContent(content);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCsvText(text);
    if (text.trim()) {
      parseCsvContent(text);
    } else {
      setPreviewRows([]);
      setError(null);
    }
  };

  const handleApplySample = () => {
    setCsvText(SAMPLE_CSV);
    parseCsvContent(SAMPLE_CSV);
  };

  const handleConfirmImport = () => {
    if (previewRows.length === 0) return;
    const count = onImport(previewRows);
    setSuccessCount(count);
    setTimeout(() => {
      onClose();
      setSuccessCount(null);
      setCsvText('');
      setPreviewRows([]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Importar Base de Clientes (CSV)</h3>
              <p className="text-xs text-slate-500">Mapeamento automático de colunas para cálculo RFM</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {successCount !== null ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Importação Concluída com Sucesso!</h4>
              <p className="text-sm text-slate-600">
                {successCount} clientes foram incorporados ao seu tenant e categorizados pelo motor RFM.
              </p>
            </div>
          ) : (
            <>
              {/* Opções de Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20">
                  <Upload className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="font-bold text-slate-800 text-xs">Escolher arquivo .CSV</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Planilha Excel ou exportação do seu PDV</span>
                  <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
                </label>

                <div className="p-4 bg-blue-50/60 border border-blue-200/70 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-blue-900 block mb-1">Quer testar com dados de exemplo?</span>
                    <span className="text-slate-600 text-[11px] block leading-relaxed">
                      Carregue uma amostra com formato padrão de nomes, telefones e compras.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplySample}
                    className="mt-2 text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1.5 self-start"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Preencher com modelo de exemplo</span>
                  </button>
                </div>
              </div>

              {/* Textarea para colar */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ou cole os dados CSV abaixo (separados por vírgula ou ponto e vírgula):
                </label>
                <textarea
                  rows={4}
                  value={csvText}
                  onChange={handleTextChange}
                  placeholder={`Nome,Telefone,Email,UltimaCompra,TotalGasto,Compras\nLucas Silva,(11) 98765-4321,lucas@email.com,2024-05-12,120.00,2`}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-[11px] focus:bg-white focus:border-blue-600 outline-none resize-none"
                />
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Pré-visualização da Tabela */}
              {previewRows.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-xs">
                      Pré-visualização: {previewRows.length} clientes identificados
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Campos válidos ✓
                    </span>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-40">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0">
                        <tr>
                          <th className="p-2 border-b">Nome</th>
                          <th className="p-2 border-b">Telefone</th>
                          <th className="p-2 border-b">Última Compra</th>
                          <th className="p-2 border-b">Total (R$)</th>
                          <th className="p-2 border-b">Qtd</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewRows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 font-medium text-slate-900">{row.name}</td>
                            <td className="p-2 text-slate-600">{row.phone}</td>
                            <td className="p-2 text-slate-600">{row.lastPurchaseDate}</td>
                            <td className="p-2 text-emerald-700 font-semibold">R$ {row.totalSpend}</td>
                            <td className="p-2 text-slate-600">{row.purchaseCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {previewRows.length > 5 && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Mostrando os primeiros 5 de {previewRows.length} registros...
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {successCount === null && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Isolamento garantido: os dados serão associados exclusivamente à sua empresa.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={previewRows.length === 0}
                onClick={handleConfirmImport}
                className={`px-5 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-all ${
                  previewRows.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    : 'bg-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                Importar {previewRows.length > 0 ? `${previewRows.length} Clientes` : ''}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
