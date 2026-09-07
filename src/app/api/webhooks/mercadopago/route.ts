import { NextResponse } from 'next/server';

/**
 * Webhook Oficial do Mercado Pago para Notificações de Pagamentos e PIX
 */

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic') || searchParams.get('type');
    const paymentId = searchParams.get('data.id') || searchParams.get('id');

    const body = await req.json().catch(() => ({}));

    console.log(`[Mercado Pago Webhook] Notificação recebida. Tópico: ${topic}, ID: ${paymentId}`);

    // Se o pagamento foi aprovado, atualiza o status de recuperação ou assinatura
    if (topic === 'payment' || body?.type === 'payment') {
      const id = paymentId || body?.data?.id;
      return NextResponse.json({ status: 'OK', processedId: id }, { status: 200 });
    }

    return NextResponse.json({ status: 'PROCESSED' }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro no processamento do webhook';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
