const url = require('url');

// Cache global para persistência em memória (Vercel mantém instâncias hot vivas temporariamente, servidor local mantém permanentemente)
if (!global.whatsappState) {
    global.whatsappState = {
        botEnabled: true,
        chats: {}, // Mapa de telefone -> dados do chat (mensagens, status, step)
        activeSessions: new Set() // Tokens de sessões ativas autenticadas
    };
}
const state = global.whatsappState;

// Popula dados de demonstração iniciais caso os chats estejam vazios
if (Object.keys(state.chats).length === 0) {
    state.chats['+559891183681'] = {
        phone: '+559891183681',
        name: 'Carlos Oliveira (Suporte)',
        step: 'idle',
        messages: [
            { sender: 'customer', text: 'Oi, bom dia!', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
            { sender: 'bot', text: 'Olá, Carlos Oliveira (Suporte)! Bem-vindo ao autoatendimento da Ultra Fibra. 🌟\n\nComo posso te ajudar hoje? Responda com o número da opção:\n1️⃣ Segunda Via de Fatura (Boleto/Pix)\n2️⃣ Falar com Suporte Técnico\n3️⃣ Conhecer Planos de Internet\n4️⃣ Outros assuntos', timestamp: new Date(Date.now() - 3600000 * 2 + 1000).toISOString() },
            { sender: 'customer', text: '3', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { sender: 'bot', text: 'Nossos planos Ultra Fibra:\n\n🚀 Plano 300 Mega - R$ 89,90/mês\n🔥 Plano 600 Mega - R$ 99,90/mês (Recomendado)\n⚡ Plano 1 Giga - R$ 149,90/mês\n📺 Plano Ultra TV (600M + Canais) - R$ 189,90/mês\n\nPara contratar, fale com um de nossos consultores de vendas no número +559891183681!', timestamp: new Date(Date.now() - 3600000 + 1000).toISOString() }
        ]
    };
}

module.exports = async (req, res) => {
    // Cabeçalhos CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }

    const query = url.parse(req.url, true).query;
    const action = query.action;

    // Helper para autenticação
    function checkAuth() {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return false;
        const token = authHeader.replace('Bearer ', '').trim();
        return state.activeSessions.has(token);
    }

    try {
        if (action === 'login') {
            if (req.method !== 'POST') {
                return respondWithError(res, 405, "Método não permitido.");
            }

            const body = await parseRequestBody(req);
            const username = body.username || "";
            const password = body.password || "";

            const ADMIN_USER = process.env.ADMIN_USER || "admin";
            const ADMIN_PASS = process.env.ADMIN_PASS || "ultra123";

            if (username === ADMIN_USER && password === ADMIN_PASS) {
                const token = 'tok_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
                state.activeSessions.add(token);
                return respondWithJson(res, 200, { success: true, token });
            } else {
                return respondWithError(res, 401, "Usuário ou senha administrativa incorretos.");
            }

        } else if (action === 'get_state') {
            if (!checkAuth()) {
                return respondWithError(res, 401, "Acesso não autorizado.");
            }

            return respondWithJson(res, 200, {
                success: true,
                botEnabled: state.botEnabled,
                chats: Object.values(state.chats)
            });

        } else if (action === 'toggle_bot') {
            if (!checkAuth()) {
                return respondWithError(res, 401, "Acesso não autorizado.");
            }

            const body = await parseRequestBody(req);
            const enabled = body.enabled === true;
            state.botEnabled = enabled;

            return respondWithJson(res, 200, {
                success: true,
                botEnabled: state.botEnabled
            });

        } else if (action === 'send_message') {
            if (!checkAuth()) {
                return respondWithError(res, 401, "Acesso não autorizado.");
            }

            const body = await parseRequestBody(req);
            const phone = body.phone || "";
            const messageText = body.message || "";

            if (!phone || !messageText) {
                return respondWithError(res, 400, "Destinatário e mensagem são obrigatórios.");
            }

            if (!state.chats[phone]) {
                state.chats[phone] = {
                    phone,
                    name: 'Cliente WhatsApp',
                    step: 'idle',
                    messages: []
                };
            }

            // Registra mensagem enviada manualmente pelo operador
            state.chats[phone].messages.push({
                sender: 'operator',
                text: messageText,
                timestamp: new Date().toISOString()
            });

            // Opcional: Reseta o chatbot para o estado inicial para evitar respostas automáticas conflitantes em seguida
            state.chats[phone].step = 'idle';

            return respondWithJson(res, 200, { success: true });

        } else if (action === 'webhook') {
            // Este endpoint simula o recebimento de uma mensagem do cliente no WhatsApp
            const body = await parseRequestBody(req);
            const phone = body.phone || "";
            const name = body.name || "Cliente";
            const messageText = (body.message || "").trim();

            if (!phone || !messageText) {
                return respondWithError(res, 400, "Telefone e mensagem são obrigatórios no webhook.");
            }

            if (!state.chats[phone]) {
                state.chats[phone] = {
                    phone,
                    name,
                    step: 'idle',
                    messages: []
                };
            }

            const chat = state.chats[phone];

            // Adiciona a mensagem recebida do cliente no log
            chat.messages.push({
                sender: 'customer',
                text: messageText,
                timestamp: new Date().toISOString()
            });

            // Se o chatbot estiver desativado, apenas registra e não envia resposta automática
            if (!state.botEnabled) {
                return respondWithJson(res, 200, {
                    success: true,
                    botEnabled: false,
                    messages: chat.messages
                });
            }

            let replyText = "";
            const normalizedText = messageText.toLowerCase().replace(/\s/g, '');

            // FLUXO DO CHATBOT
            if (chat.step === 'awaiting_cpf') {
                const cleanCpf = messageText.replace(/\D/g, '');
                
                if (normalizedText === 'menu' || normalizedText === 'voltar') {
                    chat.step = 'menu';
                    replyText = 'Ok! Voltamos ao menu principal. Como posso te ajudar hoje?\n\n' +
                                '1️⃣ Segunda Via de Fatura (Boleto/Pix)\n' +
                                '2️⃣ Falar com Suporte Técnico\n' +
                                '3️⃣ Conhecer Planos de Internet\n' +
                                '4️⃣ Outros assuntos';
                } else if (cleanCpf.length === 11 || cleanCpf.length === 14) {
                    replyText = await queryCustomerBillings(cleanCpf);
                    chat.step = 'idle'; // Reseta após a consulta
                } else {
                    replyText = '⚠️ O CPF ou CNPJ digitado parece incompleto. Por favor, digite os 11 números do CPF ou 14 do CNPJ (ou digite *menu* para cancelar):';
                }
            } else {
                // Estado inicial 'idle' ou recebimento de palavras chaves de saudação
                const isGreeting = ['oi', 'ola', 'bomdia', 'boatarde', 'boanoite', 'menu', 'ajuda', 'ola,bot', 'chatbot', 'start', 'começar'].includes(normalizedText);

                if (isGreeting || chat.step === 'idle') {
                    chat.step = 'menu';
                    replyText = `Olá, ${name}! Bem-vindo ao autoatendimento da Ultra Fibra. 🚀\n\n` +
                                `Como posso te ajudar hoje? Digite o número da opção desejada:\n\n` +
                                `1️⃣ Segunda Via de Fatura (Boleto/Pix)\n` +
                                `2️⃣ Falar com Suporte Técnico\n` +
                                `3️⃣ Conhecer Planos de Internet\n` +
                                `4️⃣ Outros assuntos`;
                } else if (messageText === '1') {
                    chat.step = 'awaiting_cpf';
                    replyText = '💳 Ótimo! Para localizar suas faturas, por favor, digite o seu **CPF** ou **CNPJ** (somente números):';
                } else if (messageText === '2') {
                    chat.step = 'idle';
                    replyText = '🛠️ Para falar com nosso suporte técnico local da Ultra Fibra, ligue ou chame no WhatsApp pelo número **+559891183681**.\n\nNosso horário de atendimento é de Segunda a Sábado, das 08:00 às 20:00.';
                } else if (messageText === '3') {
                    chat.step = 'idle';
                    replyText = '⚡ Nossos planos Ultra Fibra ativos:\n\n' +
                                '🚀 **Plano 300 Mega** - R$ 89,90/mês\n' +
                                '🔥 **Plano 600 Mega** - R$ 99,90/mês (Campeão de Vendas)\n' +
                                '⚡ **Plano 1 Giga** - R$ 149,90/mês\n' +
                                '📺 **Plano Ultra TV** (600M + Grade de Canais) - R$ 189,90/mês\n\n' +
                                'Quer assinar? Fale diretamente com nossa equipe de vendas no WhatsApp **+559891183681**!';
                } else if (messageText === '4') {
                    chat.step = 'idle';
                    replyText = 'Entendido! Sua conversa foi marcada para nossa equipe de atendimento humano. Responderemos você nesta mesma janela o mais rápido possível! 🧑‍💻';
                } else {
                    replyText = 'Não entendi seu comando. Por favor, responda com uma das opções:\n\n' +
                                '1️⃣ Segunda Via de Fatura\n' +
                                '2️⃣ Suporte Técnico\n' +
                                '3️⃣ Planos de Internet\n' +
                                'Ou digite *menu* para recomeçar.';
                }
            }

            // Adiciona a mensagem de resposta do bot
            chat.messages.push({
                sender: 'bot',
                text: replyText,
                timestamp: new Date().toISOString()
            });

            return respondWithJson(res, 200, {
                success: true,
                botEnabled: true,
                reply: replyText,
                messages: chat.messages
            });

        } else {
            return respondWithError(res, 400, "Ação não suportada.");
        }

    } catch (err) {
        console.error("Erro interno no backend do WhatsApp:", err);
        return respondWithError(res, 500, "Erro interno no servidor do chatbot.");
    }
};

// --- CONSULTA MIKWEB INTEGRADA COM WHATSAPP ---
async function queryCustomerBillings(cpfCnpj) {
    const MIKWEB_TOKEN = process.env.MIKWEB_API_TOKEN || "";
    
    // Fallback para Modo Mock ou CPF de demonstração
    if (!MIKWEB_TOKEN || cpfCnpj === '12345678900') {
        if (cpfCnpj === '12345678900') {
            return `Localizei seu cadastro, **Joseph Nascimento (Demo)**! Aqui estão suas faturas em aberto:\n\n` +
                   `📅 *Fatura #102* - Vence em: 2026-06-15\n` +
                   `💰 Valor: R$ 99,90\n` +
                   `🔑 *Pix Copia e Cola*:\n\`00020101021226870014br.gov.bcb.pix2565pix.ultrafibra.com.br/faturas/mock102\`\n\n` +
                   `📅 *Fatura #103* - Vence em: 2026-07-15\n` +
                   `💰 Valor: R$ 99,90\n` +
                   `🔑 *Pix Copia e Cola*:\n\`00020101021226870014br.gov.bcb.pix2565pix.ultrafibra.com.br/faturas/mock103\`\n\n` +
                   `Para pagar, copie o código Pix acima e cole na opção Pix Copia e Cola do app do seu banco. 👍`;
        }
        return `⚠️ Não localizei nenhum cliente cadastrado com o CPF/CNPJ **${cpfCnpj}** no banco de dados de demonstração. Tente o CPF de demonstração: *12345678900*.`;
    }

    try {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${MIKWEB_TOKEN}`
        };

        // Busca o cliente
        const response = await fetch(`https://api.mikweb.com.br/v1/admin/customers?search=${cpfCnpj}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            return `❌ Erro ao conectar no ERP Mikweb. Por favor, tente novamente em alguns instantes.`;
        }

        const data = await response.json();
        const customers = data.customers || [];

        if (customers.length === 0) {
            return `⚠️ Não encontrei nenhum cadastro ativo para o CPF/CNPJ **${cpfCnpj}**. Verifique os dígitos e tente de novo.`;
        }

        const customer = customers[0];

        // Busca as faturas
        const billingsRes = await fetch(`https://api.mikweb.com.br/v1/admin/billings?customer_id=${customer.id}&per_page=100`, {
            method: 'GET',
            headers
        });

        if (!billingsRes.ok) {
            return `Olá, ${customer.full_name}! Encontrei seu cadastro, mas houve uma falha ao puxar suas faturas. Por favor, tente novamente mais tarde.`;
        }

        const billingsData = await billingsRes.json();
        const rawBillings = billingsData.billings || [];

        // Filtra as faturas em aberto
        const openBillings = rawBillings.filter(b => {
            const status = b.situation || (b.payment_date ? "Pago" : "Aberto");
            return status.toLowerCase() === 'aberto' || !b.payment_date;
        });

        if (openBillings.length === 0) {
            return `Olá, ${customer.full_name}! Verifiquei aqui no Mikweb e você está em dia! Não há nenhuma fatura pendente de pagamento no momento. Obrigado! 😊`;
        }

        let reply = `Localizei seu cadastro, **${customer.full_name}**! Seguem suas faturas em aberto:\n\n`;

        openBillings.forEach((b, index) => {
            const valor = b.value || b.total_value || "99.90";
            const vencimento = b.due_date || "N/A";
            const pixCode = b.pix_copia_cola || b.pix_code || "";
            const boletoUrl = b.pdf_url || b.link_boleto || "";

            reply += `📄 *Fatura #${b.id}*\n`;
            reply += `📅 Vence em: ${vencimento}\n`;
            reply += `💰 Valor: R$ ${valor}\n`;
            if (pixCode) {
                reply += `🔑 *Pix Copia e Cola*:\n\`${pixCode}\`\n`;
            }
            if (boletoUrl) {
                reply += `🔗 *Boleto PDF*: ${boletoUrl}\n`;
            }
            reply += `\n`;
        });

        reply += `Copie a chave Pix acima ou use o link do PDF para fazer o pagamento. Se precisar de algo mais, digite *menu*.`;
        return reply;

    } catch (err) {
        console.error("Erro na busca de faturas Mikweb via WhatsApp:", err);
        return `❌ Ocorreu um erro interno de conexão durante a busca. Por favor, aguarde e tente novamente em instantes.`;
    }
}

// --- HELPERS ---

function respondWithError(res, status, message) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: message }));
}

function respondWithJson(res, status, data) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        if (req.body) {
            if (typeof req.body === 'object') {
                return resolve(req.body);
            }
            try {
                return resolve(JSON.parse(req.body));
            } catch (e) {
                return resolve({});
            }
        }
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
    });
}
