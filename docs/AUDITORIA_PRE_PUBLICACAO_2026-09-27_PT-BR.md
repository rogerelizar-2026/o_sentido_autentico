# Auditoria pré-publicação — O Sentido Autêntico + Guia Integrado de Exegese

**Data da auditoria:** 27 de setembro de 2026  
**Escopo:** pacote `o_sentido_autentico_integrado`, reconstruído a partir do repositório público `rogerelizar-2026/o_sentido_autentico` e acrescido do Guia Integrado de Exegese.  
**Tipo de auditoria:** código estático, arquitetura front-end/PWA, segurança, acessibilidade, UI/UX, consistência editorial, jornalística, filológica e teológica.  
**Limites:** esta não foi uma prova de invasão, auditoria jurídica, validação pelo MEC, revisão por pares acadêmica nem teste em todos os navegadores/dispositivos. Afirmações institucionais, catálogos editoriais e disponibilidade de recursos externos são mutáveis e precisam de confirmação pelo proprietário antes da publicação.

---

## 1. Parecer executivo

O projeto possui boa base: arquitetura estática apropriada ao GitHub Pages, PWA já estruturado, recursos locais, navegação responsiva, preocupação com acessibilidade, bibliografia extensa e intenção pedagógica responsável. A integração do Guia amplia significativamente o valor do portal ao conectar formação linguística, hermenêutica, crítica textual, sintaxe, discurso e aplicação.

**Entretanto, não se recomenda publicar o pacote integrado sem uma rodada corretiva.** Há um erro funcional certo no fluxo de instalação do Guia, URLs de produção antigas, um link institucional incorreto, uma página legada que amplia a superfície de segurança e uma integração visual/funcional ainda parcial entre o Guia e o design system do portal.

### Classificação geral

| Área | Avaliação | Observação |
|---|---|---|
| Arquitetura estática | Boa | Adequada ao GitHub Pages |
| PWA/offline | Boa base, correções necessárias | Cache integrado, mas fluxo de instalação/atualização do Guia é inconsistente |
| Segurança | Moderada | Sem vulnerabilidades npm de produção; página legada e ausência de política de conteúdo exigem atenção |
| Acessibilidade | Moderada | Portal principal é melhor estruturado que a página do Guia |
| UI/UX | Boa, mas inconsistente | Guia ainda funciona como microsite visual dentro do portal |
| Conteúdo teológico/filológico | Bom nível introdutório | Requer qualificações editoriais e revisão especializada |
| Rigor jornalístico/bibliográfico | Moderado | Há absolutos promocionais, links e dados temporais a verificar |
| Prontidão para publicação | **Não aprovada sem P0/P1** | Corrigir itens prioritários abaixo |

---

# 2. Riscos prioritários — P0 (corrigir antes do upload)

## P0.1 — Erro JavaScript após aceitar a instalação do PWA

**Local:** `guia-exegese.html`, função `openInstall()`, aproximadamente linha 506.  
**Erro:** após `deferredInstall.userChoice`, o código executa `installBtn.hidden=true`, mas `installBtn` foi removido do header e não é mais declarado.

```js
installBtn.hidden = true;
```

**Impacto:** gera `ReferenceError` imediatamente após o fluxo de instalação. A instalação nativa pode até ter sido aceita, mas a interface termina em erro e o estado do diálogo pode ficar inconsistente.

**Correção:** remover a referência ou substituir por atualização dos controles existentes:

```js
document.querySelectorAll('[data-install-action], [data-install-menu]')
  .forEach((button) => { button.hidden = true; });
```

Idealmente, o Guia não deve manter um segundo gerenciador de PWA. Deve reutilizar o módulo central `js/pwa.js` e o diálogo/aviso do portal.

**Critério de aceite:** instalar em Android/Chrome ou Brave sem erro no console; cancelar e aceitar o prompt; reabrir instalado; verificar `display-mode: standalone`.

---

## P0.2 — Link incorreto para “Seminários Nacional AIBREB”

**Local:** `guia-exegese.html`, aproximadamente linha 82.  
**Atual:** `http://seminariosnacionalaibreb.org.br`  
**Problema:** o domínio indicado não corresponde ao diretório oficial verificado. O diretório institucional está disponível em:

```text
https://aibreb.org.br/instituicoes_seminarios.html
```

**Impacto:** quebra de confiança, possível destino inexistente ou futuro risco de domínio de terceiros; prejuízo jornalístico e pastoral.

