@echo off
title RecuperaIA - Plataforma Multi-tenant 24/7
color 0A
cls
echo ========================================================
echo         RECUPERAIA - RECUPERACAO INTELIGENTE COM IA
echo               Padrao de Engenharia 24/7 (Luciano)
echo ========================================================
echo.

cd /d "C:\Users\luciano\.gemini\antigravity\scratch\recuperaia"

echo [1/3] Executando testes automatizados locais...
node tests/run_all.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha nos testes de integridade.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Abrindo aplicacao no navegador padrao...
start http://127.0.0.1:3000

echo.
echo [3/3] Inicializando Servidor HTTP 24/7 na porta 3000...
echo Health Check disponivel em: http://127.0.0.1:3000/api/health
echo.
node server.js

pause
