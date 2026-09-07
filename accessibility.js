/**
 * Recursos de Acessibilidade - O Sentido Autêntico
 * Implementa funcionalidades para tornar o site mais acessível
 */

(function() {
    'use strict';

    // Configurações de acessibilidade
    const accessibilityConfig = {
        highContrast: false,
        largeText: false,
        reduceMotion: false
    };

    /**
     * Inicializa os recursos de acessibilidade
     */
    function initAccessibility() {
        loadAccessibilitySettings();
        createAccessibilityToolbar();
        setupKeyboardNavigation();
        applyAccessibilitySettings();
        announcePageChanges();
    }

    /**
     * Carrega configurações salvas no localStorage
     */
    function loadAccessibilitySettings() {
        try {
            const saved = localStorage.getItem('accessibilitySettings');
            if (saved) {
                const settings = JSON.parse(saved);
                Object.assign(accessibilityConfig, settings);
            }
        } catch (e) {
            console.warn('Não foi possível carregar as configurações de acessibilidade:', e);
        }
    }

    /**
     * Salva configurações no localStorage
     */
    function saveAccessibilitySettings() {
        try {
            localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilityConfig));
        } catch (e) {
            console.warn('Não foi possível salvar as configurações de acessibilidade:', e);
        }
    }

    /**
     * Cria a barra de ferramentas de acessibilidade
     */
    function createAccessibilityToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'accessibility-toolbar';
        toolbar.className = 'accessibility-toolbar';
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Ferramentas de acessibilidade');
        
        toolbar.innerHTML = `
            <button id="a11y-contrast" class="a11y-btn" aria-pressed="${accessibilityConfig.highContrast}" title="Alto Contraste">
                <i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i>
                <span class="sr-only">Alto Contraste</span>
            </button>
            <button id="a11y-text-size" class="a11y-btn" aria-pressed="${accessibilityConfig.largeText}" title="Aumentar Texto">
                <i class="fa-solid fa-text-height" aria-hidden="true"></i>
                <span class="sr-only">Aumentar Texto</span>
            </button>
            <button id="a11y-motion" class="a11y-btn" aria-pressed="${accessibilityConfig.reduceMotion}" title="Reduzir Movimento">
                <i class="fa-solid fa-person-walking-with-cane" aria-hidden="true"></i>
                <span class="sr-only">Reduzir Movimento</span>
            </button>
            <button id="a11y-skip-nav" class="a11y-btn" title="Pular Navegação">
                <i class="fa-solid fa-arrow-down-long" aria-hidden="true"></i>
                <span class="sr-only">Pular para Conteúdo</span>
            </button>
        `;
        
        document.body.insertBefore(toolbar, document.body.firstChild);
        
        // Adiciona event listeners
        document.getElementById('a11y-contrast').addEventListener('click', toggleHighContrast);
        document.getElementById('a11y-text-size').addEventListener('click', toggleLargeText);
        document.getElementById('a11y-motion').addEventListener('click', toggleReduceMotion);
        document.getElementById('a11y-skip-nav').addEventListener('click', skipToContent);
        
        // Atalhos de teclado
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    /**
     * Alterna alto contraste
     */
    function toggleHighContrast() {
        accessibilityConfig.highContrast = !accessibilityConfig.highContrast;
        document.body.classList.toggle('high-contrast', accessibilityConfig.highContrast);
        document.getElementById('a11y-contrast').setAttribute('aria-pressed', accessibilityConfig.highContrast);
        saveAccessibilitySettings();
        announceChange('Alto contraste ' + (accessibilityConfig.highContrast ? 'ativado' : 'desativado'));
    }

    /**
     * Alterna texto grande
     */
    function toggleLargeText() {
        accessibilityConfig.largeText = !accessibilityConfig.largeText;
        document.body.classList.toggle('large-text', accessibilityConfig.largeText);
        document.getElementById('a11y-text-size').setAttribute('aria-pressed', accessibilityConfig.largeText);
        saveAccessibilitySettings();
        announceChange('Tamanho do texto ' + (accessibilityConfig.largeText ? 'aumentado' : 'normal'));
    }

    /**
     * Alterna redução de movimento
     */
    function toggleReduceMotion() {
        accessibilityConfig.reduceMotion = !accessibilityConfig.reduceMotion;
        document.body.classList.toggle('reduce-motion', accessibilityConfig.reduceMotion);
        document.getElementById('a11y-motion').setAttribute('aria-pressed', accessibilityConfig.reduceMotion);
        saveAccessibilitySettings();
        announceChange('Movimento ' + (accessibilityConfig.reduceMotion ? 'reduzido' : 'normal'));
    }

    /**
     * Pula para o conteúdo principal
     */
    function skipToContent() {
        const mainContent = document.getElementById('main-content') || document.querySelector('main');
        if (mainContent) {
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
            announceChange('Navegando para o conteúdo principal');
        }
    }

    /**
     * Aplica configurações salvas
     */
    function applyAccessibilitySettings() {
        if (accessibilityConfig.highContrast) {
            document.body.classList.add('high-contrast');
        }
        if (accessibilityConfig.largeText) {
            document.body.classList.add('large-text');
        }
        if (accessibilityConfig.reduceMotion) {
            document.body.classList.add('reduce-motion');
        }
    }

    /**
     * Configura navegação por teclado
     */
    function setupKeyboardNavigation() {
        // Foco visível em todos os elementos interativos
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    /**
     * Anuncia mudanças para leitores de tela
     */
    function announceChange(message) {
        let announcer = document.getElementById('a11y-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'a11y-announcer';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            document.body.appendChild(announcer);
        }
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    /**
     * Anuncia mudanças de página/section
     */
    function announcePageChanges() {
        // Observa mudanças nas sections ativas
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('content-section') && target.classList.contains('active')) {
                        const heading = target.querySelector('h2, h3');
                        if (heading) {
                            setTimeout(() => {
                                announceChange('Navegando para: ' + heading.textContent);
                            }, 500);
                        }
                    }
                }
            });
        });
        
        document.querySelectorAll('.content-section').forEach(section => {
            observer.observe(section, { attributes: true, attributeFilter: ['class'] });
        });
    }

    /**
     * Manipula atalhos de teclado
     */
    function handleKeyboardShortcuts(e) {
        // Alt + 1: Alto contraste
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            toggleHighContrast();
        }
        // Alt + 2: Texto grande
        if (e.altKey && e.key === '2') {
            e.preventDefault();
            toggleLargeText();
        }
        // Alt + 3: Reduzir movimento
        if (e.altKey && e.key === '3') {
            e.preventDefault();
            toggleReduceMotion();
        }
        // Alt + S: Pular para conteúdo
        if (e.altKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            skipToContent();
        }
    }

    // Estilos CSS para acessibilidade
    const accessibilityStyles = `
        /* Barra de ferramentas de acessibilidade */
        .accessibility-toolbar {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg-primary, #fff);
            border: 2px solid var(--gold, #c5a059);
            border-radius: 8px;
            padding: 0.5rem;
            display: flex;
            gap: 0.25rem;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .a11y-btn {
            background: transparent;
            border: 1px solid var(--border-color, #ddd);
            border-radius: 4px;
            padding: 0.5rem;
            cursor: pointer;
            color: var(--text-primary, #333);
            transition: all 0.2s ease;
            min-width: 40px;
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .a11y-btn:hover {
            background: var(--gold, #c5a059);
            color: #fff;
            border-color: var(--gold, #c5a059);
        }
        
        .a11y-btn[aria-pressed="true"] {
            background: var(--gold-dark, #8b6f2e);
            color: #fff;
            border-color: var(--gold-dark, #8b6f2e);
        }
        
        .a11y-btn:focus {
            outline: 3px solid var(--gold, #c5a059);
            outline-offset: 2px;
        }
        
        /* Texto apenas para leitores de tela */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        /* Alto contraste */
        body.high-contrast {
            --text-primary: #000000 !important;
            --text-secondary: #000000 !important;
            --bg-primary: #ffffff !important;
            --bg-secondary: #f0f0f0 !important;
            --border-color: #000000 !important;
            --gold: #000000 !important;
            --gold-dark: #000000 !important;
        }
        
        body.high-contrast a,
        body.high-contrast button {
            text-decoration: underline !important;
        }
        
        body.high-contrast img {
            opacity: 0.9;
        }
        
        /* Texto grande */
        body.large-text {
            font-size: 1.25em !important;
        }
        
        body.large-text .sidebar {
            font-size: 0.9em !important;
        }
        
        /* Reduzir movimento */
        body.reduce-motion *,
        body.reduce-motion *::before,
        body.reduce-motion *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
        
        /* Preferência do sistema por redução de movimento */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }
        
        /* Foco visível para navegação por teclado */
        body.keyboard-navigation *:focus {
            outline: 3px solid var(--gold, #c5a059) !important;
            outline-offset: 2px !important;
        }
        
        body.keyboard-navigation *:focus:not(:focus-visible) {
            outline: none !important;
        }
        
        /* Skip link */
        .skip-link {
            position: absolute;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--gold-dark, #8b6f2e);
            color: #fff !important;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            font-weight: 600;
            border-radius: 0 0 8px 8px;
            z-index: 10000;
            transition: top 0.3s ease;
        }
        
        .skip-link:focus {
            top: 0;
        }
        
        /* Melhorar contraste de links */
        a {
            text-underline-offset: 2px;
        }
        
        a:hover,
        a:focus {
            text-decoration-thickness: 2px;
        }
    `;

    // Injeta estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = accessibilityStyles;
    document.head.appendChild(styleSheet);

    // Inicializa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibility);
    } else {
        initAccessibility();
    }

    // Exporta funções globais se necessário
    window.accessibilityTools = {
        toggleHighContrast,
        toggleLargeText,
        toggleReduceMotion,
        skipToContent,
        getConfig: () => ({ ...accessibilityConfig })
    };
})();