**Correção:** substituir o endereço, usar HTTPS e alterar o rótulo para:

> AIBREB — Diretório de instituições, faculdades e seminários

**Observação editorial:** a listagem da AIBREB representa reconhecimento/relacionamento denominacional; não prova, por si, credenciamento acadêmico governamental.

---

## P0.3 — URLs de produção antigas em Open Graph e documentação operacional

**Locais principais:**

- `hebraico-aramaico.html`, `og:url`;
- `grego-koine.html`, `og:url`;
- `caixa-de-ferramentas.html`, `og:url`;
- `README.md`;
- `docs/AUDITORIA-2026-09-24.md`;
- `docs/LIMITACOES-PERGUNTAS.md`;
- `docs/PLANO-IMPLEMENTACAO.md`;
- `docs/PUBLICAR-GITHUB.md`.

**Atual antigo:**

```text
https://rogerelizar-2026.github.io/AutenticSense-Free/
```

**Correto:**

```text
https://rogerelizar-2026.github.io/o_sentido_autentico/
```

**Impacto:** compartilhamento social aponta para outro caminho; documentação pode levar o proprietário a publicar no repositório errado; testes antigos podem validar a base incorreta.

**Correção:** busca global por `AutenticSense-Free`, atualização dos três `og:url`, README, documentação e qualquer teste que compare URL canônica, sitemap e `package.json.homepage`.

**Critério de aceite:** nenhuma ocorrência operacional remanescente, exceto em um histórico claramente marcado como obsoleto.

---

## P0.4 — Página legada acessível com risco de injeção e dependências externas

**Local:** `ferramentas-biblicas.html`.

**Achados:**

- Tailwind carregado por `cdn.tailwindcss.com` em produção;
- Font Awesome, jsPDF e AutoTable por CDN sem Subresource Integrity;
- múltiplos `innerHTML` com interpolação de `res.titulo`, `res.descricao`, `res.url`, `res.tipo` e outros campos;
- links `target="_blank"` gerados sem `rel="noopener noreferrer"`;
- código e tema duplicados em relação à nova `caixa-de-ferramentas.html`.

**Risco:** se os recursos puderem ser importados, editados ou manipulados localmente, os templates `innerHTML` podem permitir DOM XSS persistente. Mesmo sem exploração atual, a página aumenta superfície de ataque, peso e dívida de manutenção.

**Correção recomendada:**

1. remover a página do pacote público; ou
2. movê-la para `arquivomorto/` com `noindex` e redirecionamento para `caixa-de-ferramentas.html`; e
3. não incluí-la no Service Worker; e
4. se for mantida, substituir interpolação por `textContent`, validar URLs e adicionar `rel` seguro.

**Critério de aceite:** apenas uma ferramenta oficial de catálogo permanece acessível.

---

# 3. Riscos altos — P1 (corrigir antes de divulgar publicamente)

## P1.1 — Integração visual é funcional, mas não é realmente “nativa”

**Situação:** `guia-exegese.html` mantém design system, header, sidebar, navegação inferior, modais, tema e JavaScript próprios. O portal utiliza classes `osa-*`, fontes locais, drawer, acessibilidade, termos e módulos ES.

**Impacto UX:** o usuário percebe mudança de aplicativo ao entrar no Guia. Tema, navegação, acessibilidade, comportamento do menu e instalação não são uniformes. A manutenção exige corrigir dois sistemas.

**Correção:** converter o Guia para o shell do portal:

- `osa-shell`, `osa-sidebar`, `osa-header`, `osa-drawer`, `osa-bottomnav`;
- carregar `css/main.css` e um `css/guia-exegese.css` apenas com componentes específicos;
- mover o JavaScript para `js/guia-exegese.js`;
- reutilizar `js/main.js`, `theme.js`, `sidebar.js`, `a11y.js` e `pwa.js`;
- preservar módulos, diagramas e identidade cromática interna.

**Critério de aceite:** navegar entre Portal, Grego e Guia sem ruptura de header, bottom nav, controles de acessibilidade ou tema.

---

## P1.2 — Fluxo de atualização PWA não é compartilhado pelo Guia

O portal usa `js/pwa.js`, com Service Worker em espera e aviso “Nova versão disponível”. O Guia registra `sw.js` diretamente e não implementa o mesmo fluxo de atualização.

**Impacto:** usuário pode permanecer em versão antiga ao visitar predominantemente o Guia; comportamento de atualização varia conforme a página.

