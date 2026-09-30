#!/usr/bin/env node
/*
 * AutenticSense — servidor local (zero dependências, basta o Node.js).
 * Uso:  node servidor.js    →  abre http://localhost:8080 no navegador.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml'
};

function handler(req, res) {
  let urlPath;
  try { urlPath = decodeURIComponent(req.url.split('?')[0]); }
  catch { res.writeHead(400); return res.end(); }
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 — arquivo não encontrado</h1>');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
}

function abrirNavegador(url) {
  const so = process.platform;
  const cmd = so === 'win32' ? `start "" "${url}"`
            : so === 'darwin' ? `open "${url}"`
            : `xdg-open "${url}"`;
  exec(cmd, () => { /* sem navegador gráfico: segue em frente */ });
}

function iniciar(porta) {
  const srv = http.createServer(handler);
  srv.on('error', (e) => {
    if (e.code === 'EADDRINUSE' && porta < 8095) iniciar(porta + 1);
    else { console.error('Erro ao iniciar: ' + e.message); process.exit(1); }
  });
  srv.listen(porta, () => {
    const url = `http://localhost:${porta}/index.html`;
    console.log('='.repeat(56));
    console.log('   AutenticSense — O Sentido Autêntico');
    console.log('='.repeat(56));
    console.log('   Servidor local ATIVO em:  ' + url);
    console.log('   O navegador vai abrir automaticamente.');
    console.log('   Para ENCERRAR: feche esta janela ou pressione Ctrl+C.');
    console.log('='.repeat(56));
    setTimeout(() => abrirNavegador(url), 1200);
  });
}

iniciar(8080);
