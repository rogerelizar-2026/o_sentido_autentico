# Relatório de Auditoria de Código - O Sentido Autêntico

**Data da Auditoria:** Setembro 2026  
**Auditado por:** Sistema de Análise de Código  
**Versão do Projeto:** v31 (baseado no cache do Service Worker)

---

## 📋 Sumário Executivo

Foram identificados **28 problemas** distribuídos em **6 categorias críticas**, incluindo redundâncias de código, inconsistências de implementação, bugs potenciais, problemas de acessibilidade, questões de performance e vulnerabilidades de segurança.

**Status da Correção (Outubro 2024):**
- ✅ 4 bugs críticos resolvidos
- ⚠️ 1 bug parcialmente resolvido (requer refatoração adicional)
- 🔄 23 problemas restantes aguardando implementação

---

## 🔴 Categoria 1: Bugs Críticos e Erros de Lógica

### 1.1 Variável `sidebarTimeout` inacessível no escopo global - ✅ RESOLVIDO
- **Arquivo:** `script.js` (linhas 6, 18, 23)
- **Problema Original:** A variável `sidebarTimeout` era declarada dentro do IIFE `SidebarManager` mas era referenciada no escopo global.
- **Solução Implementada:** A função `resetSidebarTimer` foi exposta através do objeto retornado por `SidebarManager` como `window.resetSidebarTimer`, permitindo acesso externo seguro sem expor a variável interna diretamente.

### 1.2 Função `switchTab` duplicada e conflitante
- **Arquivo:** `script.js` (linhas 125, 809)
- **Problema:** A função `switchTab` é exposta duas vezes globalmente (linha 125 dentro de `LanguageSwitcher.init()` e linha 809 explicitamente). Pode causar confusão de escopo.
- **Solução Proposta:** Manter apenas uma exposição global na seção de inicialização.

### 1.3 Funções `showInstitutionsModal` e `closeInstitutionsModal` duplicadas - ✅ RESOLVIDO
- **Arquivo:** `script.js` 
- **Problema Original:** As mesmas funções eram declaradas duas vezes com implementações diferentes (linhas 1009-1022 e 1109-1126). A segunda declaração sobrescrevia a primeira, tornando o código das linhas 1009-1022 morto/inútil.
- **Solução Implementada:** Removida a primeira declaração duplicada (linhas 1009-1022), mantendo apenas a implementação consolidada nas linhas 1101-1118.

### 1.4 Event listener `DOMContentLoaded` duplicado - ✅ PARCIALMENTE RESOLVIDO
- **Arquivo:** `script.js` (linhas 235 e 835)
- **Problema Original:** Existiam três listeners separados para `DOMContentLoaded` executando lógica similar.
- **Solução Implementada:** 
  - Unificado o listener da linha 235 de `window.addEventListener` para `document.addEventListener` para consistência
  - Removido o terceiro listener (antiga linha 1121) que envolvia menu de instituições, movendo a lógica para execução direta após a definição das funções
  - Mantidos dois listeners principais (linhas 235 e 835) pois possuem responsabilidades distintas: um para gráficos Chart.js e outro para configurações de acessibilidade e modal de boas-vindas
- **Observação:** A consolidação completa exigiria reestruturação maior do código dos gráficos

### 1.5 Fallback de imagem `onerror` problemático - ✅ RESOLVIDO
- **Arquivo:** `script.js` (linha 941 originalmente)
- **Problema Original:** O uso de `innerHTML` com interpolação direta para imagens podia causar comportamento inesperado em caso de erro de carregamento.
- **Solução Implementada:** Substituído por criação dinâmica de elemento `img` com handler `onerror` adequado que exibe mensagem de "Imagem não disponível" ao invés de tentar carregar fallbacks potencialmente inexistentes.

---

## 🟠 Categoria 2: Redundâncias de Código

### 2.1 CSS injetado dinamicamente duplicado
- **Arquivos:** `accessibility.js` (linhas 243-394) e `styles.css`
- **Problema:** O arquivo `accessibility.js` injeta estilos CSS via JavaScript (linhas 243-394) que provavelmente já existem em `styles.css`. Isso causa duplicação de regras e aumento desnecessário do tamanho do DOM.
- **Solução Proposta:** Mover todos os estilos de acessibilidade para `styles.css` e remover a injeção dinâmica.

### 2.2 Toggle functions duplicadas entre arquivos
- **Arquivos:** `script.js` e `accessibility.js`
- **Problema:** 
  - `toggleHighContrast` existe em `script.js` (linha 1058) e `accessibility.js` (linha 97)
  - `toggleLargeText` / ajuste de fonte existe em ambos os arquivos
- **Solução Proposta:** Centralizar todas as funções de acessibilidade em `accessibility.js` e remover duplicatas do `script.js`.

### 2.3 Seletor de elementos repetido múltiplas vezes
- **Arquivo:** `script.js`
- **Problema:** `document.getElementById('welcome-modal-overlay')` é chamado pelo menos 6 vezes em diferentes funções. Deveria ser cacheado.
- **Solução Proposta:** Criar uma variável cacheada no escopo superior.

