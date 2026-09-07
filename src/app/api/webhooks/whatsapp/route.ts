import { NextResponse } from 'next/server';

/**
 * Webhook Oficial do WhatsApp Business Platform (Meta Cloud API)
 * Suporta o protocolo oficial de verificação de desafio (hub.challenge) e ingestão de mensagens.
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'recuperaia_meta_verify_token_2026';

  if (mode === 'subscribe' && token === expectedToken) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Token de verificação inválido' }, { status: 403 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verificação de integridade do payload da Meta
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      // Mensagens recebidas do cliente
      if (value?.messages) {
        const message = value.messages[0];
        const fromPhone = message.from;
        const textBody = message.text?.body;
        console.log(`[WhatsApp Webhook] Mensagem recebida de ${fromPhone}: ${textBody}`);
      }

      // Atualizações de status (sent, delivered, read)
      if (value?.statuses) {
        const statusUpdate = value.statuses[0];
        console.log(`[WhatsApp Webhook] Status atualizado: ${statusUpdate.id} -> ${statusUpdate.status}`);
      }

      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    return NextResponse.json({ status: 'IGNORED' }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao processar webhook';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