**Correção:** remover o registro inline do Guia e inicializar o PWA pelo módulo central. Manter um único fluxo de instalação e atualização.

---

## P1.3 — Progresso marcado automaticamente sem ação pedagógica real

**Local:** `guia-exegese.html`, `IntersectionObserver`, aproximadamente linha 491.

O módulo é marcado como concluído quando entra 45% na interseção durante a rolagem.

**Impacto:** rolar rapidamente produz falso progresso e enfraquece o valor pedagógico da indicação “concluído”.

**Correções possíveis:**

- renomear para “visitado”; ou
- exigir botão “Marcar como concluído”; ou
- exigir leitura mínima + interação/checklist; ou
- manter duas métricas: visitado e concluído.

**Recomendação:** progresso explícito por ação do estudante.

---

## P1.4 — Acessibilidade incompleta em abas, accordions e diálogos

### Abas

- botões têm `role="tablist"` no contêiner, mas faltam `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"` e navegação por setas.

### Accordions

- `aria-expanded` é definido apenas depois do clique;
- faltam `aria-controls` e IDs vinculados.

### Diálogos customizados

- não há armadilha de foco;
- foco inicial e retorno ao disparador não são garantidos;
- conteúdo atrás do modal pode permanecer navegável.

### Header auto-ocultável

- pode esconder controles durante ampliação, uso por teclado ou tecnologias assistivas;
- deve ser testado a 200% e 400% de zoom.

**Correção:** adotar padrões WAI-ARIA de tabs, accordion e dialog; preferir `<dialog>` como o portal; integrar `a11y.js`.

---

## P1.5 — Alegação acadêmica e credenciamento precisam ser distinguidos

**Local:** introdução do Guia, aproximadamente linhas 78–82.

O texto fala em “instituição de ensino credenciada” e em seguida recomenda Faculdade Batista Logos e o diretório da AIBREB. Isso pode induzir o leitor a entender que todas as instituições listadas possuem credenciamento acadêmico estatal.

**Correção editorial sugerida:**

> Para cursos livres, formação eclesiástica e graduação reconhecida, os critérios são diferentes. Verifique diretamente no e-MEC a situação de cursos superiores e consulte as instituições quanto à natureza da certificação. A listagem da AIBREB indica vínculo ou referência denominacional, não credenciamento governamental automático.

**Ação do proprietário:** confirmar no e-MEC e com a instituição a natureza exata dos cursos citados.

---

## P1.6 — Links HTTP em página HTTPS

**Locais:** Guia e listagem institucional.

- `http://faculdadebatistalogos.edu.br` deve usar HTTPS;
- AIBREB deve usar `https://aibreb.org.br/instituicoes_seminarios.html`.

**Impacto:** redirecionamentos, avisos de conteúdo não seguro e menor confiança.

---

## P1.7 — Navegação inferior com cinco itens precisa de validação em telas pequenas

**Local:** `css/components.css`, aproximadamente linhas 276–300.

A grade passou de quatro para cinco itens. Em 320 px, rótulos como “Ferramentas” podem ficar excessivamente pequenos ou apertados.

**Correção:** testar 320, 360, 375 e 412 px; considerar rótulo “Recursos”; garantir alvo de toque mínimo 44×44 px e fonte legível. Avaliar colocar o Guia dentro de “Mais” se houver futura expansão.

---

# 4. Riscos médios — P2

## P2.1 — CSS e JavaScript inline dificultam manutenção e política de segurança

O Guia contém grande bloco `<style>` e script inline. Isso impede uma Content Security Policy estrita sem `'unsafe-inline'` e dificulta revisão, cache granular e testes.

**Correção:** extrair para:

```text
css/guia-exegese.css
js/guia-exegese.js
```

Depois avaliar CSP por `<meta http-equiv>` compatível com GitHub Pages. Cabeçalhos HTTP personalizados não são fornecidos nativamente pelo GitHub Pages.

---

## P2.2 — Redundância estrutural e arquivos legados

Existem pares ou gerações sobrepostas:

- `manifest.json` e `manifest.webmanifest`;
- `styles.css` e `css/*`;
- `script.js` e `js/*`;
- `ferramentas-biblicas.html` e `caixa-de-ferramentas.html`.

**Impacto:** confusão sobre fonte oficial, risco de corrigir o arquivo errado e crescimento do pacote.

**Correção:** declarar uma fonte canônica e arquivar/remover legados. Documentar no README.

