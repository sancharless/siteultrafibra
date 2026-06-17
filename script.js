document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY HEADER & MOBILE NAV
       ========================================================================== */
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        mobileToggle.classList.toggle('active');
        
        // Animated hamburger state
        const spans = mobileToggle.querySelectorAll('span');
        if (navMenu.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileToggle.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       2. PLANS TOGGLE (RESIDENCIAL / CORPORATIVO)
       ========================================================================== */
    const btnResidencial = document.getElementById('btn-residencial');
    const btnCorporativo = document.getElementById('btn-corporativo');
    const plansGrid = document.querySelector('.plans-grid');

    const planData = {
        residencial: [
            {
                name: "Plano 300 Mega",
                price: "89", cents: ",90", period: "/mês",
                features: ["<strong>300 Mbps</strong> de Download", "<strong>150 Mbps</strong> de Upload (50% de taxa)", "Roteador Dual Band 5G Incluso", "Franquia Ilimitada de Dados", "Instalação Grátis"],
                ctaText: "Contratar Plano", ctaLink: "https://wa.me/5598999999999?text=Gostaria%20de%20contratar%20o%20Plano%20300%20Mega%20Residencial."
            },
            {
                name: "Plano 600 Mega",
                price: "99", cents: ",90", period: "/mês", featured: true,
                features: ["<strong>600 Mbps</strong> de Download", "<strong>300 Mbps</strong> de Upload", "Roteador Gigabit Dual Band Incluso", "Ideal para Home Office e Streaming 4K", "Franquia Ilimitada de Dados", "Suporte prioritário 24/7", "Instalação Expressa Grátis"],
                ctaText: "Contratar Plano", ctaLink: "https://wa.me/5598999999999?text=Gostaria%20de%20contratar%20o%20Plano%20600%20Mega%20Residencial."
            },
            {
                name: "Plano 1 Giga",
                price: "149", cents: ",90", period: "/mês",
                features: ["<strong>1000 Mbps (1GB)</strong> de Download", "<strong>500 Mbps</strong> de Upload", "Roteador Wi-Fi 6 de Última Geração", "Ideal para múltiplos aparelhos, games e lives", "Conexão ultra estável de baixíssima latência", "Suporte Técnico VIP", "Instalação VIP"],
                ctaText: "Contratar Plano", ctaLink: "https://wa.me/5598999999999?text=Gostaria%20de%20contratar%20o%20Plano%201%20Giga%20Residencial."
            },
            {
                name: "Plano Ultra TV",
                price: "189", cents: ",90", period: "/mês",
                features: ["<strong>600 Mbps</strong> de Fibra Óptica", "<strong>Mais de 200 Canais</strong> Digitais", "Acesso ao App Ultra TV em 3 telas", "Roteador Dual Band Gigabit", "Canais de Esportes, Filmes e Infantis", "Suporte VIP Especializado", "Instalação de TV Grátis"],
                ctaText: "Contratar Plano", ctaLink: "https://wa.me/5598999999999?text=Gostaria%20de%20contratar%20o%20Plano%20Ultra%20TV%20Residencial."
            }
        ],
        corporativo: [
            {
                name: "Ultra Link 300M",
                price: "149", cents: ",90", period: "/mês",
                features: ["<strong>300 Mbps</strong> Download & Upload", "<strong>IP Fixo Incluso</strong>", "Garantia de Banda 85%", "Roteador Corporativo High-Load", "Suporte 24h SLA de 4 horas", "Instalação Empresarial Grátis"],
                ctaText: "Contratar Link", ctaLink: "https://wa.me/5598999999999?text=Gostaria%20de%20contratar%20o%20Plano%20Corporativo%20300M."
            },
            {
                name: "Ultra Link 600M",
                price: "199", cents: ",90", period: "/mês", featured: true,
                features: ["<strong>600 Mbps</strong> Download & Upload", "<strong>IP Fixo Incluso</strong>", "Garantia de Banda 90%", "Roteador Corporativo com Balanceamento", "SLA prioritário 4h com suporte local", "Franquia Ilimitada de Tráfego", "Ativação Expressa Grátis"],
                ctaText: "Contratar Link", ctaLink: "https://wa.me/5598999999999?text=Gostaria%20de%20contratar%20o%20Plano%20Corporativo%20600M."
            },
            {
                name: "Ultra Link 1 Giga",
                price: "299", cents: ",90", period: "/mês",
                features: ["<strong>1000 Mbps (1GB)</strong> Simétricos", "<strong>IP Fixo Dedicado</strong>", "Garantia de Banda 95%", "Roteador Wi-Fi 6 de Alta Densidade", "Suporte VIP Atendimento SLA Reduzido", "Monitoramento de Conexão Ativo", "Instalação Estruturada VIP"],
                ctaText: "Contratar Link", ctaLink: "https://wa.me/5598999999999?text=Gostaria%20de%20contratar%20o%20Plano%20Corporativo%201GB."
            },
            {
                name: "Ultra Link + TV Corp",
                price: "349", cents: ",90", period: "/mês",
                features: ["<strong>600 Mbps</strong> Simétricos", "<strong>Canais Corporativos</strong> de Notícias e Esportes", "Licenciamento Comercial de TV", "IP Fixo Incluso", "Roteador Gigabit Incluso", "Atendimento prioritário 24/7", "Instalação de TV Grátis"],
                ctaText: "Contratar Link", ctaLink: "https://wa.me/5598999999999?text=Gostaria%20de%20contratar%20o%20Plano%20Corporativo%20TV."
            }
        ]
    };

    function renderPlans(type) {
        plansGrid.style.opacity = '0';
        plansGrid.style.transform = 'translateY(15px)';
        
        setTimeout(() => {
            plansGrid.innerHTML = '';
            planData[type].forEach(plan => {
                const card = document.createElement('div');
                card.className = `plan-card ${plan.featured ? 'featured' : ''} scroll-reveal active`;
                
                card.innerHTML = `
                    ${plan.featured ? '<div class="featured-badge">MAIS CONTRATADO</div>' : ''}
                    <div class="plan-header">
                        <h3>${plan.name}</h3>
                        <div class="plan-price">
                            <span class="currency">R$</span>
                            <span class="price">${plan.price}</span>
                            <span class="cents">${plan.cents}</span>
                            <span class="period">${plan.period}</span>
                        </div>
                        <p class="price-condition">${type === 'residencial' ? 'No pagamento recorrente via boleto ou cartão' : 'Link corporativo com garantia de banda'}</p>
                    </div>
                    
                    <div class="plan-features">
                        <ul>
                            ${plan.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="plan-cta">
                        <a href="${plan.ctaLink}" class="btn ${plan.featured ? 'btn-primary btn-glow' : 'btn-secondary'} btn-block" target="_blank" rel="noopener noreferrer">${plan.ctaText}</a>
                    </div>
                `;
                plansGrid.appendChild(card);
            });
            plansGrid.style.opacity = '1';
            plansGrid.style.transform = 'translateY(0)';
        }, 300);
    }

    btnResidencial.addEventListener('click', () => {
        btnResidencial.classList.add('active');
        btnCorporativo.classList.remove('active');
        renderPlans('residencial');
    });

    btnCorporativo.addEventListener('click', () => {
        btnCorporativo.classList.add('active');
        btnResidencial.classList.remove('active');
        renderPlans('corporativo');
    });

    /* ==========================================================================
       3. TV POR ASSINATURA (PREMIUM CATEGORIES)
       ========================================================================== */
    const tvCategories = document.getElementById('tv-categories');
    const tvCardsGrid = document.getElementById('tv-cards-grid');

    const tvData = {
        filmes: [
            { title: "Cine Ultra Max", tag: "Filme", url: "assets/images/mascot_tablet.png" },
            { title: "Interestelar 2", tag: "Ficção", url: "assets/images/mascot_notebook.png" },
            { title: "The Last Conect", tag: "Série", url: "assets/images/mascot_smartphone.png" }
        ],
        esportes: [
            { title: "Brasileirão Série A", tag: "Futebol", url: "assets/images/mascot_notebook.png" },
            { title: "Ultra Sports HD", tag: "Automobilismo", url: "assets/images/mascot_smartphone.png" },
            { title: "Finais da NBA Live", tag: "Basquete", url: "assets/images/mascot_tablet.png" }
        ],
        infantil: [
            { title: "Cartoon Ultra", tag: "Desenho", url: "assets/images/mascot_smartphone.png" },
            { title: "Disney Kids", tag: "Magia", url: "assets/images/mascot_tablet.png" },
            { title: "Aventuras Animadas", tag: "Animação", url: "assets/images/mascot_notebook.png" }
        ],
        documentarios: [
            { title: "Planeta Selvagem", tag: "Natureza", url: "assets/images/mascot_tablet.png" },
            { title: "Histórias do Espaço", tag: "Astronomia", url: "assets/images/mascot_notebook.png" },
            { title: "Grandes Civilizações", tag: "História", url: "assets/images/mascot_smartphone.png" }
        ],
        noticias: [
            { title: "CNN News Brasil", tag: "Jornalismo", url: "assets/images/mascot_smartphone.png" },
            { title: "Ultra Notícias 24h", tag: "Ao Vivo", url: "assets/images/mascot_tablet.png" },
            { title: "Mercado Financeiro", tag: "Economia", url: "assets/images/mascot_notebook.png" }
        ]
    };

    if (tvCategories) {
        tvCategories.addEventListener('click', (e) => {
            const btn = e.target.closest('.category-tab');
            if (!btn) return;
            
            // Remove active classes
            tvCategories.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            renderTVCards(category);
        });
    }

    function renderTVCards(category) {
        tvCardsGrid.style.opacity = '0';
        tvCardsGrid.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            tvCardsGrid.innerHTML = '';
            tvData[category].forEach(item => {
                const card = document.createElement('div');
                card.className = 'streaming-card';
                card.innerHTML = `
                    <div class="streaming-card-img" style="background: linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(6,15,30,0.95) 100%), url('${item.url}') center/cover;"></div>
                    <span class="card-tag">${item.tag}</span>
                    <h4>${item.title}</h4>
                `;
                tvCardsGrid.appendChild(card);
            });
            tvCardsGrid.style.opacity = '1';
            tvCardsGrid.style.transform = 'scale(1)';
        }, 250);
    }

    /* ==========================================================================
       4. CONSULTA DE COBERTURA (VIACEP INTEGRATION)
       ========================================================================== */
    const cepInput = document.getElementById('cep-input');
    const btnBuscarCep = document.getElementById('btn-buscar-cep');
    const cepError = document.getElementById('cep-error');
    
    const step1Content = document.getElementById('step-1-content');
    const step2Content = document.getElementById('step-2-content');
    const step3Content = document.getElementById('step-3-content');
    
    const step1Indicator = document.getElementById('step-1-indicator');
    const step2Indicator = document.getElementById('step-2-indicator');
    const step3Indicator = document.getElementById('step-3-indicator');
    
    const lblRua = document.getElementById('lbl-rua');
    const lblBairro = document.getElementById('lbl-bairro');
    const lblCidade = document.getElementById('lbl-cidade');
    const houseNumberInput = document.getElementById('house-number');
    
    const btnVoltarStep1 = document.getElementById('btn-voltar-step1');
    const btnVerificarViabilidade = document.getElementById('btn-verificar-viabilidade');
    
    const viabilidadeSucesso = document.getElementById('viabilidade-sucesso');
    const viabilidadeErro = document.getElementById('viabilidade-erro');
    const lblBairroSucesso = document.getElementById('lbl-bairro-sucesso');
    
    const btnReiniciarCep = document.getElementById('btn-reiniciar-cep');
    const btnVerPlanosViabilidade = document.getElementById('btn-ver-planos-viabilidade');

    // Input formatting for CEP (xxxxx-xxx)
    cepInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 5) {
            val = val.substring(0,5) + '-' + val.substring(5,8);
        }
        e.target.value = val;
    });

    btnBuscarCep.addEventListener('click', async () => {
        const rawCep = cepInput.value.replace(/\D/g, '');
        if (rawCep.length !== 8) {
            cepError.textContent = 'Por favor, insira um CEP válido com 8 dígitos.';
            return;
        }
        
        cepError.textContent = '';
        btnBuscarCep.disabled = true;
        btnBuscarCep.textContent = 'Buscando...';
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
            const data = await response.json();
            
            if (data.erro) {
                cepError.textContent = 'CEP não encontrado. Verifique os números.';
                btnBuscarCep.disabled = false;
                btnBuscarCep.textContent = 'Consultar CEP';
                return;
            }
            
            // Fill address preview fields
            lblRua.textContent = data.logradouro || 'Sem logradouro padrão (Zona Rural/Geral)';
            lblBairro.textContent = data.bairro || 'Geral/Centro';
            lblCidade.textContent = `${data.localidade} - ${data.uf}`;
            lblBairroSucesso.textContent = data.bairro || data.localidade;
            
            // Trigger UI transition to Step 2
            step1Content.classList.add('d-none');
            step2Content.classList.remove('d-none');
            step1Indicator.classList.remove('step-active');
            step2Indicator.classList.add('step-active');
            
            // Map pin pulse simulation update
            const mapPin = document.querySelector('.map-pin');
            if (mapPin) {
                mapPin.style.top = '35%';
                mapPin.style.left = '42%';
                mapPin.style.backgroundColor = '#FF007F';
                mapPin.style.boxShadow = '0 0 15px #FF007F';
            }
            
        } catch (error) {
            cepError.textContent = 'Ocorreu um erro ao conectar ao serviço de CEP. Tente novamente.';
            console.error(error);
        } finally {
            btnBuscarCep.disabled = false;
            btnBuscarCep.textContent = 'Consultar CEP';
        }
    });

    btnVoltarStep1.addEventListener('click', () => {
        step2Content.classList.add('d-none');
        step1Content.classList.remove('d-none');
        step2Indicator.classList.remove('step-active');
        step1Indicator.classList.add('step-active');
    });

    btnVerificarViabilidade.addEventListener('click', () => {
        if (!houseNumberInput.value.trim()) {
            alert('Por favor, informe o número da residência.');
            return;
        }
        
        btnVerificarViabilidade.disabled = true;
        btnVerificarViabilidade.textContent = 'Verificando...';
        
        // Simulating checking database backend (IXC/Hubsoft mock query)
        setTimeout(() => {
            step2Content.classList.add('d-none');
            step3Content.classList.remove('d-none');
            step2Indicator.classList.remove('step-active');
            step3Indicator.classList.add('step-active');
            
            // Simulate 90% success rate for local CEP check
            const isAvailable = Math.random() < 0.90;
            
            const mapPin = document.querySelector('.map-pin');
            if (isAvailable) {
                viabilidadeSucesso.classList.remove('d-none');
                viabilidadeErro.classList.add('d-none');
                if (mapPin) {
                    mapPin.style.backgroundColor = '#25D366';
                    mapPin.style.boxShadow = '0 0 18px #25D366';
                }
            } else {
                viabilidadeSucesso.classList.add('d-none');
                viabilidadeErro.classList.remove('d-none');
                if (mapPin) {
                    mapPin.style.backgroundColor = '#ff4d4d';
                    mapPin.style.boxShadow = '0 0 18px #ff4d4d';
                }
            }
            btnVerificarViabilidade.disabled = false;
            btnVerificarViabilidade.textContent = 'Confirmar Endereço';
        }, 1500);
    });

    btnReiniciarCep.addEventListener('click', () => {
        step3Content.classList.add('d-none');
        step1Content.classList.remove('d-none');
        step3Indicator.classList.remove('step-active');
        step1Indicator.classList.add('step-active');
        cepInput.value = '';
        houseNumberInput.value = '';
        document.getElementById('house-complement').value = '';
    });

    // Lista de espera signup click event handler
    const btnListaEspera = document.getElementById('btn-lista-espera');
    btnListaEspera.addEventListener('click', () => {
        const email = document.getElementById('waitlist-email').value;
        if (!email || !email.includes('@')) {
            alert('Por favor, informe um e-mail válido.');
            return;
        }
        alert('Cadastro realizado com sucesso na lista de espera! Enviaremos uma notificação no seu e-mail quando a fibra estiver disponível.');
        btnReiniciarCep.click();
    });

    /* ==========================================================================
       5. CENTRAL DO ASSINANTE (CLIENT MOCK PORTAL)
       ========================================================================== */
    const frmLogin = document.getElementById('frm-portal-login');
    const btnLogin = document.getElementById('btn-login-portal');
    const btnLogout = document.getElementById('btn-logout-portal');
    const loginView = document.getElementById('portal-login-view');
    const dashboardView = document.getElementById('portal-dashboard-view');
    const dashClientName = document.getElementById('dash-client-name');
    
    // Formatting CPF/CNPJ input
    const inputCpf = document.getElementById('portal-cpf');
    inputCpf.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) { // CPF format
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else { // CNPJ format
            value = value.substring(0, 14)
                         .replace(/^(\d{2})(\d)/, '$1.$2')
                         .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                         .replace(/\.(\d{3})(\d)/, '.$1/$2')
                         .replace(/(\d{4})(\d)/, '$1-$2');
        }
        e.target.value = value;
    });

    let currentCustomer = null;

    // Seletores de Subview da Central
    const subviewEl = document.getElementById('dashboard-subview');
    const subviewTitleEl = document.getElementById('subview-title');
    const subviewBodyEl = document.getElementById('subview-body');
    const dashGridEl = document.querySelector('.dash-grid');
    const dashActionsEl = document.querySelector('.dash-actions-grid');
    const btnBackDash = document.getElementById('btn-back-dash');

    function openSubview(title, htmlContent) {
        if (!subviewEl) return;
        subviewTitleEl.textContent = title;
        subviewBodyEl.innerHTML = htmlContent;
        
        dashGridEl.classList.add('d-none');
        dashActionsEl.classList.add('d-none');
        subviewEl.classList.remove('d-none');
    }

    function closeSubview() {
        if (!subviewEl) return;
        subviewEl.classList.add('d-none');
        dashGridEl.classList.remove('d-none');
        dashActionsEl.classList.remove('d-none');
    }

    if (btnBackDash) {
        btnBackDash.addEventListener('click', closeSubview);
    }

    // Busca de Faturas no Mikweb
    async function loadBillings(title) {
        openSubview(title, '<div class="text-center py-4 text-gray">Carregando faturas...</div>');
        try {
            const response = await fetch(`/api/mikweb?action=billings&customer_id=${currentCustomer.id}`);
            const data = await response.json();
            if (!data.success) {
                subviewBodyEl.innerHTML = `<div class="text-center text-danger py-4">Erro ao carregar faturas: ${data.error || 'Erro desconhecido'}</div>`;
                return;
            }
            
            const billings = data.billings || [];
            if (billings.length === 0) {
                subviewBodyEl.innerHTML = `<div class="text-center py-4 text-gray">Nenhuma fatura encontrada.</div>`;
                return;
            }

            let html = '<div class="billing-list">';
            billings.forEach(b => {
                const statusLower = (b.status || "Aberto").toLowerCase();
                const statusClass = statusLower === 'pago' ? 'status-pago' : 
                                    (statusLower === 'vencido' ? 'status-vencido' : 'status-aberto');
                
                const formattedDate = b.due_date ? b.due_date.split('-').reverse().join('/') : '--/--/----';
                const formattedVal = parseFloat(b.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                const displayStatus = statusLower === 'pago' ? 'Pago' : (statusLower === 'vencido' ? 'Vencido' : 'Pendente');
                
                html += `
                <div class="billing-item">
                     <div>
                         <div class="billing-info-title">Fatura #${b.id}</div>
                         <div class="billing-info-date">Vencimento: ${formattedDate}</div>
                     </div>
                     <div class="billing-value">${formattedVal}</div>
                     <div class="billing-status-badge ${statusClass}">${displayStatus}</div>
                     <div class="billing-actions">
                `;
                
                if (statusLower !== 'pago') {
                    if (b.pix_code) {
                        html += `
                            <button class="btn-billing-action btn-copy-pix" data-pix="${b.pix_code}" title="Copiar PIX Copia e Cola">
                                🔑
                            </button>
                        `;
                    }
                    if (b.pdf_url && b.pdf_url !== '#') {
                        html += `
                            <a href="${b.pdf_url}" target="_blank" class="btn-billing-action" title="Visualizar Boleto PDF">
                                📄
                            </a>
                        `;
                    }
                } else {
                    const formattedPayDate = b.payment_date ? b.payment_date.split('-').reverse().join('/') : formattedDate;
                    html += `<span style="font-size: 0.8rem; color: #25d366; font-weight: 600;">Pago em ${formattedPayDate}</span>`;
                }
                
                html += `
                     </div>
                </div>
                `;
            });
            html += '</div>';
            subviewBodyEl.innerHTML = html;

            // Lógica de cópia do Pix
            subviewBodyEl.querySelectorAll('.btn-copy-pix').forEach(btn => {
                btn.addEventListener('click', () => {
                    const pix = btn.dataset.pix;
                    navigator.clipboard.writeText(pix).then(() => {
                        alert('Código PIX Copia e Cola copiado com sucesso! Use no aplicativo do seu banco.');
                    }).catch(err => {
                        alert('Erro ao copiar Pix: ' + err);
                    });
                });
            });

        } catch (error) {
            subviewBodyEl.innerHTML = `<div class="text-center text-danger py-4">Erro de conexão: ${error.message}</div>`;
        }
    }

    // Busca de Chamados Técnicos no Mikweb
    async function loadTickets() {
        openSubview("Chamados Técnicos", '<div class="text-center py-4 text-gray">Carregando chamados...</div>');
        try {
            const response = await fetch(`/api/mikweb?action=tickets&customer_id=${currentCustomer.id}`);
            const data = await response.json();
            if (!data.success) {
                subviewBodyEl.innerHTML = `<div class="text-center text-danger py-4">Erro ao buscar chamados: ${data.error || 'Erro desconhecido'}</div>`;
                return;
            }

            const tickets = data.tickets || [];
            let ticketsHtml = '';
            
            if (tickets.length === 0) {
                ticketsHtml = '<div class="text-center py-4 text-gray">Nenhum chamado de suporte registrado.</div>';
            } else {
                ticketsHtml = '<div class="ticket-list">';
                tickets.forEach(t => {
                    const statusLower = (t.status || "Aberto").toLowerCase();
                    const statusClass = statusLower === 'aberto' ? 'ticket-status-aberto' : 
                                        (statusLower === 'respondido' ? 'ticket-status-respondido' : 'ticket-status-finalizado');
                    const displayStatus = statusLower === 'aberto' ? 'Aberto' : (statusLower === 'respondido' ? 'Respondido' : 'Finalizado');
                    const date = new Date(t.created_at).toLocaleDateString('pt-BR');
                    
                    ticketsHtml += `
                    <div class="ticket-item">
                        <div class="ticket-header-info">
                            <span class="ticket-subject">${t.subject}</span>
                            <span class="ticket-status-badge ${statusClass}">${displayStatus}</span>
                        </div>
                        <p class="ticket-message">${t.message}</p>
                        <div class="ticket-date" style="margin-top: 8px;">Aberto em: ${date}</div>
                    </div>
                    `;
                });
                ticketsHtml += '</div>';
            }

            // Formulário de Abertura de Chamado
            const formHtml = `
                ${ticketsHtml}
                <div class="support-new-ticket">
                    <h4>Abrir Novo Chamado</h4>
                    <form id="frm-new-ticket" onsubmit="return false;">
                        <div class="form-group">
                            <label for="ticket-subject-input">Assunto / Motivo</label>
                            <input type="text" id="ticket-subject-input" placeholder="Ex: Lentidão no Wi-Fi, Queda de sinal, Alterar plano" required>
                        </div>
                        <div class="form-group">
                            <label for="ticket-message-input">Mensagem / Detalhes</label>
                            <textarea id="ticket-message-input" rows="3" placeholder="Descreva sua solicitação detalhadamente para nossa equipe técnica..." required></textarea>
                        </div>
                        <button type="submit" id="btn-submit-ticket" class="btn btn-primary btn-block btn-glow">Enviar Chamado</button>
                    </form>
                </div>
            `;

            subviewBodyEl.innerHTML = formHtml;

            // Submit do Chamado
            const frmTicket = document.getElementById('frm-new-ticket');
            const btnSubmitTicket = document.getElementById('btn-submit-ticket');
            
            if (frmTicket) {
                frmTicket.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const subject = document.getElementById('ticket-subject-input').value.trim();
                    const message = document.getElementById('ticket-message-input').value.trim();
                    
                    if (!subject || !message) return;
                    
                    btnSubmitTicket.disabled = true;
                    btnSubmitTicket.textContent = 'Enviando Chamado...';
                    
                    try {
                         const postRes = await fetch('/api/mikweb?action=create_ticket', {
                             method: 'POST',
                             headers: { 'Content-Type': 'application/json' },
                             body: JSON.stringify({
                                 customer_id: currentCustomer.id,
                                 subject,
                                 message
                             })
                         });
                         const postData = await postRes.json();
                         if (postData.success) {
                             alert('Chamado aberto com sucesso! Nossa equipe técnica dará retorno em breve.');
                             loadTickets(); // Atualiza a listagem
                         } else {
                             alert('Erro ao abrir chamado: ' + (postData.error || 'Erro desconhecido'));
                             btnSubmitTicket.disabled = false;
                             btnSubmitTicket.textContent = 'Enviar Chamado';
                         }
                    } catch(err) {
                         alert('Erro de conexão ao abrir chamado: ' + err.message);
                         btnSubmitTicket.disabled = false;
                         btnSubmitTicket.textContent = 'Enviar Chamado';
                    }
                });
            }

        } catch (error) {
            subviewBodyEl.innerHTML = `<div class="text-center text-danger py-4">Erro de rede: ${error.message}</div>`;
        }
    }

    btnLogin.addEventListener('click', async () => {
        const cpf = inputCpf.value;
        const pass = document.getElementById('portal-password').value;
        
        if (!cpf || pass.length < 4) {
            alert('Por favor, informe um CPF e senha válidos.');
            return;
        }
        
        btnLogin.disabled = true;
        btnLogin.textContent = 'Verificando Credenciais...';
        
        try {
            const cleanCpf = cpf.replace(/\D/g, '');
            const response = await fetch(`/api/mikweb?action=login&cpf=${cleanCpf}&password=${encodeURIComponent(pass)}`);
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                alert(data.error || 'Falha na autenticação. Verifique os dados.');
                btnLogin.disabled = false;
                btnLogin.textContent = 'Entrar na Central';
                return;
            }
            
            // Sucesso no login
            currentCustomer = data.customer;
            
            // Popula os elementos do painel dinamicamente
            dashClientName.textContent = currentCustomer.full_name;
            
            const planNameEl = document.getElementById('dash-plan-name');
            const planStatusEl = document.getElementById('dash-plan-status');
            const dueDayEl = document.getElementById('dash-due-day');
            
            if (planNameEl) planNameEl.textContent = currentCustomer.login ? currentCustomer.login.toUpperCase() : "PLANO ULTRA";
            if (planStatusEl) planStatusEl.textContent = `Status: ${currentCustomer.status || "Ativo"}`;
            if (dueDayEl) dueDayEl.textContent = `Dia ${currentCustomer.due_day || 10}`;
            
            // Transição visual para o dashboard
            loginView.classList.add('d-none');
            dashboardView.classList.remove('d-none');
            closeSubview(); // Garante que começa na tela inicial do dashboard

        } catch (err) {
            console.error(err);
            alert('Ocorreu um erro na conexão com a Central. Verifique sua conexão.');
        } finally {
            btnLogin.disabled = false;
            btnLogin.textContent = 'Entrar na Central';
        }
    });

    btnLogout.addEventListener('click', () => {
        currentCustomer = null;
        dashboardView.classList.add('d-none');
        loginView.classList.remove('d-none');
        inputCpf.value = '';
        document.getElementById('portal-password').value = '';
        closeSubview();
    });

    // Vincula ações dos botões aos novos endpoints dinâmicos
    document.getElementById('btn-dash-2via').addEventListener('click', () => {
        loadBillings("Segunda Via de Fatura");
    });

    document.getElementById('btn-dash-pagamento').addEventListener('click', () => {
        loadBillings("Faturas Pendentes");
    });

    document.getElementById('btn-dash-historico').addEventListener('click', () => {
        loadBillings("Histórico Financeiro");
    });

    document.getElementById('btn-dash-suporte').addEventListener('click', () => {
        loadTickets();
    });

    document.getElementById('btn-dash-cadastro').addEventListener('click', () => {
        const infoText = `Seus dados cadastrais atuais:\n\n` +
                         `- Nome: ${currentCustomer.full_name}\n` +
                         `- CPF/CNPJ: ${currentCustomer.cpf_cnpj}\n` +
                         `- Login Conexão: ${currentCustomer.login || 'Não cadastrado'}\n\n` +
                         `Para solicitar alteração de endereço ou e-mail, entre em contato via WhatsApp com nossa equipe de atendimento comercial.`;
        alert(infoText);
    });

    document.getElementById('btn-dash-senha').addEventListener('click', () => {
        alert('Para alterar sua senha da Central do Assinante ou de conexão PPPoE, por favor, fale com nosso suporte técnico no canal de atendimento local.');
    });

    /* ==========================================================================
       6. INTERACTIVE SMAED TEST (VELOCÍMETRO)
       ========================================================================== */
    const btnStartSpeed = document.getElementById('btn-start-speedtest');
    const speedDisplay = document.getElementById('speed-value-display');
    const statusDisplay = document.getElementById('speed-status-display');
    const needle = document.getElementById('speed-needle');
    
    const statPing = document.getElementById('stat-ping');
    const statJitter = document.getElementById('stat-jitter');
    const statDownload = document.getElementById('stat-download');
    const statUpload = document.getElementById('stat-upload');

    // Maps speed (0 - 1000) to needle rotation (-120deg to 120deg)
    function setNeedleSpeed(mbps) {
        let deg = -120; // Default zero
        if (mbps <= 100) {
            deg = -120 + (mbps * 0.6); // -120 to -60
        } else if (mbps <= 300) {
            deg = -60 + ((mbps - 100) * 0.3); // -60 to 0
        } else if (mbps <= 600) {
            deg = 0 + ((mbps - 300) * 0.2); // 0 to 60
        } else {
            deg = 60 + ((mbps - 600) * 0.15); // 60 to 120 (Max 1000)
        }
        
        // Safety bound
        if (deg > 120) deg = 120;
        needle.style.setProperty('--rotate-needle', `${deg}deg`);
    }

    btnStartSpeed.addEventListener('click', () => {
        btnStartSpeed.disabled = true;
        btnStartSpeed.textContent = 'TESTANDO...';
        
        // Reset stats
        statPing.textContent = '--';
        statJitter.textContent = '--';
        statDownload.textContent = '--';
        statUpload.textContent = '--';
        speedDisplay.textContent = '0.0';
        setNeedleSpeed(0);
        
        // Flow of simulation steps
        setTimeout(() => {
            statusDisplay.textContent = 'CONECTANDO AO SERVIDOR...';
            setNeedleSpeed(25);
            speedDisplay.textContent = '25.0';
        }, 1000);

        setTimeout(() => {
            statusDisplay.textContent = 'MEDINDO PING E JITTER...';
            const pingVal = Math.floor(Math.random() * 5) + 3; // 3ms - 7ms
            const jitterVal = Math.floor(Math.random() * 2) + 1; // 1ms - 2ms
            statPing.textContent = pingVal;
            statJitter.textContent = jitterVal;
            setNeedleSpeed(0);
            speedDisplay.textContent = '0.0';
        }, 2200);

        // Download Stage
        setTimeout(() => {
            statusDisplay.textContent = 'MEDINDO DOWNLOAD...';
            
            let currentDownload = 0;
            const targetDownload = 612.4 + (Math.random() * 15 - 7); // ~612 Mbps
            const downloadInterval = setInterval(() => {
                // Add jitter
                currentDownload += Math.random() * 80 + 30;
                if (currentDownload >= targetDownload) {
                    currentDownload = targetDownload;
                    clearInterval(downloadInterval);
                    
                    // Final Download write
                    statDownload.textContent = currentDownload.toFixed(1);
                    
                    // Transition to Upload Stage after pause
                    setTimeout(startUploadStage, 1500);
                }
                speedDisplay.textContent = currentDownload.toFixed(1);
                setNeedleSpeed(currentDownload);
            }, 100);
        }, 4000);

        function startUploadStage() {
            statusDisplay.textContent = 'MEDINDO UPLOAD...';
            setNeedleSpeed(0);
            speedDisplay.textContent = '0.0';
            
            setTimeout(() => {
                let currentUpload = 0;
                const targetUpload = 308.2 + (Math.random() * 10 - 5); // ~308 Mbps
                const uploadInterval = setInterval(() => {
                    currentUpload += Math.random() * 50 + 20;
                    if (currentUpload >= targetUpload) {
                        currentUpload = targetUpload;
                        clearInterval(uploadInterval);
                        
                        // Final Upload write
                        statUpload.textContent = currentUpload.toFixed(1);
                        
                        // Complete Speedtest
                        setTimeout(completeSpeedTest, 1500);
                    }
                    speedDisplay.textContent = currentUpload.toFixed(1);
                    setNeedleSpeed(currentUpload);
                }, 100);
            }, 1000);
        }

        function completeSpeedTest() {
            statusDisplay.textContent = 'TESTE CONCLUÍDO COM SUCESSO';
            setNeedleSpeed(0);
            speedDisplay.textContent = '0.0';
            
            btnStartSpeed.disabled = false;
            btnStartSpeed.textContent = 'RECOMEÇAR TESTE';
        }
    });

    /* ==========================================================================
       7. PROGRAMA INDIQUE E GANHE (REWARDS TRACKER)
       ========================================================================== */
    const frmReferral = document.getElementById('frm-referral');
    const btnSubmitReferral = document.getElementById('btn-submit-referral');
    const rewardsProgressFill = document.getElementById('rewards-progress-fill');
    const rewardsTotalValue = document.getElementById('rewards-total-value');
    
    let activeReferrals = 0;

    btnSubmitReferral.addEventListener('click', () => {
        const yourCpf = document.getElementById('ref-your-cpf').value;
        const friendName = document.getElementById('ref-friend-name').value;
        const friendPhone = document.getElementById('ref-friend-phone').value;
        
        if (!yourCpf || !friendName || !friendPhone) {
            alert('Por favor, preencha todos os campos do formulário.');
            return;
        }
        
        btnSubmitReferral.disabled = true;
        btnSubmitReferral.textContent = 'Enviando Indicação...';
        
        setTimeout(() => {
            activeReferrals++;
            alert(`Indicação de ${friendName} registrada com sucesso!\nNossos consultores entrarão em contato.`);
            
            // Update rewards tracker graphical bar
            let fillPercent = 0;
            let cashTotal = 'R$ 0,00';
            
            if (activeReferrals === 1) {
                fillPercent = 50;
                cashTotal = 'R$ 50,00';
            } else if (activeReferrals >= 2) {
                fillPercent = 100;
                cashTotal = `R$ ${activeReferrals * 50},00`;
            }
            
            rewardsProgressFill.style.width = `${fillPercent}%`;
            rewardsTotalValue.textContent = cashTotal;
            
            // Clean fields
            document.getElementById('ref-friend-name').value = '';
            document.getElementById('ref-friend-phone').value = '';
            
            btnSubmitReferral.disabled = false;
            btnSubmitReferral.textContent = 'Enviar Indicação';
        }, 1200);
    });

    /* ==========================================================================
       8. TESTIMONIALS CAROUSEL
       ========================================================================== */
    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentIndex = 0;

    function moveToSlide(index) {
        if (track) {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        }
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            moveToSlide(index);
        });
    });

    // Auto loop slide every 8s
    setInterval(() => {
        if (track) {
            let next = currentIndex + 1;
            if (next >= dots.length) next = 0;
            moveToSlide(next);
        }
    }, 8000);

    /* ==========================================================================
       9. BLOG FILTERS
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            blogCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('d-none');
                } else {
                    card.classList.add('d-none');
                }
            });
        });
    });

    /* ==========================================================================
       10. FAQ ACCORDION
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = item.querySelector('.accordion-body');
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.accordion-item').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.accordion-body').style.maxHeight = '0';
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                body.style.maxHeight = `${body.scrollHeight}px`;
            }
        });
    });

    /* ==========================================================================
       11. CONTACT FORM
       ========================================================================== */
    const frmContact = document.getElementById('frm-contact');
    const btnSendContact = document.getElementById('btn-send-contact');

    btnSendContact.addEventListener('click', () => {
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const phone = document.getElementById('contact-phone').value;
        const msg = document.getElementById('contact-message').value;
        
        if (!name || !email || !phone || !msg) {
            alert('Por favor, preencha todos os campos do formulário de contato.');
            return;
        }
        
        btnSendContact.disabled = true;
        btnSendContact.textContent = 'Enviando...';
        
        setTimeout(() => {
            alert(`Obrigado, ${name}! Sua mensagem foi enviada. Responderemos em breve.`);
            frmContact.reset();
            btnSendContact.disabled = false;
            btnSendContact.textContent = 'Enviar Mensagem';
        }, 1200);
    });

    /* ==========================================================================
       12. NATIVE SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Element is 10% visible
        rootMargin: '0px 0px -50px 0px' // Reveal slightly before element enters view
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Execute first plans render on load
    renderPlans('residencial');
    // First tv category render on load
    renderTVCards('filmes');

    /* ==========================================================================
       13. REGISTRATION MODAL LOGIC
       ========================================================================== */
    const registerModal = document.getElementById('register-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const frmRegister = document.getElementById('frm-register');
    const registerSuccess = document.getElementById('register-success');
    const btnSubmitRegister = document.getElementById('btn-submit-register');
    
    const regCep = document.getElementById('reg-cep');
    const regAddressInfo = document.getElementById('reg-address-info');
    const regLblRua = document.getElementById('reg-lbl-rua');
    const regLblBairro = document.getElementById('reg-lbl-bairro');
    const regLblCidade = document.getElementById('reg-lbl-cidade');
    
    // Open Modal Function
    window.openRegisterModal = function(planName) {
        if (!registerModal) return;
        
        // Reset state
        frmRegister.classList.remove('d-none');
        registerSuccess.classList.add('d-none');
        frmRegister.reset();
        regAddressInfo.classList.add('d-none');
        
        // Select matching plan in select list if passed
        const planSelect = document.getElementById('reg-plan');
        if (planName) {
            // Find option value that matches or contains the planName
            let found = false;
            for (let option of planSelect.options) {
                if (option.value.toLowerCase().includes(planName.toLowerCase()) || 
                    planName.toLowerCase().includes(option.value.toLowerCase())) {
                    planSelect.value = option.value;
                    found = true;
                    break;
                }
            }
            if (!found) {
                planSelect.value = "";
            }
        } else {
            planSelect.value = "";
        }
        
        // Pre-populate address if CEP check has been run in Coverage section
        const coverageCep = document.getElementById('cep-input').value;
        const coverageNum = document.getElementById('house-number').value;
        
        if (coverageCep) {
            regCep.value = coverageCep;
            const street = document.getElementById('lbl-rua').textContent;
            const neighborhood = document.getElementById('lbl-bairro').textContent;
            const city = document.getElementById('lbl-cidade').textContent;
            
            if (street && street !== '-') {
                regLblRua.textContent = street;
                regLblBairro.textContent = neighborhood;
                regLblCidade.textContent = city;
                regAddressInfo.classList.remove('d-none');
            }
        }
        if (coverageNum) {
            document.getElementById('reg-number').value = coverageNum;
        }
        
        registerModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
    }
    
    // Close Modal Function
    window.closeRegisterModal = function() {
        if (!registerModal) return;
        registerModal.classList.remove('open');
        document.body.style.overflow = ''; // Restore page scrolling
    }
    
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', closeRegisterModal);
    }
    
    // Close when clicking outside modal container
    if (registerModal) {
        registerModal.addEventListener('click', (e) => {
            if (e.target === registerModal) {
                closeRegisterModal();
            }
        });
    }
    
    // Event delegation on plans grid CTA click
    if (plansGrid) {
        plansGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-block');
            if (btn) {
                e.preventDefault();
                const card = btn.closest('.plan-card');
                if (card) {
                    const planName = card.querySelector('.plan-header h3').textContent.trim();
                    window.openRegisterModal(planName);
                }
            }
        });
    }
    
    // Header CTA click
    const navCta = document.getElementById('nav-cta');
    if (navCta) {
        navCta.addEventListener('click', (e) => {
            e.preventDefault();
            window.openRegisterModal();
        });
    }
    
    // CPF input mask (000.000.000-00)
    const regCpf = document.getElementById('reg-cpf');
    if (regCpf) {
        regCpf.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length <= 11) {
                val = val.replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            e.target.value = val;
        });
    }
    
    // CEP input formatting inside modal
    if (regCep) {
        regCep.addEventListener('input', async (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 5) {
                val = val.substring(0,5) + '-' + val.substring(5,8);
            }
            e.target.value = val;
            
            const rawCep = val.replace(/\D/g, '');
            if (rawCep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
                    const data = await response.json();
                    
                    if (!data.erro) {
                        regLblRua.textContent = data.logradouro || 'Rua não cadastrada';
                        regLblBairro.textContent = data.bairro || 'Bairro Geral';
                        regLblCidade.textContent = `${data.localidade} - ${data.uf}`;
                        regAddressInfo.classList.remove('d-none');
                    } else {
                        regAddressInfo.classList.add('d-none');
                    }
                } catch (err) {
                    console.error(err);
                    regAddressInfo.classList.add('d-none');
                }
            } else {
                regAddressInfo.classList.add('d-none');
            }
        });
    }
    
    // Submit registration modal form
    if (frmRegister) {
        frmRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const cpfVal = regCpf ? regCpf.value : '';
            const name = document.getElementById('reg-name').value;
            const phone = document.getElementById('reg-phone').value;
            const cep = regCep.value;
            const num = document.getElementById('reg-number').value;
            const plan = document.getElementById('reg-plan').value;
            const street = regAddressInfo.classList.contains('d-none') ? 'Não informado' : regLblRua.textContent;
            const neighborhood = regAddressInfo.classList.contains('d-none') ? 'Não informado' : regLblBairro.textContent;
            const city = regAddressInfo.classList.contains('d-none') ? 'Não informado' : regLblCidade.textContent;
            
            btnSubmitRegister.disabled = true;
            btnSubmitRegister.textContent = 'Enviando...';
            
            setTimeout(() => {
                frmRegister.classList.add('d-none');
                registerSuccess.classList.remove('d-none');
                
                document.getElementById('success-user-name').textContent = name;
                document.getElementById('success-user-phone').textContent = phone;
                
                btnSubmitRegister.disabled = false;
                btnSubmitRegister.textContent = 'Enviar e Finalizar Cadastro';
                
                // Save WhatsApp redirect logic on checkmark CTA click
                const messageText = `Olá Ultra Fibra! Acabei de preencher o cadastro de interesse no site.\n\n` +
                                    `*Nome:* ${name}\n` +
                                    `*CPF:* ${cpfVal}\n` +
                                    `*Telefone:* ${phone}\n` +
                                    `*Plano:* ${plan}\n` +
                                    `*CEP:* ${cep}\n` +
                                    `*Endereço:* ${street}, Nº ${num} - ${neighborhood}, ${city}`;
                const encodedMsg = encodeURIComponent(messageText);
                const whatsappUrl = `https://wa.me/5598999999999?text=${encodedMsg}`;
                
                const btnSuccessClose = document.getElementById('btn-success-close');
                
                // Clear old listeners if any
                const newBtn = btnSuccessClose.cloneNode(true);
                btnSuccessClose.parentNode.replaceChild(newBtn, btnSuccessClose);
                
                newBtn.addEventListener('click', () => {
                    window.open(whatsappUrl, '_blank');
                    window.closeRegisterModal();
                });
                
            }, 1200);
        });
    }

});
