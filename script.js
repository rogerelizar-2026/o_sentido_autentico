
    // ==========================================
    // SIDEBAR AUTO-HIDE TIMER LOGIC (V9)
    // ==========================================
    let sidebarTimeout;
    const sidebarCollapseDelay = 4000; // 4 seconds of inactivity

    function resetSidebarTimer() {
        const body = document.body;
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        
        clearTimeout(sidebarTimeout);
        
        // If welcome modal is open, do not start the timer or collapse
        const overlay = document.getElementById('welcome-modal-overlay');
        if (overlay && overlay.classList.contains('show')) {
            return;
        }
        
        // Only run collapse if sidebar is currently visible (not collapsed)
        if (!body.classList.contains('sidebar-collapsed')) {
            sidebarTimeout = setTimeout(() => {
                const isHovered = sidebar.matches(':hover');
                const activeEl = document.activeElement;
                const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');
                
                if (!isHovered && !isInputFocused) {
                    body.classList.add('sidebar-collapsed');
                } else {
                    // Try again in 2 seconds
                    resetSidebarTimer();
                }
            }, sidebarCollapseDelay);
        }
    }

    function expandSidebar() {
        document.body.classList.remove('sidebar-collapsed');
        resetSidebarTimer();
    }

    function toggleSidebar() {
        const body = document.body;
        if (body.classList.contains('sidebar-collapsed')) {
            expandSidebar();
        } else {
            body.classList.add('sidebar-collapsed');
        }
    }

    // Expose toggler globally
    window.toggleSidebar = toggleSidebar;
    window.expandSidebar = expandSidebar;

    // Expand on mouse movement near left edge (clientX < 30)
    window.addEventListener('mousemove', (e) => {
        if (document.body.classList.contains('sidebar-collapsed') && e.clientX < 30) {
            expandSidebar();
        }
    }, { passive: true });

    // Reset timer on user activity if expanded
    ['mousemove', 'touchstart', 'keydown', 'scroll', 'mousedown'].forEach(evt => {
        window.addEventListener(evt, () => {
            if (!document.body.classList.contains('sidebar-collapsed')) {
                resetSidebarTimer();
            }
        }, { passive: true });
    });

    // Start sidebar timer initially
    resetSidebarTimer();

    // ==========================================
    // LANGUAGE HUB SWITCHER AUTOMATION (V9)
    // ==========================================
    const langBtns = document.querySelectorAll('.lang-btn');
    const portalHub = document.getElementById('portal-hub');
    const hebrewHub = document.getElementById('hebrew-hub');
    const greekHub = document.getElementById('greek-hub');
    const portalMenu = document.getElementById('portal-menu');
    const hebrewMenu = document.getElementById('hebrew-menu');
    const greekMenu = document.getElementById('greek-menu');
    const body = document.body;

    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetLang = btn.getAttribute('data-lang');
            langBtns.forEach(b => {
                if (b.getAttribute('data-lang') === targetLang) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
            if (targetLang === 'portal') {
                if (portalHub) portalHub.style.display = 'block';
                if (hebrewHub) hebrewHub.style.display = 'none';
                if (greekHub) greekHub.style.display = 'none';
                
                if (portalMenu) portalMenu.style.display = 'flex';
                if (hebrewMenu) hebrewMenu.style.display = 'none';
                if (greekMenu) greekMenu.style.display = 'none';
                
                body.className = 'portal-active';
            } else if (targetLang === 'hebrew') {
                if (portalHub) portalHub.style.display = 'none';
                if (hebrewHub) hebrewHub.style.display = 'block';
                if (greekHub) greekHub.style.display = 'none';
                
                if (portalMenu) portalMenu.style.display = 'none';
                if (hebrewMenu) hebrewMenu.style.display = 'flex';
                if (greekMenu) greekMenu.style.display = 'none';
                
                body.className = 'hebrew-active';
            } else if (targetLang === 'greek') {
                if (portalHub) portalHub.style.display = 'none';
                if (hebrewHub) hebrewHub.style.display = 'none';
                if (greekHub) greekHub.style.display = 'block';
                
                if (portalMenu) portalMenu.style.display = 'none';
                if (hebrewMenu) hebrewMenu.style.display = 'none';
                if (greekMenu) greekMenu.style.display = 'flex';
                
                body.className = 'greek-active';
            }
            
            // Auto collapse after switching tab to let user see content
            body.classList.add('sidebar-collapsed');
            
            // Scroll to top to let user see top of new tab
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

// Dark Mode Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.setAttribute('data-theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
        }
    });

    // Active Navigation Highlighting
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('nav-external')) return; // Ignore sibling external links
            let activeMenu;
            if (body.classList.contains('portal-active')) {
                activeMenu = portalMenu;
            } else if (body.classList.contains('hebrew-active')) {
                activeMenu = hebrewMenu;
            } else {
                activeMenu = greekMenu;
            }
            if (activeMenu) {
                activeMenu.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // Copy to Clipboard Utility function supporting both ID and element reference
    function copyPrompt(param) {
        let text = "";
        let btn = null;
        
        if (typeof param === 'string') {
            const el = document.getElementById(param);
            if (el) text = el.innerText || el.textContent;
            // Try to find the button nearby
            const promptBox = el.closest('.prompt-box') || el.closest('.prompt');
            if (promptBox) btn = promptBox.querySelector('.copy-btn') || promptBox.querySelector('.prompt__copy');
        } else if (param instanceof HTMLElement) {
            btn = param;
            const promptContainer = param.closest('.prompt') || param.closest('.prompt-box');
            if (promptContainer) {
                const bodyEl = promptContainer.querySelector('.prompt__body') || promptContainer.querySelector('code') || promptContainer;
                if (bodyEl) {
                    text = bodyEl.innerText || bodyEl.textContent;
                }
            }
        }
        
        if (text) {
            text = text.trim();
            navigator.clipboard.writeText(text).then(() => {
                if (btn) {
                    const originalText = btn.innerText || btn.textContent;
                    btn.innerText = "Copiado!";
                    btn.style.background = "#2e7d32"; // Green success color
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = ""; // Restore original color
                    }, 2000);
                } else {
                    alert('Prompt copiado com sucesso! Prontinho para colar na sua Inteligência Artificial.');
                }
            }).catch(err => {
                console.error('Falha ao copiar prompt: ', err);
                alert('Erro ao copiar o prompt. Copie manualmente.');
            });
        }
    }

    // Chart.js Configuration for Hebrew and Greek
    window.addEventListener('DOMContentLoaded', () => {
        // --- HEBREW CHARTS ---
        
        // Chart 1: Complexidade vs Tempo (Scatter Plot)
        const ctxHeb1 = document.getElementById('chart1').getContext('2d');
        new Chart(ctxHeb1, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Métodos de Hebraico',
                    data: [
                        { x: 10, y: 9.8, label: 'Híbrido Integrado' },
                        { x: 6, y: 9.5, label: 'Imersão Comunicativa' },
                        { x: 8, y: 9.2, label: 'Leitura Direta' },
                        { x: 12, y: 9.0, label: 'Tutoria Individual' },
                        { x: 18, y: 8.5, label: 'Gramática-Tradução' },
                        { x: 24, y: 8.0, label: 'Curso Universitário' },
                        { x: 14, y: 7.8, label: 'Indutivo-Gramatical' }
                    ],
                    backgroundColor: 'rgba(197, 160, 89, 0.85)',
                    borderColor: 'rgba(197, 160, 89, 1)',
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Complexidade vs Tempo (Hebraico)',
                        font: { family: 'Cinzel', size: 14 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                const item = ctx.dataset.data[ctx.dataIndex];
                                return `${item.label}: Tempo: ${item.x} meses, Eficácia: ${item.y}/10`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Tempo Sugerido (Meses)' }
                    },
                    y: {
                        title: { display: true, text: 'Eficácia Geral (0-10)' },
                        min: 5,
                        max: 10
                    }
                }
            }
        });

        // Chart 2: Eficácia Multidimensional (Radar - Top 4)
        const ctxHeb2 = document.getElementById('chart2').getContext('2d');
        new Chart(ctxHeb2, {
            type: 'radar',
            data: {
                labels: ['Velocidade', 'Retenção', 'Capacidade Exegética', 'Custo-Benefício', 'Praticidade'],
                datasets: [
                    {
                        label: 'Método Híbrido Integrado',
                        data: [9.5, 9.9, 9.8, 10, 9.5],
                        backgroundColor: 'rgba(197, 160, 89, 0.2)',
                        borderColor: '#c5a059',
                        borderWidth: 2
                    },
                    {
                        label: 'Imersão Comunicativa',
                        data: [9.2, 9.0, 8.5, 9.0, 9.2],
                        backgroundColor: 'rgba(16, 42, 67, 0.15)',
                        borderColor: '#102a43',
                        borderWidth: 2
                    },
                    {
                        label: 'Leitura Direta',
                        data: [8.5, 8.8, 8.0, 9.5, 8.7],
                        backgroundColor: 'rgba(74, 85, 104, 0.1)',
                        borderColor: '#4a5568',
                        borderWidth: 2
                    },
                    {
                        label: 'Gramática-Tradução',
                        data: [6.5, 7.0, 8.5, 8.0, 6.0],
                        backgroundColor: 'rgba(226, 183, 101, 0.1)',
                        borderColor: '#e2b765',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Eficácia Multidimensional - Top 4 (Hebraico)',
                        font: { family: 'Cinzel', size: 14 }
                    }
                }
            }
        });

        // Chart 3: Tempo de Aprendizado por Método (Horizontal Bar)
        const ctxHeb3 = document.getElementById('chart3').getContext('2d');
        new Chart(ctxHeb3, {
            type: 'bar',
            data: {
                labels: ['Híbrido Integrado', 'Imersão', 'Leitura Direta', 'Tutoria', 'Gramática-Tradução', 'Universitário', 'Indutivo'],
                datasets: [{
                    label: 'Tempo Estimado até Leitura Autônoma (Meses)',
                    data: [8, 6, 9, 12, 18, 24, 15],
                    backgroundColor: 'rgba(16, 42, 67, 0.75)',
                    borderColor: 'rgba(16, 42, 67, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Hebraico: Tempo de Aprendizado por Método',
                        font: { family: 'Cinzel', size: 14 }
                    }
                }
            }
        });

        // Chart 4: Custo-Benefício (Bubble Chart)
        const ctxHeb4 = document.getElementById('chart4').getContext('2d');
        new Chart(ctxHeb4, {
            type: 'bubble',
            data: {
                datasets: [
                    {
                        label: 'Híbrido Integrado',
                        data: [{ x: 1, y: 9.8, r: 18 }], // x is cost (1-5, 1 is free/cheap), y is efficacy, r is bubble size
                        backgroundColor: 'rgba(197, 160, 89, 0.85)'
                    },
                    {
                        label: 'Leitura Direta',
                        data: [{ x: 2, y: 9.2, r: 14 }],
                        backgroundColor: 'rgba(16, 42, 67, 0.85)'
                    },
                    {
                        label: 'Gramática-Tradução',
                        data: [{ x: 3, y: 8.5, r: 12 }],
                        backgroundColor: 'rgba(74, 85, 104, 0.85)'
                    },
                    {
                        label: 'Tutoria Individual',
                        data: [{ x: 4, y: 9.0, r: 10 }],
                        backgroundColor: 'rgba(123, 29, 34, 0.85)'
                    },
                    {
                        label: 'Curso Acadêmico',
                        data: [{ x: 5, y: 8.0, r: 8 }],
                        backgroundColor: 'rgba(156, 46, 53, 0.85)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Custo-Benefício de Métodos (Hebraico)',
                        font: { family: 'Cinzel', size: 14 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                return `${ctx.dataset.label}: Custo: Nível ${ctx.raw.x}/5, Eficácia: ${ctx.raw.y}/10`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Custo (1 = Gratuito, 5 = Muito Caro)' },
                        min: 0,
                        max: 6
                    },
                    y: {
                        title: { display: true, text: 'Eficácia Geral' },
                        min: 5,
                        max: 10
                    }
                }
            }
        });


        // --- GREEK CHARTS ---

        // Chart 1: Complexidade vs Tempo (Scatter Plot)
        const ctxGrk1 = document.getElementById('grkChart1').getContext('2d');
        new Chart(ctxGrk1, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Métodos de Grego',
                    data: [
                        { x: 9, y: 9.8, label: 'Método Híbrido Integrado (Rega/Wallace)' },
                        { x: 14, y: 8.5, label: 'Mounce Gramática-Tradução' },
                        { x: 8, y: 9.0, label: 'Método Indutivo Dobson' },
                        { x: 6, y: 8.8, label: 'Imersão Comunicativa (Polis)' },
                        { x: 12, y: 7.8, label: 'Método Tradicional' },
                        { x: 20, y: 8.0, label: 'Curso Universitário' }
                    ],
                    backgroundColor: 'rgba(123, 29, 34, 0.85)',
                    borderColor: 'rgba(123, 29, 34, 1)',
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Complexidade vs Tempo (Grego Koiné)',
                        font: { family: 'Cinzel', size: 14 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                const item = ctx.dataset.data[ctx.dataIndex];
                                return `${item.label}: Tempo: ${item.x} meses, Eficácia: ${item.y}/10`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Tempo de Dedicação (Meses)' }
                    },
                    y: {
                        title: { display: true, text: 'Eficácia Geral (0-10)' },
                        min: 5,
                        max: 10
                    }
                }
            }
        });

        // Chart 2: Eficácia Multidimensional (Radar - Top 4)
        const ctxGrk2 = document.getElementById('grkChart2').getContext('2d');
        new Chart(ctxGrk2, {
            type: 'radar',
            data: {
                labels: ['Análise de Casos', 'Morfologia Verbal', 'Sintaxe Exegética', 'Retenção Anki', 'Usabilidade Prática'],
                datasets: [
                    {
                        label: 'Método Híbrido Integrado (Rega/Wallace)',
                        data: [9.8, 9.5, 9.7, 9.8, 9.6],
                        backgroundColor: 'rgba(123, 29, 34, 0.2)',
                        borderColor: '#7b1d22',
                        borderWidth: 2
                    },
                    {
                        label: 'Mounce Tradicional',
                        data: [8.8, 9.2, 7.5, 7.0, 7.5],
                        backgroundColor: 'rgba(197, 160, 89, 0.15)',
                        borderColor: '#c5a059',
                        borderWidth: 2
                    },
                    {
                        label: 'Método Indutivo',
                        data: [7.5, 8.0, 8.5, 7.5, 8.2],
                        backgroundColor: 'rgba(74, 85, 104, 0.1)',
                        borderColor: '#4a5568',
                        borderWidth: 2
                    },
                    {
                        label: 'Imersão (Polis)',
                        data: [6.0, 7.0, 6.5, 9.0, 9.0],
                        backgroundColor: 'rgba(226, 183, 101, 0.1)',
                        borderColor: '#e2b765',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Eficácia Multidimensional - Top 4 (Grego)',
                        font: { family: 'Cinzel', size: 14 }
                    }
                }
            }
        });

        // Chart 3: Tempo de Aprendizado de Casos e Paradigmas (Barras Horizontais)
        const ctxGrk3 = document.getElementById('grkChart3').getContext('2d');
        new Chart(ctxGrk3, {
            type: 'bar',
            data: {
                labels: ['Alfabeto & Fonética', 'Declinações (1ª e 2ª)', '3ª Declinação (Nomes)', 'Artigo & Casos Nominais', 'Sistema Verbal Presente', 'Estudo de Particípios', 'Sintaxe Exegética'],
                datasets: [{
                    label: 'Tempo Estimado de Domínio (Semanas)',
                    data: [2, 4, 6, 5, 8, 8, 12],
                    backgroundColor: 'rgba(123, 29, 34, 0.75)',
                    borderColor: 'rgba(123, 29, 34, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Grego: Curva de Complexidade e Tempo por Tópico',
                        font: { family: 'Cinzel', size: 14 }
                    }
                }
            }
        });

        // Chart 4: Custo-Benefício de Materiais (Bubble Chart)
        const ctxGrk4 = document.getElementById('grkChart4').getContext('2d');
        new Chart(ctxGrk4, {
            type: 'bubble',
            data: {
                datasets: [
                    {
                        label: 'Noções do Grego Bíblico (Rega)',
                        data: [{ x: 1, y: 9.2, r: 16 }], // cost (1 is low, 5 is very high), y is efficacy, r is bubble size
                        backgroundColor: 'rgba(197, 160, 89, 0.85)'
                    },
                    {
                        label: 'Gramática Grega (Wallace)',
                        data: [{ x: 2, y: 9.7, r: 18 }],
                        backgroundColor: 'rgba(123, 29, 34, 0.85)'
                    },
                    {
                        label: 'Fundamentos Grego (Mounce)',
                        data: [{ x: 1.5, y: 8.8, r: 14 }],
                        backgroundColor: 'rgba(16, 42, 67, 0.85)'
                    },
                    {
                        label: 'Software Logos (Avançado)',
                        data: [{ x: 4.5, y: 9.5, r: 12 }],
                        backgroundColor: 'rgba(74, 85, 104, 0.85)'
                    },
                    {
                        label: 'Curso Acadêmico Completo',
                        data: [{ x: 5, y: 8.5, r: 8 }],
                        backgroundColor: 'rgba(156, 46, 53, 0.85)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Custo-Benefício de Materiais de Grego',
                        font: { family: 'Cinzel', size: 14 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                return `${ctx.dataset.label}: Custo: Nível ${ctx.raw.x}/5, Eficácia: ${ctx.raw.y}/10`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Custo (1 = R$ 80-250, 5 = R$ 3.000+ / Acadêmico)' },
                        min: 0,
                        max: 6
                    },
                    y: {
                        title: { display: true, text: 'Eficácia Geral' },
                        min: 5,
                        max: 10
                    }
                }
            }
        });

        // Chart 5: Complexidade Sintática vs Resultado de Leitura (Line Chart)
        const ctxGrk5 = document.getElementById('grkChart5').getContext('2d');
        new Chart(ctxGrk5, {
            type: 'line',
            data: {
                labels: ['Nível 1: Fundação', 'Nível 2: Básico', 'Nível 3: Intermediário', 'Nível 4: Avançado', 'Nível 5: Fluência'],
                datasets: [
                    {
                        label: 'Dificuldade Sintática',
                        data: [2, 4.5, 6.8, 8.5, 9.5],
                        borderColor: '#7b1d22',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        tension: 0.3
                    },
                    {
                        label: 'Autonomia de Leitura (%)',
                        data: [10, 35, 60, 85, 98],
                        borderColor: '#c5a059',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        borderDash: [5, 5],
                        tension: 0.3,
                        yAxisID: 'yPercentage'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Curva de Dificuldade vs Autonomia no Grego',
                        font: { family: 'Cinzel', size: 14 }
                    }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'Nível de Complexidade (1-10)' },
                        min: 0,
                        max: 10
                    },
                    yPercentage: {
                        position: 'right',
                        title: { display: true, text: 'Autonomia de Leitura (%)' },
                        min: 0,
                        max: 100,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    });

// ==========================================
// PROGRESSIVE WEB APP (PWA) INTEGRATION
// ==========================================

// 1. Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => {
                console.log('PWA Service Worker registrado com sucesso para o escopo:', reg.scope);
            })
            .catch(err => {
                console.error('Falha ao registrar Service Worker do PWA:', err);
            });
    });
}

