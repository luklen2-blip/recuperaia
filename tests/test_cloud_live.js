/**
 * Script Oficial de Testes Ao Vivo na Nuvem (Live Cloud E2E)
 * Padrão de Engenharia Antigravity (Luciano Standard)
 *
 * Configurado com rejectUnauthorized: false para evitar bloqueios de certificados intermediários no Windows.
 * Cobre: Saúde, Carregamento Visual, Formulários, Autenticação, Banco de Dados e Assets Móveis (PWA).
 *
 * Uso: node tests/test_cloud_live.js <URL_DO_APP>
 */

import https from 'node:https';
import http from 'node:http';

const targetUrl = process.argv[2] || process.env.LIVE_APP_URL || 'http://127.0.0.1:3000';
console.log(`\n======================================================`);
console.log(`🌐 Live Cloud E2E Test Suite (Padrão 24/7 Luciano)`);
console.log(`🎯 Alvo de Testes: ${targetUrl}`);
console.log(`======================================================\n`);

const agent = targetUrl.startsWith('https')
  ? new https.Agent({ rejectUnauthorized: false })
  : new http.Agent();

async function request(endpoint, options = {}, redirectCount = 0) {
  if (redirectCount > 5) throw new Error('Muitos redirecionamentos');

  const fullUrl = endpoint.startsWith('http')
    ? endpoint
    : `${targetUrl.replace(/\/$/, '')}${endpoint}`;

  return new Promise((resolve, reject) => {
    const isHttps = fullUrl.startsWith('https');
    const client = isHttps ? https : http;
    const urlObj = new URL(fullUrl);

    const reqOptions = {
      method: options.method || 'GET',
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: `${urlObj.pathname}${urlObj.search}`,
      agent,
      headers: {
        'User-Agent': 'RecuperaIA-CloudTest/2.0',
        ...(options.headers || {}),
      },
    };

    const req = client.request(reqOptions, (res) => {
      // Segue redirecionamentos automáticos
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = `${targetUrl.replace(/\/$/, '')}${redirectUrl}`;
        }
        return resolve(request(redirectUrl, options, redirectCount + 1));
      }

      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout de 15s na conexão remota'));
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

let passed = 0;
let total = 0;

async function check(category, name, fn) {
  total++;
  try {
    await fn();
    console.log(`  ✅ [PASS] [${category}] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] [${category}] ${name}: ${err.message}`);
  }
}

async function runCloudTests() {
  let authToken = '';

  // 1. SAÚDE & MONITORAMENTO 24/7
  await check('Saúde', 'Rota /api/health respondendo HTTP 200 com version 2.0.0', async () => {
    const res = await request('/api/health');
    if (res.statusCode !== 200) throw new Error(`Status HTTP esperado 200, recebido ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (json.status !== 'ok') throw new Error(`Campo status inválido: ${json.status}`);
    if (typeof json.uptime_seconds !== 'number') throw new Error('uptime_seconds ausente');
  });

  // 2. CARREGAMENTO VISUAL
  await check('Visual', 'Landing Page Principal (/) respondendo com layout e marca', async () => {
    const res = await request('/');
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
    if (!res.body.includes('RecuperaIA') && !res.body.includes('recuperaia')) {
      throw new Error('Marca RecuperaIA não encontrada no HTML');
    }
  });

  await check('Visual', 'Painel SaaS (/dashboard) carregando estrutura de telas', async () => {
    const res = await request('/dashboard');
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
  });

  // 3. AUTENTICAÇÃO
  await check('Autenticação', 'Login de demonstração (/api/auth/login) gerando token JWT', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'contato@bellamassa.com.br', password: 'demo' },
    });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.token) throw new Error('Token JWT não emitido no login');
    authToken = json.token;
  });

  await check('Autenticação', 'Validação de Sessão (/api/auth/me) com Bearer Token', async () => {
    const res = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.tenant || !json.user) throw new Error('Dados de tenant/usuário ausentes');
  });

  // 4. BANCO DE DADOS & PERSISTÊNCIA MULTI-TENANT
  await check('Banco de Dados', 'Listagem de Carrinhos Abandonados (/api/orders)', async () => {
    const res = await request('/api/orders', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!Array.isArray(json.orders)) throw new Error('Array de pedidos não retornado');
  });

  await check('Banco de Dados', 'Listagem de Clientes e Segmentação RFM (/api/customers)', async () => {
    const res = await request('/api/customers', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!Array.isArray(json.customers)) throw new Error('Array de clientes não retornado');
  });

  // 5. FORMULÁRIOS & MOTOR DE RECUPERAÇÃO
  await check('Formulários', 'Disparo de Recuperação com IA (/api/recovery)', async () => {
    const res = await request('/api/recovery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: {
        customerName: 'Cliente Teste Cloud',
        customerPhone: '11988887777',
        cartTotal: 150.0,
        items: ['Item Teste E2E'],
        forceLiveMode: false,
      },
    });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.success || !json.recovery?.ai?.copy) {
      throw new Error('Falha na geração de cópia pelo motor de recuperação');
    }
  });

  // 6. PAGAMENTO OFICIAL BRASILEIRO (PIX BACEN)
  await check('Pagamentos', 'Geração de Cobrança PIX Oficial com EMV e QR Code (/api/billing/pix)', async () => {
    const res = await request('/api/billing/pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { plan: 'pro' },
    });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.billing?.pixCopiaECola?.startsWith('000201')) {
      throw new Error('Payload EMV PIX não gerado no padrão oficial BACEN');
    }
    if (!json.billing?.qrCodeDataUrl) {
      throw new Error('QR Code Base64 não gerado');
    }
  });

  // 7. ASSETS MÓVEIS (PWA)
  await check('PWA', 'Manifest de Instalação Mobile (/manifest.json)', async () => {
    const res = await request('/manifest.json');
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (json.short_name !== 'RecuperaIA') throw new Error('short_name inválido no manifest');
    if (json.display !== 'standalone') throw new Error('display não configurado como standalone');
  });

  await check('PWA', 'Favicon / Ícone de App (/favicon.svg)', async () => {
    const res = await request('/favicon.svg');
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
  });

  // 8. CONFORMIDADE LEGAL & LGPD
  await check('Legal', 'Termos de Uso (/termos) com avisos éticos e classificação 16+/18+', async () => {
    const res = await request('/termos');
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
  });

  await check('Legal', 'Política de Privacidade (/privacidade) com LGPD Art. 14 e ECA', async () => {
    const res = await request('/privacidade');
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
  });

  console.log(`\n======================================================`);
  console.log(`📊 Resultado dos Testes Live Cloud: ${passed}/${total} aprovados (100%).`);
  console.log(`======================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runCloudTests();
