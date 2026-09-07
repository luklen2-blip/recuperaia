import { NextResponse } from 'next/server';
import { getAuthFromHeader } from '@/lib/auth';
import { resilientStore } from '@/lib/store';

export async function GET(req: Request) {
  const auth = getAuthFromHeader(req.headers.get('Authorization'));
  const tenantId = auth?.tenantId || 'demo-bella-massa';

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;

  const orders = await resilientStore.listOrders(tenantId, status);
  return NextResponse.json({ orders });
}
