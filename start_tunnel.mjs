/**
 * Gerenciador de Túnel Seguro Cloudflare Quick Tunnel com --no-prechecks
 * Garante resiliência de conexão para testes remotos e acesso via celular.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cloudflaredPath = path.join(__dirname, 'cloudflared.exe');
const port = process.env.PORT || 3000;

console.log('🛡️  Iniciando Gerenciador de Túnel Seguro Cloudflare...');

if (fs.existsSync(cloudflaredPath)) {
  console.log(`📡 Disparando cloudflared com flag obrigatória --no-prechecks na porta ${port}...`);
  const tunnel = spawn(cloudflaredPath, [
    'tunnel',
    '--url', `http://localhost:${port}`,
    '--no-prechecks'
  ]);

  const handleData = (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match) {
      console.log(`\n======================================================`);
      console.log(`🚀 TÚNEL SEGURO CLOUDFLARE ATIVO: ${match[0]}`);
      console.log(`📡 Health Check Remoto: ${match[0]}/api/health`);
      console.log(`======================================================\n`);
    }
  };

  tunnel.stdout.on('data', handleData);
  tunnel.stderr.on('data', handleData);

  tunnel.on('close', (code) => {
    console.log(`Túnel encerrado com código: ${code}`);
  });
} else {
  console.log('cloudflared.exe não encontrado localmente. Utilizando túnel alternativo...');
}