// 2. Install Prompt (PWA Installation Logic)
let deferredPrompt;
const pwaInstallContainer = document.getElementById('pwa-install-container');
const pwaInstallBtn = document.getElementById('pwa-install-btn');
const welcomePwaContainer = document.getElementById('welcome-pwa-container');
const welcomePwaBtn = document.getElementById('welcome-pwa-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    
    // Update UI to notify the user they can install the PWA
    if (pwaInstallContainer) pwaInstallContainer.style.display = 'block';
    if (welcomePwaContainer) welcomePwaContainer.style.display = 'block';
});

function triggerPwaInstall() {
    if (!deferredPrompt) return;
    
    // Show the prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('Usuário aceitou a instalação do PWA');
        } else {
            console.log('Usuário recusou a instalação do PWA');
        }
        deferredPrompt = null;
        
        // Hide the install buttons
        if (pwaInstallContainer) pwaInstallContainer.style.display = 'none';
        if (welcomePwaContainer) welcomePwaContainer.style.display = 'none';
    });
}

if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', triggerPwaInstall);
}
if (welcomePwaBtn) {
    welcomePwaBtn.addEventListener('click', triggerPwaInstall);
}

// Handle appinstalled event
window.addEventListener('appinstalled', (evt) => {
    console.log('O aplicativo foi instalado com sucesso no sistema!');
    alert('O Sentido Autêntico instalado com sucesso! Agora você pode acessá-lo offline diretamente de sua tela inicial.');
});


