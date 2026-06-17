const http = require('http');

const test = (path, method = 'GET', headers = {}, body = null) => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                ...headers,
                ...(body ? {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body)
                } : {})
            }
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
        console.log("--- TESTANDO API WHATSAPP E CHATBOT LOCAL ---");
        console.log("=================================================");

        // 1. Testar Login com credenciais incorretas
        console.log("\n[TESTE 1] Fazendo login administrativo com senha errada...");
        const badLogin = await test('/api/whatsapp?action=login', 'POST', {}, JSON.stringify({
            username: 'admin',
            password: 'wrong_password'
        }));
        console.log("Status:", badLogin.status);
        console.log("Erro retornado:", badLogin.body.error);

        // 2. Testar Login com credenciais corretas
        console.log("\n[TESTE 2] Fazendo login administrativo com credenciais corretas...");
        const goodLogin = await test('/api/whatsapp?action=login', 'POST', {}, JSON.stringify({
            username: 'admin',
            password: 'ultra123'
        }));
        console.log("Status:", goodLogin.status);
        console.log("Sucesso:", goodLogin.body.success);
        const token = goodLogin.body.token;
        console.log("Token gerado:", token);

        if (!token) {
            throw new Error("Não foi possível obter um token válido, abortando testes subsequentes.");
        }

        const authHeader = { 'Authorization': `Bearer ${token}` };

        // 3. Testar Get State sem Token
        console.log("\n[TESTE 3] Buscando estado sem token de autorização...");
        const stateNoToken = await test('/api/whatsapp?action=get_state');
        console.log("Status:", stateNoToken.status);
        console.log("Erro retornado:", stateNoToken.body.error);

        // 4. Testar Get State com Token
        console.log("\n[TESTE 4] Buscando estado com token válido...");
        const stateRes = await test('/api/whatsapp?action=get_state', 'GET', authHeader);
        console.log("Status:", stateRes.status);
        console.log("Chatbot Ativo:", stateRes.body.botEnabled);
        console.log("Quantidade de conversas ativas:", stateRes.body.chats.length);

        // 5. Testar Webhook - Envio de "Oi" pelo cliente (Inicia menu)
        console.log("\n[TESTE 5] Simulando envio de 'Oi' pelo cliente...");
        const webhook1 = await test('/api/whatsapp?action=webhook', 'POST', {}, JSON.stringify({
            phone: '+5598999887766',
            name: 'Guilherme Silva',
            message: 'Oi, boa tarde!'
        }));
        console.log("Status:", webhook1.status);
        console.log("Resposta do Robô:", webhook1.body.reply);

        // 6. Testar Webhook - Envio da opção "1" (Segunda Via)
        console.log("\n[TESTE 6] Simulando envio de '1' (Segunda Via)...");
        const webhook2 = await test('/api/whatsapp?action=webhook', 'POST', {}, JSON.stringify({
            phone: '+5598999887766',
            name: 'Guilherme Silva',
            message: '1'
        }));
        console.log("Status:", webhook2.status);
        console.log("Resposta do Robô:", webhook2.body.reply);

        // 7. Testar Webhook - Envio do CPF de demonstração "12345678900"
        console.log("\n[TESTE 7] Simulando envio do CPF de demonstração...");
        const webhook3 = await test('/api/whatsapp?action=webhook', 'POST', {}, JSON.stringify({
            phone: '+5598999887766',
            name: 'Guilherme Silva',
            message: '12345678900'
        }));
        console.log("Status:", webhook3.status);
        console.log("Resposta do Robô (Boleto/Pix):", webhook3.body.reply);

        // 8. Testar Resposta Manual do Operador Humano
        console.log("\n[TESTE 8] Enviando mensagem manual do operador para o cliente...");
        const opRes = await test('/api/whatsapp?action=send_message', 'POST', authHeader, JSON.stringify({
            phone: '+5598999887766',
            message: 'Olá Guilherme, aqui é o Charles do suporte. Recebeu seu boleto acima?'
        }));
        console.log("Status:", opRes.status);
        console.log("Sucesso:", opRes.body.success);

        // 9. Testar Toggle Bot (Desativar Chatbot)
        console.log("\n[TESTE 9] Desativando o chatbot pelo painel...");
        const toggleRes = await test('/api/whatsapp?action=toggle_bot', 'POST', authHeader, JSON.stringify({
            enabled: false
        }));
        console.log("Status:", toggleRes.status);
        console.log("Chatbot Ativo pós alteração:", toggleRes.body.botEnabled);

        // 10. Testar Webhook com Chatbot Desativado
        console.log("\n[TESTE 10] Simulando mensagem do cliente com bot desativado...");
        const webhookDisabled = await test('/api/whatsapp?action=webhook', 'POST', {}, JSON.stringify({
            phone: '+5598999887766',
            name: 'Guilherme Silva',
            message: 'Oi'
        }));
        console.log("Status:", webhookDisabled.status);
        console.log("Robô respondeu automaticamente?", webhookDisabled.body.reply ? "Sim" : "Não (Correto - Apenas registrado)");

        console.log("\n=================================================");
        console.log("--- TODOS OS TESTES CONCLUÍDOS COM SUCESSO ---");
        console.log("=================================================");
    } catch (e) {
        console.error("Erro durante a execução dos testes da API do WhatsApp:", e);
    }
}

runTests();
