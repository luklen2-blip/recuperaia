import { PaymentProvider, MercadoPagoCredentials } from '../types';
import { MercadoPagoProvider } from './client';
import { MercadoPagoSandboxProvider } from './sandbox';

export function createPaymentProvider(
  credentials?: Partial<MercadoPagoCredentials>,
  forceLiveMode = false
): PaymentProvider {
  const hasValidCreds = Boolean(
    credentials?.accessToken && credentials.accessToken.trim().length > 15
  );

  if (forceLiveMode && hasValidCreds) {
    return new MercadoPagoProvider({
      accessToken: credentials!.accessToken!,
      publicKey: credentials?.publicKey,
      webhookSecret: credentials?.webhookSecret,
    });
  }

  // Fallback seguro para simulação de teste com PIX EMV BACEN
  return new MercadoPagoSandboxProvider();
}
