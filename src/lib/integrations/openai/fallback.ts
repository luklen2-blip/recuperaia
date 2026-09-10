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
    const firstName = context.customerName.split(' ')[0] || 'Cliente';
    const business = context.businessName || 'nossa loja';
    const product = context.productName || (context.items && context.items[0]) || 'seu pedido';
    const bottleneck = context.bottleneck || 'cart_abandoned';

    let copy = '';
    let pixMessage: string | undefined = undefined;
    let urgency: 'low' | 'medium' | 'high' = 'medium';
    let notes = '';

    switch (bottleneck) {
      case 'pix_unpaid':
        urgency = 'high';
        copy = `Olá, ${firstName}! Tudo bem? Vi que você solicitou seu pedido do ${product} via PIX agora há pouco. O aplicativo do seu banco apresentou alguma oscilação ao tentar concluir?`;
        if (context.pixKey) {
          pixMessage = context.pixKey;
        }
        notes = 'Abordagem consultiva assumindo instabilidade técnica no app do banco, sem cobrança agressiva.';
        break;

      case 'card_declined':
        urgency = 'high';
        copy = `Olá, ${firstName}! Aqui é do suporte técnico da ${business}. Notamos uma instabilidade na operadora do cartão ao processar sua solicitação do ${product}. Podemos tentar com outra bandeira, parcelar em 2 cartões ou gerar via PIX. Como prefere?`;
        notes = 'Postura de suporte técnico preservando a dignidade do cliente sem atribuir culpa de saldo.';
        break;

      case 'post_sale':
        urgency = 'low';
        copy = `Olá, ${firstName}! Seja muito bem-vindo(a) à ${business}! Passando para confirmar se você já recebeu os dados de acesso/rastreio do ${product}. Conseguiu acessar tudo certinho ou precisa de alguma ajuda?`;
        notes = 'Onboarding acolhedor nos primeiros 7 dias, validando experiência antes de qualquer oferta.';
        break;

      case 'cart_abandoned':
      default:
        urgency = 'medium';
        copy = `Olá, ${firstName}! Vi que você estava preenchendo os dados do ${product} na ${business}, mas não chegou a finalizar. Teve alguma dúvida sobre garantia, suporte ou formas de pagamento?`;
        notes = 'Abordagem investigativa de 2 a 3 frases curtas sem concessão precipitada de desconto.';
        break;
    }

    return {
      success: true,
      mode: this.mode,
      suggestedCopy: copy,
      pixMessage,
      offerSuggestion: context.discountOffered || 'Suporte consultivo humanizado',
      urgencyLevel: urgency,
      modelUsed: 'Motor de Regras Estático (Consultoria Comercial Consultiva)',
      reasoningNotes: notes,
    };
  }

  async handleCustomerObjection(customerMessage: string, context: AiRecoveryContext): Promise<AiRecoveryResult> {
    const firstName = context.customerName.split(' ')[0] || 'cliente';
    const lower = customerMessage.toLowerCase();

    let reply = `Olá ${firstName}! Como posso te auxiliar com as dúvidas sobre seu pedido na ${context.businessName}? Estamos à total disposição!`;

    if (lower.includes('desist') || lower.includes('não quero') || lower.includes('cancela') || lower.includes('sem interesse') || lower.includes('não tenho interesse')) {
      reply = `Entendido perfeitamente, ${firstName}! Agradeço muito por sua atenção e cordialidade. Se precisar de algo no futuro, estaremos sempre por aqui. Tenha um ótimo dia!`;
    } else if (lower.includes('humano') || lower.includes('atendente') || lower.includes('falar com alguém') || lower.includes('suporte técnico avançado')) {
      reply = `Vou transferir seu atendimento agora mesmo para o nosso suporte humano especializado, só um instante.`;
    } else if (lower.includes('frete') || lower.includes('envio')) {
      reply = `Oi, ${firstName}! Em relação à entrega, temos envio expresso com código de rastreamento no WhatsApp. Qual seria seu CEP para eu checar as opções?`;
    } else if (lower.includes('garantia') || lower.includes('seguro') || lower.includes('confiável')) {
      reply = `Oi, ${firstName}! Você conta com nossa garantia incondicional de 7 dias e suporte direto. Se não ficar 100% satisfeito, devolvemos seu valor integralmente.`;
    } else if (lower.includes('caro') || lower.includes('desconto') || lower.includes('preco') || lower.includes('preço')) {
      reply = `Entendo perfeitamente, ${firstName}! Antes de falarmos sobre valores, o que você mais precisa resolver com o produto hoje?`;
    } else if (lower.includes('prazo') || lower.includes('demora')) {
      reply = `Oi, ${firstName}! A liberação é imediata assim que o sistema confirma o pagamento, com envio direto no seu e-mail e WhatsApp.`;
    }

    return {
      success: true,
      mode: this.mode,
      suggestedCopy: reply,
      offerSuggestion: 'Atendimento consultivo e quebra de objeção',
      urgencyLevel: 'medium',
      modelUsed: 'Motor de Regras Estático (Consultor Comercial Humano)',
      reasoningNotes: 'Aplicação das diretrizes de objeção, respeito a desistências e transbordo humano.',
    };
  }
}
