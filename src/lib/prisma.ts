/**
 * Cliente Prisma Singleton Resiliente com suporte a concorrência e ambiente Next.js
 * Permite inicialização segura com fallback automático caso o Prisma Client
 * ainda esteja sendo gerado no ambiente local de desenvolvimento.
 */

let prismaInstance: any = null;

try {
  // Tentativa de carregar o cliente gerado do Prisma
  const prismaModule = await import('@prisma/client');
  if (prismaModule && prismaModule.PrismaClient) {
    const globalForPrisma = globalThis as unknown as {
      prisma: any;
    };
    prismaInstance =
      globalForPrisma.prisma ??
      new prismaModule.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
  }
} catch {
  // Em caso de falha de carregamento do binário local, instancia proxy seguro
}

if (!prismaInstance) {
  prismaInstance = new Proxy(
    {},
    {
      get: (_target, modelName) => {
        return new Proxy(
          {},
          {
            get: (_subTarget, methodName) => {
              return async () => {
                throw new Error(
                  `Prisma não conectado para [${String(modelName)}.${String(methodName)}]. Utilizando persistência resiliente.`
                );
              };
            },
          }
        );
      },
    }
  );
}

export const prisma = prismaInstance;
export default prisma;