### 2.4 Configurações de localStorage redundantes
- **Arquivos:** `script.js` e `accessibility.js`
- **Problema:** 
  - `script.js` usa `localStorage.getItem('dyslexiaActive')`, `localStorage.getItem('contrastActive')`, `localStorage.getItem('fontScale')`
  - `accessibility.js` usa `localStorage.getItem('accessibilitySettings')` com objeto JSON
- **Inconsistência:** Dois sistemas diferentes de persistência de configurações de acessibilidade.
- **Solução Proposta:** Unificar para um único sistema (preferencialmente o do `accessibility.js` que é mais organizado).

### 2.5 Chart.js configurations repetitivas
- **Arquivo:** `script.js` (linhas 258-710)
- **Problema:** Configurações de opções de gráficos (responsive, maintainAspectRatio, plugins.title.font) são repetidas literalmente em todos os 9+ gráficos.
- **Solução Proposta:** Criar objetos de configuração compartilhados.

---

## 🟡 Categoria 3: Inconsistências e Problemas de Manutenibilidade

### 3.1 Nomenclatura inconsistente de funções
- **Arquivo:** `script.js`
- **Problema:** 
  - Algumas funções usam camelCase: `closeWelcomeModal`, `copyPixKey`
  - Outras usam PascalCase para construtores: `SidebarManager`, `LanguageSwitcher`
  - Mistura de padrões dificulta a leitura.
- **Solução Proposta:** Adotar convenção consistente (recomenda-se camelCase para funções).

### 3.2 Comentários desatualizados
- **Arquivo:** `processar_imagens.py` (linha 4)
- **Problema:** Comentário diz "Setembro de 2026" mas estamos em 2024/2025. Data futura inconsistente.
- **Solução Proposta:** Atualizar para data real ou remover ano específico.

### 3.3 Versão do cache hardcoded
- **Arquivo:** `sw.js` (linha 1)
- **Problema:** `CACHE_NAME = 'o-sentido-autentico-cache-v31'` requer atualização manual a cada deploy. Fácil de esquecer.
- **Solução Proposta:** Usar timestamp ou hash de build automático.

### 3.4 Caminhos de imagem inconsistentes
- **Arquivos:** `index.html`, `sw.js`, `processar_imagens.py`
- **Problema:** 
  - `index.html` referencia `imagens/capa-ross.png`
  - `processar_imagens.py` converte JPG para PNG na pasta `imagens/`
  - Mas há arquivos `.jpg` na pasta `imagens/` (capa-mounce.jpg, etc.)
- **Inconsistência:** Mistura de formatos pode causar fallbacks indesejados.
- **Solução Proposta:** Padronizar para um único formato ou implementar sistema de fallback mais robusto.

### 3.5 Estrutura de pastas inconsistente
- **Problema:** Arquivos de imagem estão tanto na raiz quanto em `imagens/` durante o processamento. O script `processar_imagens.py` procura em ambos os lugares.
- **Solução Proposta:** Definir localização única para arquivos de origem.

---

## 🟠 Categoria 4: Problemas de Acessibilidade (A11y)

### 4.1 Toolbar de acessibilidade compete com controles nativos
- **Arquivos:** `accessibility.js` e `index.html`
- **Problema:** Existem dois sistemas de controles de acessibilidade:
  1. Toolbar flutuante criada dinamicamente por `accessibility.js`
  2. Painel fixo na sidebar em `index.html`
- **Impacto:** Confusão para usuários que necessitam de recursos de acessibilidade.
- **Solução Proposta:** Unificar em uma única interface.

### 4.2 Leitor TTS limitado
- **Arquivo:** `script.js` (linhas 1070-1104)
- **Problema:** A função `toggleTTS` lê apenas o elemento `#port-intro`. Não há opção para ler outras seções.
- **Solução Proposta:** Implementar leitor de página completa ou permitir seleção de seções.

