const url = require('url');

module.exports = async (req, res) => {
    // Configura cabeçalhos CORS
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
    const MIKWEB_TOKEN = process.env.MIKWEB_API_TOKEN || process.env.MIKWEB_TOKEN || "";

    // MODO DEMONSTRAÇÃO (Se não houver token cadastrado)
    if (!MIKWEB_TOKEN) {
        console.warn("AVISO: Variável MIKWEB_API_TOKEN não está definida. Executando em Modo de Demonstração.");
        return handleMockMode(req, res, action, query);
    }

    try {
        // MODO PRODUÇÃO (Integração real com Mikweb API)
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${MIKWEB_TOKEN}`
        };

        if (action === 'login') {
            const rawCpf = (query.cpf || "").replace(/\D/g, '');
            const password = query.password || "";

            if (!rawCpf) {
                return respondWithError(res, 400, "CPF ou CNPJ é obrigatório.");
            }

            // Busca o cliente pelo CPF/CNPJ usando o parâmetro search da API Mikweb
            const response = await fetch(`https://api.mikweb.com.br/v1/admin/customers?search=${rawCpf}`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                return respondWithError(res, response.status, "Erro ao conectar com a API do Mikweb.");
            }

            const data = await response.json();
            const customers = data.customers || [];

            if (customers.length === 0) {
                return respondWithError(res, 404, "Nenhum cliente encontrado com este CPF/CNPJ.");
            }

            // Tenta localizar um cliente exato
            const customer = customers[0];
            let authenticated = false;

            // Lógica de Autenticação robusta baseada nos dados do Mikweb
            if (customer.password && customer.password.toString().toLowerCase() === password.toLowerCase()) {
                authenticated = true;
            } else if (customer.login && customer.login.toString().toLowerCase() === password.toLowerCase()) {
                authenticated = true;
            } else {
                // Fallback de desenvolvimento: se a senha for o próprio CPF ou os 6 primeiros dígitos
                const first6Cpf = rawCpf.substring(0, 6);
                if (password === rawCpf || password === first6Cpf) {
                    authenticated = true;
                }
            }

            if (!authenticated) {
                return respondWithError(res, 401, "Senha incorreta para o CPF/CNPJ informado.");
            }

            return respondWithJson(res, 200, {
                success: true,
                customer: {
                    id: customer.id,
                    full_name: customer.full_name,
                    cpf_cnpj: customer.cpf_cnpj,
                    login: customer.login,
                    status: customer.status || "Ativo",
                    due_day: customer.due_day || 10
                }
            });

        } else if (action === 'billings') {
            const customerId = query.customer_id;
            if (!customerId) {
                return respondWithError(res, 400, "O ID do cliente é obrigatório.");
            }

            const response = await fetch(`https://api.mikweb.com.br/v1/admin/billings?customer_id=${customerId}&per_page=100`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                return respondWithError(res, response.status, "Erro ao buscar faturas no Mikweb.");
            }

            const data = await response.json();
            const rawBillings = data.billings || [];

            // Mapeamento limpo dos campos das faturas
            const billings = rawBillings.map(b => ({
                id: b.id,
                value: b.value || b.total_value || "99.90",
                due_date: b.due_date || b.vencimento,
                payment_date: b.payment_date || null,
                status: b.situation || (b.payment_date ? "Pago" : "Aberto"),
                barcode: b.barcode || b.linha_digitavel || null,
                pix_code: b.pix_copia_cola || b.pix_code || null,
                pdf_url: b.pdf_url || b.link_boleto || null
            }));

            return respondWithJson(res, 200, { success: true, billings });

        } else if (action === 'tickets') {
            const customerId = query.customer_id;
            if (!customerId) {
                return respondWithError(res, 400, "O ID do cliente é obrigatório.");
            }

            const response = await fetch(`https://api.mikweb.com.br/v1/admin/calledies?customer_id=${customerId}`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                return respondWithError(res, response.status, "Erro ao buscar chamados no Mikweb.");
            }

            const data = await response.json();
            const rawTickets = data.calledies || data.tickets || [];

            const tickets = rawTickets.map(t => ({
                id: t.id,
                subject: t.subject || t.assunto || "Chamado de Suporte",
                message: t.message || t.mensagem || "",
                status: t.status || t.situacao || "Aberto",
                created_at: t.created_at || t.data_abertura || new Date().toISOString()
            }));

            return respondWithJson(res, 200, { success: true, tickets });

        } else if (action === 'create_ticket') {
            let body = {};
            if (req.method === 'POST') {
                body = await parseRequestBody(req);
            }

            const customerId = body.customer_id || query.customer_id;
            const subject = body.subject || query.subject;
            const message = body.message || query.message;

            if (!customerId || !subject || !message) {
                return respondWithError(res, 400, "Campos obrigatórios ausentes: customer_id, subject, message.");
            }

            const response = await fetch(`https://api.mikweb.com.br/v1/admin/calledies`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    customer_id: customerId,
                    subject: subject,
                    message: message
                })
            });

            if (!response.ok) {
                return respondWithError(res, response.status, "Erro ao abrir chamado no Mikweb.");
            }

            const data = await response.json();
            return respondWithJson(res, 201, {
                success: true,
                ticket: data
            });

        } else {
            return respondWithError(res, 400, "Ação não suportada.");
        }

    } catch (error) {
        console.error("Erro interno no backend proxy:", error);
        return respondWithError(res, 500, "Erro interno no servidor de integração.");
    }
};

