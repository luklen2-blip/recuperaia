/**
 * Gerador Oficial de Pagamento PIX (Banco Central do Brasil - Padrão EMV QRCPS)
 * Suporte a Payload Copia-e-Cola e QR Code para Assinaturas e Recuperação de Vendas
 */

interface PixOptions {
  pixKey: string;
  beneficiaryName: string;
  city: string;
  amount?: number;
  txId?: string;
  description?: string;
}

/**
 * Remove acentos e caracteres especiais para conformidade com a norma EMV do BACEN
 */
function normalizeString(str: string, maxLength: number): string {
  const normalized = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .trim();
  return normalized.substring(0, maxLength);
}

/**
 * Formata um campo no padrão EMV: ID (2 dígitos) + Tamanho (2 dígitos) + Valor
 */
function formatEMV(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

/**
 * Calcula o CRC16-CCITT (Polinômio 0x1021, Inicial 0xFFFF) exigido pelo Banco Central
 */
export function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Gera o payload oficial EMV PIX Copia-e-Cola
 */
export function generatePixPayload(options: PixOptions): string {
  const {
    pixKey,
    beneficiaryName,
    city,
    amount,
    txId = '***',
    description,
  } = options;

  // 00: Payload Format Indicator (01)
  let payload = formatEMV('00', '01');

  // 01: Point of Initiation Method (12 = Estático/Reutilizável, 11 = Dinâmico)
  payload += formatEMV('01', '12');

  // 26: Merchant Account Information (PIX)
  let merchantAccount = formatEMV('00', 'br.gov.bcb.pix');
  merchantAccount += formatEMV('01', pixKey.trim());
  if (description) {
    const cleanDesc = normalizeString(description, 40);
    merchantAccount += formatEMV('02', cleanDesc);
  }
  payload += formatEMV('26', merchantAccount);

  // 52: Merchant Category Code (0000 = Padrão Geral)
  payload += formatEMV('52', '0000');

  // 53: Transaction Currency (986 = BRL)
  payload += formatEMV('53', '986');

  // 54: Transaction Amount (Opcional, com 2 casas decimais)
  if (amount !== undefined && amount > 0) {
    const formattedAmount = amount.toFixed(2);
    payload += formatEMV('54', formattedAmount);
  }

  // 58: Country Code (BR)
  payload += formatEMV('58', 'BR');

  // 59: Merchant Name (Máximo 25 caracteres)
  const cleanName = normalizeString(beneficiaryName, 25) || 'RECUPERAIA';
  payload += formatEMV('59', cleanName);

  // 60: Merchant City (Máximo 15 caracteres)
  const cleanCity = normalizeString(city, 15) || 'SAO PAULO';
  payload += formatEMV('60', cleanCity);

  // 62: Additional Data Field Template (txid)
  const cleanTxId = normalizeString(txId, 25) || '***';
  const additionalData = formatEMV('05', cleanTxId);
  payload += formatEMV('62', additionalData);

  // 63: CRC16 (Calculado sobre todo o payload incluindo "6304")
  const payloadWithCRCHeader = `${payload}6304`;
  const crc = calculateCRC16(payloadWithCRCHeader);

  return `${payloadWithCRCHeader}${crc}`;
}
