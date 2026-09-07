/**
 * Provedor Sandbox / Simulador de Desenvolvimento: WhatsApp
 * Explicitamente demarcado como Ambiente de Simulação para testes locais e desenvolvimento seguro.
 * Não faz chamadas externas falsas e documenta cada disparo simulado.
 */

import {
  WhatsAppProvider,
  SendWhatsAppTextOptions,
  SendWhatsAppTemplateOptions,
  WhatsAppSendResult,
  ProviderMode,
} from '../types';

export class WhatsAppSandboxProvider implements WhatsAppProvider {
  public readonly mode: ProviderMode = 'SANDBOX_SIMULATION';
  private sentMessagesLog: Array<{
    id: string;
    timestamp: string;
    to: string;
    text: string;
    type: string;
  }> = [];

  async sendTextMessage(options: SendWhatsAppTextOptions): Promise<WhatsAppSendResult> {
    const simulatedId = `sbx_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Armazena no log em memória do simulador para validação em testes
    this.sentMessagesLog.push({
      id: simulatedId,
      timestamp: new Date().toISOString(),
      to: options.toPhone,
      text: options.text,
      type: 'text',
    });

    return {
      success: true,
      messageId: simulatedId,
      mode: this.mode,
      status: 'delivered',
      rawResponse: {
        simulator: 'RecuperaIA WhatsApp Sandbox',
        warning: 'Mensagem processada em ambiente de teste local. Nenhuma cobrança ou envio real da Meta foi disparado.',
        recipient: options.toPhone,
        textPreview: options.text.substring(0, 100),
      },
    };
  }

  async sendTemplateMessage(options: SendWhatsAppTemplateOptions): Promise<WhatsAppSendResult> {
    const simulatedId = `sbx_tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const parsedText = options.parameters.map((p) => p.text || '').join(' | ');

    this.sentMessagesLog.push({
      id: simulatedId,
      timestamp: new Date().toISOString(),
      to: options.toPhone,
      text: `[Template: ${options.templateName}] ${parsedText}`,
      type: 'template',
    });

    return {
      success: true,
      messageId: simulatedId,
      mode: this.mode,
      status: 'delivered',
      rawResponse: {
        simulator: 'RecuperaIA WhatsApp Sandbox',
        warning: 'Template testado em ambiente de teste local.',
        templateName: options.templateName,
        recipient: options.toPhone,
      },
    };
  }

  verifyWebhook(hubMode: string, hubToken: string, expectedToken: string, challenge: string): string | null {
    if (hubMode === 'subscribe' && hubToken === expectedToken) {
      return challenge;
    }
    return null;
  }

  getSimulatorLog() {
    return [...this.sentMessagesLog];
  }
}