// ==========================================
// WELCOME MODAL LOGIC (FIXED V6)
// ==========================================

function closeWelcomeModal() {
    const welcomeModal = document.getElementById('welcome-modal-overlay');
    if (welcomeModal) {
        welcomeModal.classList.remove('show');
        localStorage.setItem('welcomeModalDismissed', 'true');
        // Ensure sidebar starts as open and reset timer when closed
        document.body.classList.remove('sidebar-collapsed');
        resetSidebarTimer();
    }
}

function resetWelcomeModal() {
    const welcomeModal = document.getElementById('welcome-modal-overlay');
    if (welcomeModal) {
        welcomeModal.classList.add('show');
        localStorage.removeItem('welcomeModalDismissed');
    }
}

// Global exposure
window.closeWelcomeModal = closeWelcomeModal;
window.resetWelcomeModal = resetWelcomeModal;


// ==========================================
// COFFEE MODAL LOGIC (V6)
// ==========================================

function copyPixKey() {
    const pixKey = document.getElementById("pix-key-flat") ? document.getElementById("pix-key-flat").innerText : "rogerelizar@gmail.com";
    navigator.clipboard.writeText(pixKey).then(() => {
        alert('Chave PIX copiada com sucesso! Deus abençoe o cafezinho. ☕');
    }).catch(err => {
        console.error('Falha ao copiar PIX: ', err);
        alert('Chave PIX: rogerelizar@gmail.com (Copie manualmente)');
    });
}

