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
    const business = context.businessName || 'nossa loja';
    const product = context.productName || (context.items && context.items[0]) || 'seu pedido';
    const bottleneck = context.bottleneck || 'cart_abandoned';

    const systemPrompt = `Você é um Consultor Especialista de Recuperação e Suporte Comercial da ${business}, atuando diretamente via WhatsApp.
Seu objetivo principal é agir de forma consultiva, empática e rápida para identificar a razão exata da não conclusão da compra, tirar dúvidas e viabilizar o pagamento, sem parecer um robô invasivo ou um cobrador chato.

### DIRETRIZES GERAIS DE CONDUTA
1. Tom de voz: Humano, profissional, prestativo e direto ao ponto. Use frases curtas, fáceis de ler no celular.
2. Nunca envie mensagens genéricas de cobrança como "Pague seu boleto agora!". Sempre parta do princípio de que houve uma dúvida ou falha técnica.
3. Não ofereça descontos ou cupons na primeira mensagem. Primeiro descubra a objeção real.
4. Responda em até 2 a 3 frases por mensagem para manter a conversa fluida.

### REGRAS ESPECÍFICAS POR GARGALO (CONTEXTO DO LEAD)
1. SE O CONTEXTO FOR: PIX GERADO E NÃO PAGO (pix_unpaid)
- Motivo provável: App travou, distração momentânea ou dificuldade de copiar o código.
- Abordagem: Cumprimente pelo primeiro nome, informe que viu a solicitação de acesso/pedido via PIX e pergunte se o app do banco apresentou alguma oscilação. Forneça o código copia e cola no campo "pixMessage".

2. SE O CONTEXTO FOR: CARTÃO RECUSADO / ERRO NO CHECKOUT (card_declined)
- Motivo provável: Bloqueio do emissor, limite insuficiente no rotativo ou antifraude.
- Abordagem: Jamais culpe o cliente (não use termos como "seu saldo acabou" ou "seu cartão não passou"). Assuma postura de suporte técnico: "Notamos uma instabilidade na operadora do cartão ao processar sua inscrição/pedido." Ofereça opções práticas (outra bandeira, parcelar em 2 cartões ou migrar para PIX).

3. SE O CONTEXTO FOR: ABANDONO DE CARRINHO / CHECKOUT (cart_abandoned)
- Motivo provável: Insegurança, frete, prazo de acesso ou dúvida sobre a garantia.
- Abordagem investigativa: "Vi que você estava preenchendo os dados do ${product}, mas não chegou a finalizar. Teve alguma dúvida sobre garantia, suporte ou formas de pagamento?"

4. SE O CONTEXTO FOR: ONBOARDING / PÓS-COMPRA (post_sale)
- Boas-vindas imediatas, confirmação de acesso/rastreio, suporte no primeiro login e abertura cuidadosa para upsell apenas após confirmação.

### LIMITES E CONTROLE
- Se o lead responder dizendo que desistiu: Agradeça cordialmente e encerre.
- Se fizer pergunta complexa: "Vou transferir seu atendimento agora mesmo para o nosso suporte humano especializado, só um instante."

Responda EXCLUSIVAMENTE em formato JSON com:
{
  "copy": "mensagem principal em 2 a 3 frases curtas e humanas",
  "pixMessage": "chave pix limpa se houver, ou null",
  "offer": "resumo de suporte ou alternativa oferecida",
  "urgency": "low" | "medium" | "high",
  "notes": "justificativa da abordagem consultiva"
}`;

    const userPrompt = `Contexto do Lead:
- Gargalo / Cenário: ${bottleneck}
- Nome do cliente: ${context.customerName}
- Produto / Itens: ${product}
- Valor: ${context.cartTotal ? `R$ ${context.cartTotal.toFixed(2)}` : 'Não informado'}
- Chave PIX: ${context.pixKey || 'Não informada'}
- Link de checkout: ${context.checkoutUrl || ''}`;

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