---

## P2.3 — Metadados canônicos relativos

As páginas principais usam `canonical` relativo. Embora navegadores resolvam a URL, canônicos absolutos são mais claros para indexadores e auditorias.

**Correção:** usar URLs absolutas com a base correta do GitHub Pages.

---

## P2.4 — Ausência de página social específica para o Guia

O Guia possui título e descrição Open Graph, mas falta `og:image` e Twitter Card correspondente.

**Sugestão:** criar imagem 1200×630 com livro aberto, título e identidade do portal; adicionar `og:image`, `twitter:card`, `twitter:title`, `twitter:description`.

---

## P2.5 — Testes automatizados ainda não contemplam plenamente o Guia

Os testes existentes foram escritos antes da integração.

**Adicionar casos para:**

- links do Guia em sidebar, drawer e bottom nav;
- funcionamento offline de `guia-exegese.html`;
- atalhos do manifesto;
- instalação/atualização PWA;
- tabs e accordions por teclado;
- persistência `osa:exegese:state`;
- ausência de overflow em 320 px;
- tema compartilhado;
- todas as URLs canônicas;
- link checker externo agendado.

---

## P2.6 — Service Worker tolera silenciosamente falhas no precache

O uso de `Promise.allSettled` impede que um recurso ausente derrube a instalação, o que é resiliente, mas pode levar a uma promessa “offline” parcialmente cumprida.

**Correção:** manter tolerância em produção, mas fazer o teste CI falhar quando qualquer item de `CORE_ASSETS` não retornar 200. Exibir versão/cache em uma tela “Sobre”.

---

# 5. Auditoria de conteúdo — teologia, filologia e hermenêutica

## T1 — Declarar claramente o ponto de vista confessional

O portal usa linguagem evangélica e recomenda instituições batistas regulares. Isso é legítimo, mas precisa ser editorialmente explícito.

**Sugestão de nota:**

> Este projeto é produzido a partir de uma perspectiva cristã evangélica confessional. Procura apresentar ferramentas acadêmicas com honestidade, distinguindo dados textuais, decisões metodológicas e convicções teológicas.

Isso é mais transparente que sugerir neutralidade completa.

---

## T2 — “Intenção original” precisa de formulação mais precisa

Evitar prometer acesso direto à psicologia do autor. Preferir:

> intenção comunicativa historicamente acessível por meio da forma final do texto, de seu contexto e de seus primeiros destinatários.

Quando relevante, distinguir autor histórico, narrador, autor implícito, redação final e função canônica.

---

## T3 — Não apresentar um método exegético como sequência infalível

O fluxo do Guia é didaticamente útil, mas a exegese é iterativa. Crítica textual, léxico, sintaxe, gênero, contexto e teologia bíblica frequentemente exigem retorno a etapas anteriores.

**Correção:** representar o fluxo como espiral ou ciclo revisável, não somente linha unidirecional.

---

## T4 — Atualização em crítica textual

Paroschi permanece útil historicamente, mas trabalha com NA26/UBS3 e categorias hoje tratadas de forma mais nuançada.

**Acrescentar:**

- NA28/UBS5;
- ECM quando aplicável;
- Coherence-Based Genealogical Method como desenvolvimento relevante, sem apresentá-lo como solução automática;
- distinção entre “texto original”, “texto inicial” e “forma mais antiga recuperável”, conforme o escopo adotado.

---

## T5 — Aspecto verbal grego e sistema verbal hebraico

O Guia já inclui alertas úteis, mas deve deixar claro que há debates contemporâneos:

- tempo, aspecto e modalidade no grego;
- discurso e Aktionsart;
- perfeito grego;
- formas qatal/yiqtol e sequências no hebraico;
- diferenças entre modelos pedagógicos tradicionais e linguística atual.

Não resolver controvérsias complexas com uma tabela introdutória.

---

## T6 — Tipologia, alegoria e uso do AT no NT

A apresentação segue linha evangélica clássica. Convém mencionar que existem abordagens distintas sobre:

- sensus plenior;
- leitura canônica;
- intertextualidade;
- tipologia retrospectiva;
- métodos judaicos do Segundo Templo.

**Sugestão:** acrescentar “abordagens em debate” e bibliografia contrastante, sem transformar o guia introdutório em tratado.

---

## T7 — Diferenciar descrição acadêmica de endosso doutrinário

Frases como “grande fidelidade às Escrituras” são avaliações do curador, não fatos mensuráveis universalmente.

