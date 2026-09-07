/**
 * Servidor HTTP Universal e Resiliente - RecuperaIA
 * Padrão de Engenharia de Luciano com resolução universal de arquivos estáticos,
 * health check 24/7 e integração completa com o Next.js.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, parse } from 'node:url';
import url from 'node:url';
import next from 'next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const appName = process.env.APP_NAME || 'RecuperaIA';

const nextApp = next({ dev, dir: __dirname });
const handle = nextApp.getRequestHandler();

// Tipos MIME comuns para entrega rápida e resiliente
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

nextApp.prepare().then(() => {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url || '/', true);
    const pathname = parsedUrl.pathname;

    // 1. Endpoint Obrigatório de Monitoramento 24/7 (/api/health)
    if ((pathname === '/api/health' || pathname === '/api/health/') && req.method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      });
      res.end(
        JSON.stringify({
          status: 'ok',
          app: appName,
          version: '2.0.0',
          uptime_seconds: Math.floor(process.uptime()),
          timestamp: new Date().toISOString(),
        })
      );
      return;
    }

    // 2. Resolução Universal de Arquivos Estáticos (public/ e raiz)
    const targetFile = pathname.replace(/^\//, '');
    if (targetFile && targetFile.includes('.')) {
      const candidatePaths = [
        path.join(__dirname, 'public', targetFile),
        path.join(__dirname, targetFile),
        path.join(process.cwd(), 'public', targetFile),
        path.join(process.cwd(), targetFile),
      ];

      const foundPath = candidatePaths.find((p) => {
        try {
          return fs.existsSync(p) && fs.statSync(p).isFile();
        } catch {
          return false;
        }
      });

      if (foundPath) {
        const ext = path.extname(foundPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(foundPath).pipe(res);
        return;
      }
    }

    // 3. Encaminhamento padrão para Next.js (App Router, Route Handlers, SSR)
    handle(req, res, parsedUrl);
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`\n🚀 RecuperaIA rodando com sucesso em http://localhost:${port}`);
    console.log(`📡 Health Check disponível em: http://localhost:${port}/api/health`);
    console.log(`🛡️  Modo: ${dev ? 'Desenvolvimento' : 'Produção 24/7'}\n`);
  });
}).catch((err) => {
  console.error('Falha ao inicializar Next.js:', err);
  process.exit(1);
});
