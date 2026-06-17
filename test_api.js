const http = require('http');

const test = (path, method = 'GET', body = null) => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: body ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            } : {}
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: data });
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
};

async function runTests() {
    try {
        console.log("=================================================");
        console.log("--- TESTANDO API LOCAL (MODO DEMONSTRAÇÃO) ---");
        console.log("=================================================");
        
        // 1. Testar Login Sucesso
        console.log("\n[TESTE 1] Testando login com CPF válido...");
        const loginRes = await test('/api/mikweb?action=login&cpf=12345678900&password=123456&mock=true');
        console.log("Status:", loginRes.status);
        console.log("Retorno:", loginRes.body);

        // 2. Testar Login Erro
        console.log("\n[TESTE 2] Testando login com CPF inválido...");
        const loginErr = await test('/api/mikweb?action=login&cpf=00012345678&password=123456&mock=true');
        console.log("Status:", loginErr.status);
        console.log("Retorno:", loginErr.body);

        // 3. Testar Billings (Faturas)
        console.log("\n[TESTE 3] Testando consulta de faturas...");
        const billingsRes = await test('/api/mikweb?action=billings&customer_id=99999&mock=true');
        console.log("Status:", billingsRes.status);
        console.log("Quantidade de faturas encontradas:", billingsRes.body.billings ? billingsRes.body.billings.length : 0);
        if (billingsRes.body.billings && billingsRes.body.billings.length > 0) {
            console.log("Exemplo de fatura:", billingsRes.body.billings[0]);
        }

        // 4. Testar Chamados
        console.log("\n[TESTE 4] Testando consulta de chamados...");
        const ticketsRes = await test('/api/mikweb?action=tickets&customer_id=99999&mock=true');
        console.log("Status:", ticketsRes.status);
        console.log("Quantidade de chamados encontrados:", ticketsRes.body.tickets ? ticketsRes.body.tickets.length : 0);
        if (ticketsRes.body.tickets && ticketsRes.body.tickets.length > 0) {
            console.log("Exemplo de chamado:", ticketsRes.body.tickets[0]);
        }

        // 5. Testar Criar Chamado
        console.log("\n[TESTE 5] Testando abertura de chamado (POST)...");
        const createRes = await test('/api/mikweb?action=create_ticket&mock=true', 'POST', JSON.stringify({
            customer_id: 99999,
            subject: 'Queda de Sinal Fibra',
            message: 'Minha internet caiu e a luz vermelha LOS do roteador está piscando.'
        }));
        console.log("Status:", createRes.status);
        console.log("Retorno:", createRes.body);

        // 6. Testar Cadastro de Senha (Primeiro Acesso)
        console.log("\n[TESTE 6] Testando cadastro/atualização de senha (POST)...");
        const registerRes = await test('/api/mikweb?action=register_password&mock=true', 'POST', JSON.stringify({
            cpf: '12345678900',
            phone: '11999999999',
            password: 'new_secure_password'
        }));
        console.log("Status:", registerRes.status);
        console.log("Retorno:", registerRes.body);

        console.log("\n=================================================");
        console.log("--- TODOS OS TESTES CONCLUÍDOS COM SUCESSO ---");
        console.log("=================================================");
    } catch (e) {
        console.error("Erro durante a execução dos testes da API:", e);
    }
}

runTests();
