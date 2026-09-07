import { NextResponse } from 'next/server';
import { getAuthFromHeader } from '@/lib/auth';
import { resilientStore } from '@/lib/store';

export async function GET(req: Request) {
  const auth = getAuthFromHeader(req.headers.get('Authorization'));
  if (!auth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const user = await resilientStore.findUserByEmail(auth.email);
  const tenant = await resilientStore.findTenantById(auth.tenantId);

  return NextResponse.json({
    user: user || { id: auth.userId, email: auth.email, role: auth.role },
    tenant,
  });
}