**Reescrita:**

> Seguem duas recomendações do curador, escolhidas por sua orientação confessional, seriedade didática e experiência pessoal de formação. O estudante deve verificar natureza do curso, corpo docente, matriz curricular e reconhecimento aplicável.

---

# 6. Auditoria filológica e bibliográfica

## F1 — Rega descrito como “indutivo”

O portal chama a abordagem de Rega/Bergmann de “didática indutiva”. Materiais descritivos da obra também a apresentam como método dedutivo e de substituição progressiva. A terminologia precisa ser conferida no prefácio/metodologia da edição efetivamente usada.

**Correção segura:** “abordagem progressiva, com explicação de paradigmas e exercícios graduais”.

---

## F2 — Inconsistência editorial de Mounce

Na página inicial aparece “Mounce — Vida” em um ponto e “Mounce — Vida Nova” na tabela. Confirmar título, editora, edição e ISBN do exemplar brasileiro. Evitar alternar:

- *Fundamentos do grego bíblico*;
- “Gramática do NT Grego”.

Usar sempre o título bibliográfico oficial.

---

## F3 — “Guia definitivo” é linguagem promocional excessiva

O portal chama Wallace de “guia definitivo”. Nenhuma gramática deve ser apresentada como definitiva, especialmente diante de debates linguísticos posteriores.

**Reescrita:**

> Uma das gramáticas de sintaxe exegética do grego do NT mais influentes e amplamente utilizadas em nível intermediário e avançado.

---

## F4 — Disponibilidade de Paroschi e LaSor é temporal

O aviso “não são mais publicados/vendidos” deve receber data de verificação:

> Situação consultada em setembro de 2026; disponibilidade pode mudar e exemplares usados podem existir.

LaSor aparece como esgotado em catálogos e em mercado de usados. Não afirmar inexistência absoluta.

---

## F5 — Bibliografia precisa de padrão único

Definir ABNT, Chicago ou SBL e padronizar:

- nomes dos autores;
- itálico;
- edição;
- tradutor;
- cidade/editora/ano;
- ISBN opcional;
- páginas quando relevantes;
- data de acesso para recursos online.

Para um projeto de estudos bíblicos, SBL ou Chicago Notes-Bibliography são escolhas naturais; para público acadêmico brasileiro, ABNT é mais reconhecível.

---

# 7. Auditoria jornalística e editorial

## J1 — Alegações temporais e comerciais precisam de data/fonte

Exemplos:

- “100% sem anúncios”;
- “melhor indicação para estudantes”;
- disponibilidade editorial;
- quantidade de métodos;
- situação de instituições e cursos.

**Correção:** informar “verificado em setembro de 2026”, critérios de avaliação e fonte. Substituir “melhor” por “recomendação editorial do curador”.

---

## J2 — Separar conteúdo editorial de informação fornecida por terceiros

Criar rótulos:

- **Avaliação do curador**;
- **Informação da editora**;
- **Dados da instituição**;
- **Estimativa editorial**;
- **Situação verificada em [data]**.

Isso reduz confusão entre fato, propaganda de fornecedor e julgamento editorial.

---

## J3 — Política de correções e transparência

O convite por e-mail é positivo. Acrescentar página ou seção “Política editorial” com:

- como sugerir correções;
- versão/data do conteúdo;
- changelog;
- critérios de inclusão de recursos;
- declaração de conflitos de interesse;
- política para links afiliados ou apoio financeiro;
- prazo estimado para revisar erros críticos.

---

## J4 — Revisão de língua portuguesa

Realizar leitura humana integral. Pontos recorrentes a verificar:

- espaços duplos;
- concordância em listas;
- padronização de “coinê/koiné”; 
- “Novo Testamento” versus “NT”;
- “exegese grega” versus “exegese do texto grego”;
- uso consistente de maiúsculas em títulos;
- termos ingleses em itálico: *arcing*, *phrasing*, *display-mode*;
- hífens, travessões e aspas.

---

# 8. Segurança e privacidade

## S1 — Resultado do audit de dependências

`npm audit --omit=dev` não encontrou vulnerabilidades conhecidas nas dependências de produção no momento desta auditoria. Isso não cobre CDNs, código inline, lógica DOM ou futuras atualizações.

## S2 — `localStorage`

Não há dados sensíveis, mas progresso, preferências e coleção do usuário podem ser perdidos ao limpar o navegador. O portal já avisa sobre exportação na ferramenta. Estender aviso ao progresso do Guia.