// Global exposure


window.copyPixKey = copyPixKey;


// ==========================================
// CUSTOM INTERACTIVE AUDIO PLAYER LOGIC (V6)
// ==========================================

let audioEl = null;
let playBtn = null;
let playIcon = null;
let progressBar = null;
let currentTimeLabel = null;
let totalTimeLabel = null;
let muteBtn = null;
let volumeIcon = null;
let volumeBar = null;
let pulseIcon = null;

function initAudioPlayer() {
    audioEl = document.getElementById('biblical-audio');
    playBtn = document.getElementById('audio-play-btn');
    playIcon = document.getElementById('audio-play-icon');
    progressBar = document.getElementById('audio-progress-bar');
    currentTimeLabel = document.getElementById('audio-current-time');
    totalTimeLabel = document.getElementById('audio-total-time');
    muteBtn = document.getElementById('audio-mute-btn');
    volumeIcon = document.getElementById('audio-volume-icon');
    volumeBar = document.getElementById('audio-volume-bar');
    pulseIcon = document.querySelector('.audio-pulse-icon');

    if (!audioEl) return;

    // Listeners
    audioEl.removeEventListener('timeupdate', updateAudioProgress);
    audioEl.addEventListener('timeupdate', updateAudioProgress);
    
    audioEl.addEventListener('loadedmetadata', () => {
        if (totalTimeLabel) {
            totalTimeLabel.innerText = formatAudioTime(audioEl.duration);
        }
    });
    audioEl.addEventListener('ended', resetAudioPlayerState);
}

