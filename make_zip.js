import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const desktop = 'C:\\Users\\luciano\\OneDrive\\Desktop';
const zipPath = path.join(desktop, 'RecuperaIA_Producao.zip');
const sourceDir = 'C:\\Users\\luciano\\.gemini\\antigravity\\scratch\\recuperaia';
const stagingDir = path.join(desktop, '_staging_recuperaia');

if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
if (fs.existsSync(stagingDir)) fs.rmSync(stagingDir, { recursive: true, force: true });
fs.mkdirSync(stagingDir, { recursive: true });

// Copia arquivos excluindo node_modules, .next, etc.
const ignoreList = ['node_modules', '.next', '.git', '.system_generated', 'scratch', 'dist', 'cloudflared.exe', 'temp_zip'];

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoreList.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(sourceDir, stagingDir);

// Compacta usando PowerShell
execSync(`powershell -Command "Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${zipPath}' -Force"`);
fs.rmSync(stagingDir, { recursive: true, force: true });

console.log('✅ ZIP criado com sucesso em:', zipPath);
