import { NextResponse } from 'next/server';
import { getAuthFromHeader } from '@/lib/auth';
import { resilientStore } from '@/lib/store';

export async function GET(req: Request) {
  const auth = getAuthFromHeader(req.headers.get('Authorization'));
  const tenantId = auth?.tenantId || 'demo-bella-massa';

  const { searchParams } = new URL(req.url);
  const segment = searchParams.get('segment') || undefined;

  const customers = await resilientStore.listCustomers(tenantId, segment);
  return NextResponse.json({ customers });
}

export async function POST(req: Request) {
  const auth = getAuthFromHeader(req.headers.get('Authorization'));
  const tenantId = auth?.tenantId || 'demo-bella-massa';

  try {
    const body = await req.json();
    const { name, phone, email, segment, notes, totalSpend } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefone do cliente são obrigatórios.' },
        { status: 400 }
      );
    }

    const customer = await resilientStore.createCustomer({
      tenantId,
      name,
      phone,
      email,
      segment,
      notes,
      totalSpend: Number(totalSpend || 0),
    });

    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao cadastrar cliente';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
