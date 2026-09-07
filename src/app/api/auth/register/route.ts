import { NextResponse } from 'next/server';
import { resilientStore } from '@/lib/store';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, managerName, email, phone, segment, companySize, password } = body;

    if (!companyName || !email || !password) {
      return NextResponse.json(
        { error: 'Nome da empresa, e-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await resilientStore.findUserByEmail(cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este e-mail já está cadastrado. Realize login para acessar.' },
        { status: 409 }
      );
    }

    // Cria Tenant e Usuário Proprietário (Owner)
    const tenant = await resilientStore.createTenant({
      name: companyName,
      email: cleanEmail,
      phone,
      segment: segment || 'retail',
      companySize: companySize || 'small',
    });

    const passwordHash = await hashPassword(password);
    const user = await resilientStore.createUser({
      email: cleanEmail,
      name: managerName || companyName,
      passwordHash,
      role: 'OWNER',
      tenantId: tenant.id,
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      tenantId: tenant.id,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
        isLiveMode: tenant.isLiveMode,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