## S3 — Links externos

Padronizar `target="_blank"` com:

```html
rel="noopener noreferrer external"
```

A página legada possui links sem essa proteção.

## S4 — Content Security Policy

Depois de remover scripts inline, considerar CSP restritiva. No GitHub Pages, usar `<meta http-equiv="Content-Security-Policy">`; testar cuidadosamente Service Worker, imagens e fontes.

## S5 — Integridade e dependências externas

Evitar CDNs quando já existem ativos locais. Se alguma CDN for indispensável, fixar versão e usar SRI quando suportado.

---

# 9. Plano de correção recomendado

## Fase 1 — Bloqueadores (antes de qualquer upload público)

1. Corrigir `installBtn` inexistente.
2. Corrigir links Faculdade Batista Logos/AIBREB para HTTPS e destino oficial.
3. Atualizar todas as URLs `AutenticSense-Free` operacionais.
4. Remover, redirecionar ou neutralizar `ferramentas-biblicas.html`.
5. Executar teste hospedado em HTTPS no GitHub Pages, não apenas `file://`.

## Fase 2 — Coerência do produto

6. Converter o Guia para o shell `osa-*` ou, no mínimo, reutilizar PWA, a11y e drawer centrais.
7. Unificar instalação e atualização PWA.
8. Corrigir progresso automático.
9. Implementar tabs/accordions/dialogs acessíveis.
10. Testar navegação inferior em 320–412 px.

## Fase 3 — Revisão acadêmica/editorial

11. Verificar credenciamento/natureza dos cursos e inserir ressalva e-MEC.
12. Revisar Rega, Mounce, Wallace, Paroschi e LaSor no exemplar/catálogo.
13. Remover absolutos promocionais.
14. Declarar perspectiva confessional e política editorial.
15. Padronizar bibliografia e inserir datas de acesso/verificação.

## Fase 4 — Sustentabilidade técnica

16. Extrair CSS/JS inline do Guia.
17. Limpar arquivos legados e manifestos duplicados.
18. Atualizar testes Playwright/axe/PWA.
19. Adicionar verificação automática de links e Lighthouse.
20. Criar changelog e processo de versão.

---

# 10. Checklist de aprovação para publicação

- [ ] Instalação PWA testada sem erro em Android/Brave ou Chrome.
- [ ] Atualização de Service Worker testada de v1.0 para v1.1.
- [ ] Guia abre offline após primeira visita.
- [ ] Nenhuma URL operacional contém `AutenticSense-Free`.
- [ ] AIBREB e Faculdade Batista Logos usam HTTPS e destino verificado.
- [ ] Página legada removida/redirecionada.
- [ ] Navegação funciona a 320 px sem truncamento crítico.
- [ ] Abas, accordions e diálogos funcionam por teclado.
- [ ] Contraste e zoom a 200% aprovados.
- [ ] Dados institucionais e bibliográficos confirmados pelo proprietário.
- [ ] Revisão teológica/filológica feita por ao menos um docente qualificado.
- [ ] Revisão ortográfica e editorial concluída.
- [ ] Backup do repositório atual realizado.

---

# 11. Conclusão

O projeto é promissor e pedagogicamente valioso, mas o pacote atual deve ser tratado como **candidato de lançamento**, não como versão final. As correções P0 são pequenas em quantidade, porém relevantes para confiança, instalação e segurança. As correções P1 determinarão se o Guia parecerá realmente parte de “O Sentido Autêntico” ou apenas uma página anexada.

Após corrigir P0 e P1, realizar teste de aceitação em HTTPS com pelo menos:

- Android/Brave ou Chrome;
- iPhone/Safari, se disponível;
- desktop Chrome/Edge/Firefox;
- leitor de tela ou navegação integral por teclado;
- modo offline e atualização de versão.

**Recomendação final:** não substituir o repositório público antes de corrigir os bloqueadores e gerar novo pacote auditado.

---

## Referências externas verificadas nesta auditoria

- AIBREB — página oficial: https://aibreb.org.br/
- AIBREB — instituições, faculdades e seminários: https://aibreb.org.br/instituicoes_seminarios.html
- Pinto & Dias, 2ª edição, ISBN 9788527509909: catálogo consultado em setembro de 2026.
- LaSor, edição brasileira, ISBN 9788527500869; disponibilidade indicada como esgotada em catálogo consultado em setembro de 2026.
