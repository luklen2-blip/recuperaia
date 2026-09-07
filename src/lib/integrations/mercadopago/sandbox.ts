/**
 * Provedor Sandbox de Pagamentos PIX: Mercado Pago
 * Utiliza o gerador oficial EMV BACEN em ambiente local de simulação
 * Não efetua cobranças em cartões reais e é demarcado como modo de teste.
 */

import {
  PaymentProvider,
  CreatePixPaymentOptions,
  PaymentResult,
  ProviderMode,
} from '../types';
import { generatePixPayload } from '../../pix';

export class MercadoPagoSandboxProvider implements PaymentProvider {
  public readonly mode: ProviderMode = 'SANDBOX_SIMULATION';

  async createPixPayment(options: CreatePixPaymentOptions): Promise<PaymentResult> {
    const paymentId = `sbx_pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const pixKey = process.env.PIX_KEY || 'financeiro@recuperaia.com.br';
    const beneficiary = process.env.PIX_BENEFICIARY_NAME || 'RecuperaIA Teste';
    const city = process.env.PIX_CITY || 'SAO PAULO';

    // Gera payload oficial EMV para testes reais de QR code no app do banco
    const pixCopiaECola = generatePixPayload({
      pixKey,
      beneficiaryName: beneficiary,
      city,
      amount: options.amount,
      txId: options.externalReference.substring(0, 25),
      description: options.description,
    });

    return {
      success: true,
      mode: this.mode,
      paymentId,
      status: 'pending',
      pixCopiaECola,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };
  }

  async getPaymentStatus(paymentId: string): Promise<{ status: string; paid: boolean }> {
    return {
      status: 'pending',
      paid: false,
    };
  }
}
