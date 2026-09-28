# Relatório de implementação — versão 1.2.0

**Data:** 27 de setembro de 2026  
**Base:** auditoria pré-publicação de 27/09/2026

## Situação

As quatro fases do plano técnico/editorial foram aplicadas. Itens que dependiam de comprovação externa do proprietário foram resolvidos conservadoramente: as alegações foram qualificadas e o leitor foi orientado a consultar o e-MEC e as instituições. Isso evita publicar credenciamento não comprovado.

## Fase 1 — bloqueadores

- Corrigida a referência inexistente `installBtn`.
- Atualizados Faculdade Batista Logos e AIBREB para HTTPS; adotado o diretório oficial da AIBREB.
- Atualizadas URLs de produção e documentação operacional.
- Removida `ferramentas-biblicas.html` e os ativos legados duplicados `manifest.json`, `styles.css` e `script.js`.
- Confirmados todos os ativos locais e sintaxe JavaScript.

## Fase 2 — coerência do produto

- CSS e JavaScript do Guia foram extraídos para `css/guia-exegese.css` e `js/guia-exegese.js`.
- Guia passou a usar o módulo central `js/pwa.js` para atualizações do Service Worker.
- Adicionados controles compartilhados de acessibilidade e TTS por `js/a11y.js`.
- Progresso agora depende de ação explícita “Marcar módulo como concluído”.
- Abas receberam papéis ARIA, seleção, vínculo com painéis e navegação por setas.
- Accordions receberam estado inicial e `aria-controls`.
- Diálogos customizados receberam foco inicial, retorno e contenção por Tab.
- Foram adicionadas regras específicas para 320 px.

## Fase 3 — revisão acadêmica/editorial

- Recomendações institucionais foram identificadas como avaliação do curador.
- Inserida distinção entre cursos livres, formação eclesiástica, reconhecimento denominacional e credenciamento governamental.
- Atualizadas qualificações sobre Paroschi, LaSor, NA28/UBS5, ECM e CBGM.
- Fluxo exegético foi descrito como iterativo.
- Removida a expressão promocional “guia definitivo”.
- Corrigida inconsistência de editora de Mounce no portal.
- A descrição metodológica de Rega foi tornada cautelosa.
- Alegações sobre disponibilidade editorial e ausência de anúncios receberam data/fonte atribuída.
- Criada `docs/POLITICA-EDITORIAL.md`.

## Fase 4 — sustentabilidade

- Versão elevada para 1.2.0.
- Cache do Service Worker elevado para `v1.2.0` e novos ativos adicionados.
- Criados `CHANGELOG.md`, imagem social 1200×630 e metadados Twitter/Open Graph.
- Adicionado verificador de links locais e testes Playwright específicos do Guia.
- Dependências de produção: zero vulnerabilidades conhecidas em `npm audit --omit=dev`.

## Validações executadas

- `node --check sw.js`: aprovado.
- `node --check js/guia-exegese.js`: aprovado.
- parse de `data/recursos.json`: aprovado.
- verificador de links locais: aprovado.
- HTML: zero IDs duplicados nas sete páginas.
- busca de URLs operacionais obsoletas/inseguras: nenhuma ocorrência.
- `npm audit --omit=dev`: zero vulnerabilidades conhecidas.
- integridade do ZIP: aprovada.

## Limitação do ambiente de teste

A suíte Playwright foi atualizada e o navegador foi baixado, porém o sandbox não possui bibliotecas de sistema necessárias para iniciar Chromium (`libnss3`, `libatk`, `libasound2` e correlatas). Portanto, os testes de navegador, axe, instalação PWA e viewport real permanecem obrigatórios no GitHub Actions ou em computador com as dependências do Playwright. Essa limitação não foi tratada como aprovação implícita.

## Verificação humana ainda necessária

Antes da publicação, o proprietário deve confirmar:

1. situação atual de cursos superiores no e-MEC;
2. títulos, edições e ISBNs nos exemplares efetivamente usados;
3. teste real em Android/Chrome ou Brave e iPhone/Safari;
4. revisão final por docente qualificado e revisão ortográfica humana.
