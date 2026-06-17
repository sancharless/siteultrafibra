const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const apiMikweb = require('./api/mikweb');
const apiWhatsapp = require('./api/whatsapp');

// Carrega variáveis do arquivo .env se existir
try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                const [key, ...valParts] = trimmed.split('=');
                process.env[key.trim()] = valParts.join('=').trim();
            }
        });
        console.log("[LOCAL DEV] Variáveis de ambiente carregadas do arquivo .env");
    }
} catch (e) {
    console.error("Erro ao ler o arquivo .env:", e);
}


const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.json': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Roteador de API (/api/mikweb)
    if (parsedUrl.pathname === '/api/mikweb') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            req.body = body;
            apiMikweb(req, res);
        });
        return;
    }

    // Roteador de API (/api/whatsapp)
    if (parsedUrl.pathname === '/api/whatsapp') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            req.body = body;
            apiWhatsapp(req, res);
        });
        return;
    }

    // Serve os arquivos estáticos do frontend
    let decodedPath = decodeURIComponent(parsedUrl.pathname);
    let filePath = path.join(__dirname, decodedPath === '/' ? 'index.html' : decodedPath);
    
    // Segurança: impede acesso a arquivos fora da pasta do projeto
    if (!filePath.startsWith(__dirname)) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Acesso proibido');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Arquivo não encontrado');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n====================================================================`);
    console.log(`[LOCAL DEV] Servidor rodando em: http://localhost:${PORT}`);
    console.log(`[LOCAL DEV] Rota integrada ativa: http://localhost:${PORT}/api/mikweb`);
    console.log(`====================================================================\n`);
});