function toggleBiblicalAudio() {
    if (!audioEl) initAudioPlayer();
    if (!audioEl) return;

    if (audioEl.paused) {
        audioEl.play().then(() => {
            if (playIcon) {
                playIcon.className = 'fa-solid fa-pause';
            }
            if (pulseIcon) pulseIcon.classList.add('audio-pulse-playing');
        }).catch(err => {
            console.error('Erro ao tocar áudio:', err);
        });
    } else {
        audioEl.pause();
        resetAudioPlayerState();
    }
}

function resetAudioPlayerState() {
    if (playIcon) {
        playIcon.className = 'fa-solid fa-play';
    }
    if (pulseIcon) pulseIcon.classList.remove('audio-pulse-playing');
}

function updateAudioProgress() {
    if (!audioEl || !progressBar) return;
    
    const percentage = (audioEl.currentTime / audioEl.duration) * 100;
    progressBar.value = isNaN(percentage) ? 0 : percentage;
    
    if (currentTimeLabel) {
        currentTimeLabel.innerText = formatAudioTime(audioEl.currentTime);
    }
}

function seekBiblicalAudio(value) {
    if (!audioEl) return;
    const seekTo = (value / 100) * audioEl.duration;
    audioEl.currentTime = isNaN(seekTo) ? 0 : seekTo;
}

