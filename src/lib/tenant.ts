/**
 * Módulo de Isolamento Multi-Tenant do RecuperaIA
 * Garante que todas as operações em banco de dados e APIs sejam estritamente isoladas por tenantId.
 */

import { prisma } from './prisma';

export interface TenantContext {
  tenantId: string;
  userId: string;
  role: string;
}

export async function validateTenantAccess(userId: string, tenantId: string): Promise<boolean> {
  try {
    const member = await prisma.tenantMember.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });

    if (member) return true;

    // Verifica se é SUPERADMIN
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user?.role === 'SUPERADMIN';
  } catch {
    return false;
  }
}

export function scopeWhere<T extends object>(tenantId: string, additionalWhere?: T): T & { tenantId: string } {
  return {
    ...additionalWhere,
    tenantId,
  } as T & { tenantId: string };
}
