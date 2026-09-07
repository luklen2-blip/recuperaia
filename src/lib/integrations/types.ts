/**
 * Tipagens e Contratos para Provedores de Integração
 * Separação estrita entre Provedores Reais (Produção) e Sandbox/Simuladores (Testes)
 */

export type ProviderMode = 'LIVE_PRODUCTION' | 'SANDBOX_SIMULATION';

// ==========================================
// WHATSAPP BUSINESS PLATFORM (Cloud API)
// ==========================================
export interface WhatsAppCredentials {
  phoneNumberId: string;
  wabaId?: string;
  accessToken: string;
  businessName?: string;
}

export interface SendWhatsAppTextOptions {
  toPhone: string;
  text: string;
  previewUrl?: boolean;
}

export interface SendWhatsAppTemplateOptions {
  toPhone: string;
  templateName: string;
  languageCode: string;
  parameters: Array<{
    type: 'text' | 'currency' | 'date_time';
    text?: string;
  }>;
}

export interface WhatsAppSendResult {
  success: boolean;
  messageId: string;
  mode: ProviderMode;
  status: 'sent' | 'delivered' | 'failed';
  rawResponse?: unknown;
  error?: string;
}

export interface WhatsAppProvider {
  readonly mode: ProviderMode;
  sendTextMessage(options: SendWhatsAppTextOptions): Promise<WhatsAppSendResult>;
  sendTemplateMessage(options: SendWhatsAppTemplateOptions): Promise<WhatsAppSendResult>;
  verifyWebhook(hubMode: string, hubToken: string, expectedToken: string, challenge: string): string | null;
}

// ==========================================
// OPENAI / RECUPERAÇÃO INTELIGENTE
// ==========================================
export interface AiRecoveryContext {
  customerName: string;
  cartTotal?: number;
  items?: string[];
  daysInactive?: number;
  segment?: string;
  businessName: string;
  businessSegment: string;
  discountOffered?: string;
  checkoutUrl?: string;
  tone?: 'friendly' | 'urgent' | 'consultative' | 'direct';
}

export interface AiRecoveryResult {
  success: boolean;
  mode: ProviderMode;
  suggestedCopy: string;
  offerSuggestion: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  modelUsed: string;
  reasoningNotes?: string;
  error?: string;
}

export interface AiProvider {
  readonly mode: ProviderMode;
  generateRecoveryMessage(context: AiRecoveryContext): Promise<AiRecoveryResult>;
  handleCustomerObjection(customerMessage: string, context: AiRecoveryContext): Promise<AiRecoveryResult>;
}

// ==========================================
// MERCADO PAGO & PAGAMENTOS PIX
// ==========================================
export interface MercadoPagoCredentials {
  accessToken: string;
  publicKey?: string;
  webhookSecret?: string;
}

export interface CreatePixPaymentOptions {
  amount: number;
  description: string;
  payerEmail: string;
  payerName?: string;
  payerCpf?: string;
  externalReference: string;
}

export interface PaymentResult {
  success: boolean;
  mode: ProviderMode;
  paymentId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  pixCopiaECola: string;
  pixQrCodeBase64?: string;
  expiresAt: string;
  error?: string;
}

export interface PaymentProvider {
  readonly mode: ProviderMode;
  createPixPayment(options: CreatePixPaymentOptions): Promise<PaymentResult>;
  getPaymentStatus(paymentId: string): Promise<{ status: string; paid: boolean }>;
}
