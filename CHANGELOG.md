# Changelog

## 1.2.3 — 2026-09-28

### Paridade visual do Guia
- `guia-exegese.html` migrado para o mesmo shell, header, sidebar e drawer de `index.html`.
- FAB de acessibilidade passa a usar exclusivamente o posicionamento e estilo do design system.
- Removidos integralmente a busca do Guia e o índice lateral direito “Nesta página”.
- O princípio do minicard foi incorporado à seção “A jornada exegética”.
- Menu do Guia agora reutiliza `sidebar.js`, inclusive auto-ocultação e comportamento por teclado.


## 1.2.2 — 2026-09-28

### Navegação e unidade visual
- Removidos indicadores “Destino”, rótulo e busca do header do Guia, botões de ação do hero e botões “X” das gavetas.
- Header, sidebar, FAB de acessibilidade e tipografia do Guia alinhados ao Portal.
- “Instalar como App” adicionado às barras laterais desktop e mobile.
- Navegação inferior móvel sincronizada com o padrão do Portal em todas as páginas.
- Guia passa a usar menu lateral com auto-ocultação após 4 segundos.


## 1.2.1 — 2026-09-27

### Identidade visual
- Guia de Exegese alinhado ao design system do Portal do Estudante.
- Unificadas tipografia, paleta, ícones, favicon, cabeçalho, sidebar, cartões e navegação inferior.
- Preservada a organização didática e o progresso específico do Guia.
- Cache PWA atualizado para entregar os novos estilos.


## 1.2.0 — 2026-09-27

### Corrigido
- Erro de instalação PWA causado pela referência inexistente `installBtn`.
- URLs HTTPS e diretório oficial da AIBREB.
- URLs Open Graph e documentação operacional do caminho de produção.
- Atualização PWA do Guia integrada ao módulo central.
- Progresso do Guia alterado para conclusão explícita pelo estudante.
- Semântica e teclado de abas, accordions e diálogos do Guia.

### Segurança e manutenção
- Removida a página legada `ferramentas-biblicas.html` e ativos legados sem referência.
- CSS e JavaScript inline do Guia extraídos para arquivos próprios.
- Eliminados manifesto e folhas/scripts legados duplicados.

### Editorial
- Qualificadas recomendações institucionais, status bibliográfico e afirmações comerciais.
- Adicionada política editorial e de correções.
- Adicionada imagem social específica do Guia.

### Testes
- Ampliada a cobertura automatizada para o Guia, URLs, progresso, acessibilidade e largura de 320 px.