### 4.3 Contraste de cores questionável
- **Arquivo:** `styles.css` (não totalmente visível, mas referenciado)
- **Problema:** Variáveis CSS como `--gold` (#c5a059) sobre fundos claros podem não atingir ratio de contraste WCAG AA.
- **Solução Proposta:** Testar contrastes com ferramenta automatizada e ajustar cores.

### 4.4 Skip link não implementado funcionalmente
- **Arquivo:** `accessibility.js` (linhas 366-383)
- **Problema:** Estilos para `.skip-link` existem, mas não há elemento HTML correspondente visível.
- **Solução Proposta:** Adicionar skip link real no HTML ou remover estilos mortos.

---

## 🔵 Categoria 5: Performance e Otimização

### 5.1 Falta de debounce em event listeners
- **Arquivo:** `script.js` (linhas 67-70)
- **Problema:** Múltiplos eventos (`mousemove`, `touchstart`, `keydown`, `scroll`, `mousedown`) disparam `handleActivity` sem debounce/throttle, causando execuções excessivas.
- **Solução Proposta:** Implementar throttle de 100-200ms.

### 5.2 Query selectors em loop
- **Arquivo:** `script.js` (linha 1036)
- **Problema:** `document.querySelectorAll('.content p, .content li, .content td, .content h3, .content h4, .content span')` é executado toda vez que `adjustFontSize` é chamado.
- **Solução Proposta:** Cache dos elementos ou usar classe CSS dedicada.

### 5.3 Imagens sem lazy loading
- **Arquivo:** `index.html`
- **Problema:** Imagens de capas de livros não usam `loading="lazy"`, impactando carregamento inicial.
- **Solução Proposta:** Adicionar `loading="lazy"` em imagens abaixo do fold.

### 5.4 Service Worker cacheia tudo sem estratégia
- **Arquivo:** `sw.js`
- **Problema:** Estratégia de cache é "cache-first" para tudo, incluindo possíveis atualizações frequentes.
- **Solução Proposta:** Implementar estratégia "stale-while-revalidate" para conteúdo dinâmico.

### 5.5 Áudio m4a sem fallback
- **Arquivo:** `index.html` (referência a `línguas_bíblicas_e_tecnologia.m4a`)
- **Problema:** Formato m4a não é universalmente suportado. Não há fallback para mp3 ou ogg.
- **Solução Proposta:** Fornecer múltiplos formatos ou converter para formato mais compatível.

---

## 🟣 Categoria 6: Segurança e Boas Práticas

### 6.1 innerHTML com interpolação potencialmente insegura
- **Arquivo:** `script.js` (linhas 914-928)
- **Problema:** Uso de template literals com `innerHTML` para criar modal. Se `title` ou `href` contiverem conteúdo malicioso, XSS é possível.
- **Solução Proposta:** Sanitizar inputs ou usar `textContent` e `createElement`.

### 6.2 eval implícito via Function constructor ausente mas...
- **Arquivo:** `script.js`
- **Observação:** Não foi encontrado uso de `eval()`, o que é positivo. Porém, `setTimeout` com string não foi verificado completamente.

### 6.3 Links externos sem rel="noopener" consistentemente
- **Arquivo:** `index.html`
- **Problema:** Alguns links têm `rel="noopener"` (linha 904 no JS), mas links no HTML podem não ter.
- **Solução Proposta:** Auditar todos os links externos e adicionar `rel="noopener noreferrer"`.

### 6.4 Validação de input ausente
- **Arquivo:** `processar_imagens.py`
- **Problema:** Não há validação se arquivos de imagem são realmente imagens antes de processar.
- **Solução Proposta:** Adicionar verificação de assinatura de arquivo (magic numbers).

### 6.5 Testes unitários incompletos
- **Arquivo:** `test_processar_imagens.py`
- **Problema:** Teste `test_imagem_rgba_convertida_para_rgb` (linha 128) não verifica efetivamente a conversão, apenas que não houve exceção.
- **Solução Proposta:** Melhorar asserções para validar resultado real da conversão.

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| Total de Linhas de Código | ~7,308 |
| Arquivos JavaScript | 3 (script.js, accessibility.js, sw.js) |
| Arquivos Python | 2 (processar_imagens.py, test_processar_imagens.py) |
| Arquivos HTML | 2 (index.html, ferramentas-biblicas.html) |
| Arquivos CSS | 1 (styles.css - 2,551 linhas) |
| Tamanho do Backup | ~23.7 MB (SA-Bvkp.zip) |

---

## 🎯 Priorização de Correções

### Crítico (Resolver Imediatamente)
1. Bug da variável `sidebarTimeout` (1.1)
2. Funções duplicadas `showInstitutionsModal` (1.3)
3. Event listeners duplicados (1.4)

### Alto (Resolver na Próxima Sprint)
4. Unificação de sistemas de acessibilidade (2.4, 4.1)
5. Fallback de imagens (1.5, 3.4)
6. XSS via innerHTML (6.1)

### Médio (Planejar para Futuro)
7. Otimização de performance (5.1, 5.2, 5.3)
8. Consistência de nomenclatura (3.1)
9. Melhoria nos testes (6.5)

### Baixo (Melhorias Contínuas)
10. Comentários desatualizados (3.2)
11. Versionamento automático de cache (3.3)

---

## ✅ Pontos Positivos Identificados

1. **Estrutura modular** com IIFEs bem definidas
2. **PWA implementado** com Service Worker funcional
3. **Preocupação com acessibilidade** mesmo que haja duplicações
4. **Testes unitários** presentes para o módulo Python
5. **Comentários descritivos** na maioria das funções
6. **Separação de responsabilidades** entre arquivos
7. **Uso de variáveis CSS** para theming
8. **Fallback de imagens** implementado (mesmo que imperfeito)

---

## 📝 Recomendações Gerais

1. **Implementar ESLint/Prettier** para padronização automática
2. **Configurar husky pre-commit hooks** para rodar linters
3. **Adicionar TypeScript** gradualmente para type safety
4. **Implementar CI/CD** com validação automática
5. **Criar documentação** de arquitetura do projeto
6. **Estabelecer code review** obrigatório
7. **Monitorar performance** com Lighthouse CI
8. **Realizar auditoria de segurança** com ferramentas especializadas

---

*Relatório gerado automaticamente. Para dúvidas, consulte a equipe de desenvolvimento.*