function changeBiblicalVolume(value) {
    if (!audioEl) return;
    audioEl.volume = value;
    updateVolumeIcon(value);
}

function toggleBiblicalMute() {
    if (!audioEl) return;
    if (audioEl.muted) {
        audioEl.muted = false;
        if (volumeBar) volumeBar.value = audioEl.volume;
        updateVolumeIcon(audioEl.volume);
    } else {
        audioEl.muted = true;
        if (volumeBar) volumeBar.value = 0;
        if (volumeIcon) {
            volumeIcon.className = 'fa-solid fa-volume-xmark';
        }
    }
}

function updateVolumeIcon(volume) {
    if (!volumeIcon) return;
    if (volume == 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else if (volume < 0.4) {
        volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high';
    }
}

function formatAudioTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Global exposure
window.toggleBiblicalAudio = toggleBiblicalAudio;
window.seekBiblicalAudio = seekBiblicalAudio;
window.changeBiblicalVolume = changeBiblicalVolume;
window.toggleBiblicalMute = toggleBiblicalMute;


// Check if welcome modal was already dismissed on load, and init player
window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('welcome-modal-overlay');
    if (overlay) {
        if (localStorage.getItem('welcomeModalDismissed') === 'true') {
            overlay.classList.remove('show');
            // Ensure sidebar is open on subsequent accesses and start timer
            document.body.classList.remove('sidebar-collapsed');
            resetSidebarTimer();
        } else {
            overlay.classList.add('show');
            // Ensure sidebar is open under the welcome modal but paused
            document.body.classList.remove('sidebar-collapsed');
            clearTimeout(sidebarTimeout);
        }
    }
    // Initialize audio player
    initAudioPlayer();
});

