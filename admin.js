document.addEventListener('DOMContentLoaded', () => {

    // ELEMENTOS DA TELA DE LOGIN
    const loginContainer = document.getElementById('login-container');
    const frmLoginAdmin = document.getElementById('frm-login-admin');
    const adminUser = document.getElementById('admin-user');
    const adminPass = document.getElementById('admin-pass');
    const loginError = document.getElementById('login-error');
    const btnLoginSubmit = document.getElementById('btn-login-submit');

    // ELEMENTOS DO DASHBOARD
    const adminDashboard = document.getElementById('admin-dashboard');
    const botStatusIndicator = document.getElementById('bot-status-indicator');
    const chkBotToggle = document.getElementById('chk-bot-toggle');
    const contactListEl = document.getElementById('contact-list');
    const activeChatName = document.getElementById('active-chat-name');
    const activeChatPhone = document.getElementById('active-chat-phone');
    const messageHistoryEl = document.getElementById('message-history');
    const operatorMessageInput = document.getElementById('operator-message-input');
    const btnSendOperator = document.getElementById('btn-send-operator');
    const frmSendOperator = document.getElementById('frm-send-operator');
    const btnLogout = document.getElementById('btn-logout');

    // ELEMENTOS DO SIMULADOR
    const btnOpenSimulator = document.getElementById('btn-open-simulator');
    const btnCloseSimulator = document.getElementById('btn-close-simulator');
    const simulatorModal = document.getElementById('simulator-modal');
    const simPhoneInput = document.getElementById('sim-phone');
    const simNameInput = document.getElementById('sim-name');
    const simMessagesPreview = document.getElementById('sim-messages-preview');
    const simMessageInput = document.getElementById('sim-message-input');
    const frmSimulatorSend = document.getElementById('frm-simulator-send');
    const btnQuickReplies = document.querySelectorAll('.btn-quick-reply');

    let adminToken = sessionStorage.getItem('adminToken') || '';
    let currentActivePhone = '';
    let pollIntervalId = null;

    // --- CONTROLES DE FLUXO E LOGIN ---

    if (adminToken) {
        showDashboard();
    }

    frmLoginAdmin.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        btnLoginSubmit.disabled = true;
        btnLoginSubmit.textContent = 'Verificando...';
        loginError.classList.add('d-none');

        try {
            const res = await fetch('/api/whatsapp?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: adminUser.value,
                    password: adminPass.value
                })
            });

            const data = await res.json();
            
            if (data.success && data.token) {
                adminToken = data.token;
                sessionStorage.setItem('adminToken', adminToken);
                showDashboard();
            } else {
                loginError.textContent = data.error || 'Usuário ou senha administrativa inválidos.';
                loginError.classList.remove('d-none');
            }
        } catch (err) {
            console.error(err);
            loginError.textContent = 'Erro ao conectar no servidor administrativo.';
            loginError.classList.remove('d-none');
        } finally {
            btnLoginSubmit.disabled = false;
            btnLoginSubmit.textContent = 'Acessar Painel';
        }
    });

    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('adminToken');
        adminToken = '';
        currentActivePhone = '';
        clearInterval(pollIntervalId);
        
        adminDashboard.classList.add('d-none');
        loginContainer.classList.remove('d-none');
        
        adminUser.value = '';
        adminPass.value = '';
    });

    function showDashboard() {
        loginContainer.classList.add('d-none');
        adminDashboard.classList.remove('d-none');
        
        loadStateFromServer();
        
        // Inicia pooling de monitoramento em tempo real (a cada 3s)
        pollIntervalId = setInterval(loadStateFromServer, 3000);
    }

    // --- CONSUMO DE DADOS DO BACKEND ---

    async function loadStateFromServer() {
        if (!adminToken) return;

        try {
            const res = await fetch('/api/whatsapp?action=get_state', {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });

            if (res.status === 401) {
                // Token expirado ou inválido
                btnLogout.click();
                return;
            }

            const data = await res.json();
            if (data.success) {
                // Atualiza o estado do switch do robô
                chkBotToggle.checked = data.botEnabled;
                if (data.botEnabled) {
                    botStatusIndicator.textContent = 'ATIVO';
                    botStatusIndicator.classList.add('active');
                } else {
                    botStatusIndicator.textContent = 'INATIVO';
                    botStatusIndicator.classList.remove('active');
                }

                // Renderiza a lista de conversas
                renderContactsList(data.chats);
                
                // Atualiza o chat ativo se houver
                if (currentActivePhone) {
                    const activeChat = data.chats.find(c => c.phone === currentActivePhone);
                    if (activeChat) {
                        renderActiveChat(activeChat);
                    }
                }
            }
        } catch (err) {
            console.error("Erro ao sincronizar com o servidor:", err);
        }
    }

    function renderContactsList(chats) {
        contactListEl.innerHTML = '';
        
        if (chats.length === 0) {
            contactListEl.innerHTML = `<div class="text-center text-gray py-4" style="font-size:0.85rem">Nenhuma conversa registrada.</div>`;
            return;
        }

        // Ordena chats pelo timestamp da última mensagem de forma decrescente
        const sortedChats = [...chats].sort((a, b) => {
            const timeA = a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].timestamp) : 0;
            const timeB = b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].timestamp) : 0;
            return timeB - timeA;
        });

        sortedChats.forEach(chat => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            const timeText = lastMsg ? formatTime(lastMsg.timestamp) : '';
            const msgSnippet = lastMsg ? (lastMsg.sender === 'bot' ? '🤖 ' : lastMsg.sender === 'operator' ? '🧑‍💻 ' : '') + lastMsg.text : 'Sem mensagens';

            const itemDiv = document.createElement('div');
            itemDiv.className = `contact-item ${chat.phone === currentActivePhone ? 'active' : ''}`;
            itemDiv.innerHTML = `
                <div class="contact-item-avatar">👤</div>
                <div class="contact-item-details">
                    <div class="contact-item-header">
                        <span class="contact-item-name">${chat.name || chat.phone}</span>
                        <span class="contact-item-time">${timeText}</span>
                    </div>
                    <div class="contact-item-preview">${msgSnippet}</div>
                </div>
            `;

            itemDiv.addEventListener('click', () => {
                currentActivePhone = chat.phone;
                
                // Remove classe ativa das outras conversas
                document.querySelectorAll('.contact-item').forEach(el => el.classList.remove('active'));
                itemDiv.classList.add('active');

                // Carrega a conversa atual
                renderActiveChat(chat);

                // Libera a digitação do operador
                operatorMessageInput.removeAttribute('disabled');
                btnSendOperator.removeAttribute('disabled');
                operatorMessageInput.focus();
            });

            contactListEl.appendChild(itemDiv);
        });
    }

    function renderActiveChat(chat) {
        activeChatName.textContent = chat.name || 'Cliente WhatsApp';
        activeChatPhone.textContent = `Telefone: ${chat.phone} | Etapa do Bot: ${chat.step ? chat.step.toUpperCase() : 'IDLE'}`;
        
        messageHistoryEl.innerHTML = '';

        if (chat.messages.length === 0) {
            messageHistoryEl.innerHTML = `<div class="text-center text-gray py-4">Sem mensagens trocadas.</div>`;
            return;
        }

        chat.messages.forEach(msg => {
            const rowDiv = document.createElement('div');
            rowDiv.className = `message-row ${msg.sender}`;
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'message-bubble';
            
            // Tratamento especial para estilizar Pix copia e cola em bloco mono
            let formattedText = escapeHTML(msg.text);
            if (msg.text.includes('000201')) {
                // Encontra a chave Pix e envolve em <code>
                formattedText = formattedText.replace(/(000201[^\s]+)/g, '<code style="display:block;background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;margin:8px 0;word-break:break-all;user-select:all;border:1px solid rgba(255,255,255,0.1)">$1</code>');
            }

            bubbleDiv.innerHTML = `
                ${formattedText}
                <span class="message-timestamp">${formatTime(msg.timestamp)}</span>
            `;

            rowDiv.appendChild(bubbleDiv);
            messageHistoryEl.appendChild(rowDiv);
        });

        // Rola até o final das mensagens
        messageHistoryEl.scrollTop = messageHistoryEl.scrollHeight;
    }

    // --- CONTROLE DE MENSAGENS E TOGGLE DE CONFIGURAÇÕES ---

    // Liga/Desliga chatbot
    chkBotToggle.addEventListener('change', async () => {
        if (!adminToken) return;

        const enabled = chkBotToggle.checked;
        try {
            const res = await fetch('/api/whatsapp?action=toggle_bot', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ enabled })
            });
            const data = await res.json();
            if (data.success) {
                if (data.botEnabled) {
                    botStatusIndicator.textContent = 'ATIVO';
                    botStatusIndicator.classList.add('active');
                } else {
                    botStatusIndicator.textContent = 'INATIVO';
                    botStatusIndicator.classList.remove('active');
                }
            }
        } catch (err) {
            console.error("Erro ao alterar status do bot:", err);
        }
    });

    // Envio de mensagem manual do operador
    frmSendOperator.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = operatorMessageInput.value.trim();
        if (!text || !currentActivePhone || !adminToken) return;

        operatorMessageInput.disabled = true;
        btnSendOperator.disabled = true;

        try {
            const res = await fetch('/api/whatsapp?action=send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    phone: currentActivePhone,
                    message: text
                })
            });

            const data = await res.json();
            if (data.success) {
                operatorMessageInput.value = '';
                // Recarrega o estado atualizado imediatamente
                loadStateFromServer();
            } else {
                alert('Falha ao enviar mensagem: ' + data.error);
            }
        } catch (err) {
            console.error("Erro de conexão ao enviar mensagem:", err);
        } finally {
            operatorMessageInput.disabled = false;
            btnSendOperator.disabled = false;
            operatorMessageInput.focus();
        }
    });

    // --- SIMULADOR DE WHATSAPP DO CLIENTE ---

    btnOpenSimulator.addEventListener('click', () => {
        simulatorModal.classList.add('open');
        simMessageInput.focus();
        renderSimulatorChatPreview();
    });

    btnCloseSimulator.addEventListener('click', () => {
        simulatorModal.classList.remove('open');
    });

    // Envio de mensagem simulada do cliente
    frmSimulatorSend.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = simMessageInput.value.trim();
        const phone = simPhoneInput.value.trim();
        const name = simNameInput.value.trim();

        if (!text || !phone) return;

        simMessageInput.value = '';

        try {
            const res = await fetch('/api/whatsapp?action=webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone,
                    name,
                    message: text
                })
            });

            const data = await res.json();
            if (data.success) {
                // Atualiza o preview interno do simulador
                renderSimulatorChatPreview();
                // Se esse contato for o atual selecionado na tela de controle do admin, atualiza também
                if (phone === currentActivePhone) {
                    loadStateFromServer();
                } else {
                    // Caso seja uma conversa nova, recarrega a lista lateral
                    loadStateFromServer();
                }
            }
        } catch (err) {
            console.error("Erro ao simular envio de mensagem:", err);
        }
    });

    // Atalhos rápidos no simulador
    btnQuickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            simMessageInput.value = text;
            frmSimulatorSend.dispatchEvent(new Event('submit'));
        });
    });

    // Renderiza as mensagens trocadas na simulação dentro da caixa de preview do modal
    function renderSimulatorChatPreview() {
        const phone = simPhoneInput.value.trim();
        simMessagesPreview.innerHTML = '';

        if (!phone) {
            simMessagesPreview.innerHTML = `<div class="text-center text-gray py-4">Informe um telefone válido.</div>`;
            return;
        }

        // Faz uma busca local rápida no state mantido na tela (ou podemos consultar as faturas locais)
        fetch('/api/whatsapp?action=get_state', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.chats) {
                const activeChat = data.chats.find(c => c.phone === phone);
                if (activeChat && activeChat.messages.length > 0) {
                    activeChat.messages.forEach(msg => {
                        const previewRow = document.createElement('div');
                        previewRow.style.display = 'flex';
                        previewRow.style.justifyContent = msg.sender === 'customer' ? 'flex-start' : 'flex-end';
                        previewRow.style.marginBottom = '8px';

                        const previewBubble = document.createElement('div');
                        previewBubble.style.padding = '8px 12px';
                        previewBubble.style.borderRadius = '10px';
                        previewBubble.style.fontSize = '0.82rem';
                        previewBubble.style.maxWidth = '75%';
                        previewBubble.style.whiteSpace = 'pre-wrap';
                        previewBubble.style.lineHeight = '1.4';

                        if (msg.sender === 'customer') {
                            previewBubble.style.background = 'rgba(255,255,255,0.08)';
                            previewBubble.style.color = '#fff';
                        } else if (msg.sender === 'bot') {
                            previewBubble.style.background = 'linear-gradient(135deg, #FF6A00 0%, #FF007F 100%)';
                            previewBubble.style.color = '#fff';
                        } else {
                            // Operador
                            previewBubble.style.background = '#0B2240';
                            previewBubble.style.color = '#fff';
                            previewBubble.style.border = '1px solid rgba(0, 122, 255, 0.3)';
                        }

                        // Formatação Pix
                        let textContent = escapeHTML(msg.text);
                        if (msg.text.includes('000201')) {
                            textContent = textContent.replace(/(000201[^\s]+)/g, '<code style="display:block;background:rgba(0,0,0,0.3);padding:4px;word-break:break-all;user-select:all">$1</code>');
                        }

                        previewBubble.innerHTML = textContent;
                        previewRow.appendChild(previewBubble);
                        simMessagesPreview.appendChild(previewRow);
                    });
                    
                    // Rola para baixo o preview do simulador
                    simMessagesPreview.scrollTop = simMessagesPreview.scrollHeight;
                } else {
                    simMessagesPreview.innerHTML = `<div class="text-center text-gray py-4" style="font-size:0.8rem">Nenhuma mensagem nesta conversa. Digite "Oi" para iniciar.</div>`;
                }
            }
        });
    }

    // --- UTILITÁRIOS ---

    function formatTime(isoString) {
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return '';
        }
    }

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;');
    }
});
