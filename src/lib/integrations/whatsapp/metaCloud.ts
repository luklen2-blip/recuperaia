/**
 * Provedor Oficial de Produção: WhatsApp Business Platform (Meta Cloud API v21.0)
 * Realiza chamadas HTTP autênticas para os servidores da Meta (Graph API).
 */

import {
  WhatsAppProvider,
  WhatsAppCredentials,
  SendWhatsAppTextOptions,
  SendWhatsAppTemplateOptions,
  WhatsAppSendResult,
  ProviderMode,
} from '../types';

export class MetaWhatsAppCloudProvider implements WhatsAppProvider {
  public readonly mode: ProviderMode = 'LIVE_PRODUCTION';
  private credentials: WhatsAppCredentials;

  constructor(credentials: WhatsAppCredentials) {
    if (!credentials.phoneNumberId || !credentials.accessToken) {
      throw new Error('MetaWhatsAppCloudProvider requer phoneNumberId e accessToken válidos.');
    }
    this.credentials = credentials;
  }

  private cleanPhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  async sendTextMessage(options: SendWhatsAppTextOptions): Promise<WhatsAppSendResult> {
    const formattedPhone = this.cleanPhone(options.toPhone);
    const url = `https://graph.facebook.com/v21.0/${this.credentials.phoneNumberId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'text',
      text: {
        preview_url: options.previewUrl ?? false,
        body: options.text,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          messageId: '',
          mode: this.mode,
          status: 'failed',
          rawResponse: data,
          error: data?.error?.message || `Erro HTTP ${response.status} da Meta Graph API`,
        };
      }

      const messageId = data?.messages?.[0]?.id || `wamid_${Date.now()}`;
      return {
        success: true,
        messageId,
        mode: this.mode,
        status: 'sent',
        rawResponse: data,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        messageId: '',
        mode: this.mode,
        status: 'failed',
        error: `Falha de rede ao conectar à Meta API: ${errorMsg}`,
      };
    }
  }

  async sendTemplateMessage(options: SendWhatsAppTemplateOptions): Promise<WhatsAppSendResult> {
    const formattedPhone = this.cleanPhone(options.toPhone);
    const url = `https://graph.facebook.com/v21.0/${this.credentials.phoneNumberId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'template',
      template: {
        name: options.templateName,
        language: {
          code: options.languageCode || 'pt_BR',
        },
        components: [
          {
            type: 'body',
            parameters: options.parameters,
          },
        ],
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          messageId: '',
          mode: this.mode,
          status: 'failed',
          rawResponse: data,
          error: data?.error?.message || `Erro HTTP ${response.status} no envio de template Meta`,
        };
      }

      const messageId = data?.messages?.[0]?.id || `wamid_${Date.now()}`;
      return {
        success: true,
        messageId,
        mode: this.mode,
        status: 'sent',
        rawResponse: data,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        messageId: '',
        mode: this.mode,
        status: 'failed',
        error: `Falha ao enviar template via Meta Cloud API: ${errorMsg}`,
      };
    }
  }

  verifyWebhook(hubMode: string, hubToken: string, expectedToken: string, challenge: string): string | null {
    if (hubMode === 'subscribe' && hubToken === expectedToken) {
      return challenge;
    }
    return null;
  }
}