// ==========================================
// DYNAMIC LINK INTERCEPTOR & MEDIA PREVIEW MODAL (V13)
// ==========================================

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Ignore internal navigation links and javascript triggers
    if (href.startsWith('#') || href.startsWith('javascript:')) {
        return;
    }
    
    const lowerHref = href.toLowerCase();
    const isImage = lowerHref.endsWith('.png') || lowerHref.endsWith('.jpg') || lowerHref.endsWith('.jpeg') || lowerHref.endsWith('.gif') || lowerHref.endsWith('.svg') || lowerHref.endsWith('.webp');
    const isAudio = lowerHref.endsWith('.mp3') || lowerHref.endsWith('.m4a') || lowerHref.endsWith('.wav') || lowerHref.endsWith('.ogg');
    
    if (isImage || isAudio) {
        e.preventDefault(); // Stop direct browser redirection/download
        openMediaPreviewModal(href, isImage ? 'image' : 'audio', link.innerText || 'Visualização de Recurso');
        return;
    }
    
    // For HTML files or external websites, always open in a new tab
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
});

function openMediaPreviewModal(href, type, title) {
    let mediaModal = document.getElementById('media-preview-modal-overlay');
    if (!mediaModal) {
        mediaModal = document.createElement('div');
        mediaModal.id = 'media-preview-modal-overlay';
        mediaModal.className = 'welcome-overlay';
        mediaModal.style.zIndex = '999999';
        mediaModal.innerHTML = `
            <div class="welcome-modal" style="max-width: 800px; padding: 2rem; border-color: var(--gold);">
                <button class="sidebar-close" onclick="closeMediaPreviewModal()" style="position: absolute; top: 1rem; right: 1rem; background: var(--bg-secondary); border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-xmark"></i></button>
                <h3 id="media-modal-title" style="font-family: 'Cinzel', serif; color: var(--gold-dark); margin-bottom: 1.5rem; text-align: center;">Visualização de Recurso</h3>
                <div id="media-modal-content" style="display: flex; justify-content: center; align-items: center; min-height: 200px; margin-bottom: 1.5rem; background: rgba(0,0,0,0.03); border-radius: 8px; padding: 1rem; overflow: hidden;">
                    <!-- Content injected here -->
                </div>
                <div style="display: flex; justify-content: center; gap: 1rem;">
                    <a id="media-modal-download-btn" href="" download class="welcome-btn" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; background-color: var(--gold); color: white;">
                        <i class="fa-solid fa-download"></i> Baixar Arquivo
                    </a>
                    <button class="welcome-btn" onclick="closeMediaPreviewModal()" style="background: none; border: 1px solid var(--border-color); color: var(--text-secondary); box-shadow: none;">Fechar</button>
                </div>
            </div>
        `;
        document.body.appendChild(mediaModal);
    }
    
    const modalTitle = document.getElementById('media-modal-title');
    const modalContent = document.getElementById('media-modal-content');
    const downloadBtn = document.getElementById('media-modal-download-btn');
    
    // Clean and set title
    modalTitle.innerText = title.trim() || 'Visualização de Recurso';
    downloadBtn.href = href;
    
    if (type === 'image') {
        modalContent.innerHTML = `<img src="${href}" alt="${title}" style="max-width: 100%; max-height: 50vh; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">`;
    } else if (type === 'audio') {
        modalContent.innerHTML = `
            <div style="width: 100%; text-align: center; padding: 1rem;">
                <i class="fa-solid fa-file-audio" style="font-size: 4rem; color: var(--gold); margin-bottom: 1rem; display: block;"></i>
                <p style="margin-bottom: 1rem; font-weight: 600;">Reprodutor de Prévia</p>
                <audio src="${href}" controls style="width: 100%; max-width: 500px;"></audio>
            </div>
        `;
    }
    
    mediaModal.classList.add('show');
}

function closeMediaPreviewModal() {
    const mediaModal = document.getElementById('media-preview-modal-overlay');
    if (mediaModal) {
        const audio = mediaModal.querySelector('audio');
        if (audio) audio.pause();
        mediaModal.classList.remove('show');
    }
}

window.closeMediaPreviewModal = closeMediaPreviewModal;

    // Cross-tab navigation click listener for smooth UX
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#port-')) {
                if (!document.body.classList.contains('portal-active')) {
                    const portalBtn = document.querySelector('.lang-btn[data-lang="portal"]');
                    if (portalBtn) {
                        portalBtn.click();
                        // Delay scroll slightly to allow DOM redraw
                        setTimeout(() => {
                            const target = document.querySelector(href);
                            if (target) target.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }
                }
            }
        });
    });
