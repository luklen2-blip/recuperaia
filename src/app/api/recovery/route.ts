import { NextResponse } from 'next/server';
import { getAuthFromHeader } from '@/lib/auth';
import { resilientStore } from '@/lib/store';
import { createAiProvider } from '@/lib/integrations/openai';
import { createWhatsAppProvider } from '@/lib/integrations/whatsapp';

export async function POST(req: Request) {
  const auth = getAuthFromHeader(req.headers.get('Authorization'));
  const tenantId = auth?.tenantId || 'demo-bella-massa';

  try {
    const body = await req.json();
    const {
      customerId,
      customerName,
      customerPhone,
      cartTotal,
      items,
      daysInactive,
      discountOffered,
      checkoutUrl,
      bottleneck,
      productName,
      pixKey,
      forceLiveMode = false,
    } = body;

    if (!customerPhone) {
      return NextResponse.json({ error: 'Telefone do cliente é obrigatório para disparo.' }, { status: 400 });
    }

    const tenant = await resilientStore.findTenantById(tenantId);
    const businessName = tenant?.name || 'RecuperaIA Partner';
    const businessSegment = tenant?.segment || 'Comércio Geral';

    // 1. Geração de Cópia Persuasiva com IA (OpenAI ou Fallback Consultivo)
    const aiProvider = createAiProvider(process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL);
    const aiResult = await aiProvider.generateRecoveryMessage({
      customerName: customerName || 'Cliente',
      cartTotal: Number(cartTotal || 0),
      items: items || [],
      daysInactive: Number(daysInactive || 1),
      businessName,
      businessSegment,
      discountOffered,
      checkoutUrl,
      bottleneck,
      productName,
      pixKey,
    });

    const messageText = aiResult.suggestedCopy;

    // 2. Disparo via WhatsApp (Meta Cloud API Oficial ou Sandbox Simulator)
    const whatsappCreds = {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
      wabaId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
      businessName,
    };

    const whatsappProvider = createWhatsAppProvider(whatsappCreds, forceLiveMode);
    const sendResult = await whatsappProvider.sendTextMessage({
      toPhone: customerPhone,
      text: messageText,
    });

    // Se houver chave PIX separada, envia em mensagem limpa e isolada para facilitar o Copia e Cola
    if (aiResult.pixMessage) {
      await whatsappProvider.sendTextMessage({
        toPhone: customerPhone,
        text: aiResult.pixMessage,
      });
    }

    // 3. Registro no Histórico de Mensagens
    const recordedMessage = await resilientStore.recordMessage({
      tenantId,
      customerId: customerId || 'unknown',
      content: messageText,
      channel: 'WHATSAPP',
      isAiGenerated: aiResult.mode === 'LIVE_PRODUCTION',
      isSandbox: sendResult.mode === 'SANDBOX_SIMULATION',
      status: sendResult.status,
    });

    return NextResponse.json({
      success: true,
      recovery: {
        ai: {
          mode: aiResult.mode,
          modelUsed: aiResult.modelUsed,
          copy: messageText,
          offer: aiResult.offerSuggestion,
          urgency: aiResult.urgencyLevel,
        },
        whatsapp: {
          mode: sendResult.mode,
          status: sendResult.status,
          messageId: sendResult.messageId,
          raw: sendResult.rawResponse,
        },
        recordedMessage,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao processar recuperação';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
