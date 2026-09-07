/**
 * Motor de Recuperação Baseado em Regras (Fallback sem IA)
 * Explicitamente demarcado como Mecanismo Estático / Fallback.
 * Utilizado quando a OPENAI_API_KEY não foi configurada ou em ambiente de homologação local.
 */

import {
  AiProvider,
  AiRecoveryContext,
  AiRecoveryResult,
  ProviderMode,
} from '../types';

export class RuleBasedRecoveryProvider implements AiProvider {
  public readonly mode: ProviderMode = 'SANDBOX_SIMULATION';

  async generateRecoveryMessage(context: AiRecoveryContext): Promise<AiRecoveryResult> {
    const firstName = context.customerName.split(' ')[0] || 'cliente';
    const totalText = context.cartTotal ? ` no valor de R$ ${context.cartTotal.toFixed(2)}` : '';
    const discount = context.discountOffered || '5% de desconto para pagamento no PIX';

    let copy = '';
    let urgency: 'low' | 'medium' | 'high' = 'medium';

    if (context.daysInactive && context.daysInactive > 7) {
      urgency = 'high';
      copy = `Oi ${firstName}! Sentimos sua falta aqui na ${context.businessName}! 😊 Separamos uma condição especial exclusiva para você voltar hoje: ${discount}. Posso te enviar o link para aproveitar?`;
    } else {
      urgency = 'medium';
      copy = `Olá ${firstName}! Tudo bem? Notamos que você deixou alguns itens selecionados${totalText} na ${context.businessName}. Seus produtos ainda estão reservados! Conseguimos liberar ${discount} caso queira concluir agora. Link: ${context.checkoutUrl || 'Acesse nosso catálogo'}`;
    }

    return {
      success: true,
      mode: this.mode,
      suggestedCopy: copy,
      offerSuggestion: discount,
      urgencyLevel: urgency,
      modelUsed: 'Motor de Regras Estático (Fallback Local sem IA)',
      reasoningNotes: 'Regra determinística disparada com base em tempo de inatividade e valor de carrinho.',
    };
  }

  async handleCustomerObjection(customerMessage: string, context: AiRecoveryContext): Promise<AiRecoveryResult> {
    const firstName = context.customerName.split(' ')[0] || 'cliente';
    const lower = customerMessage.toLowerCase();

    let reply = `Olá ${firstName}! Como posso te auxiliar com as dúvidas sobre seu pedido na ${context.businessName}? Estamos à total disposição!`;

    if (lower.includes('frete') || lower.includes('envio')) {
      reply = `Oi ${firstName}! Em relação à entrega, temos opções expressas e conseguimos verificar uma condição especial no frete para você concluir seu pedido na ${context.businessName}. Qual é o seu CEP?`;
    } else if (lower.includes('caro') || lower.includes('desconto') || lower.includes('preco') || lower.includes('preço')) {
      reply = `Oi ${firstName}! Entendemos perfeitamente. Conseguimos liberar uma condição facilitada no PIX com confirmação imediata. Quer que eu gere a chave com o desconto aplicado?`;
    } else if (lower.includes('prazo') || lower.includes('demora')) {
      reply = `Oi ${firstName}! Assim que o pagamento for confirmado, seu pedido já entra imediatamente na esteira de expedição da ${context.businessName}.`;
    }

    return {
      success: true,
      mode: this.mode,
      suggestedCopy: reply,
      offerSuggestion: 'Ajuste de condição comercial',
      urgencyLevel: 'medium',
      modelUsed: 'Motor de Regras Estático (Fallback Local sem IA)',
      reasoningNotes: 'Detecção de palavras-chave de objeção (frete, preço, prazo).',
    };
  }
}
