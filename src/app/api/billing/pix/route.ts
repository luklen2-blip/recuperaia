import { NextResponse } from 'next/server';
import { getAuthFromHeader } from '@/lib/auth';
import { generatePixPayload } from '@/lib/pix';
import QRCode from 'qrcode';

export async function POST(req: Request) {
  const auth = getAuthFromHeader(req.headers.get('Authorization'));
  const tenantId = auth?.tenantId || 'demo-bella-massa';

  try {
    const body = await req.json();
    const { plan = 'pro', customAmount } = body;

    const planPrices: Record<string, number> = {
      start: 97.0,
      pro: 197.0,
      business: 397.0,
    };

    const amount = customAmount || planPrices[plan] || 197.0;
    const pixKey = process.env.PIX_KEY || 'financeiro@recuperaia.com.br';
    const beneficiaryName = process.env.PIX_BENEFICIARY_NAME || 'RecuperaIA Tecnologia Ltda';
    const city = process.env.PIX_CITY || 'SAO PAULO';
    const txId = `REC${Date.now().toString().substring(6)}`;

    // Gera payload oficial BACEN EMV Copia-e-Cola
    const pixCopiaECola = generatePixPayload({
      pixKey,
      beneficiaryName,
      city,
      amount,
      txId,
      description: `Assinatura Plano ${plan.toUpperCase()} RecuperaIA`,
    });

    // Gera imagem QR Code em Data URL Base64
    const qrCodeDataUrl = await QRCode.toDataURL(pixCopiaECola, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    return NextResponse.json({
      success: true,
      billing: {
        plan,
        amount,
        txId,
        pixKey,
        beneficiaryName,
        city,
        pixCopiaECola,
        qrCodeDataUrl,
        expiresInSeconds: 3600,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao gerar PIX';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
