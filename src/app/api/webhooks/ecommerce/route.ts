import { NextResponse } from 'next/server';
import { resilientStore } from '@/lib/store';

/**
 * Endpoint Universal de Ingestão de Carrinhos Abandonados e Pedidos Pendentes
 * Suporta webhooks de Shopify, WooCommerce, Nuvemshop, Hotmart e Kiwify.
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tenantId = 'demo-bella-massa',
      source = 'WEBHOOK',
      customerName,
      customerPhone,
      customerEmail,
      cartTotal,
      items,
      checkoutUrl,
      externalId,
    } = body;

    if (!customerPhone) {
      return NextResponse.json({ error: 'Telefone do cliente é obrigatório.' }, { status: 400 });
    }

    // Registra cliente se novo
    const customer = await resilientStore.createCustomer({
      tenantId,
      name: customerName || 'Cliente E-commerce',
      phone: customerPhone,
      email: customerEmail,
      segment: 'at_risk',
      totalSpend: Number(cartTotal || 0),
      notes: `Origem: ${source} - Pedido ${externalId || 'Avulso'}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Carrinho ingerido com sucesso para a esteira de recuperação da IA',
      cart: {
        customerId: customer.id,
        tenantId,
        source,
        cartTotal,
        items,
        checkoutUrl,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro na ingestão do carrinho';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
