/**
 * Provedor Oficial de Pagamento: Mercado Pago API v1
 * Processamento de pagamentos PIX com Copia e Cola, QR Code e Webhooks
 */

import {
  PaymentProvider,
  MercadoPagoCredentials,
  CreatePixPaymentOptions,
  PaymentResult,
  ProviderMode,
} from '../types';

export class MercadoPagoProvider implements PaymentProvider {
  public readonly mode: ProviderMode = 'LIVE_PRODUCTION';
  private credentials: MercadoPagoCredentials;

  constructor(credentials: MercadoPagoCredentials) {
    if (!credentials.accessToken || credentials.accessToken.trim().length === 0) {
      throw new Error('MercadoPagoProvider requer accessToken válido.');
    }
    this.credentials = credentials;
  }

  async createPixPayment(options: CreatePixPaymentOptions): Promise<PaymentResult> {
    const url = 'https://api.mercadopago.com/v1/payments';

    const payload = {
      transaction_amount: Number(options.amount.toFixed(2)),
      description: options.description,
      payment_method_id: 'pix',
      payer: {
        email: options.payerEmail,
        first_name: options.payerName || 'Cliente',
        identification: options.payerCpf
          ? { type: 'CPF', number: options.payerCpf.replace(/\D/g, '') }
          : undefined,
      },
      external_reference: options.externalReference,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/mercadopago`,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `pix_${options.externalReference}_${Date.now()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          mode: this.mode,
          paymentId: '',
          status: 'rejected',
          pixCopiaECola: '',
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          error: data?.message || `Erro HTTP ${response.status} na API do Mercado Pago`,
        };
      }

      const pointOfInteraction = data?.point_of_interaction?.transaction_data;
      const pixCopiaECola = pointOfInteraction?.qr_code || '';
      const pixQrCodeBase64 = pointOfInteraction?.qr_code_base64 || '';
      const paymentId = String(data?.id || '');

      return {
        success: true,
        mode: this.mode,
        paymentId,
        status: 'pending',
        pixCopiaECola,
        pixQrCodeBase64,
        expiresAt: data?.date_of_expiration || new Date(Date.now() + 3600000).toISOString(),
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        mode: this.mode,
        paymentId: '',
        status: 'rejected',
        pixCopiaECola: '',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        error: `Falha de conexão com Mercado Pago: ${errorMsg}`,
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<{ status: string; paid: boolean }> {
    const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.credentials.accessToken}`,
        },
      });

      if (!response.ok) {
        return { status: 'unknown', paid: false };
      }

      const data = await response.json();
      const status = data?.status || 'pending';
      return { status, paid: status === 'approved' };
    } catch {
      return { status: 'error', paid: false };
    }
  }
}
