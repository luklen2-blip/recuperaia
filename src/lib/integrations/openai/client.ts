/**
 * Provedor Oficial de IA: OpenAI (GPT-4o / GPT-4o-mini)
 * Gera mensagens inteligentes e personalizadas de recuperação de vendas e carrinhos abandonados
 */

import {
  AiProvider,
  AiRecoveryContext,
  AiRecoveryResult,
  ProviderMode,
} from '../types';

export class OpenAiProvider implements AiProvider {
  public readonly mode: ProviderMode = 'LIVE_PRODUCTION';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gpt-4o-mini') {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('OpenAiProvider requer uma OPENAI_API_KEY válida.');
    }
    this.apiKey = apiKey.trim();
    this.model = model;
  }

  async generateRecoveryMessage(context: AiRecoveryContext): Promise<AiRecoveryResult> {
    const systemPrompt = `Você é o assistente inteligente de vendas e recuperação de clientes do ${context.businessName}, uma empresa do segmento de ${context.businessSegment}.
Sua missão é recuperar um cliente ou carrinho abandonado via WhatsApp com uma abordagem cordial, empática, persuasiva e humanizada.
Regras obrigatórias:
1. Escreva em português do Brasil (pt-BR).
2. Não soe robótico ou invasivo. Use tom ${context.tone || 'amigável e prestativo'}.
3. Se houver cupom/oferta (${context.discountOffered || 'nenhum'}), mencione de forma natural.
4. Finalize com uma chamada clara e simples para ação.
5. Devolva a resposta EXCLUSIVAMENTE em formato JSON com a estrutura:
{
  "copy": "texto da mensagem para whatsapp",
  "offer": "resumo da condição ou oferta destacada",
  "urgency": "low" | "medium" | "high",
  "notes": "curta justificativa da abordagem"
}`;

    const userPrompt = `Dados da Recuperação:
- Nome do cliente: ${context.customerName}
- Valor do carrinho/pedido: ${context.cartTotal ? `R$ ${context.cartTotal.toFixed(2)}` : 'Não informado'}
- Itens de interesse: ${context.items ? context.items.join(', ') : 'Não informado'}
- Dias de inatividade/abandono: ${context.daysInactive || 1}
- Segmento do cliente: ${context.segment || 'Geral'}
- Link de checkout: ${context.checkoutUrl || ''}
${context.discountOffered ? `- Condição especial autorizada: ${context.discountOffered}` : ''}`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          mode: this.mode,
          suggestedCopy: '',
          offerSuggestion: '',
          urgencyLevel: 'medium',
          modelUsed: this.model,
          error: data?.error?.message || `Erro HTTP ${response.status} da API da OpenAI`,
        };
      }

      const content = data?.choices?.[0]?.message?.content;
      const parsed = JSON.parse(content || '{}');

      return {
        success: true,
        mode: this.mode,
        suggestedCopy: parsed.copy || 'Olá! Vimos que seu pedido ainda está reservado.',
        offerSuggestion: parsed.offer || context.discountOffered || 'Condição especial garantida',
        urgencyLevel: parsed.urgency || 'medium',
        modelUsed: this.model,
        reasoningNotes: parsed.notes,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        mode: this.mode,
        suggestedCopy: '',
        offerSuggestion: '',
        urgencyLevel: 'medium',
        modelUsed: this.model,
        error: `Falha na requisição à OpenAI: ${errorMsg}`,
      };
    }
  }

  async handleCustomerObjection(customerMessage: string, context: AiRecoveryContext): Promise<AiRecoveryResult> {
    const systemPrompt = `Você é o atendente de pós-venda da empresa ${context.businessName}.
O cliente enviou a seguinte mensagem no WhatsApp expressando uma dúvida ou objeção: "${customerMessage}".
Responda de forma empática, resolutiva e encorajadora para fechar o pedido.
Devolva em formato JSON:
{
  "copy": "resposta sugerida para o whatsapp",
  "offer": "oferta sugerida se aplicável",
  "urgency": "medium",
  "notes": "orientação técnica"
}`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'system', content: systemPrompt }],
          temperature: 0.6,
          response_format: { type: 'json_object' },
        }),
      });

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      const parsed = JSON.parse(content || '{}');

      return {
        success: true,
        mode: this.mode,
        suggestedCopy: parsed.copy || 'Entendo perfeitamente sua dúvida! Como posso te ajudar a concluir?',
        offerSuggestion: parsed.offer || '',
        urgencyLevel: parsed.urgency || 'medium',
        modelUsed: this.model,
        reasoningNotes: parsed.notes,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        mode: this.mode,
        suggestedCopy: '',
        offerSuggestion: '',
        urgencyLevel: 'medium',
        modelUsed: this.model,
        error: `Falha ao processar objeção na OpenAI: ${errorMsg}`,
      };
    }
  }
}
