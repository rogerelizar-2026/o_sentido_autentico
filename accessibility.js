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
        
        // Cria botões de forma segura usando createElement para prevenir XSS
        const contrastBtn = document.createElement('button');
        contrastBtn.id = 'a11y-contrast';
        contrastBtn.className = 'a11y-btn';
        contrastBtn.setAttribute('aria-pressed', accessibilityConfig.highContrast);
        contrastBtn.setAttribute('title', 'Alto Contraste');
        const contrastIcon = document.createElement('i');
        contrastIcon.className = 'fa-solid fa-circle-half-stroke';
        contrastIcon.setAttribute('aria-hidden', 'true');
        const contrastText = document.createElement('span');
        contrastText.className = 'sr-only';
        contrastText.textContent = 'Alto Contraste';
        contrastBtn.appendChild(contrastIcon);
        contrastBtn.appendChild(contrastText);
        
        const textSizeBtn = document.createElement('button');
        textSizeBtn.id = 'a11y-text-size';
        textSizeBtn.className = 'a11y-btn';
        textSizeBtn.setAttribute('aria-pressed', accessibilityConfig.largeText);
        textSizeBtn.setAttribute('title', 'Aumentar Texto');
        const textSizeIcon = document.createElement('i');
        textSizeIcon.className = 'fa-solid fa-text-height';
        textSizeIcon.setAttribute('aria-hidden', 'true');
        const textSizeText = document.createElement('span');
        textSizeText.className = 'sr-only';
        textSizeText.textContent = 'Aumentar Texto';
        textSizeBtn.appendChild(textSizeIcon);
        textSizeBtn.appendChild(textSizeText);
        
        const motionBtn = document.createElement('button');
        motionBtn.id = 'a11y-motion';
        motionBtn.className = 'a11y-btn';
        motionBtn.setAttribute('aria-pressed', accessibilityConfig.reduceMotion);
        motionBtn.setAttribute('title', 'Reduzir Movimento');
        const motionIcon = document.createElement('i');
        motionIcon.className = 'fa-solid fa-person-walking-with-cane';
        motionIcon.setAttribute('aria-hidden', 'true');
        const motionText = document.createElement('span');
        motionText.className = 'sr-only';
        motionText.textContent = 'Reduzir Movimento';
        motionBtn.appendChild(motionIcon);
        motionBtn.appendChild(motionText);
        
        const skipNavBtn = document.createElement('button');
        skipNavBtn.id = 'a11y-skip-nav';
        skipNavBtn.className = 'a11y-btn';
        skipNavBtn.setAttribute('title', 'Pular Navegação');
        const skipNavIcon = document.createElement('i');
        skipNavIcon.className = 'fa-solid fa-arrow-down-long';
        skipNavIcon.setAttribute('aria-hidden', 'true');
        const skipNavText = document.createElement('span');
        skipNavText.className = 'sr-only';
        skipNavText.textContent = 'Pular para Conteúdo';
        skipNavBtn.appendChild(skipNavIcon);
        skipNavBtn.appendChild(skipNavText);
        
        toolbar.appendChild(contrastBtn);
        toolbar.appendChild(textSizeBtn);
        toolbar.appendChild(motionBtn);
        toolbar.appendChild(skipNavBtn);
        
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

    // Nota: Estilos CSS da toolbar de acessibilidade foram movidos para styles.css
    // para evitar injeção dinâmica de CSS e consolidar todos os estilos em um único arquivo

    // Exporta funções globais se necessário
    window.accessibilityTools = {
        toggleHighContrast,
        toggleLargeText,
        toggleReduceMotion,
        skipToContent,
        getConfig: () => ({ ...accessibilityConfig })
    };

    // Funções wrapper para compatibilidade com o HTML existente e centralização da lógica de acessibilidade
    window.toggleHighContrast = function(checked) {
        if (checked && !accessibilityConfig.highContrast) {
            toggleHighContrast();
        } else if (!checked && accessibilityConfig.highContrast) {
            toggleHighContrast();
        }
    };

    window.adjustFontSize = function(action) {
        const currentScale = parseFloat(localStorage.getItem('fontScale') || '1.0');
        let newScale = currentScale;
        
        if (action === 'increase') {
            newScale = Math.min(currentScale + 0.1, 1.4);
        } else if (action === 'decrease') {
            newScale = Math.max(currentScale - 0.1, 0.8);
        } else if (action === 'reset') {
            newScale = 1.0;
        }
        
        localStorage.setItem('fontScale', newScale);
        
        const elementsToScale = document.querySelectorAll('.content p, .content li, .content td, .content h3, .content h4, .content span');
        elementsToScale.forEach(el => {
            el.style.fontSize = `calc(1rem * ${newScale})`;
        });
        
        const scaleDisplay = document.getElementById('font-scale-display');
        if (scaleDisplay) {
            scaleDisplay.textContent = Math.round(newScale * 100) + '%';
        }
    };

    window.toggleDyslexiaFont = function(checked) {
        if (checked) {
            document.body.classList.add('dyslexia-font');
            localStorage.setItem('dyslexiaActive', 'true');
        } else {
            document.body.classList.remove('dyslexia-font');
            localStorage.removeItem('dyslexiaActive');
        }
    };

    // Centraliza o carregamento das configurações salvas no localStorage
    function loadSavedAccessibilitySettings() {
        try {
            if (localStorage.getItem('dyslexiaActive') === 'true') {
                document.body.classList.add('dyslexia-font');
                const dyslexiaToggle = document.getElementById('dyslexia-toggle');
                if (dyslexiaToggle) dyslexiaToggle.checked = true;
            }
            if (localStorage.getItem('contrastActive') === 'true') {
                document.body.classList.add('high-contrast');
                const contrastToggle = document.getElementById('contrast-toggle');
                if (contrastToggle) contrastToggle.checked = true;
            }
            if (localStorage.getItem('fontScale')) {
                const savedScale = parseFloat(localStorage.getItem('fontScale'));
                setTimeout(() => {
                    const elementsToScale = document.querySelectorAll('.content p, .content li, .content td, .content h3, .content h4, .content span');
                    elementsToScale.forEach(el => {
                        el.style.fontSize = `calc(1rem * ${savedScale})`;
                    });
                    const scaleDisplay = document.getElementById('font-scale-display');
                    if (scaleDisplay) {
                        scaleDisplay.textContent = Math.round(savedScale * 100) + '%';
                    }
                }, 100);
            }
        } catch (err) {
            console.error('Erro ao carregar configurações de acessibilidade:', err);
        }
    }

    // Inicializa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initAccessibility();
            loadSavedAccessibilitySettings();
        });
    } else {
        initAccessibility();
        loadSavedAccessibilitySettings();
    }
})();
