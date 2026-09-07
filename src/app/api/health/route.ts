import { NextResponse } from 'next/server';

/**
 * Endpoint Obrigatório de Monitoramento 24/7 do RecuperaIA
 * Utilizado por Render, Railway, Fly.io, UptimeRobot e testes automatizados.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: process.env.APP_NAME || 'RecuperaIA',
    version: '2.0.0',
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
