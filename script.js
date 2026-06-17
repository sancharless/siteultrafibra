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

    btnLogin.addEventListener('click', () => {
        const cpf = inputCpf.value;
        const pass = document.getElementById('portal-password').value;
        
        if (!cpf || pass.length < 4) {
            alert('Por favor, informe um CPF e senha válidos.');
            return;
        }
        
        btnLogin.disabled = true;
        btnLogin.textContent = 'Verificando Credenciais...';
        
        setTimeout(() => {
            // Success simulation
            loginView.classList.add('d-none');
            dashboardView.classList.remove('d-none');
            dashClientName.textContent = 'Joseph Nascimento';
            btnLogin.disabled = false;
            btnLogin.textContent = 'Entrar na Central';
        }, 1200);
    });

    btnLogout.addEventListener('click', () => {
        dashboardView.classList.add('d-none');
        loginView.classList.remove('d-none');
        inputCpf.value = '';
        document.getElementById('portal-password').value = '';
    });

    // Bind simulated actions inside Dashboard
    document.getElementById('btn-dash-2via').addEventListener('click', () => {
        alert('Carregando 2ª Via da Fatura...\nCódigo de Barras PIX Gerado com sucesso:\n00020101021226870014br.gov.bcb.pix2565pix.ultrafibra.com.br/faturas/25684391');
    });

    document.getElementById('btn-dash-pagamento').addEventListener('click', () => {
        alert('Sem faturas em aberto! Seu plano de 600 MEGA está quitado até o próximo vencimento.');
    });

    document.getElementById('btn-dash-historico').addEventListener('click', () => {
        alert('Histórico Financeiro:\n- Fatura Junho/2026: R$ 99,90 [PAGO]\n- Fatura Maio/2026: R$ 99,90 [PAGO]\n- Fatura Abril/2026: R$ 99,90 [PAGO]');
    });

    document.getElementById('btn-dash-suporte').addEventListener('click', () => {
        alert('Chamados Técnicos:\nNenhum incidente ou chamado técnico registrado. Sua conexão de fibra óptica está com sinal estável de +18dBm.');
    });

    document.getElementById('btn-dash-cadastro').addEventListener('click', () => {
        alert('Redirecionando para atualização cadastral...\n(Nome, Endereço de Instalação e E-mail confirmados).');
    });

    document.getElementById('btn-dash-senha').addEventListener('click', () => {
        const nova = prompt('Informe sua nova senha da Central:');
        if (nova) {
            alert('Senha alterada com sucesso!');
        }
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
        
        // Reset CPF states
        const modalHiddenFields = document.getElementById('modal-hidden-fields');
        const cpfValidationMsg = document.getElementById('cpf-validation-msg');
        const cpfSearchSpinner = document.getElementById('cpf-search-spinner');
        const regCpf = document.getElementById('reg-cpf');
        
        if (modalHiddenFields) {
            modalHiddenFields.classList.add('d-none');
            modalHiddenFields.classList.remove('fade-in-form-group');
        }
        if (cpfValidationMsg) {
            cpfValidationMsg.textContent = '';
            cpfValidationMsg.className = 'validation-msg';
        }
        if (cpfSearchSpinner) {
            cpfSearchSpinner.classList.add('d-none');
        }
        if (regCpf) {
            regCpf.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        }
        
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
    
    // CPF Mathematical Validation
    function validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        
        // Sequence of identical digits check
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }
    
    // CPF input mask and check query
    const regCpf = document.getElementById('reg-cpf');
    const cpfSearchSpinner = document.getElementById('cpf-search-spinner');
    const cpfValidationMsg = document.getElementById('cpf-validation-msg');
    const modalHiddenFields = document.getElementById('modal-hidden-fields');
    const regName = document.getElementById('reg-name');
    
    if (regCpf) {
        regCpf.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length <= 11) {
                val = val.replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            e.target.value = val;
            
            const cleanCpf = val.replace(/\D/g, '');
            
            if (cleanCpf.length < 11) {
                modalHiddenFields.classList.add('d-none');
                modalHiddenFields.classList.remove('fade-in-form-group');
                cpfValidationMsg.textContent = '';
                cpfValidationMsg.className = 'validation-msg';
                cpfSearchSpinner.classList.add('d-none');
                regCpf.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                return;
            }
            
            if (validateCPF(cleanCpf)) {
                // Show loading
                cpfValidationMsg.textContent = 'Consultando Receita Federal e base do Governo...';
                cpfValidationMsg.className = 'validation-msg loading';
                cpfSearchSpinner.classList.remove('d-none');
                regCpf.style.borderColor = 'var(--primary-orange)';
                
                setTimeout(() => {
                    cpfSearchSpinner.classList.add('d-none');
                    
                    const mockNames = [
                        "Joseph Nascimento",
                        "Maria Silva Oliveira",
                        "Carlos Eduardo Souza",
                        "Ana Julia Santos",
                        "Lucas Ferreira Lima",
                        "Amanda Costa Ribeiro",
                        "Roberto Alves Pereira",
                        "Camila Rodrigues Mello",
                        "Bruno Carvalho Gomes",
                        "Juliana Barbosa Rocha"
                    ];
                    const lastDigit = parseInt(cleanCpf.charAt(10));
                    const selectedName = mockNames[lastDigit];
                    
                    regName.value = selectedName;
                    
                    cpfValidationMsg.textContent = `✓ CPF Confirmado! Titular: ${selectedName}`;
                    cpfValidationMsg.className = 'validation-msg success';
                    regCpf.style.borderColor = '#25D366';
                    
                    modalHiddenFields.classList.remove('d-none');
                    modalHiddenFields.classList.add('fade-in-form-group');
                }, 1200);
            } else {
                cpfValidationMsg.textContent = '❌ CPF inválido. Verifique os dígitos.';
                cpfValidationMsg.className = 'validation-msg error';
                regCpf.style.borderColor = '#ff4d4d';
                modalHiddenFields.classList.add('d-none');
                modalHiddenFields.classList.remove('fade-in-form-group');
                cpfSearchSpinner.classList.add('d-none');
            }
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
            
            const cpfVal = regCpf.value;
            const name = regName.value;
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
