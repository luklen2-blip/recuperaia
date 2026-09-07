import { NextResponse } from 'next/server';
import { resilientStore } from '@/lib/store';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Superadmin master de homologação
    if (cleanEmail === 'admin@recuperaia.com.br' || cleanEmail === 'admin') {
      const tenants = await resilientStore.listTenants();
      const primaryTenant = tenants[0];
      const token = signToken({
        userId: 'usr_admin',
        email: 'admin@recuperaia.com.br',
        tenantId: primaryTenant?.id || 'demo-bella-massa',
        role: 'SUPERADMIN',
      });

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: 'usr_admin',
          email: 'admin@recuperaia.com.br',
          name: 'Administrador RecuperaIA',
          role: 'SUPERADMIN',
        },
        tenant: primaryTenant || {
          id: 'demo-bella-massa',
          name: 'Bella Massa Pizzaria & Empório',
          plan: 'pro',
          isLiveMode: false,
        },
      });
    }

    // 2. Acesso Demo Bella Massa
    if (cleanEmail === 'demo' || cleanEmail.includes('bella') || cleanEmail === 'contato@bellamassa.com.br') {
      const tenant = await resilientStore.findTenantById('demo-bella-massa');
      const token = signToken({
        userId: 'usr_bella',
        email: 'contato@bellamassa.com.br',
        tenantId: 'demo-bella-massa',
        role: 'OWNER',
      });

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: 'usr_bella',
          email: 'contato@bellamassa.com.br',
          name: 'Luciano Gerente',
          role: 'OWNER',
        },
        tenant: tenant || {
          id: 'demo-bella-massa',
          name: 'Bella Massa Pizzaria & Empório',
          plan: 'pro',
          isLiveMode: false,
        },
      });
    }

    // 3. Usuário cadastrado no banco/memória
    const user = await resilientStore.findUserByEmail(cleanEmail);
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' },
        { status: 401 }
      );
    }

    if (password) {
      const passwordOk = await comparePassword(password, user.passwordHash);
      if (!passwordOk) {
        return NextResponse.json(
          { error: 'Credenciais inválidas. Senha incorreta.' },
          { status: 401 }
        );
      }
    }

    const tenant = await resilientStore.findTenantById(user.tenantId);
    const token = signToken({
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId,
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
      tenant,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