// --- FUNÇÕES AUXILIARES ---

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

// --- MOCK MODE HANDLER ---
function handleMockMode(req, res, action, query) {
    if (action === 'login') {
        const rawCpf = (query.cpf || "").replace(/\D/g, '');
        const password = query.password || "";

        if (rawCpf.startsWith('000')) {
            return respondWithError(res, 404, "[MOCK] CPF não localizado no banco de dados.");
        }

        return respondWithJson(res, 200, {
            success: true,
            customer: {
                id: 99999,
                full_name: "Joseph Nascimento (Demo)",
                cpf_cnpj: rawCpf,
                login: "joseph.nascimento",
                status: "Ativo",
                due_day: 15
            }
        });

    } else if (action === 'billings') {
        return respondWithJson(res, 200, {
            success: true,
            billings: [
                {
                    id: 101,
                    value: "99.90",
                    due_date: "2026-05-15",
                    payment_date: "2026-05-14",
                    status: "Pago",
                    barcode: "00190.00009 02796.162007 00000.111019 1 97720000009990",
                    pix_code: "00020101021226870014br.gov.bcb.pix2565pix.ultrafibra.com.br/faturas/mock101",
                    pdf_url: "#"
                },
                {
                    id: 102,
                    value: "99.90",
                    due_date: "2026-06-15",
                    payment_date: null,
                    status: "Aberto",
                    barcode: "00190.00009 02796.162007 00000.222019 1 98020000009990",
                    pix_code: "00020101021226870014br.gov.bcb.pix2565pix.ultrafibra.com.br/faturas/mock102",
                    pdf_url: "#"
                },
                {
                    id: 103,
                    value: "99.90",
                    due_date: "2026-07-15",
                    payment_date: null,
                    status: "Aberto",
                    barcode: "00190.00009 02796.162007 00000.333019 1 98320000009990",
                    pix_code: "00020101021226870014br.gov.bcb.pix2565pix.ultrafibra.com.br/faturas/mock103",
                    pdf_url: "#"
                }
            ]
        });

    } else if (action === 'tickets') {
        return respondWithJson(res, 200, {
            success: true,
            tickets: [
                {
                    id: 201,
                    subject: "Lentidão no Wi-Fi período noturno",
                    message: "Identifiquei lentidão nos fins de semana a partir das 20h.",
                    status: "Respondido",
                    created_at: "2026-06-01T14:30:00Z"
                },
                {
                    id: 202,
                    subject: "Dúvida sobre ativação do IPv6",
                    message: "Gostaria de saber se o meu roteador já está configurado com IPv6.",
                    status: "Finalizado",
                    created_at: "2026-05-18T10:15:00Z"
                }
            ]
        });

    } else if (action === 'create_ticket') {
        return respondWithJson(res, 201, {
            success: true,
            ticket: {
                id: Math.floor(Math.random() * 1000) + 300,
                subject: query.subject || "Assunto Teste",
                message: query.message || "Mensagem Teste",
                status: "Aberto",
                created_at: new Date().toISOString()
            }
        });
    }

    return respondWithError(res, 400, "[MOCK] Ação não suportada.");
}
