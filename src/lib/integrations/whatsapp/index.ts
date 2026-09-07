import { WhatsAppProvider, WhatsAppCredentials } from '../types';
import { MetaWhatsAppCloudProvider } from './metaCloud';
import { WhatsAppSandboxProvider } from './sandbox';

export function createWhatsAppProvider(
  credentials?: Partial<WhatsAppCredentials>,
  forceLiveMode = false
): WhatsAppProvider {
  const hasValidCreds = Boolean(
    credentials?.phoneNumberId &&
    credentials?.accessToken &&
    credentials.phoneNumberId.length > 5 &&
    credentials.accessToken.length > 10
  );

  if (forceLiveMode && hasValidCreds) {
    return new MetaWhatsAppCloudProvider({
      phoneNumberId: credentials!.phoneNumberId!,
      accessToken: credentials!.accessToken!,
      wabaId: credentials?.wabaId,
      businessName: credentials?.businessName,
    });
  }

  // Retorna o Sandbox explicitamente configurado
  return new WhatsAppSandboxProvider();
}
