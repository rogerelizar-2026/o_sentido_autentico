
// ==========================================
// SIDEBAR AUTO-HIDE TIMER LOGIC (V10 - Optimized)
// ==========================================
const SidebarManager = (function() {
        let sidebarTimeout = null;
        const sidebarCollapseDelay = 4000;
        let sidebar = null;
        let overlay = null;
        
        function init() {
            sidebar = document.querySelector('.sidebar');
            overlay = document.getElementById('welcome-modal-overlay');
        }
        
        function resetSidebarTimer() {
            if (!sidebar) return;
            clearTimeout(sidebarTimeout);
            
            if (overlay && overlay.classList.contains('show')) return;
            
            if (!document.body.classList.contains('sidebar-collapsed')) {
                sidebarTimeout = setTimeout(() => {
                    const isHovered = sidebar.matches(':hover');
                    const activeEl = document.activeElement;
                    const isInputFocused = activeEl && /^(INPUT|TEXTAREA|SELECT)$/.test(activeEl.tagName);
                    
                    if (!isHovered && !isInputFocused) {
                        document.body.classList.add('sidebar-collapsed');
                    } else {
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
            body.classList.toggle('sidebar-collapsed', !body.classList.contains('sidebar-collapsed'));
            if (!body.classList.contains('sidebar-collapsed')) {
                resetSidebarTimer();
            }
        }
        
        function handleMousemove(e) {
            if (document.body.classList.contains('sidebar-collapsed') && e.clientX < 30) {
                expandSidebar();
            }
        }
        
        function handleActivity() {
            if (!document.body.classList.contains('sidebar-collapsed')) {
                resetSidebarTimer();
            }
        }

        return {
            init: function() {
                init();
                // Expõe toggleSidebar e resetTimer globalmente pois são usados pelo HTML
                window.toggleSidebar = toggleSidebar;
                window.resetSidebarTimer = resetSidebarTimer;
                window.addEventListener('mousemove', handleMousemove, { passive: true });
                ['mousemove', 'touchstart', 'keydown', 'mousedown'].forEach(evt => {
                    window.addEventListener(evt, handleActivity, { passive: true });
                });
                resetSidebarTimer();
            }
        };
    })();
    
    SidebarManager.init();


    // ==========================================
    // LANGUAGE HUB SWITCHER AUTOMATION (V10 - Optimized)
    // ==========================================
    const LanguageSwitcher = (function() {
        const elements = {};
        
        function cacheElements() {
            elements.langBtns = document.querySelectorAll('.lang-btn');
            elements.portalHub = document.getElementById('portal-hub');
            elements.hebrewHub = document.getElementById('hebrew-hub');
            elements.greekHub = document.getElementById('greek-hub');
            elements.portalMenu = document.getElementById('portal-menu');
            elements.hebrewMenu = document.getElementById('hebrew-menu');
            elements.greekMenu = document.getElementById('greek-menu');
        }
        
        function updateButtons(targetLang) {
            elements.langBtns.forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-lang') === targetLang);
            });
        }
        
        function switchTab(targetLang) {
            const hubs = { portal: elements.portalHub, hebrew: elements.hebrewHub, greek: elements.greekHub };
            const menus = { portal: elements.portalMenu, hebrew: elements.hebrewMenu, greek: elements.greekMenu };
            const classes = { portal: 'portal-active', hebrew: 'hebrew-active', greek: 'greek-active' };
            
            ['portal', 'hebrew', 'greek'].forEach(lang => {
                if (hubs[lang]) hubs[lang].style.display = (lang === targetLang ? 'block' : 'none');
                if (menus[lang]) menus[lang].style.display = (lang === targetLang ? 'flex' : 'none');
            });
            
            document.body.className = classes[targetLang] || '';
            document.body.classList.add('sidebar-collapsed');
            updateButtons(targetLang);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        return {
            init: function() {
                cacheElements();
                elements.langBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        switchTab(btn.getAttribute('data-lang'));
                    });
                });
            }
        };
    })();
    
    LanguageSwitcher.init();

    // Dark Mode & Theme Manager
    const ThemeManager = (function() {
        let body = document.body;
        
        function init() {
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('change', () => {
                    body.toggleAttribute('data-theme', themeToggle.checked);
                    if (themeToggle.checked) {
                        body.setAttribute('data-theme', 'dark');
                    } else {
                        body.removeAttribute('data-theme');
                    }
                });
            }
        }
        
        return { init: init };
    })();
    
    ThemeManager.init();

    // Active Navigation Highlighting (Optimized)
    const NavigationManager = (function() {
        const navItems = document.querySelectorAll('.nav-item');
        
        function handleClick(item) {
            if (item.classList.contains('nav-external')) return;
            
            let activeMenu = null;
            const body = document.body;
            if (body.classList.contains('portal-active')) {
                activeMenu = document.getElementById('portal-menu');
            } else if (body.classList.contains('hebrew-active')) {
                activeMenu = document.getElementById('hebrew-menu');
            } else {
                activeMenu = document.getElementById('greek-menu');
            }
            
            if (activeMenu) {
                activeMenu.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
            body.classList.add('sidebar-collapsed');
        }
        
        return {
            init: function() {
                navItems.forEach(item => {
                    item.addEventListener('click', () => handleClick(item));
                });
            }
        };
    })();
    
    NavigationManager.init();

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
    document.addEventListener('DOMContentLoaded', () => {
    // Nota: Configurações de acessibilidade são gerenciadas exclusivamente por accessibility.js
    // O carregamento das configurações salvas (dyslexia, contraste, fontScale) é feito lá

        // --- HEBREW CHARTS ---
        
        // Chart 1: Complexidade vs Tempo (Scatter Plot)
        try {
        const ctxHeb1 = document.getElementById('chart1');
        if (ctxHeb1) {
            new Chart(ctxHeb1.getContext('2d'), {
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
        } catch (err) {
            console.error('Erro ao criar gráfico Heb1:', err);
        }

        // Chart 2: Eficácia Multidimensional (Radar - Top 4)
        try {
        const ctxHeb2 = document.getElementById('chart2');
        if (ctxHeb2) {
        new Chart(ctxHeb2.getContext('2d'), {
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
        } catch (err) {
            console.error('Erro ao criar gráfico Heb2:', err);
        }

        // Chart 3: Tempo de Aprendizado por Método (Horizontal Bar)
        try {
        const ctxHeb3 = document.getElementById('chart3');
        if (ctxHeb3) {
        new Chart(ctxHeb3.getContext('2d'), {
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
        } catch (err) {
            console.error('Erro ao criar gráfico Heb3:', err);
        }

        // Chart 4: Custo-Benefício (Bubble Chart)
        try {
        const ctxHeb4 = document.getElementById('chart4');
        if (ctxHeb4) {
        new Chart(ctxHeb4.getContext('2d'), {
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
        } catch (err) {
            console.error('Erro ao criar gráfico Heb4:', err);
        }


        // --- GREEK CHARTS ---

        // Chart 1: Complexidade vs Tempo (Scatter Plot)
        try {
        const ctxGrk1 = document.getElementById('grkChart1');
        if (ctxGrk1) {
        new Chart(ctxGrk1.getContext('2d'), {
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
        } catch (err) {
            console.error('Erro ao criar gráfico Grk1:', err);
        }

        // Chart 2: Eficácia Multidimensional (Radar - Top 4)
        try {
        const ctxGrk2 = document.getElementById('grkChart2');
        if (ctxGrk2) {
        new Chart(ctxGrk2.getContext('2d'), {
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
        } catch (err) {
            console.error('Erro ao criar gráfico Grk2:', err);
        }

        // Chart 3: Tempo de Aprendizado de Casos e Paradigmas (Barras Horizontais)
        try {
        const ctxGrk3 = document.getElementById('grkChart3');
        if (ctxGrk3) {
        new Chart(ctxGrk3.getContext('2d'), {
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
        } catch (err) {
            console.error('Erro ao criar gráfico Grk3:', err);
        }

        // Chart 4: Custo-Benefício de Materiais (Bubble Chart)
        try {
        const ctxGrk4 = document.getElementById('grkChart4');
        if (ctxGrk4) {
        new Chart(ctxGrk4.getContext('2d'), {
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
        } catch (err) {
            console.error('Erro ao criar gráfico Grk4:', err);
        }

        // Chart 5: Complexidade Sintática vs Resultado de Leitura (Line Chart)
        try {
        const ctxGrk5 = document.getElementById('grkChart5');
        if (ctxGrk5) {
        new Chart(ctxGrk5.getContext('2d'), {
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
        } catch (err) {
            console.error('Erro ao criar gráfico Grk5:', err);
        }
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
// Check if welcome modal was already dismissed on load, and init player
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('welcome-modal-overlay');
    if (overlay) {
        if (localStorage.getItem('welcomeModalDismissed') === 'true') {
            overlay.classList.remove('show');
            // Ensure sidebar is open on subsequent accesses and start timer
            document.body.classList.remove('sidebar-collapsed');
            SidebarManager.resetTimer();
        } else {
            overlay.classList.add('show');
            // Ensure sidebar is open under the welcome modal but paused
            document.body.classList.remove('sidebar-collapsed');
        }
    }
    // Initialize audio player
    
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
    
    // Adiciona atributos de segurança em links externos
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
});

// Função de sanitização básica para prevenir XSS
function sanitizeHTML(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function openMediaPreviewModal(href, type, title) {
    let mediaModal = document.getElementById('media-preview-modal-overlay');
    if (!mediaModal) {
        mediaModal = document.createElement('div');
        mediaModal.id = 'media-preview-modal-overlay';
        mediaModal.className = 'welcome-overlay';
        mediaModal.style.zIndex = '999999';
        
        // Cria estrutura do modal de forma segura usando createElement
        const modalContainer = document.createElement('div');
        modalContainer.className = 'welcome-modal';
        modalContainer.style.cssText = 'max-width: 800px; padding: 2rem; border-color: var(--gold);';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'sidebar-close';
        closeBtn.onclick = function() { closeMediaPreviewModal(); };
        closeBtn.style.cssText = 'position: absolute; top: 1rem; right: 1rem; background: var(--bg-secondary); border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;';
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fa-solid fa-xmark';
        closeBtn.appendChild(closeIcon);
        
        const titleEl = document.createElement('h3');
        titleEl.id = 'media-modal-title';
        titleEl.style.cssText = "font-family: 'Cinzel', serif; color: var(--gold-dark); margin-bottom: 1.5rem; text-align: center;";
        
        const contentEl = document.createElement('div');
        contentEl.id = 'media-modal-content';
        contentEl.style.cssText = 'display: flex; justify-content: center; align-items: center; min-height: 200px; margin-bottom: 1.5rem; background: rgba(0,0,0,0.03); border-radius: 8px; padding: 1rem; overflow: hidden;';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = 'display: flex; justify-content: center; gap: 1rem;';
        
        const downloadLink = document.createElement('a');
        downloadLink.id = 'media-modal-download-btn';
        downloadLink.href = '';
        downloadLink.setAttribute('download', '');
        downloadLink.className = 'welcome-btn';
        downloadLink.style.cssText = 'text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; background-color: var(--gold); color: white;';
        const downloadIcon = document.createElement('i');
        downloadIcon.className = 'fa-solid fa-download';
        const downloadText = document.createTextNode(' Baixar Arquivo');
        downloadLink.appendChild(downloadIcon);
        downloadLink.appendChild(downloadText);
        
        const closeActionBtn = document.createElement('button');
        closeActionBtn.className = 'welcome-btn';
        closeActionBtn.onclick = function() { closeMediaPreviewModal(); };
        closeActionBtn.style.cssText = 'background: none; border: 1px solid var(--border-color); color: var(--text-secondary); box-shadow: none;';
        closeActionBtn.textContent = 'Fechar';
        
        actionsDiv.appendChild(downloadLink);
        actionsDiv.appendChild(closeActionBtn);
        
        modalContainer.appendChild(closeBtn);
        modalContainer.appendChild(titleEl);
        modalContainer.appendChild(contentEl);
        modalContainer.appendChild(actionsDiv);
        
        mediaModal.appendChild(modalContainer);
        document.body.appendChild(mediaModal);
    }
    
    const modalTitle = document.getElementById('media-modal-title');
    const modalContent = document.getElementById('media-modal-content');
    const downloadBtn = document.getElementById('media-modal-download-btn');
    
    // Usa textContent para evitar XSS no título
    modalTitle.textContent = title.trim() || 'Visualização de Recurso';
    downloadBtn.href = href;
    
    if (type === 'image') {
        const img = document.createElement('img');
        img.src = href;
        img.alt = title || 'Visualização de Imagem';
        img.style.cssText = 'max-width: 100%; max-height: 50vh; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);';
        img.onerror = function() {
            const errorContainer = document.createElement('div');
            errorContainer.style.cssText = 'text-align: center; padding: 2rem;';
            
            const errorIcon = document.createElement('i');
            errorIcon.className = 'fa-solid fa-image';
            errorIcon.style.cssText = 'font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem; display: block;';
            
            const errorMsg = document.createElement('p');
            errorMsg.textContent = 'Imagem não disponível';
            
            errorContainer.appendChild(errorIcon);
            errorContainer.appendChild(errorMsg);
            
            while (modalContent.firstChild) {
                modalContent.removeChild(modalContent.firstChild);
            }
            modalContent.appendChild(errorContainer);
        };
        while (modalContent.firstChild) {
            modalContent.removeChild(modalContent.firstChild);
        }
        modalContent.appendChild(img);
    } else if (type === 'audio') {
        // Cria elemento audio de forma segura
        const audioContainer = document.createElement('div');
        audioContainer.style.cssText = 'width: 100%; text-align: center; padding: 1rem;';
        
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-file-audio';
        icon.style.cssText = 'font-size: 4rem; color: var(--gold); margin-bottom: 1rem; display: block;';
        
        const label = document.createElement('p');
        label.style.cssText = 'margin-bottom: 1rem; font-weight: 600;';
        label.textContent = 'Reprodutor de Prévia';
        
        const audio = document.createElement('audio');
        audio.src = href;
        audio.controls = true;
        audio.style.cssText = 'width: 100%; max-width: 500px;';
        
        audioContainer.appendChild(icon);
        audioContainer.appendChild(label);
        audioContainer.appendChild(audio);
        
        while (modalContent.firstChild) {
            modalContent.removeChild(modalContent.firstChild);
        }
        modalContent.appendChild(audioContainer);
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


// ==========================================
// V18 ACCESSIBILITY (A11Y) & RECOMMENDED INSTITUTIONS MODAL LOGIC
// ==========================================

// Close button state on welcome modal
function toggleWelcomeButton(checked) {
    const btn = document.getElementById('welcome-start-btn');
    if (btn) {
        if (checked) {
            btn.removeAttribute('disabled');
            btn.style.opacity = '1.0';
            btn.style.pointerEvents = 'auto';
        } else {
            btn.setAttribute('disabled', 'true');
            btn.style.opacity = '0.5';
            btn.style.pointerEvents = 'none';
        }
    }
}
window.toggleWelcomeButton = toggleWelcomeButton;

// ============================================================================
// FIM DO MÓDULO DE ACESSIBILIDADE DUPLICADO
// A lógica de acessibilidade foi centralizada em accessibility.js
// ============================================================================

// ============================================================================

// TTS (Text-to-Speech Page Reader)
let activeUtterance = null;
function toggleTTS() {
    const btnText = document.getElementById('tts-text');
    const btnIcon = document.getElementById('tts-icon');
    
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (btnText) btnText.innerText = "Ouvir Introdução";
        if (btnIcon) btnIcon.className = "fa-solid fa-volume-high";
        return;
    }
    
    // Read the portal intro text
    const introEl = document.getElementById('port-intro');
    if (!introEl) return;
    
    const text = introEl.innerText || introEl.textContent;
    activeUtterance = new SpeechSynthesisUtterance(text);
    activeUtterance.lang = 'pt-BR';
    
    activeUtterance.onend = () => {
        if (btnText) btnText.innerText = "Ouvir Introdução";
        if (btnIcon) btnIcon.className = "fa-solid fa-volume-high";
    };
    activeUtterance.onerror = () => {
        if (btnText) btnText.innerText = "Ouvir Introdução";
        if (btnIcon) btnIcon.className = "fa-solid fa-volume-high";
    };
    
    if (btnText) btnText.innerText = "Parar Leitura";
    if (btnIcon) btnIcon.className = "fa-solid fa-circle-stop";
    
    window.speechSynthesis.speak(activeUtterance);
}
window.toggleTTS = toggleTTS;

// ==========================================
// INSTITUTIONS RECOMMENDED MODAL (V18/V21)
// ==========================================
function showInstitutionsModal() {
    // Switch to portal tab first
    if (typeof window.switchTab === 'function') {
        window.switchTab('portal');
    }
    document.body.classList.add('sidebar-collapsed');
    const target = document.getElementById('port-institutions');
    if (target) {
        setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}
function closeInstitutionsModal() {
    // Do nothing since it is now a flat section
}
window.showInstitutionsModal = showInstitutionsModal;
window.closeInstitutionsModal = closeInstitutionsModal;

// Intercept menu clicks on flat section links (Institutions & Coffee Card)
document.querySelectorAll('.nav-item.nav-external a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#port-coffee' || href === '#port-institutions') {
            e.preventDefault();
            if (typeof window.switchTab === 'function') {
                window.switchTab('portal');
            }
            const target = document.querySelector(href);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 120);
            }
        }
    });
});
